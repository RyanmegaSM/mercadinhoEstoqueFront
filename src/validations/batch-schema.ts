import z from "zod";

export const createBatchSchema = z.object({
  supplier: z.string().nonempty("O nome é obrigatório"),
  validity: z
    .string()
    .regex(
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
      "Data inválida. Use o formato dd/mm/yyyy."
    ),
});

export const detailsBatchSchema = z.object({
  supplier: z.string().nonempty("O nome é obrigatório"),
  validity: z
    .string()
    .regex(
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
      "Data inválida. Use o formato dd/mm/yyyy."
    ),
  price: z.string(),
  totalProducts: z.number(),
});
