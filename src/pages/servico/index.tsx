import { zodResolver } from "@hookform/resolvers/zod";
import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CgSpinnerTwo } from "react-icons/cg";
import { api } from "../../utils/api";
import { useSession } from "next-auth/react";
import Router from "next/router";
const Service: NextPage = () => {
  const schemaValidation = z.object({
    name: z
      .string({ required_error: "Obrigatório" })
      .min(3, "No mínimo 3 caracteres"),
  });
  type FieldValues = z.infer<typeof schemaValidation>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: zodResolver(schemaValidation),
  });
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    create.mutate(data);
  };
  const create = api.service.create.useMutation({
    onSuccess: () => {
      alert("sucesso");
    },
  });
  const { data: sessionData } = useSession();
  console.log(sessionData);
  if (!sessionData)
    return (
      <>
        <Head>
          <title>Não encontrado</title>
          <meta name="description" content="Não encontrado" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-white">Não encontrado</h1>
            <p className="text-lg text-white"></p>
          </div>
        </main>
      </>
    );
  return (
    <>
      <Head>
        <title>Atividades</title>
        <meta name="description" content="Tela de atividades" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <form
          className="mb-4 flex flex-col gap-4 rounded-md bg-violet-600 p-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            {...register("name")}
            placeholder="Tipo de serviço"
            className="rounded-sm p-2 shadow-lg"
          />
          <span className="text-red-500">{errors.name?.message}</span>
          <button
            className="rounded-sm bg-blue-800 p-2 text-white transition-colors hover:bg-blue-700"
            type="submit"
          >
            Cadastrar
          </button>
        </form>
        <ListService />
      </main>
    </>
  );
};

const ListService: React.FC = () => {
  const inativate = api.service.inativate.useMutation();
  const activate = api.service.activate.useMutation();
  return (
    <div className="flex flex-col gap-4 rounded-md bg-slate-400 p-10">
      {data.data?.map((item) => (
        <div
          key={item.id}
          className="flex flex-row rounded-md bg-slate-200 p-2"
        >
          <span className={item.deletedAt ? "line-through" : ""}>
            {item.name}
          </span>
          <button className="rounded-sm bg-amber-500 p-2 text-white transition-colors hover:bg-amber-600">
            Editar
          </button>
          {item.deletedAt ? (
            <button
              onClick={() => activate.mutate({ id: item.id })}
              className="rounded-sm bg-red-500 p-2 text-white transition-colors hover:bg-red-600"
            >
              {activate.isLoading && activate.variables?.id === item.id ? (
                <CgSpinnerTwo
                  className="mr-3 h-5 w-5 animate-spin"
                  viewBox="0 0 24 24"
                />
              ) : (
                "Ativar"
              )}
            </button>
          ) : (
            <button
              onClick={() => inativate.mutate({ id: item.id })}
              className="rounded-sm bg-red-500 p-2 text-white transition-colors hover:bg-red-600"
            >
              {inativate.isLoading && inativate.variables?.id === item.id ? (
                <CgSpinnerTwo
                  className="mr-3 h-5 w-5 animate-spin"
                  viewBox="0 0 24 24"
                />
              ) : (
                "Inativar"
              )}
            </button>
          )}
        </div>
      ))}

      {!data.data?.length && (
        <div className="flex flex-col rounded-md bg-slate-200 p-2">
          Não há serviços cadastrados
        </div>
      )}
    </div>
  );
};

export default Service;
