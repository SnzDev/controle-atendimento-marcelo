import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Head from "next/head";
import Image from "next/image";
import ListSubheader from "@mui/material/ListSubheader";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import { useState } from "react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

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
  const [open, setOpen] = useState(true);
  const handleClick = () => {
    setOpen(!open);
  };

  const { push } = useRouter();
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
  const create = api.client.create.useMutation();

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
        <title>Cadastro de cliente</title>
        <meta name="description" content="Cadastro de cliente" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black">
        <Image src="/Logo.png" width={95} height={95} alt="Logo AcesseNet" />
        <h1 className="text-3xl font-bold text-stone-50"> AcesseNet</h1>
        <h3 className="text-lg font-semibold text-stone-500">
          Cadastro de cliente
        </h3>
        <div className="w-full justify-center px-4 py-3">
          <div className="flex justify-center gap-10">
            {/* <div>
              <List
                className='bg-black  text-stone-100 w-[500px] justify-center'
              >
                <ListItemButton onClick={handleClick} className='bg-stone-900 hover:bg-slate-600'>
                  <ListItemText className='text-stone-100 font-semibold text-base'>
                    Cadastro de Cliente
                  </ListItemText>
                  {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4 }}>
                      <form className="flex flex-col justify-items-center">
                        <div>
                          <p className="text-stone-100 font-semibold text-base">Nome do cliente</p>
                          <span className="flex row items-center pl-1.5">
                            <Image src="/icons/User.svg" className="mr-[-32px] z-10" width={24} height={24} alt="icone usuário" />
                            <input
                              className="rounded p-2 pl-10 items-center my-2 w-80 text-stone-100 bg-stone-900"
                              type="text"
                              placeholder="Maria Cardoso Santos"
                            />
                          </span>
                        </div>
                        <div className="flex row justify-center">
                          <button className="p-2 mt-4 rounded w-80 font-semibold bg-blue-500 hover:bg-blue-300" >Cadastrar</button>
                        </div>
                      </form>
                    </ListItemButton>
                  </List>
                </Collapse>
              </List>
            </div> */}
            <div className="flex items-center justify-between gap-10">
              <form className="flex justify-items-center gap-10">
                <div>
                  <p className="text-base font-semibold text-stone-100">
                    Nome do cliente
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
                      className="my-2 w-80 items-center rounded bg-stone-900 p-2 pl-10 text-stone-100"
                      type="text"
                      placeholder="Maria Cardoso Santos"
                    />
                  </span>
                </div>
                <div className="row flex justify-center">
                  <button className="mt-8 h-10 w-40 rounded bg-blue-500 p-2 font-semibold hover:bg-blue-300">
                    Cadastrar
                  </button>
                </div>
              </form>
              <div>
                <p className="text-base font-semibold text-stone-100">
                  Pesquisa
                </p>
                <span className="row flex items-center pl-1.5">
                  <Image
                    src="/icons/Search.svg"
                    className="z-10 mr-[-32px]"
                    width={24}
                    height={24}
                    alt="icone usuário"
                  />
                  <input
                    className="my-2 w-80 items-center rounded bg-stone-900 p-2 pl-10 text-stone-100"
                    type="text"
                    placeholder="Pesquisa"
                  />
                </span>
              </div>
            </div>
          </div>
          <TableContainer
            component={Paper}
            className="mt-4 border-r-8 border-l-8 bg-stone-900 text-stone-100"
          >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className="text-stone-100">
                    Nome do cliente
                  </TableCell>
                  <TableCell
                    className="text-stone-100"
                    align="right"
                  ></TableCell>
                  <TableCell
                    className="text-stone-100"
                    align="right"
                  ></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      className="text-stone-100"
                      component="th"
                      scope="row"
                    >
                      {row.name}
                    </TableCell>
                    <TableCell className="text-stone-100" align="right">
                      <button className="mt-4 w-20 rounded bg-blue-500 p-2 font-semibold hover:bg-blue-300">
                        Editar
                      </button>
                    </TableCell>
                    <TableCell className="text-stone-100" align="right">
                      <button className="mt-4 w-20 rounded bg-blue-500 p-2 font-semibold hover:bg-blue-300">
                        Editar
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        {/* <>
        <h1 className="text-3xl font-bold text-stone-50"> AcesseNet</h1>
        <h3 className="text-lg font-semibold text-stone-500">
          Cadastro de Cliente
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
        </> */}
      </main>
    </>
  );
}

export default Cliente;
