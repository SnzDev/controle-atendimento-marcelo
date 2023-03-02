import type * as prisma from "@prisma/client";
import moment from "moment";
import { Edit, Add } from "@mui/icons-material";
import React, { useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import { api } from "../utils/api";

interface EditObservation {
  id: string | null;
  observation: string | null;
}

interface HandleChangeObservation {
  key: "id" | "observation";
  value: string | null;
}
interface ObservationProps {
  observation: (prisma.Observation & {
    userAction: prisma.User;
  })[];
  assignmentId: string;
}
const Observation = ({ observation, assignmentId }: ObservationProps) => {
  const [editObservation, setEditObservation] = useState<EditObservation>({
    id: null,
    observation: null,
  });
  const [isNew, setIsNew] = useState(false);
  const handleChangeObservation = (props: HandleChangeObservation) => {
    setEditObservation((old) => {
      return { ...old, [props.key]: props.value };
    });
  };
  const resetObservationFields = () => {
    setEditObservation({ id: null, observation: null });
    setIsNew(false);
  };
  const queryClient = api.useContext();
  const updateObservation = api.observation.update.useMutation({
    onSuccess: async () => {
      await queryClient.assignment.getAssignments.invalidate();
      await queryClient.observation.getAll.invalidate();
    },
  });
  const createObservation = api.observation.create.useMutation({
    onSuccess: async () => {
      await queryClient.assignment.getAssignments.invalidate();
      await queryClient.observation.getAll.invalidate();
    },
  });

  return (
    <div>
      <details className="bg-stale-800 open:bg-stale-200 duration-300">
        <summary className="text-md cursor-pointer bg-inherit  py-3 text-slate-200">
          Observações
        </summary>

        {observation?.map((item) =>
          editObservation.id ? (
            <div key={item.id} className="flex flex-col gap-2 px-5">
              <p className="text-sm font-bold text-slate-200">
                {moment(item.updatedAt).format("DD/MM HH:mm")}:{" "}
                {item.userAction.name}:
              </p>
              <p className="flex flex-row justify-between gap-2 rounded border border-slate-800 bg-slate-600 px-5 py-3 text-sm font-light text-slate-200">
                <textarea
                  rows={5}
                  className="my-2 flex-1 items-center rounded border-[1px] border-stone-100 bg-stone-900 p-2  text-stone-100"
                  value={editObservation.observation ?? ""}
                  onChange={(e) =>
                    handleChangeObservation({
                      key: "observation",
                      value: e.target.value ?? "",
                    })
                  }
                ></textarea>
                <button
                  onClick={() => {
                    updateObservation
                      .mutateAsync({
                        id: editObservation.id ?? "",
                        observation: editObservation.observation ?? "",
                      })
                      .then(() => resetObservationFields())
                      .catch((e) => {
                        console.log(e);
                      });
                  }}
                >
                  <SaveIcon />
                </button>
              </p>
            </div>
          ) : (
            <div key={item.id} className="flex flex-col gap-2 px-5">
              <p className="text-sm font-bold text-slate-200">
                {moment(item.updatedAt).format("DD/MM HH:mm")}:{" "}
                {item.userAction.name}:
              </p>
              <p className="flex flex-row justify-between rounded border border-slate-800 bg-slate-600 px-5 py-3 text-sm font-light text-slate-200">
                {item.observation}
                <button>
                  <Edit
                    onClick={() => {
                      handleChangeObservation({ key: "id", value: item.id });
                      handleChangeObservation({
                        key: "observation",
                        value: item.observation,
                      });
                      setIsNew(false);
                    }}
                  />
                </button>
              </p>
            </div>
          )
        )}

        {isNew ? (
          <div className="mt-2 flex flex-col gap-2 px-5">
            <p className="text-sm font-bold text-slate-200">Nova Observação:</p>
            <p className="flex flex-row justify-between gap-2 rounded border border-slate-800 bg-slate-600 px-5 py-3 text-sm font-light text-slate-200">
              <textarea
                rows={5}
                className="my-2  flex-1 items-center rounded border-[1px] border-stone-100 bg-stone-900 p-2  text-stone-100"
                value={editObservation.observation ?? ""}
                onChange={(e) =>
                  handleChangeObservation({
                    key: "observation",
                    value: e.target.value ?? "",
                  })
                }
              ></textarea>
              <button
                onClick={() => {
                  createObservation
                    .mutateAsync({
                      observation: editObservation.observation ?? "",
                      assignmentId,
                    })
                    .then(() => resetObservationFields())
                    .catch((e) => {
                      console.log(e);
                    });
                }}
              >
                <SaveIcon />
              </button>
            </p>
          </div>
        ) : (
          <>
            {observation.length === 0 && (
              <div className="flex flex-col gap-2 px-5">
                <p className="text-sm font-bold text-slate-200">
                  Não há Observações no momento
                </p>
              </div>
            )}
            <button
              className="mt-2 flex w-full flex-1 items-center justify-center rounded-md bg-slate-800 py-1 font-bold text-slate-300 shadow-lg transition-colors hover:bg-slate-900 active:bg-slate-600"
              onClick={() => {
                resetObservationFields();
                setIsNew(true);
              }}
            >
              <Add width={22} height={22} /> Adcionar nova observação
            </button>
          </>
        )}
      </details>
    </div>
  );
};

export default React.memo(Observation);
