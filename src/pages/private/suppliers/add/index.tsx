import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import z from "zod";

import { Card } from "@/components/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createSupplier } from "@/services/suppliers";
import { createSupplierSchema } from "@/validations/supplier-schema";
import { InputMask } from "@/components/input-mask";

export function AddSupplierPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof createSupplierSchema>>({
    resolver: zodResolver(createSupplierSchema),
  });

  const handleCreateSupplier = async (
    data: z.infer<typeof createSupplierSchema>
  ) => {
    try {
      const newSupplier = {
        name: data.name,
        telephone: data.telephone,
        address: data.address,
        cnpj: data.cnpj,
      };

      await createSupplier(newSupplier);
      toast.success("Fornecedor criado com sucesso.");
      navigate("/suppliers");
    } catch (error) {
      toast.error(`Erro ao cadastrar fornecedor: ${error}`, {
        duration: 4000,
      });
    }
  };

  return (
    <Card title="Novo fornecedor" actions={[]}>
      <form onSubmit={handleSubmit(handleCreateSupplier)}>
        <div className="flex items-center justify-between mb-2">
          <section className="w-1/2 p-3 ">
            <label>Nome</label>
            <Input
              placeholder="Nome do fornecedor"
              className="mt-1"
              {...register("name")}
            />
            {errors.name && (
              <span className="text-sm text-red-500">
                {errors.name.message}
              </span>
            )}
          </section>
          <section className="w-1/2 p-3">
            <label>Telefone</label>
            <InputMask<z.infer<typeof createSupplierSchema>>
              control={control}
              name="telephone"
              mask="(00) 00000-0000"
              className="mt-1"
            />
            {errors.telephone && (
              <span className="text-sm text-red-500">
                {errors.telephone.message}
              </span>
            )}
          </section>
        </div>

        <div className="flex items-center justify-around">
          <section className="w-1/2 p-3">
            <label>Endereço</label>
            <Input
              placeholder="Endereço do fornecedor"
              className="mt-1"
              {...register("address")}
            />
            {errors.address && (
              <span className="text-sm text-red-500">
                {errors.address.message}
              </span>
            )}
          </section>
          <section className="w-1/2 p-3">
            <label>CNPJ</label>
            <InputMask<z.infer<typeof createSupplierSchema>>
              control={control}
              name="cnpj"
              mask="00.000.000/0000-00"
              className="mt-1"
            />
            {errors.cnpj && (
              <span className="text-sm text-red-500">
                {errors.cnpj.message}
              </span>
            )}
          </section>
        </div>

        <div className="flex gap-2 justify-end mt-4 px-3 border-t pt-6">
          <Button
            type="button"
            className="cursor-pointer"
            variant={"secondary"}
            onClick={() => navigate("/suppliers")}
          >
            Cancelar
          </Button>
          <Button className="cursor-pointer" type="submit">
            Salvar
          </Button>
        </div>
      </form>
    </Card>
  );
}
