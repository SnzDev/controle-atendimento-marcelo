import { Fade, MenuItem } from "@mui/material";
import { useSession } from "next-auth/react";
import React from "react";
import { api } from "../../utils/api";
import { StyledMenu } from "../StyledMenu";

interface ChangeServiceProps {
  serviceId: string;
  assignmentId: string;
  shopName: string;
}
const ChangeService = (props: ChangeServiceProps) => {
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);

  const queryClient = api.useContext();
  const listService = api.service.getAll.useQuery({});
  const serviceName = listService.data?.find(
    (service) => service.id === props.serviceId
  )?.name;

  const changeService = api.assignment.changeService.useMutation({
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
        {serviceName}
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
        {listService.data?.map(({ id: serviceId, name }) => {
          if (serviceId !== props.serviceId)
            return (
              <MenuItem
                key={serviceId}
                onClick={() => {
                  changeService.mutate({
                    id: props.assignmentId,
                    serviceId,
                  });
                  setAnchor(null);
                }}
                sx={{ textTransform: "capitalize" }}
              >
                {name?.toLowerCase()}
              </MenuItem>
            );
        })}
      </StyledMenu>
    </>
  );
};

export default React.memo(ChangeService);
