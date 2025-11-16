import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import z from "zod";

import { Card } from "@/components/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { createStockMovimentation } from "@/services/stockMovimentation";
import { createMovimentationSchema } from "@/validations/stockMovimentation-schema";

export function AddStockMovimentationPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createMovimentationSchema),
  });

  const handleCreateMovimentation = async (
    data: z.infer<typeof createMovimentationSchema>
  ) => {
    try {
      const newMoviment = {
        data: data.data,
        tipo: data.tipo,
        quantidade: data.quantidade,
        produtoId: data.produtoId,
        usuarioId: data.usuarioId,
      };

      await createStockMovimentation(newMoviment);
      toast.success("Fornecedor criado com sucesso.");
    } catch (error) {
      toast.error(`Erro ao cadastrar fornecedor: ${error}`, {
        duration: 4000,
      });
    }
  };

  return (
    <Card title="Novo fornecedor" actions={[]}>
      <form onSubmit={handleSubmit(handleCreateMovimentation)}>
        <div className="flex items-center justify-between mb-2">
          <section className="w-1/2 p-3 ">
            <label>Data</label>
            <Input
              placeholder="Data da movimentação"
              className="mt-1"
              {...register("data")}
            />
            {errors.data && (
              <span className="text-sm text-red-500">
                {errors.data.message}
              </span>
            )}
          </section>
          <section className="w-1/2 p-3 ">
            <label>Tipo</label>
            <Input
              placeholder="Tipo de movimentação"
              className="mt-1"
              {...register("tipo")}
            />
            {errors.tipo && (
              <span className="text-sm text-red-500">
                {errors.tipo.message}
              </span>
            )}
          </section>
        </div>

        <div className="flex items-center justify-between mb-2">
          <section className="w-1/2 p-3 ">
            <label>Quantidade</label>
            <Input
              placeholder="Quantidade da movimentação"
              className="mt-1"
              {...register("quantidade")}
            />
            {errors.quantidade && (
              <span className="text-sm text-red-500">
                {errors.quantidade.message}
              </span>
            )}
          </section>
          <section className="w-1/2 p-3 ">
            <label>Produto</label>
            <Input
              placeholder="Produto da movimentação"
              className="mt-1"
              {...register("produtoId")}
            />
            {errors.produtoId && (
              <span className="text-sm text-red-500">
                {errors.produtoId.message}
              </span>
            )}
          </section>
        </div>

        <div className="flex items-center justify-between mb-2">
          <section className="w-1/2 p-3">
            <label>Usuario</label>
            <Input
              placeholder="Usuário de movimentação"
              className="mt-1"
              {...register("usuarioId")}
            />
            {errors.usuarioId && (
              <span className="text-sm text-red-500">
                {errors.usuarioId.message}
              </span>
            )}
          </section>
        </div>

        <div className="flex gap-2 justify-end mt-4 px-3 border-t pt-6">
          <Button
            type="button"
            className="cursor-pointer"
            variant={"secondary"}
            onClick={() => navigate("/stockMovimentation")}
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
