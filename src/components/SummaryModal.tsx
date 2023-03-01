import { Modal } from "@mui/material";
import React from "react";
import { api } from "../utils/api";
interface SummaryModalProps {
  isVisible: boolean;
  onClose: () => void;
  shopId: string;
  dateActivity: string;
}

const SummaryModal = ({
  isVisible,
  onClose,
  dateActivity,
  shopId,
}: SummaryModalProps) => {
  const listAssignments = api.assignment.getSummary.useQuery({
    dateActivity,
    shopId,
  });
  const listUsers = api.user.getAll.useQuery({});
  const listServices = api.service.getAll.useQuery({});
  const getCountByService = (serviceId: string) =>
    listAssignments.data?.filter((item) => item.serviceId === serviceId).length;
  const existsUserOnAssingments = (userId: string) =>
    !!listAssignments.data?.find((item) => item.userId === userId);
  return (
    <Modal
      open={isVisible}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      onClose={onClose}
    >
      <div className="relative flex max-h-[500px] min-h-fit max-w-xl flex-col items-center justify-center gap-5 overflow-y-scroll rounded bg-slate-800 p-5 shadow-md ">
        <div className="flex flex-row flex-wrap justify-center gap-2">
          {listServices.data?.map((service) => (
            <div
              key={service.id}
              className="flex flex-col items-center justify-center rounded-lg bg-blue-500 p-3 shadow-lg"
            >
              <span className="text-font-extrabold text-2xl font-bold text-slate-100">
                {service.name}
              </span>
              <span className="text-font-extrabold text-xl font-bold text-slate-100">
                {getCountByService(service.id)}
              </span>
            </div>
          ))}
        </div>
        <div className="flex w-full flex-col ">
          {listUsers.data?.map((user) => {
            if (!existsUserOnAssingments(user.id)) return;
            return (
              <div
                key={user.id}
                className="flex flex-col items-center  border-b-2 p-2 shadow-lg"
              >
                <span className="text-font-extrabold self-start text-2xl font-bold text-slate-100">
                  {user.name}
                </span>
                <div className="flex flex-row flex-wrap gap-2">
                  {listServices.data?.map((service) => (
                    <div
                      key={service.id}
                      className="flex flex-col items-center justify-center rounded-lg bg-blue-500 p-1 shadow-lg"
                    >
                      <span className="text-font-extrabold text-md font-bold text-slate-100">
                        {service.name}
                      </span>
                      <span className="text-font-extrabold text-xs font-bold text-slate-100">
                        {getCountByService(service.id)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default React.memo(SummaryModal);
