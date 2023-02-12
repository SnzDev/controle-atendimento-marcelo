import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Head from "next/head";
import Image from "next/image";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Chip, Collapse } from "@mui/material";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form/dist/types";
import Swal from "sweetalert2";
import { z } from "zod";
import useDebounce from "../../hooks/useDebounce";
import { api } from "../../utils/api";
function Loja() {
  const [selectedId, setSelectedId] = useState("");
  const [searchName, setSearchName] = useState("");
  const nameDebounced = useDebounce(searchName, 500);
  const schemaValidation = z.object({
    id: z.string().optional(),
    name: z
      .string({ required_error: "Obrigatório" })
      .min(3, "No minímo 3 caracteres"),
  });
  type FieldValues = z.infer<typeof schemaValidation>;
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(schemaValidation),
  });
  const queryCtx = api.useContext();
  const create = api.shop.create.useMutation({
    onSuccess: () => {
      void queryCtx.shop.getAll.invalidate();
      void Swal.fire({
        icon: "success",
        title: "Loja cadastrada com sucesso!",
        showConfirmButton: false,
        timer: 1500,
      });
      setSelectedId("");
      reset();
    },
    onError: () => {
      void Swal.fire({
        icon: "error",
        title: "Falha ao cadastrar loja!",
        text: "Algo deu errado",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });
  const update = api.shop.update.useMutation({
    onSuccess: () => {
      void queryCtx.shop.getAll.invalidate();
      void Swal.fire({
        icon: "success",
        title: "Loja atualizada com sucesso!",
        showConfirmButton: false,
        timer: 1500,
      });
      setSelectedId("");
      reset();
    },
    onError: () => {
      void Swal.fire({
        icon: "error",
        title: "Falha ao editar loja!",
        text: "Algo deu errado",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });
  const showPatient = api.shop.findOne.useQuery(
    { id: selectedId },
    {
      enabled: !!selectedId,
      onSuccess: (data) => {
        setValue("id", data?.id);
        setValue("name", data?.name ?? "");
      },
    }
  );
  const list = api.shop.getAll.useQuery({ name: nameDebounced });
  const inactive = api.shop.inativate.useMutation({
    onSuccess: () => {
      void queryCtx.shop.getAll.invalidate();
      void Swal.fire({
        icon: "success",
        title: "Loja inativada com sucesso!",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: () => {
      void Swal.fire({
        icon: "error",
        title: "Falha ao inativar loja!",
        text: "Algo deu errado",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });
  const active = api.shop.activate.useMutation({
    onSuccess: () => {
      void queryCtx.shop.getAll.invalidate();
      void Swal.fire({
        icon: "success",
        title: "Loja ativada com sucesso!",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: () => {
      void Swal.fire({
        icon: "error",
        title: "Falha ao ativar loja!",
        text: "Algo deu errado",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = ({ id, name }) => {
    if (id) return update.mutate({ id, name });

    create.mutate({ name });
  };

  return (
    <>
      <Head>
        <title>Cadastro de loja</title>
        <meta name="description" content="Cadastro de loja" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black">
        <Image src="/Logo.png" width={95} height={95} alt="Logo AcesseNet" />
        <h1 className="text-3xl font-bold text-stone-50"> AcesseNet</h1>
        <h3 className="text-center text-lg font-semibold text-slate-100">
          Cadastro de loja
        </h3>
        <div className="max-w-screen-lg justify-center  py-3  ">
          <div className="flex flex-col justify-center rounded bg-slate-800 p-2">
            <div className="flex items-center justify-between gap-10">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex justify-items-center gap-10"
              >
                <div>
                  <p className="text-base font-semibold text-stone-100">
                    Revenda
                  </p>
                  <span className="row flex items-center pl-1.5">
                    <Image
                      src="/icons/User.svg"
                      className="z-10 mr-[-32px]"
                      width={24}
                      height={24}
                      alt="icone usuário"
                    />
                    <input
                      {...register("name")}
                      className="my-2  w-80 items-center rounded border-[1px] border-stone-100 bg-stone-900 p-2 pl-10 text-stone-100"
                      type="text"
                      placeholder="Ex: Piripiri"
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
                    className="mt-8 h-10 w-40 rounded bg-blue-600 p-2 font-semibold text-stone-100 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                    disabled={create.isLoading || update.isLoading}
                  >
                    {create.isLoading || update.isLoading ? (
                      <CircularProgress color="inherit" size="25px" />
                    ) : (
                      "Salvar"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <TableContainer className="relative mt-4 h-[500px] w-full overflow-y-scroll  bg-slate-800 shadow">
            <Table className="relative" aria-label="simple table">
              <TableHead className="sticky top-1 bg-slate-800">
                <TableRow>
                  <TableCell className="text-lg font-bold text-stone-100">
                    Lojas
                  </TableCell>
                  <TableCell className="text-stone-100" width="10%">
                    <span className="row flex items-center pl-1.5 ">
                      <Image
                        src="/icons/Search.svg"
                        className="z-10 mr-[-32px]"
                        width={24}
                        height={24}
                        alt="icone usuário"
                      />
                      <input
                        className=" w-80 items-center rounded border-[1px] border-stone-100 bg-stone-900 p-2 pl-10 text-stone-100"
                        type="text"
                        placeholder="Pesquisar"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                      />
                    </span>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list.isLoading ? (
                  <TableRow>
                    <TableCell align="center" colSpan={2}>
                      <CircularProgress color="primary" size="100px" />
                    </TableCell>
                  </TableRow>
                ) : (
                  list.data?.map((item) => (
                    <TableRow
                      key={item.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        className="text-md capitalize text-stone-100"
                        scope="row"
                      >
                        {item.name.toLowerCase()}
                        {item.deletedAt && (
                          <Chip
                            label="Inativo"
                            className="ml-2"
                            size="small"
                            color="error"
                          />
                        )}
                      </TableCell>
                      <TableCell className=" text-stone-100">
                        <div className="flex justify-end gap-4">
                          <button
                            onClick={() => setSelectedId(item.id)}
                            className="w-20 rounded bg-yellow-600 p-2 font-semibold transition-colors hover:bg-yellow-700"
                          >
                            {showPatient.isLoading && selectedId === item.id ? (
                              <CircularProgress color="inherit" size="10px" />
                            ) : (
                              "Editar"
                            )}
                          </button>
                          {item.deletedAt ? (
                            <button
                              onClick={() => active.mutate({ id: item.id })}
                              className="w-20 rounded bg-green-700 p-2 font-semibold transition-colors hover:bg-green-800"
                            >
                              Ativar
                            </button>
                          ) : (
                            <button
                              onClick={() => inactive.mutate({ id: item.id })}
                              className="w-20 rounded bg-red-500 p-2 font-semibold transition-colors hover:bg-red-600"
                            >
                              Inativar
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </main>
    </>
  );
}

export default Loja;
