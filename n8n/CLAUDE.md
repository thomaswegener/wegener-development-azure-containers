# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

n8n workflow automation instance running as a Docker container (`n8n.wegener.no`), using SQLite for storage and Traefik as reverse proxy. The primary workload is an AI-powered self-learning email sorter.

## Infrastructure

- **Container**: `n8n.wegener.no` on `n8nio/n8n:latest`
- **Database**: SQLite at `./data/database.sqlite` (mapped to `/home/node/.n8n` inside container)
- **Network**: External `web` network (Traefik)
- **Community node**: `n8n-nodes-imap-enhanced` v2.18.11 — provides moveEmail, copyEmail, flags, and multi-mailbox support
- **IMAP server**: `imap.domeneshop.no` for `thomas@wegener.no` (Dovecot, folders use `INBOX.{folder}` format)

## Common Operations

```bash
docker compose up -d                              # Start n8n
docker compose up --build -d                      # Rebuild and start
docker compose logs -f n8n                        # Tail logs
docker exec n8n.wegener.no n8n export:workflow --id=ID --output=/tmp/wf.json   # Export workflow
docker exec n8n.wegener.no n8n import:workflow --input=/tmp/wf.json            # Import workflow
```

### Querying the database

n8n uses `sqlite3` (async API) — `better-sqlite3` is not available:
```js
docker exec n8n.wegener.no node -e "
const sqlite3 = require('/usr/local/lib/node_modules/n8n/node_modules/.pnpm/sqlite3@5.1.7/node_modules/sqlite3');
const db = new sqlite3.Database('/home/node/.n8n/database.sqlite');
db.all('SELECT ...', (err, rows) => { ... });
"
```

Data tables use UUID-based table names: `data_table_user_{uuid}`.

## Email Sorter Workflow

**"Email Sorter 3.0 - Selvlærende"** (ID: `JmuJS2uY1j6lXrqD`)

### Data flow

```
IMAP Trigger → Get Emails → Normalizer → Get Active Rules (parallel)
                                       → Match Rules → Need LLM?
  yes → Build Prompt (Code) → Basic LLM Chain (Claude Haiku) → Parse Response
        → Prepare Rule → Create Auto Rule → Restore Email → Log Decision → Route by Tag → IMAP Move
  no  → Use Matched Rule → Log Decision → Route by Tag → IMAP Move
```

### Key design decisions

- **Build Prompt is a Code node**: The Basic LLM Chain `text` field does NOT evaluate `{{ $json.xxx }}` expressions. The prompt must be built in a Code node that outputs `{ chatInput: "..." }`, with the chain set to `promptType: "auto"`.
- **Get Active Rules is a parallel branch**: Normalizer feeds both Get Active Rules and Match Rules. If chained sequentially (Normalizer → Get Active Rules → Match Rules), every rule row becomes a separate item, causing N×multiplication of emails through the pipeline.
- **Match Rules references rules via `$('Get Active Rules').all()`**: The n8n v1 execution order ensures Get Active Rules completes before Match Rules runs due to this implicit dependency.
- **No Merge node**: Both paths (LLM and rule-match) connect directly to Log Decision. A Merge node in `combineAll` mode blocks when only one branch has data.

### Data tables

| Table | UUID | Purpose |
|-------|------|---------|
| `email_rules` | `94381c0f-da17-44ff-8687-3a2093b672a9` | Sorting rules (manual + AI-generated) |
| `email_log` | `d44dd412-168e-4be2-a129-e1a47e98edd5` | Classification audit log |

### Email categories

`linus`, `oline`, `ingvild`, `bris`, `piratehusky`, `visithammerfest`, `go-north`, `invoice`, `valuable`, `trash`

### Rule structure

Rules have pattern columns (`sender_contains`, `domain_contains`, `subject_contains`, `body_contains`), `match_mode` (any/all), `correct_tag`, and `source` (manual/ai-auto). The LLM returns `match_by` field + `match_value` to create focused, reusable rules rather than over-specific ones.

## Credentials

| ID | Name | Type |
|----|------|------|
| `jy0nWlLLSAn8rgw9` | Mail - thomas@wegener.no | imapApi |
| `slAVE80qHGPp5eWb` | Anthropic account | anthropicApi |

## n8n API Notes

- Public API key auth works for workflows but NOT for data tables or variables
- Workflow export/import uses the CLI (`n8n export:workflow` / `n8n import:workflow`)
- n8n LangChain nodes live under `@n8n/n8n-nodes-langchain` — inspect available models/versions via `require()` inside the container
- The Anthropic Chat Model node supports versions `[1, 1.1, 1.2, 1.3]` with models up to `claude-3-5-haiku-20241022`

## Version Control

This project lives inside the `containers` monorepo. Always commit and push from the monorepo root (`/home/wegener/containers`), not from within this subdirectory.
The `data/` directory (SQLite database, node_modules, logs) is gitignored — do not force-add it.
