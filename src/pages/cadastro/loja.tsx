import CircularProgress from "@mui/material/CircularProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Head from "next/head";
import Image from "next/image";
import AddIcon from "@mui/icons-material/Add";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Chip, Fab, Modal } from "@mui/material";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form/dist/types";
import Swal from "sweetalert2";
import { z } from "zod";
import ResponsiveAppBar from "../../components/AppBar";
import useDebounce from "../../hooks/useDebounce";
import { api } from "../../utils/api";

function Shop() {
  const [selectedId, setSelectedId] = useState("");
  const [modalCreate, setModalCreate] = useState(false);
  const [searchName, setSearchName] = useState("");
  const nameDebounced = useDebounce(searchName, 500);

  const queryCtx = api.useContext();

  const list = api.shop.getAll.useQuery({ name: nameDebounced });
  const inactive = api.shop.inativate.useMutation({
    onSuccess: () => {
      void queryCtx.shop.getAll.invalidate();
      void Swal.fire({
        icon: "success",
        title: "Revenda inativada com sucesso!",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: () => {
      void Swal.fire({
        icon: "error",
        title: "Falha ao inativar revenda!",
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
        title: "Revenda ativada com sucesso!",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: () => {
      void Swal.fire({
        icon: "error",
        title: "Falha ao ativar revenda!",
        text: "Algo deu errado",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });

  return (
    <>
      <Head>
        <title>Cadastro de revenda</title>
        <meta name="description" content="Cadastro de revenda" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ResponsiveAppBar />
      <main className="flex h-screen flex-1 flex-col items-center overflow-y-hidden bg-black px-2 pb-4 pt-[80px]">
        <Fab
          onClick={() => setModalCreate(true)}
          sx={{ position: "absolute", right: 10, bottom: 10 }}
          className="bg-blue-500"
          color="primary"
          aria-label="add"
        >
          <AddIcon />
        </Fab>
        <TableContainer
          sx={{ width: "fit-content" }}
          className="relative flex overflow-y-scroll rounded-lg bg-slate-800 shadow"
        >
          <Table className="relative" aria-label="simple table">
            <TableHead className="sticky top-0 bg-slate-800">
              <TableRow>
                <TableCell
                  sx={{ color: "#f1f5f9" }}
                  className="text-lg font-bold"
                >
                  Revendas
                </TableCell>
                <TableCell sx={{ color: "#f1f5f9" }} width="10%">
                  <span className="row flex items-center pl-1.5 ">
                    <Image
                      src="/icons/Search.svg"
                      className="z-10 mr-[-32px]"
                      width={24}
                      height={24}
                      alt="icone usuário"
                    />
                    <input
                      className=" w-40 items-center rounded border-[1px] border-stone-100 bg-stone-900 p-2 pl-10 text-stone-100 md:w-80"
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
                      sx={{ color: "#f1f5f9" }}
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
                    <TableCell>
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={() => {
                            setSelectedId(item.id);
                            setModalCreate(true);
                          }}
                          className="w-20 rounded bg-yellow-600 p-2 font-semibold text-stone-100 transition-colors hover:bg-yellow-700"
                        >
                          Editar
                        </button>
                        {item.deletedAt ? (
                          <button
                            onClick={() => active.mutate({ id: item.id })}
                            className="w-20 rounded bg-green-700 p-2 font-semibold text-stone-100 transition-colors hover:bg-green-800"
                          >
                            Ativar
                          </button>
                        ) : (
                          <button
                            onClick={() => inactive.mutate({ id: item.id })}
                            className="w-20 rounded bg-red-500 p-2 font-semibold text-stone-100 transition-colors hover:bg-red-600"
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
        <ModalCreate
          clientId={selectedId}
          isOpen={modalCreate}
          onClose={() => setModalCreate(false)}
        />
      </main>
    </>
  );
}

interface ModalCreateProps {
  isOpen: boolean;
  onClose: () => void;
  clientId?: string;
}
const ModalCreate = ({ clientId, isOpen, onClose }: ModalCreateProps) => {
  const queryCtx = api.useContext();

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

  const create = api.shop.create.useMutation({
    onSuccess: () => {
      void queryCtx.shop.getAll.invalidate();
      void Swal.fire({
        icon: "success",
        title: "Revenda cadastrado com sucesso!",
        showConfirmButton: false,
        timer: 1500,
      });
      reset();
    },
    onError: () => {
      void Swal.fire({
        icon: "error",
        title: "Falha ao cadastrar revenda!",
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
        title: "Revenda atualizado com sucesso!",
        showConfirmButton: false,
        timer: 1500,
      });
      reset();
    },
    onError: () => {
      void Swal.fire({
        icon: "error",
        title: "Falha ao editar revenda!",
        text: "Algo deu errado",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });

  api.shop.findOne.useQuery(
    { id: clientId ?? "" },
    {
      enabled: !!clientId,
      onSuccess: (data) => {
        setValue("id", data?.id);
        setValue("name", data?.name ?? "");
      },
    }
  );

  const onSubmit: SubmitHandler<FieldValues> = ({ id, name }) => {
    if (id) {
      update.mutate({ id, name });
      return onClose();
    }

    create.mutate({ name });
    onClose();
  };

  return (
    <Modal
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      open={isOpen}
      onClose={onClose}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-fit flex-col items-center justify-center gap-2 rounded bg-slate-800 px-10 py-5 shadow-md "
      >
        <div className="flex flex-col justify-end">
          <p className="text-base font-semibold text-stone-100">
            Nome da revenda
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
              className="my-2 w-60 items-center rounded border-[1px] border-stone-100 bg-stone-900 p-2 pl-10 text-stone-100 md:w-80"
              type="text"
            />
          </span>
          {errors.name && (
            <p className="text-sm font-semibold text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>
        <div className="flex flex-row justify-center">
          <button
            type="submit"
            className="h-10 w-40 rounded bg-blue-600 p-2 font-semibold text-stone-100 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
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
    </Modal>
  );
};

export default Shop;
