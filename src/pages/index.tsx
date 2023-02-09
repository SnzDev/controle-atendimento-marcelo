import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { z } from "zod";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getCsrfToken } from "next-auth/react";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
const Login = ({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const schemaValidation = z.object({
    email: z.string().email("E-mail inválido"),
    password: z.string().min(2, "Minimo 2 caracteres"),
  });

  type FieldValues = z.infer<typeof schemaValidation>;
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

        <form
          className="flex flex-col justify-items-center"
          action="/api/auth/callback/credentials"
        >
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <div>
            <p className="pt-8 text-base font-semibold text-stone-100">
              Endereço de e-mail
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
                className="my-2 w-80 items-center rounded bg-stone-900 p-2 pl-10 text-stone-100"
                type="email"
                placeholder="exemplo@exemplo.com.br"
              />
            </span>
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
              className="my-2 w-80 items-center rounded bg-stone-900 p-2 pl-10 text-stone-100"
              type="password"
              placeholder="**************"
            />
          </span>
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

          <button className="w-82 row flex items-center gap-2 rounded bg-white p-2 pl-16 text-base font-semibold">
            <Image
              src="/icons/Google.svg"
              className="z-10"
              width={24}
              height={24}
              alt="Logo AcesseNet"
            />
            Entrar com Google
          </button>

          <p className="my-4 text-center text-base  font-semibold text-stone-500 underline underline-offset-1">
            Esqueceu sua senha?
          </p>
        </form>
      </main>
    </>
  );
};

export default Login;
