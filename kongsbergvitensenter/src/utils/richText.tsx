import React from 'react'

type RichBlock =
  | { type: 'paragraph'; lines: string[] }
  | { type: 'list'; items: string[] }

const BREAK_TOKEN = '__BR__'

const parseRichText = (text: string): RichBlock[] => {
  const lines = text.replace(/\r\n?/g, '\n').split('\n')
  const blocks: RichBlock[] = []

  let paragraphBuffer: string[] = []
  let listBuffer: string[] = []

  const flushParagraph = () => {
    if (paragraphBuffer.length === 0) return
    blocks.push({ type: 'paragraph', lines: paragraphBuffer })
    paragraphBuffer = []
  }

  const flushList = () => {
    if (listBuffer.length === 0) return
    blocks.push({ type: 'list', items: listBuffer })
    listBuffer = []
  }

  lines.forEach((line) => {
    const trimmed = line.trim()
    const listMatch = trimmed.match(/^[-*•]\s+(.*)/)

    if (listMatch) {
      flushParagraph()
      listBuffer.push(listMatch[1])
      return
    }

    if (trimmed === '') {
      flushList()
      if (paragraphBuffer.length > 0) {
        paragraphBuffer.push(BREAK_TOKEN)
      }
      return
    }

    flushList()
    paragraphBuffer.push(trimmed)
  })

  flushParagraph()
  flushList()

  return blocks
}

type BoldState = { open: boolean }

const renderBoldWithState = (text: string, state: BoldState) => {
  const nodes: React.ReactNode[] = []
  const tokens = text.split(/(\*\*|__)/)

  tokens.forEach((token, index) => {
    if (!token) return
    if (token === '**' || token === '__') {
      state.open = !state.open
      return
    }
    nodes.push(
      state.open ? (
        <strong key={`b-${index}-${nodes.length}`}>{token}</strong>
      ) : (
        <React.Fragment key={`t-${index}-${nodes.length}`}>{token}</React.Fragment>
      ),
    )
  })

  return nodes
}

const linkifyPlainText = (text: string, state: BoldState) => {
  const nodes: React.ReactNode[] = []
  const parts = text.split(/(https?:\/\/[^\s]+)/g)

  parts.forEach((part, index) => {
    if (!part) return
    if (/^https?:\/\/[^\s]+$/.test(part)) {
      nodes.push(
        <a key={`plain-${index}-${part}`} href={part} target="_blank" rel="noreferrer">
          {part}
        </a>,
      )
    } else {
      renderBoldWithState(part, state).forEach((node, innerIndex) => {
        nodes.push(
          <React.Fragment key={`text-${index}-${innerIndex}`}>{node}</React.Fragment>,
        )
      })
    }
  })

  return nodes
}

const linkifyWithAnchors = (text: string, state: BoldState) => {
  const nodes: React.ReactNode[] = []
  const anchorRegex = /<a\s+href="([^"]+)"[^>]*>(.*?)<\/a>/gi
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = anchorRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(...linkifyPlainText(text.slice(lastIndex, match.index), state))
    }

    const anchorContent = renderBoldWithState(match[2] || match[1], state)

    nodes.push(
      <a
        key={`anchor-${nodes.length}-${match[1]}`}
        href={match[1]}
        target="_blank"
        rel="noreferrer"
      >
        {anchorContent}
      </a>,
    )

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    nodes.push(...linkifyPlainText(text.slice(lastIndex), state))
  }

  return nodes
}

export const renderRichText = (text?: string) => {
  if (!text) return null

  const blocks = parseRichText(text)

  return blocks.map((block, blockIndex) => {
    if (block.type === 'list') {
      return (
        <ul key={`list-${blockIndex}`}>
          {block.items.map((item, itemIndex) => (
            <li key={`li-${blockIndex}-${itemIndex}`}>
              {linkifyWithAnchors(item, { open: false })}
            </li>
          ))}
        </ul>
      )
    }

    const boldState: BoldState = { open: false }
    return (
      <p key={`p-${blockIndex}`}>
        {block.lines.map((line, lineIndex) => (
          line === BREAK_TOKEN ? (
            <br key={`br-${blockIndex}-${lineIndex}`} />
          ) : (
            <React.Fragment key={`line-${blockIndex}-${lineIndex}`}>
              {linkifyWithAnchors(line, boldState)}
              {lineIndex < block.lines.length - 1 && block.lines[lineIndex + 1] !== BREAK_TOKEN && (
                <br />
              )}
            </React.Fragment>
          )
        ))}
      </p>
    )
  })
}
