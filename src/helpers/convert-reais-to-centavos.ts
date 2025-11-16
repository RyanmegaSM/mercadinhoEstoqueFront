export const reaisToCentacos = (value: number | string) => {
  const amount =
    typeof value === "string" ? parseFloat(value.replace(",", ".")) : value;

  if (isNaN(amount)) {
    throw new Error("Válor inválido para conversão em centavos");
  }

  return Math.round(amount * 100);
};
