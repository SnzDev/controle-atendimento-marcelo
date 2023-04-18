import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Badge from "@mui/material/Badge";
import Head from "next/head";
import Image from "next/image";

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
import { colorRoles } from "../../utils/utils";
import { UserRole } from "@prisma/client";

function User() {
  const [selectedId, setSelectedId] = useState("");
  const [modalCreate, setModalCreate] = useState(false);
  const [searchName, setSearchName] = useState("");
  const nameDebounced = useDebounce(searchName, 500);

  const queryCtx = api.useContext();
  const list = api.user.getAll.useQuery({ name: nameDebounced });

  const inactive = api.user.inativate.useMutation({
    onSuccess: () => {
      void queryCtx.user.getAll.invalidate();
      void Swal.fire({
        icon: "success",
        title: "Usuario inativado com sucesso!",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: () => {
      void Swal.fire({
        icon: "error",
        title: "Falha ao inativar usuario!",
        text: "Algo deu errado",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });
  const active = api.user.activate.useMutation({
    onSuccess: () => {
      void queryCtx.user.getAll.invalidate();
      void Swal.fire({
        icon: "success",
        title: "Usuario ativado com sucesso!",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: () => {
      void Swal.fire({
        icon: "error",
        title: "Falha ao ativar usuario!",
        text: "Algo deu errado",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });
  return (
    <>
      <Head>
        <title>Cadastro de usuário</title>
        <meta name="description" content="cadastro de usuaário" />
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
                  Usuários
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
                      className="text-md capitalize"
                      sx={{ color: "#f1f5f9" }}
                      scope="row"
                    >
                      <Badge variant="dot" color={colorRoles(item.role)}>
                        {item?.name?.toLowerCase()}
                      </Badge>
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
          userId={selectedId}
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
  userId?: string;
}
const ModalCreate = ({ isOpen, onClose, userId }: ModalCreateProps) => {
  const queryCtx = api.useContext();
  const schemaValidation = z
    .object({
      id: z.string().optional(),
      name: z
        .string({ required_error: "Obrigatório" })
        .min(3, "No minímo 3 caracteres"),
      userName: z
        .string({ required_error: "Obrigatório" })
        .min(3, "No minímo 3 caracteres"),
      role: z.enum([UserRole.ADMIN, UserRole.TECH, UserRole.USER]),
      password: z.string().optional(),
      confirmPassword: z.string().optional(),
    })
    .superRefine((input, ctx) => {
      const { password, confirmPassword, id } = input;

      if (!id) {
        if (!password)
          return ctx.addIssue({
            path: ["password"],
            message: "Obrigatório",
            code: "custom",
          });

        if (password.length < 8)
          return ctx.addIssue({
            path: ["password"],
            message: "No mínimo 8 caracteres",
            code: "custom",
          });
      }
      if (password && password.length < 8)
        return ctx.addIssue({
          path: ["password"],
          message: "No mínimo 8 caracteres",
          code: "custom",
        });

      if (password !== confirmPassword) {
        return ctx.addIssue({
          path: ["confirmPassword"],
          message: "As senhas não conferem",
          code: "custom",
        });
      }
    });
  type FieldValues = z.infer<typeof schemaValidation>;
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(schemaValidation),
  });

  api.user.findOne.useQuery(
    { id: userId ?? "" },
    {
      enabled: !!userId,
      onSuccess: (data) => {
        setValue("id", data?.id);
        setValue("name", data?.name);
        setValue("userName", data?.userName);
        setValue("role", data?.role);
      },
    }
  );
  const create = api.user.create.useMutation({
    onSuccess: () => queryCtx.user.getAll.invalidate(),
  });
  const update = api.user.update.useMutation({
    onSuccess: () => queryCtx.user.getAll.invalidate(),
  });

  const onSubmit: SubmitHandler<FieldValues> = ({
    confirmPassword,
    password,
    id,
    ...data
  }) => {
    if (id) {
      update.mutate({ password, id, ...data });
      onClose();
      return reset();
    }
    if (!password) return;
    create.mutate({ password, ...data });
    onClose();
    reset();
  };

  return (
    <Modal
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      open={isOpen}
      onClose={onClose}
    >
      <form
        className="flex w-fit flex-col items-center justify-center gap-2 rounded bg-slate-800 px-10 py-5 shadow-md "
        onSubmit={handleSubmit(onSubmit, (error) => console.log(error))}
      >
        <div>
          <p className="text-base font-semibold text-stone-100">Nome</p>
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
              className="my-2 w-60 items-center rounded border-[1px] border-stone-100 bg-stone-900 p-2 pl-10 text-stone-100 md:w-80"
              type="text"
              placeholder="Maria José de Sousa Sauro"
            />
          </span>
          {errors.name && (
            <p className="text-base font-semibold text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <p className="text-base font-semibold text-stone-100">E-mail</p>
          <span className="row flex items-center">
            <Image
              src="/icons/EnvelopeSimple.svg"
              className="z-10 mr-[-32px]"
              width={24}
              height={24}
              alt="Logo AcesseNet"
            />
            <input
              {...register("userName")}
              className="my-2 w-60 items-center rounded border-[1px] border-stone-100 bg-stone-900 p-2 pl-10 text-stone-100 md:w-80"
              type="text"
              placeholder="usuario.nome"
            />
          </span>
          {errors.userName && (
            <p className="text-base font-semibold text-red-500">
              {errors.userName.message}
            </p>
          )}
        </div>

        <div>
          <p className="text-base font-semibold text-stone-100">Cargo</p>
          <span className="row flex items-center">
            <Image
              src="/icons/EnvelopeSimple.svg"
              className="z-10 mr-[-32px]"
              width={24}
              height={24}
              alt="Logo AcesseNet"
            />
            <select
              {...register("role")}
              className="my-2 w-60 items-center rounded border-[1px] border-stone-100 bg-stone-900 p-2 pl-10 text-stone-100 md:w-80"
              placeholder="Usuário"
            >
              <option value={UserRole.ADMIN}>Admin</option>
              <option value={UserRole.USER}>Usuário</option>
              <option value={UserRole.TECH}>Técnico</option>
            </select>
          </span>
          {errors.role && (
            <p className="text-base font-semibold text-red-500">
              {errors.role.message}
            </p>
          )}
        </div>

        <div>
          <p className="text-base font-semibold text-stone-100">Senha</p>
          <span className="row flex items-center">
            <Image
              src="/icons/Lock.svg"
              className="z-10 mr-[-32px]"
              width={24}
              height={24}
              alt="Logo AcesseNet"
            />
            <input
              {...register("password")}
              className="my-2 w-60 items-center rounded border-[1px] border-stone-100 bg-stone-900 p-2 pl-10 text-stone-100 md:w-80"
              type="password"
              placeholder="*****************"
            />
          </span>
          {errors.password && (
            <p className="text-base font-semibold text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <p className="text-base font-semibold text-stone-100">
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
              {...register("confirmPassword")}
              className="my-2 w-60 items-center rounded border-[1px] border-stone-100 bg-stone-900 p-2 pl-10 text-stone-100 md:w-80"
              type="password"
              placeholder="*****************"
            />
          </span>
          {errors.confirmPassword && (
            <p className="text-base font-semibold text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <div className="row flex justify-center">
          <button
            type="submit"
            disabled={create.isLoading}
            className="h-10 w-40 rounded bg-blue-600 p-2 font-semibold text-stone-100 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {create.isLoading ? (
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
export default User;
