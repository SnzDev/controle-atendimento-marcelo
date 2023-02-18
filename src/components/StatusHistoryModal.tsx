import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InfoIcon from "@mui/icons-material/Info";
import { Modal } from "@mui/material";
import type { HistoryAssignment, User } from "@prisma/client";
import moment from "moment";
import { useState } from "react";

interface StatusHistoryModal {
  historyAssignment: (HistoryAssignment & {
    userAction: User;
  })[];
}

export const StatusHistoryModal = ({
  historyAssignment,
}: StatusHistoryModal) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const _toggle = () => setIsOpen((old) => !old);
  return (
    <>
      <button
        onClick={handleOpen}
        className="inline-block rounded-full bg-gray-200 text-xs font-medium uppercase leading-tight text-gray-700 shadow-md transition duration-150 ease-in-out hover:bg-gray-300 hover:shadow-lg focus:bg-gray-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-400 active:shadow-lg"
      >
        <InfoIcon />
      </button>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <div className="flex max-h-[400px] max-w-[600px] flex-col gap-6 overflow-y-scroll rounded bg-slate-700 p-5 text-slate-200">
          {historyAssignment?.map((item) => (
            <div key={item.id}>
              <div className=" flex flex-row items-center gap-2 text-sm">
                <p className="flex flex-row items-center gap-1 text-slate-200">
                  <AccessTimeIcon />

                  {moment(item.updatedAt).format("DD/MM HH:mm")}
                </p>
                <p className="text-lg text-slate-200">
                  {item.userAction.name}:
                </p>
              </div>
              <div className="mt-2 rounded bg-slate-600 p-4">
                {item.description}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};
