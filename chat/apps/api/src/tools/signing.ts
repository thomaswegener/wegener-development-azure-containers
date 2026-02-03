import crypto from "node:crypto";

function base64url(input: Buffer | string): string {
  const buf = typeof input === "string" ? Buffer.from(input) : input;
  return buf.toString("base64url");
}

function hmac(secret: string, payloadJson: string): Buffer {
  return crypto.createHmac("sha256", secret).update(payloadJson).digest();
}

export function signPayload(payload: Record<string, any>, secret: string): string {
  const payloadJson = JSON.stringify(payload);
  const sig = hmac(secret, payloadJson);
  return `${base64url(payloadJson)}.${base64url(sig)}`;
}

export function verifyToken(token: string, secret: string): Record<string, any> | null {
  const [payloadB64, sigB64] = token.split(".");
  if (!payloadB64 || !sigB64) return null;
  const payloadJson = Buffer.from(payloadB64, "base64url").toString("utf8");
  const expected = base64url(hmac(secret, payloadJson));
  try {
    const ok = crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sigB64));
    if (!ok) return null;
  } catch {
    return null;
  }
  const payload = JSON.parse(payloadJson);
  if (payload.exp && Date.now() > payload.exp) return null;
  return payload;
}

