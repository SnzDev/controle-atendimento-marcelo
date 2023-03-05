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
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { api } from "../../utils/api";

export interface FilterAssignment {
  shopId: string | null;
  dateActivity: string;
  usersSelect: string[];
}

export type HandleChangeFilterAssignment =
  | {
      key: "shopId" | "dateActivity";
      value: string;
    }
  | {
      key: "usersSelect";
      value: string[];
    };
export default function Assignments() {
  const session = useSession();
  const queryClient = api.useContext();
  const [isVisibleModalCreate, setIsVisibleModalCreate] = useState(false);
  const [isOpenModalSummary, setIsOpenModalSummary] = useState(false);
  const [filterAssignment, setFilterAssignment] = useState<FilterAssignment>({
    shopId: null,
    dateActivity: moment().format("YYYY-MM-DD"),
    usersSelect: [],
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

  React.useEffect(() => {
    const shopIdLocalStorage =
      localStorage.getItem("@filterAssignment.shopId") ?? "";
    handleChangeFilter({ key: "shopId", value: shopIdLocalStorage });

    const usersSelectLocalStorage =
      localStorage.getItem("@filterAssignment.usersSelect")?.split(",") ?? [];
    handleChangeFilter({ key: "usersSelect", value: usersSelectLocalStorage });
  }, []);

  const role = session?.data?.user.role;
  const sessionUserId = session?.data?.user.id;
  const sessionUserName = session?.data?.user.name;
  const listUsers = api.user.getAll.useQuery({});
  const { height, width } = useWindowDimensions();
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
            {role !== "TECH" && (
              <AssignmentColumn
                dateActivity={filterAssignment.dateActivity}
                userId={sessionUserId ?? ""}
                userName={sessionUserName ?? ""}
              />
            )}
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
    </>
  );
}
