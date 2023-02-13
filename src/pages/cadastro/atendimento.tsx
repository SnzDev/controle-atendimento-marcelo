import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, TextField } from "@mui/material";
import type { TRPCErrorResponse } from "@trpc/server/rpc";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form/dist/types";
import Swal from "sweetalert2";
import { z } from "zod";
import { api } from "../../utils/api";
import moment from "moment";

function Assignment() {
  const { push } = useRouter();
  const schemaValidation = z.object({
    client: z.object({
      id: z.string({ required_error: "Obrigatório" }),
      label: z.string().optional(),
    }),
    technic: z.object({
      id: z.string({ required_error: "Obrigatório" }),
      label: z.string().optional(),
    }),
    shop: z.object({
      id: z.string({ required_error: "Obrigatório" }),
      label: z.string().optional(),
    }),
    service: z.object({
      id: z.string({ required_error: "Obrigatório" }),
      label: z.string().optional(),
    }),
    dateActivity: z.date(),
  });
  type FieldValues = z.infer<typeof schemaValidation>;
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: zodResolver(schemaValidation),
    defaultValues: {
      client: {
        id: "",
        label: "",
      },
      technic: {
        id: "",
        label: "",
      },
      shop: {
        id: "",
        label: "",
      },
      service: {
        id: "",
        label: "",
      },
      dateActivity: new Date(moment().format("YYYY-MM-DD")),
    },
  });
  const queryCtx = api.useContext();

  const create = api.assignment.create.useMutation({
    onSuccess: () => {
      void queryCtx.assignment.getAssignments.invalidate();
      void Swal.fire({
        icon: "success",
        title: "Atendimento cadastrado com sucesso!",
        showConfirmButton: false,
        timer: 1500,
      });
      reset();
    },
    onError: () => {
      void Swal.fire({
        icon: "error",
        title: "Falha ao cadastrar atendimento!",
        text: "Algo deu errado",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });

  const listClients = api.clients.getAll.useQuery({});
  const listTechnic = api.technic.getAll.useQuery({});
  const listShop = api.shop.getAll.useQuery({});
  const listService = api.service.getAll.useQuery({});

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
          <Controller
            control={control}
            name="client"
            render={({ field: { onChange, ...field } }) => (
              <Autocomplete
                {...field}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(_e, v) => onChange(v)}
                disablePortal
                id="combo-box-demo"
                style={{ color: "black" }}
                options={
                  listClients.data?.map(({ id, name }) => {
                    return { id, label: name };
                  }) ?? []
                }
                renderInput={(params) => (
                  <div ref={params.InputProps.ref}>
                    <p className=" text-base font-semibold text-stone-100">
                      Cliente
                    </p>
                    <span className="flex flex-row items-center pl-1.5">
                      <Image
                        src="/icons/User.svg"
                        className="z-10 mr-[-32px]"
                        width={24}
                        height={24}
                        alt="Logo AcesseNet"
                      />
                      <input
                        type="text"
                        {...params.inputProps}
                        className="my-2 w-80 items-center rounded border-[1px] border-stone-100 bg-stone-900 p-2 pl-10 text-stone-100"
                      />
                      <button className="ml-2 rounded-md bg-blue-500 py-2 px-4 transition-colors hover:bg-blue-600">
                        +
                      </button>
                    </span>
                    {errors.technic && (
                      <p className="text-sm font-semibold text-red-500">
                        {errors.technic.message}
                      </p>
                    )}
                  </div>
                )}
                noOptionsText="Não encontrado"
              />
            )}
          />

          <Controller
            control={control}
            name="technic"
            render={({ field: { onChange, ...field } }) => (
              <Autocomplete
                {...field}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(_e, v) => onChange(v)}
                disablePortal
                id="combo-box-demo"
                style={{ color: "black" }}
                options={
                  listTechnic.data?.map(({ id, name }) => {
                    return { id, label: name };
                  }) ?? []
                }
                renderInput={(params) => (
                  <div ref={params.InputProps.ref}>
                    <p className=" text-base font-semibold text-stone-100">
                      Técnico
                    </p>
                    <span className="flex flex-row items-center pl-1.5">
                      <Image
                        src="/icons/User.svg"
                        className="z-10 mr-[-32px]"
                        width={24}
                        height={24}
                        alt="Logo AcesseNet"
                      />
                      <input
                        type="text"
                        {...params.inputProps}
                        className="my-2 w-80 items-center rounded border-[1px] border-stone-100 bg-stone-900 p-2 pl-10 text-stone-100"
                      />
                      <button className="ml-2 rounded-md bg-blue-500 py-2 px-4 transition-colors hover:bg-blue-600">
                        +
                      </button>
                    </span>
                    {errors.technic && (
                      <p className="text-sm font-semibold text-red-500">
                        {errors.technic.message}
                      </p>
                    )}
                  </div>
                )}
                noOptionsText="Não encontrado"
              />
            )}
          />

          <Controller
            control={control}
            name="service"
            render={({ field: { onChange, ...field } }) => (
              <Autocomplete
                {...field}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(_e, v) => onChange(v)}
                disablePortal
                id="combo-box-demo"
                style={{ color: "black" }}
                options={
                  listService.data?.map(({ id, name }) => {
                    return { id, label: name };
                  }) ?? []
                }
                renderInput={(params) => (
                  <div ref={params.InputProps.ref}>
                    <p className=" text-base font-semibold text-stone-100">
                      Tipo de Serviço
                    </p>
                    <span className="flex flex-row items-center pl-1.5">
                      <Image
                        src="/icons/User.svg"
                        className="z-10 mr-[-32px]"
                        width={24}
                        height={24}
                        alt="Logo AcesseNet"
                      />
                      <input
                        type="text"
                        {...params.inputProps}
                        className="my-2 w-80 items-center rounded border-[1px] border-stone-100 bg-stone-900 p-2 pl-10 text-stone-100"
                      />
                      <button className="ml-2 rounded-md bg-blue-500 py-2 px-4 transition-colors hover:bg-blue-600">
                        +
                      </button>
                    </span>
                    {errors.technic && (
                      <p className="text-sm font-semibold text-red-500">
                        {errors.technic.message}
                      </p>
                    )}
                  </div>
                )}
                noOptionsText="Não encontrado"
              />
            )}
          />
          <Controller
            control={control}
            name="shop"
            render={({ field: { onChange, ...field } }) => (
              <Autocomplete
                {...field}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(_e, v) => onChange(v)}
                disablePortal
                id="combo-box-demo"
                style={{ color: "black" }}
                options={
                  listShop.data?.map(({ id, name }) => {
                    return { id, label: `${name}` };
                  }) ?? []
                }
                renderInput={(params) => (
                  <div ref={params.InputProps.ref}>
                    <p className=" text-base font-semibold text-stone-100">
                      Loja
                    </p>
                    <span className="flex flex-row items-center pl-1.5">
                      <Image
                        src="/icons/User.svg"
                        className="z-10 mr-[-32px]"
                        width={24}
                        height={24}
                        alt="Logo AcesseNet"
                      />
                      <input
                        type="text"
                        {...params.inputProps}
                        className="my-2 w-80 items-center rounded border-[1px] border-stone-100 bg-stone-900 p-2 pl-10 text-stone-100"
                      />
                      <button className="ml-2 rounded-md bg-blue-500 py-2 px-4 transition-colors hover:bg-blue-600">
                        +
                      </button>
                    </span>
                    {errors.technic && (
                      <p className="text-sm font-semibold text-red-500">
                        {errors.technic.message}
                      </p>
                    )}
                  </div>
                )}
                noOptionsText="Não encontrado"
              />
            )}
          />
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
