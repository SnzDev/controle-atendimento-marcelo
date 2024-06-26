import { Add as AddIcon } from "@mui/icons-material";
import { Fab } from "@mui/material";

import moment from "moment";
import { useSession } from "next-auth/react";
import Head from "next/head";
import React, { useState } from "react";
import ResponsiveAppBar from "../../components/AppBar";
import AssignmentColumn from "../../components/Assignment/AssignmentColumn";
import AssignmentModal from "../../components/AssignmentModal";
import SummaryModal from "../../components/SummaryModal";
import useDebounce from "../../hooks/useDebounce";
import { useWindowDimensions } from "../../hooks";
import { api } from "../../utils/api";
import { MessageAudio } from "~/components/socket-test/MessageAudio";

export interface FilterAssignment {
  shopId: string | null;
  clientName: string | null;
  dateActivity: string;
  usersSelect: string[];
  servicesSelect: string[];
}

export type HandleChangeFilterAssignment =
  | {
    key: "shopId" | "dateActivity" | "clientName";
    value: string;
  }
  | {
    key: "usersSelect";
    value: string[];
  }
  | {
    key: "servicesSelect";
    value: string[];
  };
export default function Assignments() {
  const session = useSession();
  const [isVisibleModalCreate, setIsVisibleModalCreate] = useState(false);
  const [isOpenModalSummary, setIsOpenModalSummary] = useState(false);
  const [filterAssignment, setFilterAssignment] = useState<FilterAssignment>({
    shopId: null,
    clientName: null,
    dateActivity: moment().format("YYYY-MM-DD"),
    usersSelect: [],
    servicesSelect: [],
  });
  const { shopId, dateActivity } = useDebounce(filterAssignment, 300);

  const handleChangeFilter = ({ key, value }: HandleChangeFilterAssignment) =>
    setFilterAssignment((old) => {
      const oldLocalStorage = localStorage.getItem(`@filterAssignment.${key}`);
      value !== oldLocalStorage &&
        localStorage.setItem(
          `@filterAssignment.${key}`,
          typeof value === "string" ? value : value.join(",")
        );
      return { ...old, [key]: value };
    });

  const role = session?.data?.user.role;
  const sessionUserId = session?.data?.user.id;
  const sessionUserName = session?.data?.user.name;

  const listUsers = api.user.getAll.useQuery({});
  React.useEffect(() => {
    handleChangeFilter({
      key: "usersSelect",
      value: listUsers.data?.map((user) => user.id) ?? [],
    });
    const shopIdLocalStorage = localStorage.getItem("@filterAssignment.shopId");
    if (shopIdLocalStorage)
      handleChangeFilter({ key: "shopId", value: shopIdLocalStorage });

    const usersSelectLocalStorage = localStorage
      .getItem("@filterAssignment.usersSelect")
      ?.split(",");
    if (usersSelectLocalStorage)
      handleChangeFilter({
        key: "usersSelect",
        value: usersSelectLocalStorage,
      });
  }, [listUsers.data]);

  const { height } = useWindowDimensions();

  return (
    <>
      <Head>
        <title>Atendimentos</title>
        <meta name="description" content="Lista de Atendimentos" />
        <link rel="icon" href="/favicon.ico" />
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
          filterAssignment={filterAssignment}
          onChange={handleChangeFilter}
          screenAssignment
        />

        <div
          style={{ maxHeight: height - 96 }}
          className={`mt-20 flex w-full flex-1 flex-row gap-2 px-4 `}
        >
          <div className="flex flex-row gap-2">
            <AssignmentColumn
              dateActivity={filterAssignment.dateActivity}
              userId={sessionUserId ?? ""}
              userName={sessionUserName ?? ""}
            />
          </div>
          <div className="flex  flex-row gap-2 overflow-x-auto">
            {listUsers.data
              ?.filter((user) => filterAssignment.usersSelect.includes(user.id))
              ?.map(({ id, name }) => {
                if (id === sessionUserId && role !== "TECH") return;
                return (
                  <AssignmentColumn
                    key={id}
                    dateActivity={filterAssignment.dateActivity}
                    shopId={filterAssignment.shopId ?? undefined}
                    userId={id}
                    userName={name}
                    clientName={filterAssignment.clientName}
                    services={filterAssignment.servicesSelect}
                  />
                );
              })}
          </div>
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
      <MessageAudio />
    </>
  );
}
