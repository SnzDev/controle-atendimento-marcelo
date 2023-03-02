import { useAutoAnimate } from "@formkit/auto-animate/react";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import EventIcon from "@mui/icons-material/Event";
import { IconButton } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import moment from "moment";
import { useSession } from "next-auth/react";
import Image from "next/image";
import * as React from "react";
import Observation from "../components/Observation";
import StatusHistoryModal from "../components/StatusHistoryModal";
import { api } from "../utils/api";
import ChangeService from "./Menus/ChangeService";
import ChangeStatus from "./Menus/ChangeStatus";
import ChangeTechnic from "./Menus/ChangeTechnic";

// interface AssignmentDrawerProps {
//   isVisible: boolean;
//   onClose: () => void;
// }
function AssignmentDrawer() {
  const session = useSession();
  const queryClient = api.useContext();
  const [parent] = useAutoAnimate(/* optional config */);

  const today = moment().format("YYYY-MM-DD");

  const positionUp = api.assignment.positionUp.useMutation({
    onSuccess: () => queryClient.assignment.getAssignments.invalidate(),
  });
  const positionDown = api.assignment.positionDown.useMutation({
    onSuccess: () => queryClient.assignment.getAssignments.invalidate(),
  });

  const changeTechnic = api.assignment.changeTechnic.useMutation({
    onSuccess: () => queryClient.assignment.getAssignments.invalidate(),
  });
  const listAssignments = api.assignment.getAssignments.useQuery({
    userId: session?.data?.user.id,
    shopId: null,
    dateActivity: today,
  });

  return (
    <div className="fixed left-0 top-[64px] h-full pb-[64px]">
      <div className=" overflow-x-scrol flex h-full w-fit flex-1 flex-row gap-4 bg-slate-900 p-4">
        {listAssignments.data?.map(({ userId, assignments }) => (
          <TableContainer
            key={userId}
            sx={{
              overflowY: "scroll",
              position: "relative",
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
                  // const dateNow = moment(now).format("YYYY-MM-DD");
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
                  ).isBefore(dateActivity, "day");

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
                              <ChangeStatus
                                actualStatus={assignment.status}
                                assignmentId={assignment.id}
                              />
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
                              {isActivityBeforeActivityDay ? (
                                <button
                                  onClick={() =>
                                    changeTechnic.mutate({
                                      id: assignment.id,
                                      userId: assignment.userId,
                                      dateActivity: today,
                                    })
                                  }
                                  className="text-blue-600 transition duration-300 ease-in-out hover:text-blue-700"
                                >
                                  Fixar
                                </button>
                              ) : null}
                            </div>
                          </div>

                          <div className="flex flex-row items-center justify-between font-bold capitalize text-blue-500">
                            <ChangeService
                              serviceId={assignment.serviceId}
                              assignmentId={assignment.id}
                              shopName={assignment.shop.name}
                            />
                            {!isActivityBeforeActivityDay && (
                              <div className="flex flex-row gap-3">
                                {session.data?.user.role !== "TECH" && (
                                  <ChangeTechnic
                                    assignmentId={assignment.id}
                                    userId={assignment.userId}
                                  />
                                )}
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
                              </div>
                            )}
                          </div>
                          <Observation
                            assignmentId={assignment.id}
                            observation={assignment.observation}
                          />
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
    </div>
  );
}
export default React.memo(AssignmentDrawer);
