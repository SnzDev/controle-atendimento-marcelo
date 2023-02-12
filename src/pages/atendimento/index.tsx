import { Button, IconButton, Paper } from "@mui/material";
import Chip from "@mui/material/Chip/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Head from "next/head";
import Image from "next/image";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { api } from "../../utils/api";
export default function Assignments() {
  const shopId = "cle0947h3000av5k41d3wxmmk";
  const dateActivity = "2023-11-02";
  const listAssignments = api.assignment.getAssignments.useQuery({
    shopId,
    dateActivity,
  });

  return (
    <>
      <Head>
        <title>Atendimentos</title>
        <meta name="description" content="Lista de Atendimentos" />
        <link rel="icon" href="/favicon.ico" />
        <style></style>
      </Head>
      <main className="flex min-h-screen flex-1 flex-col items-center bg-black">
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
        <div className="flex w-full flex-1 flex-row gap-4 px-4">
          {listAssignments.data?.map(({ techId, assignments }) => (
            <TableContainer
              key={techId}
              component={Paper}
              className="relative mt-4 h-[500px] w-[400px] overflow-y-scroll bg-slate-800 shadow"
            >
              <Table aria-label="simple table">
                <TableHead className="sticky top-0 z-10 bg-slate-800">
                  <TableRow>
                    <TableCell
                      align="center"
                      className="flex flex-row items-center justify-center gap-4 border-none text-lg font-bold text-stone-100"
                    >
                      <Image
                        alt="technical_icon"
                        src="/icons/Technical.svg"
                        width={24}
                        height={24}
                      />
                      {assignments[0]?.technic.name}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className=" border-none ">
                        <div className="rounded bg-slate-700 p-2 drop-shadow-md">
                          <div className="flex flex-row justify-between">
                            <span className="overflow-ellipsis text-lg font-bold text-slate-50 ">
                              {assignment.client.name}
                            </span>
                            <div className="flex flex-row gap-1">
                              <Button
                                className="bg-yellow-600 hover:bg-yellow-700"
                                size="small"
                                variant="contained"
                              >
                                {assignment.status === "PENDING" && "PENDENTE"}
                                {assignment.status === "CANCELED" &&
                                  "CANCELADO"}
                                {assignment.status === "IN_PROGRESS" &&
                                  "ANDAMENTO"}
                                {assignment.status === "FINALIZED" &&
                                  "FINALIZADO"}
                              </Button>
                            </div>
                          </div>
                          <div className="flex flex-row items-center justify-between font-bold text-blue-500">
                            {assignment.service.name}

                            <div className="flex flex-row gap-3">
                              <IconButton
                                className="text-blue-500"
                                component="label"
                              >
                                <ArrowUpwardIcon />
                              </IconButton>
                              <IconButton
                                color="primary"
                                className="text-blue-500"
                                component="label"
                              >
                                <ArrowDownwardIcon />
                              </IconButton>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {assignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className=" border-none ">
                        <div className="rounded bg-slate-700 p-2 drop-shadow-md">
                          <div className="flex flex-row justify-between">
                            <span className="overflow-ellipsis text-lg font-bold text-slate-50 ">
                              {assignment.client.name}
                            </span>
                            <div className="flex flex-row gap-1">
                              <Button
                                className="bg-yellow-600 hover:bg-yellow-700"
                                size="small"
                                variant="contained"
                              >
                                {assignment.status === "PENDING" && "PENDENTE"}
                                {assignment.status === "CANCELED" &&
                                  "CANCELADO"}
                                {assignment.status === "IN_PROGRESS" &&
                                  "ANDAMENTO"}
                                {assignment.status === "FINALIZED" &&
                                  "FINALIZADO"}
                              </Button>
                            </div>
                          </div>
                          <div className="flex flex-row items-center justify-between font-bold text-blue-500">
                            {assignment.service.name}

                            <div className="flex flex-row gap-3">
                              <IconButton
                                className="text-blue-500"
                                component="label"
                              >
                                <ArrowUpwardIcon />
                              </IconButton>
                              <IconButton
                                color="primary"
                                className="text-blue-500"
                                component="label"
                              >
                                <ArrowDownwardIcon />
                              </IconButton>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {assignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className=" border-none ">
                        <div className="rounded bg-slate-700 p-2 drop-shadow-md">
                          <div className="flex flex-row justify-between">
                            <span className="overflow-ellipsis text-lg font-bold text-slate-50 ">
                              {assignment.client.name}
                            </span>
                            <div className="flex flex-row gap-1">
                              <Button
                                className="bg-yellow-600 hover:bg-yellow-700"
                                size="small"
                                variant="contained"
                              >
                                {assignment.status === "PENDING" && "PENDENTE"}
                                {assignment.status === "CANCELED" &&
                                  "CANCELADO"}
                                {assignment.status === "IN_PROGRESS" &&
                                  "ANDAMENTO"}
                                {assignment.status === "FINALIZED" &&
                                  "FINALIZADO"}
                              </Button>
                            </div>
                          </div>
                          <div className="flex flex-row items-center justify-between font-bold text-blue-500">
                            {assignment.service.name}

                            <div className="flex flex-row gap-3">
                              <IconButton
                                className="text-blue-500"
                                component="label"
                              >
                                <ArrowUpwardIcon />
                              </IconButton>
                              <IconButton
                                color="primary"
                                className="text-blue-500"
                                component="label"
                              >
                                <ArrowDownwardIcon />
                              </IconButton>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ))}
        </div>
      </main>
    </>
  );
}
