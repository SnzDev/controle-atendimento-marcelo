import Head from "next/head";
import Image from 'next/image';

function cliente() {
  return (
    <>
      <Head>
        <title>Serviço</title>
        <meta name="description" content="cadastro de serviços" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black">
        <Image src="/Logo.png" width={95} height={95} alt="Logo AcesseNet" />
        <h1 className="text-stone-50 font-bold text-3xl"> AcesseNet</h1>
        <h3 className="text-stone-500 font-semibold text-lg">Cadastro de cliente</h3>

        <form className="flex flex-col justify-items-center">
          <div>
            <p className="text-stone-100 font-semibold text-base pt-8">Nome do cliente</p>
            <span className="flex row items-center pl-1.5">
              <Image src="/icons/User.svg" className="mr-[-32px] z-10" width={24} height={24} alt="Logo AcesseNet" />
              <input
                className="rounded p-2 pl-10 items-center my-2 w-80 text-stone-100 bg-stone-900"
                type="text"
                placeholder="Maria Cardoso Santos"
              />
            </span>
          </div>
          <div className="flex row justify-center">
            <button className="p-2 mt-8 rounded w-80 font-semibold bg-blue-500 hover:bg-blue-300" >Cadastrar</button>
          </div>

        </form>
      </main>
    </>
  )
}

export default cliente