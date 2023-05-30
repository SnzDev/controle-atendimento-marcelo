import { Fade, MenuItem } from "@mui/material";
import { useSession } from "next-auth/react";
import React from "react";
import { api } from "../../utils/api";
import { StyledMenu } from "../StyledMenu";

interface ChangeRegion {
  regionId: null | string;
  assignmentId: string;
  shopName: string;
}
const ChangeRegion = (props: ChangeRegion) => {
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);

  const queryClient = api.useContext();
  const listRegion = api.region.getAll.useQuery({});
  const Region = listRegion.data?.find(
    (service) => service.id === props.regionId
  )?.name;

  const changeService = api.assignment.changeRegion.useMutation({
    onSuccess: async () => {
      await queryClient.assignment.getAssignments.invalidate();
      await queryClient.assignment.getAssignment.invalidate();
      await queryClient.assignment.getSummary.invalidate();
    },
  });
  const session = useSession();
  const userSession = session.data?.user;
  return (
    <>
      <button
        onClick={(event) =>
          userSession?.role !== "TECH" && setAnchor(event.currentTarget)
        }
        className="font-bold capitalize text-blue-500"
      >
        {Region}
        {userSession?.role === "TECH" && ` - ${props.shopName?.toLowerCase()}`}
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
        {listRegion.data?.map(({ id: regionId, name }) => {
          if (regionId !== props.regionId)
            return (
              <MenuItem
                key={regionId}
                onClick={() => {
                  changeService.mutate({
                    id: props.assignmentId,
                    regionId,
                  });
                  setAnchor(null);
                }}
              >
                {name}
              </MenuItem>
            );
        })}
      </StyledMenu>
    </>
  );
};

export default React.memo(ChangeRegion);
