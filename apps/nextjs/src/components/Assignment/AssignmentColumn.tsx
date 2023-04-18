import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import moment from "moment";
import Image from "next/image";
import React from "react";
import { api } from "../../utils/api";
import AssignmentRows from "./AssignmentRows";

interface AssignmentColumn {
  userId: string;
  shopId?: string;
  userName: string;
  dateActivity: string;
  services?: string[];
  clientName?: string | null;
}
const AssignmentColumn = (props: AssignmentColumn) => {
  const assignments = api.assignment.getAssignment.useQuery({
    userId: props.userId,
    shopId: props.shopId,
    dateActivity: props.dateActivity,
  });

  console.log(props.clientName?.toLowerCase());

  const filteredAssignment = assignments.data?.filter(
    (assignment) =>
      (!props.services ||
        props.services?.length === 0 ||
        props.services?.includes(assignment.serviceId)) &&
      assignment.client.name
        ?.toLowerCase()
        .includes(props.clientName?.toLowerCase() ?? "")
  );

  const runningAssignments = filteredAssignment?.filter((assignment) => {
    const isToday =
      moment(assignment.dateActivity).utc().format("YYYY-MM-DD") ===
      moment(props.dateActivity).format("YYYY-MM-DD");
    return (
      assignment.status !== "FINALIZED" &&
      assignment.status !== "CANCELED" &&
      isToday
    );
  });
  const pendingFromBefore = filteredAssignment?.filter((assignment) => {
    const isToday =
      moment(assignment.dateActivity).utc().format("YYYY-MM-DD") !==
      moment(props.dateActivity).format("YYYY-MM-DD");
    return (
      assignment.status !== "FINALIZED" &&
      assignment.status !== "CANCELED" &&
      isToday
    );
  });
  const finalizedAssignments = filteredAssignment?.filter(
    (assignment) =>
      assignment.status === "FINALIZED" || assignment.status === "CANCELED"
  );

  return (
    <>
      {!!assignments.data && assignments.data.length > 0 && (
        <TableContainer
          sx={{
            position: "relative",
            backgroundColor: "rgb(30 41 59)",
            overflowY: "auto",
          }}
          className="min-w-[400px] max-w-[400px] rounded-lg shadow"
        >
          <Table
            aria-label="simple table"
            sx={{
              overflowY: "scroll",
            }}
          >
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
                    alt="technical_"
                    src="/icons/Technical.svg"
                    width={24}
                    height={24}
                  />
                  {props.userName}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingFromBefore && (
                <div className="mx-2 rounded-sm border-b-2 border-b-slate-100">
                  <span className="mt-2 h-1 w-full text-slate-100">
                    Dias Anteriores
                  </span>
                </div>
              )}
              <AssignmentRows
                dateActivity={props.dateActivity}
                assignments={pendingFromBefore}
              />

              <div className="mx-2 rounded-sm border-b-2 border-b-slate-100">
                <span className="mt-2 h-1 w-full text-slate-100">Hoje</span>
              </div>

              <AssignmentRows
                dateActivity={props.dateActivity}
                assignments={runningAssignments}
              />
              <div className="mx-2 rounded-sm border-b-2 border-b-slate-100">
                <span className="mt-2 h-1 w-full text-slate-100">
                  Encerrados
                </span>
              </div>
              <AssignmentRows
                dateActivity={props.dateActivity}
                assignments={finalizedAssignments}
              />
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default React.memo(AssignmentColumn);
