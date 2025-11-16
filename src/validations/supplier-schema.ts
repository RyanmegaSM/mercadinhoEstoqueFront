import z from "zod";

export const createSupplierSchema = z.object({
  name: z.string().nonempty("O nome é obrigatório"),
  telephone: z.string().nonempty("Telefone é obrigatorio"),
  address: z.string().nonempty("O endereço é obrigatório"),
  cnpj: z.string().nonempty("O CNPJ é obrigatório"),


});
