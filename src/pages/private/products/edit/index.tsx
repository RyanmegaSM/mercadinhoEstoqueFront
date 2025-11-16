import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { useForm, Controller } from "react-hook-form";
import z from "zod";

import { Card } from "@/components/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductSchema } from "@/validations/product-schema";
import { toast } from "sonner";
import { getCategories } from "@/services/categories";
import { updateProduct, getProductById } from "@/services/products";
import { centavosToReais } from "@/helpers/convert-centavos-to-reais";

export function EditProductPage() {
  const navigate = useNavigate();

  const { id } = useParams() as { id: string };

  const { data: product } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await getProductById(Number(id));
      return response;
    },
  });

  const { data: categories, isLoading: cateriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await getCategories();

      return response.map((item) => ({ id: item.id, name: item.nome }));
    },
    initialData: [],
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      category: categories.length > 0 ? String(categories[0].id) : "0",
    },
  });

  useEffect(() => {
    if (!product) return;

    reset({
      name: product.nome,
      description: product.descricao,
      price: product.precoUnitario,
      category: String(product.categoriaId),
    });
  }, [product, reset]);

  const handleUpdateProduct = async (
    data: z.infer<typeof createProductSchema>
  ) => {
    try {
      const updatedProduct = {
        id: Number(id),
        name: data.name,
        description: data.description,
        unitPrice: data.price,
        categoryId: Number(data.category),
      };

      await updateProduct(updatedProduct);
      toast.success("Produto alterado com sucesso.");
      navigate("/products");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, {
          duration: 4000,
        });
      }
    }
  };

  return (
    <Card title="Editar produto" actions={[]}>
      <form onSubmit={handleSubmit(handleUpdateProduct)}>
        <div className="flex items-center justify-between mb-2">
          <section className="w-1/2 p-3 ">
            <label>Nome</label>
            <Input
              placeholder="Nome do produto"
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
            <label>Descrição</label>
            <Input
              placeholder="Descrição do produto"
              className="mt-1"
              {...register("description")}
            />
            {errors.description && (
              <span className="text-sm text-red-500">
                {errors.description.message}
              </span>
            )}
          </section>
        </div>

        <div className="flex items-center justify-around">
          <section className="w-1/2 p-3">
            <label>Preço</label>
            <Controller
              name="price"
              control={control}
              defaultValue={0}
              render={({ field: { value, onChange } }) => (
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="R$ 0,00"
                  className="mt-1"
                  value={value === 0 ? "" : centavosToReais(value as number)}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/\D/g, "");
                    const valueAsNumber = parseInt(numericValue || "0");
                    onChange(valueAsNumber);
                  }}
                />
              )}
            />
            {errors.price && (
              <span className="text-sm text-red-500">
                {errors.price.message}
              </span>
            )}
          </section>
          <section className="w-1/2 p-3">
            <label>Categoria</label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={String(field.value)}
                  disabled={cateriesLoading}
                >
                  <SelectTrigger className="w-full min-w-[250px]">
                    <SelectValue
                      placeholder={
                        cateriesLoading
                          ? "Carregando categorias..."
                          : "Selecione uma categoria"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && (
              <span className="text-sm text-red-500">
                {errors.category.message}
              </span>
            )}
          </section>
        </div>

        <div className="flex gap-2 justify-end mt-4 px-3 border-t pt-6">
          <Button
            type="button"
            className="cursor-pointer"
            variant={"secondary"}
            onClick={() => navigate("/products")}
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
