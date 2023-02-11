import { signOut } from "next-auth/react";
import Head from "next/head";
import { useEffect } from "react";

const SignOut = () => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    signOut({ redirect: true, callbackUrl: "/" });
  }, []);
  return (
    <>
      <Head>
        <title>Desconectar</title>
        <meta name="description" content="Desconectar da sessão" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black">
        <span>Desconectando...</span>
      </main>
    </>
  );
};

export default SignOut;
