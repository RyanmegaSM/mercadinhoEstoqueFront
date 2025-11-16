import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useAuth } from "@/contexts/auth/use-auth";
import { loginFormSchema } from "@/validations/login-schema";

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit = async (data: z.infer<typeof loginFormSchema>) => {
    try {
      const { email, password } = data;
      await login(email, password);
      toast.success("Login realizado com sucesso!", { duration: 4000 });
      navigate("/");
    } catch (error) {
      console.log("Erro ao fazer login", error);
      toast.error(`${error}`, {
        duration: 4000,
      });
    }
  };

  return (
    <main className="h-screen grid grid-cols-1 md:grid-cols-3">
      <div
        className="hidden md:block md:col-span-2 bg-cover bg-center"
        style={{ backgroundImage: "url('/src/assets/img-estoque.jpg')" }}
      />

      <div className="flex  justify-center p-6 bg-card text-card-foreground">
        <div className="w-full max-w-sm shadow-md bg-card text-card-foreground p-6 rounded-lg space-y-4">
          <h1 className="text-center font-bold text-2xl">Login</h1>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <section>
              <label className="block text-sm font-medium">E-mail</label>
              <Input className="mt-2" type="email" {...register("email")} />
              {errors.email && (
                <span className="text-sm text-red-500">
                  {errors.email.message}
                </span>
              )}
            </section>

            <section
              className="
            mt-4"
            >
              <label className="block text-sm font-medium">Senha</label>
              <Input
                className="mt-2"
                type="password"
                {...register("password")}
              />
              {errors.password && (
                <span className="text-sm text-red-500">
                  {errors.password.message}
                </span>
              )}
            </section>

            <Button className="w-full mt-4 cursor-pointer" type="submit">
              Entrar
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
