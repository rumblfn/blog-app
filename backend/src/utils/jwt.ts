import crypto from "crypto";

interface JWTPayload {
  id: number;
  exp: number;
}

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export function createJWT(payload: object, expiresIn: number = 3600): string {
  const header = Buffer.from(
    JSON.stringify({ alg: "HS256", typ: "JWT" }),
  ).toString("base64");
  const body = Buffer.from(
    JSON.stringify({
      ...payload,
      exp: Math.floor(Date.now() / 1000) + expiresIn,
    }),
  ).toString("base64");
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64");
  return `${header}.${body}.${signature}`;
}

export function verifyJWT(token: string): JWTPayload | null {
  const [headerB64, bodyB64, signature] = token.split(".");
  const expectedSignature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${headerB64}.${bodyB64}`)
    .digest("base64");
  if (signature !== expectedSignature) return null;
  const payload = JSON.parse(
    Buffer.from(bodyB64, "base64").toString(),
  ) as JWTPayload;
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}
