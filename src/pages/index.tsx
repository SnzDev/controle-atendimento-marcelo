import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getServerSession } from "next-auth";
import { getProviders, signIn } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { authOptions } from "../server/auth";
moment.locale("pt-br");

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  const providers = await getProviders();
  if (session) {
    return { redirect: { destination: "/atendimento" } };
  }
  return {
    props: { providers: providers ?? [] },
  };
};
const Login = ({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { query } = useRouter();
  const loginError = query?.error;
  const schemaValidation = z.object({
    userName: z
      .string({ required_error: "Obrigatório" })
      .min(3, "No mínimo 3 caracteres"),
    password: z
      .string({ required_error: "Obrigatório" })
      .min(8, "Mínimo 8 caracteres"),
  });

  type FieldValues = z.infer<typeof schemaValidation>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: zodResolver(schemaValidation),
  });
  const onSubmit: SubmitHandler<FieldValues> = async ({
    userName,
    password,
  }) => {
    await signIn("credentials", {
      redirect: true,
      callbackUrl: "/atendimento",
      userName,
      password,
    });
  };

  // const session = useSession();
  // useEffect(() => {
  //   if (session) {
  //     void push("/atendimento");
  //   }
  // }, [session]);
  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="tela de login" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black">
        <Image src="/Logo.png" width={95} height={95} alt="Logo AcesseNet" />
        <h1 className="text-3xl font-bold text-stone-50"> AcesseNet</h1>
        <h3 className="text-lg font-semibold text-stone-500">
          Faça login e comece a usar!
        </h3>
        {!!loginError && (
          <p className="mt-4 rounded-md bg-red-500 p-2 text-gray-100 ">
            E-mail ou senha incorreta!
          </p>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-items-center"
        >
          {/* <input name="csrfToken" type="hidden" defaultValue={csrfToken} /> */}
          <div>
            <p className="pt-8 text-base font-semibold text-stone-100">
              Usuário
            </p>
            <span className="row flex items-center pl-1.5">
              <Image
                src="/icons/EnvelopeSimple.svg"
                className="z-10 mr-[-32px]"
                width={24}
                height={24}
                alt="Logo AcesseNet"
              />
              <input
                {...register("userName")}
                className="my-2 w-80 items-center rounded bg-stone-900 p-2 pl-10 text-stone-100"
                type="text"
                placeholder="exemplo@exemplo.com.br"
              />
            </span>
            {errors.userName && (
              <p className=" text-red-500 ">{errors.userName.message}</p>
            )}
          </div>

          <p className="pt-6 text-base font-semibold text-stone-100">
            Sua senha
          </p>
          <span className="row flex items-center pl-1.5">
            <Image
              src="/icons/Lock.svg"
              className="z-10 mr-[-32px]"
              width={24}
              height={24}
              alt="Logo AcesseNet"
            />
            <input
              {...register("password")}
              className="my-2 w-80 items-center rounded bg-stone-900 p-2 pl-10 text-stone-100"
              type="password"
              placeholder="**************"
            />
          </span>
          {errors.password && (
            <p className=" text-red-500 ">{errors.password.message}</p>
          )}
          <br />
          <button
            type="submit"
            className="mt-4 w-80 rounded bg-blue-500 p-2 text-base font-semibold hover:bg-blue-300"
          >
            Entrar na plataforma
          </button>
          <p className="my-4 text-center text-base  font-semibold text-stone-500">
            ou
          </p>

          {Object.values(providers).map(
            (provider) =>
              provider.name !== "credentials" && (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() =>
                    signIn(provider.id, {
                      // callbackUrl: `${window.location.origin}`,
                    })
                  }
                  className="w-82 row flex items-center gap-2 rounded bg-white p-2 pl-16 text-base font-semibold"
                >
                  <Image
                    src="/icons/Google.svg"
                    className="z-10"
                    width={24}
                    height={24}
                    alt="Logo AcesseNet"
                  />
                  Entrar com {provider.name}
                </button>
              )
          )}

          <p className="my-4 text-center text-base  font-semibold text-stone-500 underline underline-offset-1">
            Esqueceu sua senha?
          </p>
        </form>
      </main>
    </>
  );
};

export default Login;
