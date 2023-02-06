import { type NextPage } from "next";
import Head from "next/head";

import { api } from "../utils/api";

const Login: NextPage = () => {
  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="tela de login" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black">
        <h1 className="text-stone-50 font-bold text-2xl"> AcesseNet</h1>
        <h3 className="text-stone-300 font-semibold text-lg">Faça login e comece a usar!</h3>
        <p className="text-stone-100 font-semibold text-base">Endereço de e-mail</p>
        <input type="email" placeholder="exemplo@exemplo.com.br" />
        <p className="text-stone-100 font-semibold text-base">Sua senha</p>
        <input type="password" />
        <br />
        <button className="bg-white p-2" >Entrar na plataforma</button>
        <p>ou</p>
        <button className="bg-white p-2" >Entrar com Google</button>
      </main>
    </>

  )
}

export default Login
