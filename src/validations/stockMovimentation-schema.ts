import z from "zod";

export const createMovimentationSchema = z.object({
  data: z.date("A data é obrigatória"),
  tipo: z.string().nonempty("O tipo é obrigatório"),
  quantidade: z.coerce
    .number({
      error: "Quantidade deve ser um número válido",
    }),
  produtoId: z.coerce
     .number({
      error: "Quantidade deve ser um número válido",
    }),
  usuarioId: z.coerce
     .number({
      error: "Quantidade deve ser um número válido",
    }),

});


