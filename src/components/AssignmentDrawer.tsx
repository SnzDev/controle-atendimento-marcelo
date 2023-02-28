import { useAutoAnimate } from "@formkit/auto-animate/react";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import EventIcon from "@mui/icons-material/Event";
import { IconButton } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import Fade from "@mui/material/Fade";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import type { AssignmentStatus } from "@prisma/client";
import moment from "moment";
import { useSession } from "next-auth/react";
import Image from "next/image";
import * as React from "react";
import { useState } from "react";
import { Observation } from "../components/Observation";
import { StatusHistoryModal } from "../components/StatusHistoryModal";
import { StyledMenu } from "../components/StyledMenu";
import useDebounce from "../hooks/useDebounce";
import { api } from "../utils/api";
import { changeStatusColor, changeStatusPortuguese } from "../utils/utils";
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
  oldUserId: string | null;
}

interface HandleOpenMenuProps {
  event: React.MouseEvent<HTMLButtonElement>;
  id: string;
  status: AssignmentStatus | null;
  oldUserId: string | null;
}
interface HandleChangeTechnicProps {
  userId: string | null;
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
interface AssignmentDrawerProps {
  isVisible: boolean;
  onClose: () => void;
}
export default function AssignmentDrawer({
  isVisible,
  onClose,
}: AssignmentDrawerProps) {
  const session = useSession();
  const queryClient = api.useContext();
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
      oldUserId: null,
    });

  const handleOpenMenuChangeTechnic = ({
    status,
    event: { currentTarget: anchor },
    id,
    oldUserId: oldTechnicId,
  }: HandleOpenMenuProps) => {
    setAnchorMenuChangeTechnic({ anchor, id, status, oldUserId: oldTechnicId });
  };
  const handleCloseMenuChangeTechnic = () => {
    setAnchorMenuChangeTechnic({
      anchor: null,
      id: null,
      status: null,
      oldUserId: null,
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
    userId: session?.data?.user.id,
    shopId: null,
    dateActivity: moment().format("YYYY-MM-DD"),
  });

  const listUser = api.user.getAll.useQuery({});

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
  const handleChangeTechnic = ({ id, userId }: HandleChangeTechnicProps) => {
    if (!id || !userId) return handleCloseMenuStatus();

    if (anchorMenuChangeTechnic.id)
      changeTechnic.mutate({
        id: anchorMenuChangeTechnic.id,
        userId,
      });
    handleCloseMenuChangeTechnic();
  };
  const role = session?.data?.user.role;
  const changeStatusWhenFinalized =
    (anchorMenuStatus.status !== "FINALIZED" &&
      anchorMenuStatus.status !== "CANCELED") ||
    role === "ADMIN";
  return (
    <Drawer anchor="right" open={isVisible} onClose={onClose}>
      <div className=" flex w-96 flex-1 flex-row gap-4 overflow-x-scroll bg-black px-4">
        {listAssignments.data?.map(({ userId, assignments }) => (
          <TableContainer
            key={userId}
            sx={{
              overflowY: "scroll",
              position: "relative",
              marginTop: "16px",
              backgroundColor: "rgb(30 41 59)",
            }}
            className="max-h-[800px] min-w-[350px] max-w-[400px] rounded-lg shadow"
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
                    {assignments[0]?.userAssignment.name}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody ref={parent}>
                {assignments.map((assignment) => {
                  const now = moment();
                  const dateNow = moment(now).format("YYYY-MM-DD");
                  const finalizedAt = moment(assignment.finalizedAt);
                  const createdAt = moment(assignment.createdAt);
                  const dateActivity = moment(assignment.dateActivity).utc();
                  const diffHour = now.diff(createdAt, "hours");
                  const diffMinutes = now.diff(createdAt, "minutes");
                  const diffFinalizedHour = finalizedAt.diff(
                    createdAt,
                    "hours"
                  );
                  const diffFinalizedMinutes = finalizedAt.diff(
                    createdAt,
                    "minutes"
                  );
                  const isActivityBeforeActivityDay = moment(
                    dateActivity.format("YYYY-MM-DD")
                  ).isBefore(filterAssignment.dateActivity, "day");

                  return (
                    <TableRow key={assignment.id}>
                      <TableCell
                        sx={{
                          border: isActivityBeforeActivityDay
                            ? undefined
                            : "none",
                          borderWidth: "2px",
                          borderColor: "rebeccapurple",
                          padding: 1,
                        }}
                      >
                        <div className="rounded bg-slate-700 p-2 drop-shadow-md">
                          <div className="flex flex-row justify-between">
                            <span className="flex items-center gap-1 overflow-ellipsis text-lg font-bold capitalize text-slate-50 ">
                              <StatusHistoryModal
                                historyAssignment={assignment.HistoryAssignment}
                              />
                              {assignment.client.name}
                            </span>
                            <div className="flex flex-row gap-1">
                              <button
                                aria-label="fade-button"
                                onClick={(event) =>
                                  !isActivityBeforeActivityDay &&
                                  handleOpenMenuStatus({
                                    status: assignment.status,
                                    event,
                                    id: assignment.id,
                                    oldUserId: assignment.userId,
                                  })
                                }
                                className={`rounded p-2 text-slate-50 ${changeStatusColor(
                                  assignment.status
                                )}
                                `}
                              >
                                {changeStatusPortuguese({
                                  status: assignment.status,
                                  isUppercase: true,
                                })}
                              </button>
                            </div>
                          </div>
                          <div className="mt-1 flex flex-row items-center justify-between font-bold text-slate-500">
                            <div className="flex flex-row items-center gap-0 ">
                              <AccessTimeIcon />
                              {createdAt.format("DD/MM HH:mm")}
                            </div>
                            <div className="flex flex-row items-center gap-0 ">
                              <EventIcon />
                              {dateActivity.format("DD/MM")}
                            </div>
                            <div className="flex flex-row items-center gap-1 ">
                              <AccessAlarmIcon />
                              {assignment.finalizedAt
                                ? diffFinalizedHour
                                  ? `${diffFinalizedHour} H`
                                  : `${diffFinalizedMinutes} M`
                                : diffHour
                                ? `${diffHour} H`
                                : `${diffMinutes} M`}
                            </div>
                            <div className="flex">
                              {
                                isActivityBeforeActivityDay ? (
                                  <button
                                    onClick={() =>
                                      changeTechnic.mutate({
                                        id: assignment.id,
                                        userId: assignment.userId,
                                        dateActivity:
                                          filterAssignment.dateActivity,
                                      })
                                    }
                                    className="text-blue-600 transition duration-300 ease-in-out hover:text-blue-700"
                                  >
                                    Fixar
                                  </button>
                                ) : null
                                // <button className="text-blue-600 transition duration-300 ease-in-out hover:text-blue-700">
                                //   Adiar
                                // </button>
                              }
                            </div>
                          </div>

                          <div className="flex flex-row items-center justify-between font-bold capitalize text-blue-500">
                            {assignment.service.name}{" "}
                            {assignment.shop.name?.toLowerCase()}
                            {session.data?.user.role !== "TECH" && (
                              <div className="flex flex-row">
                                {!isActivityBeforeActivityDay && (
                                  <>
                                    <button
                                      onClick={(event) =>
                                        !isActivityBeforeActivityDay &&
                                        handleOpenMenuChangeTechnic({
                                          status: assignment.status,
                                          event,
                                          id: assignment.id,
                                          oldUserId: userId,
                                        })
                                      }
                                      className="text-blue-500"
                                    >
                                      <Image
                                        alt="technical_icon"
                                        src="/icons/Technical.svg"
                                        width={22}
                                        height={22}
                                      />
                                    </button>
                                    <IconButton
                                      onClick={() =>
                                        positionUp.mutate({
                                          id: assignment.id,
                                        })
                                      }
                                      color="primary"
                                      component="label"
                                    >
                                      <ArrowUpwardIcon />
                                    </IconButton>
                                    <IconButton
                                      onClick={() =>
                                        positionDown.mutate({
                                          id: assignment.id,
                                        })
                                      }
                                      color="primary"
                                      component="label"
                                    >
                                      <ArrowDownwardIcon />
                                    </IconButton>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                          {!!assignment.observation.length && (
                            <Observation observation={assignment.observation} />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
        {listUser.data?.map((item) => {
          const userName = item.name;
          if (item.id !== anchorMenuChangeTechnic.oldUserId)
            return (
              <MenuItem
                key={item.id}
                onClick={() =>
                  handleChangeTechnic({
                    id: anchorMenuChangeTechnic.id,
                    userId: item.id,
                  })
                }
              >
                {userName}
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
        open={!!anchorMenuStatus.anchor && changeStatusWhenFinalized}
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
    </Drawer>
  );
}
