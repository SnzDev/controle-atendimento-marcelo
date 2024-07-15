import type {
  Assignment,
  Client,
  HistoryAssignment,
  Observation,
  Region,
  Service,
  Shop,
  User,
} from "@prisma/client";

import {
  AccessAlarm,
  AccessTime,
  ArrowDownward,
  ArrowUpward,
  Event,
} from "@mui/icons-material";
import { api } from "../../utils/api";
import ChangeService from "../Menus/ChangeService";
import ChangeStatus from "../Menus/ChangeStatus";
import ChangeTechnic from "../Menus/ChangeTechnic";
import ObservationModal from "../Observation";
import StatusHistoryModal from "../StatusHistoryModal";
import moment from "moment";
import { IconButton, TableCell, TableRow } from "@mui/material";
import { useSession } from "next-auth/react";
import React from "react";
import ChangeRegion from "../Menus/ChangeRegion";
import { ChatWhatsapp } from "../whatsapp/ButtonChat";
import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from "@morpheus/api";

type Assignments = inferRouterOutputs<AppRouter>['assignment']['getAssignment']
interface AssignmentRows {
  dateActivity: string;
  assignments: Assignments;
}
const AssignmentRows = (props: AssignmentRows) => {
  const session = useSession();
  const role = session?.data?.user?.role;
  const queryClient = api.useContext();
  const positionUp = api.assignment.positionUp.useMutation({
    onSuccess: async () => {
      await queryClient.assignment.getAssignment.invalidate();
      await queryClient.assignment.getSummary.invalidate();
    },
  });
  const positionDown = api.assignment.positionDown.useMutation({
    onSuccess: async () => {
      await queryClient.assignment.getAssignment.invalidate();
      await queryClient.assignment.getSummary.invalidate();
    },
  });

  const changeTechnic = api.assignment.changeTechnic.useMutation({
    onSuccess: async () => {
      await queryClient.assignment.getAssignment.invalidate();
      await queryClient.assignment.getSummary.invalidate();
    },
  });

  return (
    <>
      {props.assignments?.map((assignment) => {
        const now = moment();
        // const dateNow = moment(now).format("YYYY-MM-DD");
        const finalizedAt = moment(assignment.finalizedAt);
        const createdAt = moment(assignment.createdAt);
        const diffHour = now.diff(createdAt, "hours");
        const diffMinutes = now.diff(createdAt, "minutes");
        const diffFinalizedHour = finalizedAt.diff(createdAt, "hours");
        const diffFinalizedMinutes = finalizedAt.diff(createdAt, "minutes");
        const dateActivity = moment(assignment.dateActivity).utc();
        const isActivityBeforeActivityDay = moment(
          dateActivity.format("YYYY-MM-DD")
        ).isBefore(props.dateActivity, "day");
        const isToday =
          dateActivity.format("YYYY-MM-DD") ===
          moment(props.dateActivity).format("YYYY-MM-DD");

        return (
          <TableRow key={assignment.id}>
            <TableCell
              sx={{
                border: isActivityBeforeActivityDay ? undefined : "none",
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
                      isToday={isToday}
                      actualStatus={assignment.status}
                      assignmentId={assignment.id}
                    />
                  </div>
                </div>
                <div className="mt-1 flex flex-row items-center justify-between font-bold text-slate-500">
                  <div className="flex flex-row items-center gap-0 ">
                    <AccessTime />
                    {createdAt.format("DD/MM HH:mm")}
                  </div>
                  <div className="flex flex-row items-center gap-0 ">
                    <Event />
                    {dateActivity.format("DD/MM")}
                  </div>
                  <div className="flex flex-row items-center gap-1 ">
                    <AccessAlarm />
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
                            dateActivity: props.dateActivity,
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
                    <div className="flex flex-row">
                      {role !== "TECH" && (
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
                        <ArrowUpward />
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
                        <ArrowDownward />
                      </IconButton>

                      {assignment.Chat?.contactId && (
                        <ChatWhatsapp
                          chatId={assignment.Chat.id}
                        // contactId={assignment.Chat.contactId}
                        />
                      )}
                    </div>
                  )}
                </div>
                <div className="flex flex-row items-center justify-between font-bold capitalize text-teal-500">
                  <ChangeRegion
                    assignmentId={assignment.id}
                    regionId={assignment?.regionId}
                    shopName={assignment.shop.name}
                  />
                </div>
                <ObservationModal
                  assignmentId={assignment.id}
                  observation={assignment.observation}
                />
              </div>
            </TableCell>
          </TableRow>
        );
      })}
    </>
  );
};

export default React.memo(AssignmentRows);
