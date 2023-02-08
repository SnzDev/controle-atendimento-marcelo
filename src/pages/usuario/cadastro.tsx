
import Head from "next/head";
import Image from 'next/image';

function cadastro() {
  return (
    <>
      <Head>
        <title>Cadastro de usuário</title>
        <meta name="description" content="cadastro de usuaário" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black">

        <Image src="/Logo.png" width={95} height={95} alt="Logo AcesseNet" />
        <h1 className="text-stone-50 font-bold text-3xl"> AcesseNet</h1>
        <h3 className="text-stone-500 font-semibold text-lg">Faça login e comece a usar!</h3>

        <form>
          <div className="flex row items-center gap-4">
            <div>
              <p className="text-stone-100 font-semibold text-base pt-8">Nome</p>
              <span className="flex row items-center">
                <Image src="/icons/User.svg" className="items-end" width={24} height={24} alt="Logo AcesseNet" />
                <input
                  className="rounded p-2 my-2 w-80 bg-stone-900"
                  type="text"
                  placeholder="Maria José de Sousa Sauro"
                />
              </span>
            </div>

            <div>
              <p className="text-stone-100 font-semibold text-base pt-8">E-mail</p>
              <span className="flex row items-center">
                <Image src="/icons/EnvelopeSimple.svg" className="items-end" width={24} height={24} alt="Logo AcesseNet" />
                <input
                  className="rounded p-2 my-2 w-80 bg-stone-900"
                  type="email"
                  placeholder="exemplo@exemplo.com.br"
                />
              </span>
            </div>
          </div>

          <div className="flex row items-center gap-4 itens">
            <div>
              <p className="text-stone-100 font-semibold text-base pt-6">Senha</p>
              <span className="flex row items-center">
                <Image src="/icons/Lock.svg" className="items-end" width={24} height={24} alt="Logo AcesseNet" />
                <input
                  className="rounded p-2 my-2 w-80 bg-stone-900"
                  type="password"
                  placeholder="*****************"
                />
              </span>
            </div>

            <div>
              <p className="text-stone-100 font-semibold text-base pt-6">Confirmar senha</p>
              <span className="flex row items-center">
                <Image src="/icons/Lock.svg" className="items-end" width={24} height={24} alt="Logo AcesseNet" />
                <input
                  className="rounded p-2 my-2 w-80 bg-stone-900"
                  type="password"
                  placeholder="*****************"

                />
              </span>
            </div>
          </div>
          <div className="flex row justify-center">
            <button className="p-2 mt-8 rounded w-80 font-semibold bg-blue-500 hover:bg-blue-300" >Cadastrar</button>
          </div>
        </form>
      </main>

    </>
  )
}

export default cadastro