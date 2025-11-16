import z from "zod";

export const createProductSchema = z.object({
  name: z.string().nonempty("O nome é obrigatório"),
  description: z.string().nonempty("A descrição é obrigatória"),
  price: z.coerce
    .number({
      error: "O preço deve ser um número válido",
    })
    .positive("O preço deve ser maior que zero"),
  category: z.string().nonoptional(),
});
