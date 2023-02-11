import { zodResolver } from "@hookform/resolvers/zod";
import type { TRPCErrorResponse } from "@trpc/server/rpc";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form/dist/types";
import Swal from "sweetalert2";
import { z } from "zod";
import { api } from "../../utils/api";
function Cliente() {
  const { push } = useRouter();
  const schemaValidation = z.object({
    name: z
      .string({ required_error: "Obrigatório" })
      .min(3, "No minímo 3 caracteres"),
    city: z
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
  const create = api.shop.create.useMutation();

  const onSubmit: SubmitHandler<FieldValues> = (data) =>
    create
      .mutateAsync(data)
      .then(async () => {
        await Swal.fire({
          icon: "success",
          title: "Loja criada com sucesso!",
          showConfirmButton: false,
          timer: 1500,
        });
        await push("/atendimento");
      })
      .catch((error: TRPCErrorResponse) =>
        Swal.fire({
          icon: "error",
          title: error ?? "Algo deu errado!",
          showConfirmButton: false,
          timer: 1500,
        })
      );
  return (
    <>
      <Head>
        <title>Cadastro de Loja</title>
        <meta name="description" content="Cadastro de Loja" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black">
        <Image src="/Logo.png" width={95} height={95} alt="Logo AcesseNet" />
        <h1 className="text-3xl font-bold text-stone-50"> AcesseNet</h1>
        <h3 className="text-lg font-semibold text-stone-500">
          Cadastro de Loja
        </h3>

        <form
          className="flex flex-col justify-items-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <p className="pt-8 text-base font-semibold text-stone-100">
              Sigla da Loja
            </p>
            <span className="row flex items-center pl-1.5">
              <Image
                src="/icons/User.svg"
                className="z-10 mr-[-32px]"
                width={24}
                height={24}
                alt="Logo AcesseNet"
              />
              <input
                {...register("name")}
                className={`my-2 w-80 items-center rounded bg-stone-900 p-2 pl-10 text-stone-100 ${
                  !!errors.name ? "border-2 border-red-50" : ""
                }`}
                type="text"
                placeholder="Maria Cardoso Santos"
              />
            </span>
            {errors.name && (
              <p className="text-sm font-semibold text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>
          <div>
            <p className="pt-8 text-base font-semibold text-stone-100">
              Nome da cidade
            </p>
            <span className="row flex items-center pl-1.5">
              <Image
                src="/icons/User.svg"
                className="z-10 mr-[-32px]"
                width={24}
                height={24}
                alt="Logo AcesseNet"
              />
              <input
                {...register("city")}
                className={`my-2 w-80 items-center rounded bg-stone-900 p-2 pl-10 text-stone-100 ${
                  !!errors.name ? "border-2 border-red-50" : ""
                }`}
                type="text"
                placeholder="Cidade"
              />
            </span>
            {errors.name && (
              <p className="text-sm font-semibold text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="row flex justify-center">
            <button
              type="submit"
              className="mt-8 w-80 rounded bg-blue-500 p-2 font-semibold hover:bg-blue-300"
            >
              Cadastrar
            </button>
          </div>
        </form>
      </main>
    </>
  );
}

export default Cliente;
