import { Paper } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Head from "next/head";
import Image from "next/image";

export default function Assignments() {
  return (
    <>
      <Head>
        <title>Atendimentos</title>
        <meta name="description" content="Lista de Atendimentos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-black">
        <div className="flex h-20 w-full flex-row justify-between bg-slate-800">
          <div className="flex flex-row items-center gap-2">
            <Image
              src="/Logo.png"
              width={95}
              height={95}
              alt="Logo AcesseNet"
            />
            <h1 className="text-3xl font-bold text-stone-50"> AcesseNet</h1>
          </div>
        </div>
        <div className="flex flex-1 flex-row">
          <TableContainer
            component={Paper}
            className="mt-4 border-r-8 border-l-8 bg-stone-900 text-stone-100"
          >
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className="text-lg font-bold text-stone-100">
                    Nome do cliente
                  </TableCell>
                  <TableCell className="text-stone-100" width="10%">
                    HEllo
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Oi</TableCell>
                  <TableCell>Olá</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </main>
    </>
  );
}
