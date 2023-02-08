import { type NextPage } from "next";
import Head from "next/head";
import Image from 'next/image';
import { z } from 'zod';



const schemaValidation = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(2, "Minimo 2 caracteres")
})

type FieldValues = z.infer<typeof schemaValidation>

const Login: NextPage = () => {

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="tela de login" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black">
        <Image src="/Logo.png" width={95} height={95} alt="Logo AcesseNet" />
        <h1 className="text-stone-50 font-bold text-3xl"> AcesseNet</h1>
        <h3 className="text-stone-500 font-semibold text-lg">Faça login e comece a usar!</h3>

        <form>
          <div>
            <p className="text-stone-100 font-semibold text-base pt-8">Endereço de e-mail</p>
            <span className="flex row items-center">
              <Image src="/icons/EnvelopeSimple.svg" className="items-end" width={24} height={24} alt="Logo AcesseNet" />
              <input
                className="rounded p-2 my-2 w-80 bg-stone-900"
                type="email"
                placeholder="exemplo@exemplo.com.br"
              />
            </span>
          </div>

          <p className="text-stone-100 font-semibold text-base pt-6">Sua senha</p>
          <span className="flex row items-center">
            <Image src="/icons/Lock.svg" className="" width={24} height={24} alt="Logo AcesseNet" />
            <input
              className="rounded p-2 my-2 w-80 bg-stone-900"
              type="password"
              placeholder="**************"
            />
          </span>
          <br />

          <button className="p-2 mt-6 rounded w-80 font-semibold text-base bg-blue-500 hover:bg-blue-300" >Entrar na plataforma</button>
          <p className="text-stone-500 font-semibold text-base  my-4 text-center">ou</p>
          <span className="flex row items-center">
            <Image src="/icons/Google.svg" className="" width={24} height={24} alt="Logo AcesseNet" />
            <button className="bg-white p-2 rounded w-80 font-semibold text-base" >Entrar com Google</button>
          </span>
          <p className="text-stone-500 font-semibold text-base  my-4 text-center underline underline-offset-1">Esqueceu sua senha?</p>
        </form>
      </main>
    </>
  )
}

export default Login
