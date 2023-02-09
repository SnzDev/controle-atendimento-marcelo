import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";
import Image from "next/image";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form/dist/types";
import Swal from "sweetalert2";
import { z } from "zod";
import { api } from "../../utils/api";
import "@sweetalert2/theme-dark";
function Cliente() {
  const schemaValidation = z.object({
    name: z
      .string({ required_error: "Obrigatório" })
      .min(3, "No minímo 3 caracteres"),
  });
  type FieldValues = z.infer<typeof schemaValidation>;
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(schemaValidation),
  });
  const create = api.client.create.useMutation();

  const onSubmit: SubmitHandler<FieldValues> = (data) =>
    create.mutateAsync(data).then(async () => {
      await Swal.fire("Cliente cadastrado com sucesso!");
      reset();
    });
  return (
    <>
      <Head>
        <title>Serviço</title>
        <meta name="description" content="cadastro de serviços" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black">
        <Image src="/Logo.png" width={95} height={95} alt="Logo AcesseNet" />
        <h1 className="text-3xl font-bold text-stone-50"> AcesseNet</h1>
        <h3 className="text-lg font-semibold text-stone-500">
          Cadastro de cliente
        </h3>

        <form
          className="flex flex-col justify-items-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <p className="pt-8 text-base font-semibold text-stone-100">
              Nome do cliente
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
