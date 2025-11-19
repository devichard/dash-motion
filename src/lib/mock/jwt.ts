import type { User } from "@/types/auth";

export function generateMockJWT(user: User): string {
  // Header
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  // Payload com expiração de 7 dias
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      approved: user.approved,
    },
    exp: now + 7 * 24 * 60 * 60, // 7 dias
    iat: now,
  };

  // Simula codificação Base64URL
  const base64UrlEncode = (obj: unknown): string => {
    const json = JSON.stringify(obj);
    const base64 = btoa(json);
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  };

  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(payload);

  // Para mock, não precisamos de assinatura real
  const signature = base64UrlEncode({ mock: true });

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

