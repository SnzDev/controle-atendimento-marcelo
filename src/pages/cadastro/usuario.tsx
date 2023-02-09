import Head from "next/head";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler } from "react-hook-form/dist/types";
import { api } from "../../utils/api";

function Usuario() {
  const schemaValidation = z.object({
    name: z
      .string({ required_error: "Obrigatório" })
      .min(3, "No minímo 3 caracteres"),
  });
  type FieldValues = z.infer<typeof schemaValidation>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(schemaValidation),
  });
  const onSubmit: SubmitHandler<FieldValues> = (data) => console.log(data);
  return (
    <>
      <Head>
        <title>Cadastro de usuário</title>
        <meta name="description" content="cadastro de usuaário" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black">
        <Image src="/Logo.png" width={95} height={95} alt="Logo AcesseNet" />
        <h1 className="text-3xl font-bold text-stone-50"> AcesseNet</h1>
        <h3 className="text-lg font-semibold text-stone-500">
          Cadastro de usuário
        </h3>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row flex items-center gap-6">
            <div>
              <p className="pt-8 text-base font-semibold text-stone-100">
                Nome
              </p>
              <span className="row flex items-center">
                <Image
                  src="/icons/User.svg"
                  className="z-10 mr-[-32px]"
                  width={24}
                  height={24}
                  alt="Logo AcesseNet"
                />
                <input
                  {...register("name")}
                  className="my-2 w-80 rounded bg-stone-900 p-2 pl-10"
                  type="text"
                  placeholder="Maria José de Sousa Sauro"
                />
              </span>
            </div>

            <div>
              <p className="pt-8 text-base font-semibold text-stone-100">
                E-mail
              </p>
              <span className="row flex items-center">
                <Image
                  src="/icons/EnvelopeSimple.svg"
                  className="z-10 mr-[-32px]"
                  width={24}
                  height={24}
                  alt="Logo AcesseNet"
                />
                <input
                  className="my-2 w-80 rounded bg-stone-900 p-2 pl-10 text-stone-100"
                  type="email"
                  placeholder="exemplo@exemplo.com.br"
                />
              </span>
            </div>
          </div>

          <div className="row flex items-center gap-6">
            <div>
              <p className="pt-6 text-base font-semibold text-stone-100">
                Senha
              </p>
              <span className="row flex items-center">
                <Image
                  src="/icons/Lock.svg"
                  className="z-10 mr-[-32px]"
                  width={24}
                  height={24}
                  alt="Logo AcesseNet"
                />
                <input
                  className="my-2 w-80 rounded bg-stone-900 p-2 pl-10 text-stone-100"
                  type="password"
                  placeholder="*****************"
                />
              </span>
            </div>

            <div>
              <p className="pt-6 text-base font-semibold text-stone-100">
                Confirmar senha
              </p>
              <span className="row flex items-center">
                <Image
                  src="/icons/Lock.svg"
                  className="z-10 mr-[-32px]"
                  width={24}
                  height={24}
                  alt="Logo AcesseNet"
                />
                <input
                  className="my-2 w-80 rounded bg-stone-900 p-2 pl-10 text-stone-100"
                  type="password"
                  placeholder="*****************"
                />
              </span>
            </div>
          </div>
          <div className="row flex justify-center">
            <button className="mt-8 w-80 rounded bg-blue-500 p-2 font-semibold hover:bg-blue-300">
              Cadastrar
            </button>
          </div>
        </form>
      </main>
    </>
  );
}

export default Usuario;
