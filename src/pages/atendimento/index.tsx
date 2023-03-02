import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  Event as EventIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Add as AddIcon,
  AccessTime as AccessTimeIcon,
  AccessAlarm as AccessAlarmIcon,
} from "@mui/icons-material";
import {
  IconButton,
  Fab,
  Table,
  TableCell,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import moment from "moment";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import ResponsiveAppBar from "../../components/AppBar";
import AssignmentModal from "../../components/AssignmentModal";
import ChangeService from "../../components/Menus/ChangeService";
import ChangeStatus from "../../components/Menus/ChangeStatus";
import ChangeTechnic from "../../components/Menus/ChangeTechnic";
import Observation from "../../components/Observation";
import StatusHistoryModal from "../../components/StatusHistoryModal";
import SummaryModal from "../../components/SummaryModal";
import useDebounce from "../../hooks/useDebounce";
import { api } from "../../utils/api";

interface FilterAssignment {
  shopId: string | null;
  dateActivity: string;
}

interface HandleChangeFilterAssignment {
  key: "shopId" | "dateActivity";
  value: string;
}
export default function Assignments() {
  const session = useSession();
  const queryClient = api.useContext();
  const [isVisibleModalCreate, setIsVisibleModalCreate] = useState(false);
  const [isOpenModalSummary, setIsOpenModalSummary] = useState(false);
  const [parent] = useAutoAnimate(/* optional config */);
  const [filterAssignment, setFilterAssignment] = useState<FilterAssignment>({
    shopId: null,
    dateActivity: moment().format("YYYY-MM-DD"),
  });
  const { shopId, dateActivity } = useDebounce(filterAssignment, 300);

  const handleChangeFilter = ({ key, value }: HandleChangeFilterAssignment) =>
    setFilterAssignment((old) => {
      return { ...old, [key]: value };
    });

  const listAssignments = api.assignment.getAssignments.useQuery({
    shopId,
    dateActivity,
  });

  const positionUp = api.assignment.positionUp.useMutation({
    onSuccess: async () => {
      await queryClient.assignment.getAssignments.invalidate();
      await queryClient.assignment.getSummary.invalidate();
    },
  });
  const positionDown = api.assignment.positionDown.useMutation({
    onSuccess: async () => {
      await queryClient.assignment.getAssignments.invalidate();
      await queryClient.assignment.getSummary.invalidate();
    },
  });

  const changeTechnic = api.assignment.changeTechnic.useMutation({
    onSuccess: async () => {
      await queryClient.assignment.getAssignments.invalidate();
      await queryClient.assignment.getSummary.invalidate();
    },
  });
  const role = session?.data?.user.role;
  const sessionUserId = session?.data?.user.id;
  return (
    <>
      <Head>
        <title>Atendimentos</title>
        <meta name="description" content="Lista de Atendimentos" />
        <link rel="icon" href="/favicon.ico" />
        <style></style>
      </Head>
      <main className="flex min-h-screen flex-1 flex-col items-center overflow-y-hidden bg-black ">
        {role !== "TECH" && (
          <Fab
            onClick={() => setIsVisibleModalCreate(true)}
            sx={{ position: "absolute", right: 10, bottom: 10 }}
            className="bg-blue-500"
            color="primary"
            aria-label="add"
          >
            <AddIcon />
          </Fab>
        )}
        <ResponsiveAppBar
          openModalSummary={() => setIsOpenModalSummary(true)}
          shopId={filterAssignment.shopId}
          dateActivity={filterAssignment.dateActivity}
          onChange={handleChangeFilter}
          screenAssignment
        />

        <div
          className={`mt-16 flex w-full flex-1 flex-row gap-4 overflow-x-scroll px-4 ${
            role !== "TECH" ? "pl-[25rem]" : ""
          }`}
        >
          {listAssignments.data?.map(({ userId, assignments }) => {
            if (userId === sessionUserId && role !== "TECH") return;
            return (
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
                      // const dateNow = moment(now).format("YYYY-MM-DD");
                      const finalizedAt = moment(assignment.finalizedAt);
                      const createdAt = moment(assignment.createdAt);
                      const dateActivity = moment(
                        assignment.dateActivity
                      ).utc();
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
                                    historyAssignment={
                                      assignment.HistoryAssignment
                                    }
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
                                          dateActivity:
                                            filterAssignment.dateActivity,
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
            );
          })}
        </div>

        <AssignmentModal
          isVisible={isVisibleModalCreate}
          onClose={() => setIsVisibleModalCreate(false)}
        />
        <SummaryModal
          shopId={shopId ?? ""}
          dateActivity={dateActivity}
          isVisible={isOpenModalSummary}
          onClose={() => setIsOpenModalSummary(false)}
        />
      </main>
    </>
  );
}
