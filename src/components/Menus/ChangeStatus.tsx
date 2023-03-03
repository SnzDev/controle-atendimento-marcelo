import { Fade, MenuItem } from "@mui/material";
import type { AssignmentStatus, UserRole } from "@prisma/client";
import React from "react";
import { api } from "../../utils/api";
import { changeStatusColor, changeStatusPortuguese } from "../../utils/utils";
import { StyledMenu } from "../StyledMenu";
import { useSession } from "next-auth/react";
interface ChangeStatusProps {
  actualStatus: AssignmentStatus;
  assignmentId: string;
}
const ChangeStatus = (props: ChangeStatusProps) => {
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  const status: AssignmentStatus[] = [
    "PENDING",
    "IN_PROGRESS",
    "FINALIZED",
    "CANCELED",
    "INACTIVE",
  ];
  const queryClient = api.useContext();
  const changeStatus = api.assignment.changeStatus.useMutation({
    onSuccess: async () => {
      await queryClient.assignment.getAssignments.invalidate();
      await queryClient.assignment.getSummary.invalidate();
    },
  });
  const session = useSession();
  const userSession = session.data?.user;
  return (
    <>
      <button
        onClick={(event) => setAnchor(event.currentTarget)}
        className={`rounded p-2 text-slate-50 ${changeStatusColor(
          props.actualStatus
        )}`}
      >
        {changeStatusPortuguese({
          status: props.actualStatus,
          isUppercase: true,
        })}
      </button>
      <StyledMenu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchor}
        open={!!anchor}
        onClose={() => setAnchor(null)}
        TransitionComponent={Fade}
      >
        {status?.map((status) => {
          if (
            (props.actualStatus === "CANCELED" ||
              props.actualStatus === "FINALIZED") &&
            userSession?.role !== "ADMIN"
          )
            return;
          if (status !== props.actualStatus)
            return (
              <MenuItem
                key={status}
                onClick={() => {
                  changeStatus.mutate({ status, id: props.assignmentId });
                  setAnchor(null);
                }}
              >
                {changeStatusPortuguese({ status, isUppercase: true })}
              </MenuItem>
            );
        })}
      </StyledMenu>
    </>
  );
};

export default React.memo(ChangeStatus);
