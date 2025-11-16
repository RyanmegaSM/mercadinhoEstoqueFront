export function decodeToken(token: string) {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Token inválido. Verifique se possui três partes (JWT).");
  }

  try {
    const decoded = base64UrlDecode(parts[1]);
    const parsedDecoded = JSON.parse(decoded);

    if (typeof parsedDecoded.permissions === "string") {
      parsedDecoded.permissions = JSON.parse(parsedDecoded.permissions);
    }

    return parsedDecoded;
  } catch (error) {
    console.log(error);
    throw new Error("Falha ao decodificar o token.");
  }
}

function base64UrlDecode(str: string): string {
  let output = str.replace(/-/g, "+").replace(/_/g, "/");
  output += "=".repeat((4 - (output.length % 4)) % 4);
  return decodeURIComponent(
    Array.from(
      atob(output),
      (c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`
    ).join("")
  );
}
