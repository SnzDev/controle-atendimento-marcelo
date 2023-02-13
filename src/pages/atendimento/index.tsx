import { useAutoAnimate } from "@formkit/auto-animate/react";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { IconButton } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Head from "next/head";
import Image from "next/image";

import {} from "@formkit/auto-animate";
import Fade from "@mui/material/Fade";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { StyledMenu } from "../../components/StyledMenu";
import { api } from "../../utils/api";
import { AssignmentStatus } from "@prisma/client";
import { ResponsiveAppBar } from "../../components/AppBar";

interface MenuChangeStatus {
  anchor: null | HTMLElement;
  id: string | null;
  status: AssignmentStatus | null;
}
interface HandleOpenMenuProps {
  event: React.MouseEvent<HTMLButtonElement>;
  id: string;
  status: AssignmentStatus | null;
}
interface HandleChangeStatusProps {
  status: AssignmentStatus | null;
  id: string | null;
}

export default function Assignments() {
  const shopId = "cle0947h3000av5k41d3wxmmk";
  const dateActivity = "2023-11-02";
  const queryClient = api.useContext();
  const [parent] = useAutoAnimate(/* optional config */);
  const [anchorEl, setAnchorEl] = useState<MenuChangeStatus>({
    anchor: null,
    id: null,
    status: null,
  });
  const open = Boolean(anchorEl.anchor);
  const handleOpenMenu = ({
    status,
    event: { currentTarget: anchor },
    id,
  }: HandleOpenMenuProps) => {
    setAnchorEl({ anchor, id, status });
  };
  const handleCloseMenu = () => {
    setAnchorEl({ anchor: null, id: null, status: null });
  };
  const listAssignments = api.assignment.getAssignments.useQuery({
    shopId,
    dateActivity,
  });

  const positionUp = api.assignment.positionUp.useMutation({
    onSuccess: () => queryClient.assignment.getAssignments.invalidate(),
  });
  const positionDown = api.assignment.positionDown.useMutation({
    onSuccess: () => queryClient.assignment.getAssignments.invalidate(),
  });

  const changeStatus = api.assignment.changeStatus.useMutation({
    onSuccess: () => queryClient.assignment.getAssignments.invalidate(),
  });
  const handleChangeStatus = ({ id, status }: HandleChangeStatusProps) => {
    if (!id || !status) return handleCloseMenu();

    changeStatus.mutate({ id, status });
    handleCloseMenu();
  };
  return (
    <>
      <Head>
        <title>Atendimentos</title>
        <meta name="description" content="Lista de Atendimentos" />
        <link rel="icon" href="/favicon.ico" />
        <style></style>
      </Head>
      <ResponsiveAppBar />
      <main className="flex min-h-screen flex-1 flex-col items-center bg-black">
        <div className="flex h-full w-full flex-1 flex-row  gap-4 overflow-x-scroll px-4">
          {listAssignments.data?.map(({ techId, assignments }) => (
            <TableContainer
              key={techId}
              sx={{
                overflowY: "scroll",
                position: "relative",
                marginTop: "16px",
                maxHeight: "600px",
                width: "400px",
                backgroundColor: "rgb(30 41 59)",
              }}
              className="rounded-lg shadow"
            >
              <Table aria-label="simple table">
                <TableHead className="sticky top-0 z-10 bg-slate-800">
                  <TableRow>
                    <TableCell
                      align="center"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 16,
                        fontWeight: "bold",
                        fontSize: 24,
                        color: "rgb(248 250 252)",
                        border: "none",
                      }}
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
                <TableBody ref={parent}>
                  {assignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell
                        sx={{
                          border: "none",
                          padding: 1,
                        }}
                      >
                        <div className="rounded bg-slate-700 p-2 drop-shadow-md">
                          <div className="flex flex-row justify-between">
                            <span className="overflow-ellipsis text-lg font-bold capitalize text-slate-50 ">
                              {assignment.client.name}
                            </span>
                            <div className="flex flex-row gap-1">
                              <button
                                aria-label="fade-button"
                                onClick={(event) =>
                                  handleOpenMenu({
                                    status: assignment.status,
                                    event,
                                    id: assignment.id,
                                  })
                                }
                                className={`rounded  p-2 text-slate-50  
                                ${
                                  assignment.status === "PENDING"
                                    ? "bg-yellow-600 hover:bg-yellow-700"
                                    : ""
                                }
                                ${
                                  assignment.status === "IN_PROGRESS"
                                    ? "bg-blue-600 hover:bg-blue-700"
                                    : ""
                                }
                                ${
                                  assignment.status === "FINALIZED"
                                    ? "bg-green-600 hover:bg-green-700"
                                    : ""
                                }
                                ${
                                  assignment.status === "CANCELED"
                                    ? "bg-red-600 hover:bg-red-700"
                                    : ""
                                }
                                `}
                              >
                                {assignment.status === "PENDING" && "PENDENTE"}
                                {assignment.status === "CANCELED" &&
                                  "CANCELADO"}
                                {assignment.status === "IN_PROGRESS" &&
                                  "ANDAMENTO"}
                                {assignment.status === "FINALIZED" &&
                                  "FINALIZADO"}
                              </button>
                            </div>
                          </div>
                          <div className="flex flex-row items-center justify-between font-bold text-blue-500">
                            {assignment.service.name}

                            <div className="flex flex-row gap-3">
                              <IconButton
                                onClick={() =>
                                  positionUp.mutate({ id: assignment.id })
                                }
                                color="primary"
                                component="label"
                              >
                                <ArrowUpwardIcon />
                              </IconButton>
                              <IconButton
                                onClick={() =>
                                  positionDown.mutate({ id: assignment.id })
                                }
                                color="primary"
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
        <StyledMenu
          id="fade-menu"
          MenuListProps={{
            "aria-labelledby": "fade-button",
          }}
          anchorEl={anchorEl.anchor}
          open={open}
          onClose={handleCloseMenu}
          TransitionComponent={Fade}
        >
          {anchorEl.status !== "PENDING" && (
            <MenuItem
              onClick={() =>
                handleChangeStatus({ id: anchorEl.id, status: "PENDING" })
              }
            >
              PENDENTE
            </MenuItem>
          )}
          {anchorEl.status !== "IN_PROGRESS" && (
            <MenuItem
              onClick={() =>
                handleChangeStatus({ id: anchorEl.id, status: "IN_PROGRESS" })
              }
            >
              ANDAMENTO
            </MenuItem>
          )}
          {anchorEl.status !== "FINALIZED" && (
            <MenuItem
              onClick={() =>
                handleChangeStatus({ id: anchorEl.id, status: "FINALIZED" })
              }
            >
              FINALIZADO
            </MenuItem>
          )}
          {anchorEl.status !== "CANCELED" && (
            <MenuItem
              onClick={() =>
                handleChangeStatus({ id: anchorEl.id, status: "CANCELED" })
              }
            >
              CANCELADO
            </MenuItem>
          )}
        </StyledMenu>
      </main>
    </>
  );
}
