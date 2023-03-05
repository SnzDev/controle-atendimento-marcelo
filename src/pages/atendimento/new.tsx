import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  Event as EventIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Add as AddIcon,
  AccessTime as AccessTimeIcon,
  AccessAlarm as AccessAlarmIcon,
} from "@mui/icons-material";
import {
  IconButton,
  Fab,
  Table,
  TableCell,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import moment from "moment";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import ResponsiveAppBar from "../../components/AppBar";
import AssignmentColumn from "../../components/Assignment/AssignmentColumn";
import AssignmentDrawer from "../../components/AssignmentDrawer";
import AssignmentModal from "../../components/AssignmentModal";
import ChangeService from "../../components/Menus/ChangeService";
import ChangeStatus from "../../components/Menus/ChangeStatus";
import ChangeTechnic from "../../components/Menus/ChangeTechnic";
import Observation from "../../components/Observation";
import StatusHistoryModal from "../../components/StatusHistoryModal";
import SummaryModal from "../../components/SummaryModal";
import useDebounce from "../../hooks/useDebounce";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { api } from "../../utils/api";

interface FilterAssignment {
  shopId: string | null;
  dateActivity: string;
}

interface HandleChangeFilterAssignment {
  key: "shopId" | "dateActivity";
  value: string;
}
export default function Assignments() {
  const session = useSession();
  const queryClient = api.useContext();
  const [isVisibleModalCreate, setIsVisibleModalCreate] = useState(false);
  const [isOpenModalSummary, setIsOpenModalSummary] = useState(false);
  const [parent] = useAutoAnimate(/* optional config */);
  const [filterAssignment, setFilterAssignment] = useState<FilterAssignment>({
    shopId: null,
    dateActivity: moment().format("YYYY-MM-DD"),
  });
  const { shopId, dateActivity } = useDebounce(filterAssignment, 300);

  const handleChangeFilter = ({ key, value }: HandleChangeFilterAssignment) =>
    setFilterAssignment((old) => {
      const oldLocalStorage = localStorage.getItem(`@filterAssignment.${key}`);
      value !== oldLocalStorage &&
        localStorage.setItem(`@filterAssignment.${key}`, value);
      return { ...old, [key]: value };
    });

  React.useEffect(() => {
    const shopIdLocalStorage =
      localStorage.getItem("@filterAssignment.shopId") ?? "";
    handleChangeFilter({ key: "shopId", value: shopIdLocalStorage });
  }, []);

  const role = session?.data?.user.role;
  const sessionUserId = session?.data?.user.id;
  const sessionUseName = session?.data?.user.name;
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
          shopId={filterAssignment.shopId}
          dateActivity={filterAssignment.dateActivity}
          onChange={handleChangeFilter}
          screenAssignment
        />

        <div
          style={{ maxHeight: height - 80 }}
          className={`mt-16 flex w-full flex-1 flex-row gap-2 px-4 `}
        >
          <div className="flex flex-row gap-2">
            {role !== "TECH" && (
              <AssignmentColumn
                dateActivity={filterAssignment.dateActivity}
                userId={sessionUserId ?? ""}
                userName={sessionUseName ?? ""}
              />
            )}
          </div>
          <div className="flex  flex-row gap-2 overflow-x-scroll">
            {listUsers.data?.map(({ id, name }) => {
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
            {listUsers.data?.map(({ id, name }) => {
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
            {listUsers.data?.map(({ id, name }) => {
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
            {listUsers.data?.map(({ id, name }) => {
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
