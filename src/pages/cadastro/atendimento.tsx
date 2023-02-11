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

function Assignment() {
  const { push } = useRouter();
  const schemaValidation = z.object({
    clientId: z.string({ required_error: "Obrigatório" }),
    technicId: z.string({ required_error: "Obrigatório" }),
    shopId: z.string({ required_error: "Obrigatório" }),
    serviceId: z.string({ required_error: "Obrigatório" }),
    dayActivity: z.date(),
  });
  type FieldValues = z.infer<typeof schemaValidation>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: zodResolver(schemaValidation),
  });
  const create = api.client.create.useMutation();

  const listClients = api.client.getAll.useQuery();
  const listTechnic = api.technic.getAll.useQuery();
  const listShop = api.shop.getAll.useQuery();
  const listService = api.service.getAll.useQuery();

  const onSubmit: SubmitHandler<FieldValues> = (data) =>
    create
      .mutateAsync(data)
      .then(async () => {
        await Swal.fire({
          icon: "success",
          title: "Cliente criado com sucesso!",
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
        <title>Atendimento</title>
        <meta name="description" content="cadastro de serviços" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black">
        <Image src="/Logo.png" width={95} height={95} alt="Logo AcesseNet" />
        <h1 className="text-3xl font-bold text-stone-50"> AcesseNet</h1>
        <h3 className="text-lg font-semibold text-stone-500">
          Cadastro de Atendimento
        </h3>

        <form
          className="flex flex-col items-center justify-items-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <p className=" text-base font-semibold text-stone-100">Cliente</p>
            <span className="row flex items-center pl-1.5">
              <Image
                src="/icons/User.svg"
                className="z-10 mr-[-32px]"
                width={24}
                height={24}
                alt="Logo AcesseNet"
              />
              <select
                {...register("clientId")}
                className={`my-2 w-80 items-center rounded bg-stone-900 p-2 pl-10 text-stone-100 ${
                  !!errors.clientId ? "border-2 border-red-50" : ""
                }`}
                placeholder="Selecione uma cidade"
              >
                {listClients?.data?.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
              <button className="ml-2 rounded-md bg-blue-500 py-2 px-4 transition-colors hover:bg-blue-600">
                +
              </button>
            </span>
            {errors.clientId && (
              <p className="text-sm font-semibold text-red-500">
                {errors.clientId.message}
              </p>
            )}
          </div>
          <div>
            <p className=" text-base font-semibold text-stone-100">Técnico</p>
            <span className="row flex items-center pl-1.5">
              <Image
                src="/icons/User.svg"
                className="z-10 mr-[-32px]"
                width={24}
                height={24}
                alt="Logo AcesseNet"
              />
              <select
                {...register("technicId")}
                className={`my-2 w-80 items-center rounded bg-stone-900 p-2 pl-10 text-stone-100 ${
                  !!errors.technicId ? "border-2 border-red-50" : ""
                }`}
                placeholder="Selecione um técnico"
              >
                {listTechnic?.data?.map((technic) => (
                  <option key={technic.id} value={technic.id}>
                    {technic.name}
                  </option>
                ))}
              </select>
              <button className="ml-2 rounded-md bg-blue-500 py-2 px-4 transition-colors hover:bg-blue-600">
                +
              </button>
            </span>
            {errors.technicId && (
              <p className="text-sm font-semibold text-red-500">
                {errors.technicId.message}
              </p>
            )}
          </div>
          <div>
            <p className=" text-base font-semibold text-stone-100">
              Tipo de Serviço
            </p>
            <span className="row flex items-center pl-1.5">
              <Image
                src="/icons/User.svg"
                className="z-10 mr-[-32px]"
                width={24}
                height={24}
                alt="Logo AcesseNet"
              />
              <select
                {...register("serviceId")}
                className={`my-2 w-80 items-center rounded bg-stone-900 p-2 pl-10 text-stone-100 ${
                  !!errors.serviceId ? "border-2 border-red-50" : ""
                }`}
                placeholder="Selecione o tipo"
              >
                {listService?.data?.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
              <button className="ml-2 rounded-md bg-blue-500 py-2 px-4 transition-colors hover:bg-blue-600">
                +
              </button>
            </span>
            {errors.serviceId && (
              <p className="text-sm font-semibold text-red-500">
                {errors.serviceId.message}
              </p>
            )}
          </div>
          <div>
            <p className="text-base font-semibold text-stone-100">Loja</p>
            <span className="row flex items-center pl-1.5">
              <Image
                src="/icons/User.svg"
                className="z-10 mr-[-32px]"
                width={24}
                height={24}
                alt="Logo AcesseNet"
              />
              <select
                {...register("shopId")}
                className={`my-2 w-80 items-center rounded bg-stone-900 p-2 pl-10 text-stone-100 ${
                  !!errors.shopId ? "border-2 border-red-50" : ""
                }`}
                placeholder="Selecione a loja"
              >
                {listShop?.data?.map((shop) => (
                  <option key={shop.id} value={shop.id}>
                    {shop.name}
                  </option>
                ))}
              </select>
              <button className="ml-2 rounded-md bg-blue-500 py-2 px-4 transition-colors hover:bg-blue-600">
                +
              </button>
            </span>
            {errors.shopId && (
              <p className="text-sm font-semibold text-red-500">
                {errors.shopId.message}
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

export default Assignment;
