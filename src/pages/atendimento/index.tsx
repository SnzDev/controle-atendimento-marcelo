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

import Fade from "@mui/material/Fade";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { StyledMenu } from "../../components/StyledMenu";
import { api } from "../../utils/api";
import type { AssignmentStatus } from "@prisma/client";
import { ResponsiveAppBar } from "../../components/AppBar";

import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { AssignmentModal } from "../../components/AssignmentModal";
import moment from "moment";
import useDebounce from "../../hooks/useDebounce";

interface AnchorMenuStatus {
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
interface AnchorMenuChangeTechnic {
  anchor: null | HTMLElement;
  id: string | null;
  status: AssignmentStatus | null;
  oldTechnicId: string | null;
}

interface HandleOpenMenuProps {
  event: React.MouseEvent<HTMLButtonElement>;
  id: string;
  status: AssignmentStatus | null;
  oldTechnicId: string | null;
}
interface HandleChangeTechnicProps {
  technicId: string | null;
  id: string | null;
}
interface FilterAssignment {
  shopId: string | null;
  dateActivity: string;
}

interface HandleChangeFilterAssignment {
  key: "shopId" | "dateActivity";
  value: string;
}
export default function Assignments() {
  const queryClient = api.useContext();
  const [isVisibleModalCreate, setIsVisibleModalCreate] = useState(false);
  const [parent] = useAutoAnimate(/* optional config */);
  const [filterAssignment, setFilterAssignment] = useState<FilterAssignment>({
    shopId: null,
    dateActivity: moment().format("YYYY-MM-DD"),
  });
  const { shopId, dateActivity } = useDebounce(filterAssignment, 1000);
  const [anchorMenuStatus, setAnchorMenuStatus] = useState<AnchorMenuStatus>({
    anchor: null,
    id: null,
    status: null,
  });
  const [anchorMenuChangeTechnic, setAnchorMenuChangeTechnic] =
    useState<AnchorMenuChangeTechnic>({
      anchor: null,
      id: null,
      status: null,
      oldTechnicId: null,
    });

  const handleOpenMenuChangeTechnic = ({
    status,
    event: { currentTarget: anchor },
    id,
    oldTechnicId,
  }: HandleOpenMenuProps) => {
    setAnchorMenuChangeTechnic({ anchor, id, status, oldTechnicId });
  };
  const handleCloseMenuChangeTechnic = () => {
    setAnchorMenuChangeTechnic({
      anchor: null,
      id: null,
      status: null,
      oldTechnicId: null,
    });
  };
  const handleOpenMenuStatus = ({
    status,
    event: { currentTarget: anchor },
    id,
  }: HandleOpenMenuProps) => {
    setAnchorMenuStatus({ anchor, id, status });
  };
  const handleCloseMenuStatus = () => {
    setAnchorMenuStatus({ anchor: null, id: null, status: null });
  };
  const handleChangeFilter = ({ key, value }: HandleChangeFilterAssignment) =>
    setFilterAssignment((old) => {
      return { ...old, [key]: value };
    });

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
  const changeTechnic = api.assignment.changeTechnic.useMutation({
    onSuccess: () => queryClient.assignment.getAssignments.invalidate(),
  });
  const handleChangeStatus = ({ id, status }: HandleChangeStatusProps) => {
    if (!id || !status) return handleCloseMenuStatus();

    changeStatus.mutate({ id, status });
    handleCloseMenuStatus();
  };
  const handleChangeTechnic = ({ id, technicId }: HandleChangeTechnicProps) => {
    if (!id || !technicId) return handleCloseMenuStatus();

    if (anchorMenuChangeTechnic.id)
      changeTechnic.mutate({
        id: anchorMenuChangeTechnic.id,
        technicId,
      });
    handleCloseMenuChangeTechnic();
  };
  console.log(filterAssignment);
  return (
    <>
      <Head>
        <title>Atendimentos</title>
        <meta name="description" content="Lista de Atendimentos" />
        <link rel="icon" href="/favicon.ico" />
        <style></style>
      </Head>
      <main className="flex min-h-screen flex-1 flex-col items-center overflow-y-hidden bg-black ">
        <Fab
          onClick={() => setIsVisibleModalCreate(true)}
          sx={{ position: "absolute", right: 10, bottom: 10 }}
          className="bg-blue-500"
          color="primary"
          aria-label="add"
        >
          <AddIcon />
        </Fab>
        <ResponsiveAppBar
          shopId={filterAssignment.shopId}
          dateActivity={filterAssignment.dateActivity}
          onChange={handleChangeFilter}
        />

        <div className=" mt-16 flex w-full flex-1 flex-row  gap-4 overflow-x-scroll px-4">
          {listAssignments.data?.map(({ techId, assignments }) => (
            <TableContainer
              key={techId}
              sx={{
                overflowY: "scroll",
                position: "relative",
                marginTop: "16px",
                maxHeight: "600px",
                maxWidth: "400px",
                minWidth: "350px",
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
                                  handleOpenMenuStatus({
                                    status: assignment.status,
                                    event,
                                    id: assignment.id,
                                    oldTechnicId: assignment.technicId,
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
                              <button
                                onClick={(event) =>
                                  handleOpenMenuChangeTechnic({
                                    status: assignment.status,
                                    event,
                                    id: assignment.id,
                                    oldTechnicId: techId,
                                  })
                                }
                                className="text-blue-500"
                              >
                                <Image
                                  alt="technical_icon"
                                  src="/icons/Technical.svg"
                                  width={16}
                                  height={16}
                                />
                              </button>
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
          anchorEl={anchorMenuChangeTechnic.anchor}
          open={!!anchorMenuChangeTechnic.anchor}
          onClose={handleCloseMenuChangeTechnic}
          TransitionComponent={Fade}
        >
          {listAssignments.data?.map((item) => {
            const technicName = item.assignments[0]?.technic.name;
            if (item.techId !== anchorMenuChangeTechnic.oldTechnicId)
              return (
                <MenuItem
                  key={item.techId}
                  onClick={() =>
                    handleChangeTechnic({
                      id: anchorMenuChangeTechnic.id,
                      technicId: item.techId,
                    })
                  }
                >
                  {technicName}
                </MenuItem>
              );
          })}
        </StyledMenu>

        <StyledMenu
          id="fade-menu"
          MenuListProps={{
            "aria-labelledby": "fade-button",
          }}
          anchorEl={anchorMenuStatus.anchor}
          open={!!anchorMenuStatus.anchor}
          onClose={handleCloseMenuStatus}
          TransitionComponent={Fade}
        >
          {anchorMenuStatus.status !== "PENDING" && (
            <MenuItem
              onClick={() =>
                handleChangeStatus({
                  id: anchorMenuStatus.id,
                  status: "PENDING",
                })
              }
            >
              PENDENTE
            </MenuItem>
          )}
          {anchorMenuStatus.status !== "IN_PROGRESS" && (
            <MenuItem
              onClick={() =>
                handleChangeStatus({
                  id: anchorMenuStatus.id,
                  status: "IN_PROGRESS",
                })
              }
            >
              ANDAMENTO
            </MenuItem>
          )}
          {anchorMenuStatus.status !== "FINALIZED" && (
            <MenuItem
              onClick={() =>
                handleChangeStatus({
                  id: anchorMenuStatus.id,
                  status: "FINALIZED",
                })
              }
            >
              FINALIZADO
            </MenuItem>
          )}
          {anchorMenuStatus.status !== "CANCELED" && (
            <MenuItem
              onClick={() =>
                handleChangeStatus({
                  id: anchorMenuStatus.id,
                  status: "CANCELED",
                })
              }
            >
              CANCELADO
            </MenuItem>
          )}
        </StyledMenu>

        <AssignmentModal
          isVisible={isVisibleModalCreate}
          onClose={() => setIsVisibleModalCreate(false)}
        />
      </main>
    </>
  );
}
