import Head from "next/head";
import Image from "next/image";

export default function PermissionError() {
  return (
    <>
      <Head>
        <title>Sem permissão</title>
        <meta name="description" content="Cadastro de cliente" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black">
        <Image
          alt="Sem permissão"
          width={200}
          height={200}
          src="/icons/undraw/permission_denied.svg"
        />
        <h1 className="mt-5 text-3xl font-bold text-white">
          Erro de permissão
        </h1>
        <p className="text-lg text-white">
          Você não tem permissão para acessar esse recurso.
        </p>
      </main>
    </>
  );
}
