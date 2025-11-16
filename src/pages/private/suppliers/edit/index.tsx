import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import z from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card } from "@/components/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { updateSupplier, getSupplierById } from "@/services/suppliers";
import { createSupplierSchema } from "@/validations/supplier-schema";

export function EditSupplierPage() {
  const navigate = useNavigate();

  const { id } = useParams() as { id: string };

  const { data: supplier } = useQuery({
    queryKey: ["supplier", id],
    queryFn: async () => {
      const response = await getSupplierById(Number(id));
      return response;
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createSupplierSchema),
  });

  const handleUpdateSupplier = async (
    data: z.infer<typeof createSupplierSchema>
  ) => {
    try {
      const updatedSupplier = {
        id: Number(id),
        name: data.name,
        telephone: data.telephone,
        address: data.address,
        cnpj: data.cnpj,
      };

      await updateSupplier(updatedSupplier);
      toast.success("Fornecedor criado com sucesso.");
      navigate("/suppliers");
    } catch (error) {
      toast.error(`Erro ao cadastrar fornecedor: ${error}`, {
        duration: 4000,
      });
    }
  };

  useEffect(() => {
    if (!supplier) return;

    reset({
      address: supplier.endereco,
      cnpj: supplier.cnpj,
      name: supplier.nome,
      telephone: supplier.telefone,
    });
  }, [supplier, reset]);

  return (
    <Card title="Editar fornecedor" actions={[]}>
      <form onSubmit={handleSubmit(handleUpdateSupplier)}>
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
            <Input
              placeholder="Numero do fornecedor"
              className="mt-1"
              {...register("telephone")}
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
            <Input
              placeholder="CNPJ do fornecedor"
              className="mt-1"
              {...register("cnpj")}
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
