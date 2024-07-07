
import { useSession } from "next-auth/react";
import { MessageAudio } from "~/components/socket-test/MessageAudio";
import AssignmentColumn from "../../components/Assignment/AssignmentColumn";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export default function Assignments() {
  const session = useSession();
  const sessionUserId = session?.data?.user.id;
  const sessionUserName = session?.data?.user.name;
  const date = new Date().toISOString();

  return (

    <main className="flex min-h-screen min-w-screen flex-1 flex-col items-center overflow-y-hidden bg-black ">
      {/* <div
        className={`mt-20 flex w-full h-full flex-1 flex-row gap-2 px-4 `}
      >
        <div className="flex flex-row gap-2">
          <AssignmentColumn
            dateActivity={date}
            userId={sessionUserId ?? ""}
            userName={sessionUserName ?? ""}
          />
        </div>
        <div className="flex flex-row gap-2 overflow-x-auto">

          <AssignmentColumn
            dateActivity={date}
            userId="clq63rc3s0000i0aq3ntbwewu"
            userName="Whatsapp"
          />
        </div>
      </div>


      <MessageAudio /> */}

      <div>
        <div>
          <Tabs defaultValue="account" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="account"></TabsContent>
            <TabsContent value="password"></TabsContent>
          </Tabs>
        </div>
        <div>

        </div>
      </div>

    </main>
  );
}
