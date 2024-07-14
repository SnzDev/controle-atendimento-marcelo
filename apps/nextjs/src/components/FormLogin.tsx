"use client";

import type { SubmitHandler } from "react-hook-form";
import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeSlash, SecuritySafe, UserOctagon } from "iconsax-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { useToast } from "~/components/ui/use-toast";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { getProviders, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { type GetServerSidePropsContext } from "next";
import { authOptions } from "@morpheus/auth";
import { getServerSession } from "next-auth";
import { Label } from "./ui/label";
const formSchema = z.object({
  userName: z
    .string({ required_error: "Obrigatório" })
    .min(3, "No mínimo 3 caracteres"),
  password: z
    .string({ required_error: "Obrigatório" })
    .min(8, "Mínimo 8 caracteres"),
});

type FormSchemaProps = z.infer<typeof formSchema>;
// export const getServerSideProps = async (
//   context: GetServerSidePropsContext,
// ) => {
//   const session = await getServerSession(context.req, context.res, authOptions);

//   const providers = await getProviders();
//   if (session) {
//     return { redirect: { destination: "/atendimento" } };
//   }
//   return {
//     props: { providers: providers ?? [] },
//   };
// };

export function FormLogin() {
  const session = useSession();
  const { replace } = useRouter();
  const [showPassword, setShowPassword] = useState(true);
  const { toast } = useToast();

  const { handleSubmit, control } = useForm<FormSchemaProps>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const submit: SubmitHandler<FormSchemaProps> = async ({ userName, password }) => {
    await signIn("credentials", {
      redirect: true,
      callbackUrl: "/whatsapp/atendimentos",
      userName,
      password,
    });
  };

  useEffect(() => {
    if (session.data) {
      void replace("/whatsapp/atendimentos");
    }
  }, [session, replace]);

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="flex w-1/2 flex-col items-center justify-center gap-4 "
    >
      <div className="flex w-full flex-col items-start">
        <Label className="text-xl">Morpheus</Label>
        <Label className="text-md text-muted-foreground">Faça seu login</Label>

      </div>
      <div className="flex w-full flex-col items-center gap-6">
        <Controller
          control={control}
          name="userName"
          render={({ field: { value, onChange }, formState: { errors } }) => (
            <Input
              // startDecoration={
              //   <UserOctagon size="32" color="#7E30E1" variant="Bulk" />
              // }
              type="text"
              placeholder="Digite seu usuário"
              className="w-full h-12"
              inputClassName="h-10 text-base"
              // errors={errors.email?.message}
              value={value}
              onChange={onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange }, formState: { errors } }) => (
            <Input
              className="w-full h-12"
              inputClassName="h-10 text-base"
              placeholder="Digite sua senha"
              type={showPassword ? "password" : "text"}
              // errors={errors.password?.message}
              value={value}
              onChange={onChange}
            />
          )}
        />

        <Button type="submit" className="w-full">
          Entrar
        </Button>
        {/* <p className="cursor-pointer text-sm text-primary underline hover:opacity-80">
          Esqueci minha senha
        </p> */}
      </div>
    </form>
  );
}

// import { BaseInput } from "~/components/ui/BaseInput";
// import { Button } from "~/components/ui/Button";

// const FormSchema = z.object({
//   email: z.string().email("E-mail inválido").min(1, "Campo obrigatório"),
//   password: z.string().min(1, "Campo obrigatório"),
// });

// type FormValues = z.infer<typeof FormSchema>;

// export async function FormLogin() {
//   const session = await auth();

//   if (!session) {
//     return (
//       <form>
//         <Button
//           type="submit"
//           formAction={async () => {
//             "use server";
//             await signIn("Crendentials", {
//               email: "admin@starttec.com.br",
//               password: "teste123",
//             });
//           }}
//         >
//           Sign in with Discord
//         </Button>
//       </form>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl">
//         <span>Logged in as {session.user.name}</span>
//       </p>

//       <form>
//         <Button
//           formAction={async () => {
//             "use server";
//             await signOut();
//           }}
//         >
//           Sign out
//         </Button>
//       </form>
//     </div>
//   );
// }
