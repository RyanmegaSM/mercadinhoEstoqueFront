import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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

import { createUser } from "@/services/users";
import { createUserSchema } from "@/validations/user-schema";
import { AccessTypes } from "@/constants/access-types";

export function AddUserPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof createUserSchema>>({
    resolver: zodResolver(createUserSchema),
  });

  const handleCreateUser = async (data: z.infer<typeof createUserSchema>) => {
    try {
      await createUser(data);
      toast.success("Usuário criado com sucesso.");
      navigate("/users");
    } catch (error) {
      toast.error(`Erro ao cadastrar usuário: ${error}`, {
        duration: 4000,
      });
    }
  };

  return (
    <Card title="Novo Usuário" actions={[]}>
      <form onSubmit={handleSubmit(handleCreateUser)}>
        <div className="flex items-center justify-between mb-2">
          <section className="w-1/2 p-3">
            <label>Nome</label>
            <Input
              placeholder="Nome do usuário"
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
            <label>Email</label>
            <Input
              type="email"
              placeholder="Email do usuário"
              className="mt-1"
              {...register("email")}
            />
            {errors.email && (
              <span className="text-sm text-red-500">
                {errors.email.message}
              </span>
            )}
          </section>
        </div>

        <div className="flex items-center justify-between">
          <section className="w-1/2 p-3">
            <label>Senha</label>
            <Input
              type="password"
              placeholder="Senha do usuário"
              className="mt-1"
              {...register("password")}
            />
            {errors.password && (
              <span className="text-sm text-red-500">
                {errors.password.message}
              </span>
            )}
          </section>
          <section className="w-1/2 p-3">
            <label>Tipo de Acesso</label>
            <Select
              onValueChange={(value) => {
                const numericValue = Number(value);
                if (!isNaN(numericValue)) {
                  register("accessType").onChange({
                    target: { value: numericValue, name: "accessType" },
                  });
                }
              }}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Selecione um tipo de acesso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={String(AccessTypes.MANAGER)}>
                  Gerente
                </SelectItem>
                <SelectItem value={String(AccessTypes.EMPLOYEE)}>
                  Funcionário
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.accessType && (
              <span className="text-sm text-red-500">
                {errors.accessType.message}
              </span>
            )}
          </section>
        </div>

        <div className="flex gap-2 justify-end mt-4 px-3 border-t pt-6">
          <Button
            type="button"
            className="cursor-pointer"
            variant={"secondary"}
            onClick={() => navigate("/users")}
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
