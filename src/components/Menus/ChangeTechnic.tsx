import { Fade, MenuItem } from "@mui/material";
import Image from "next/image";
import React from "react";
import { api } from "../../utils/api";
import { StyledMenu } from "../StyledMenu";

interface ChangeTechnicProps {
  userId: string;
  assignmentId: string;
}
const ChangeTechnic = (props: ChangeTechnicProps) => {
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);

  const queryClient = api.useContext();
  const listUser = api.user.getAll.useQuery({});
  const changeTechnic = api.assignment.changeTechnic.useMutation({
    onSuccess: async () => {
      await queryClient.assignment.getAssignments.invalidate();
      await queryClient.assignment.getAssignment.invalidate();
      await queryClient.assignment.getSummary.invalidate();
    },
  });
  return (
    <>
      <button onClick={(event) => setAnchor(event.currentTarget)}>
        <Image
          alt="technical_icon"
          src="/icons/Technical.svg"
          width={16}
          height={16}
        />
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
        {listUser.data?.map((item) => {
          const userName = item.name;
          if (item.id !== props.userId)
            return (
              <MenuItem
                key={item.id}
                onClick={() => {
                  changeTechnic.mutate({
                    id: props.assignmentId,
                    userId: item.id,
                  });
                  setAnchor(null);
                }}
                sx={{ textTransform: "capitalize" }}
              >
                {userName?.toLowerCase()}
              </MenuItem>
            );
        })}
      </StyledMenu>
    </>
  );
};

export default React.memo(ChangeTechnic);
