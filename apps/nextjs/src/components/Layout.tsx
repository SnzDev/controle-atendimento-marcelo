
import { cn } from "~/lib/utils";

export default function TabLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main
      className={cn(
        "flex min-h-screen w-screen h-screen flex-row pr-4 font-sans antialiased",
      )}
    >
      <Sidebar />

      <div className="flex h-[calc(100%-130px)] w-[calc(100%-200px)] flex-col">
        <Header />

        <div className="flex h-full w-full p-12">{children}</div>
      </div>
    </main>
  );
}


import { User } from "iconsax-react";

export function Header() {
  const session = api.auth.getSession.useQuery();

  return (
    <div className="flex h-[100px] items-center justify-between py-2 px-12">
      <p className="text-md font-semibold text-primary">Início</p>

      <div className="flex flex-row items-end gap-1">
        <div className="flex flex-col text-xs">
          Usuário:
          <p className="text-sm font-medium text-primary">
            {session.data?.user?.name}
          </p>
        </div>

        <User variant="Bulk" className="text-primary" />
      </div>
    </div>
  );
}


import { Home2, LogoutCurve } from "iconsax-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SidebarItem } from "~/components/SideBarItem";
import { api } from "~/utils/api";


const SidebarItems = [
  {
    href: "/whatsapp/atendimentos",
    icon: <Home2 variant="Bulk" />,
    label: "Início",
  },

];

export function Sidebar() {
  const pathName = usePathname();
  return (
    <div className="flex min-h-screen bg-slate-100 w-[200px] flex-col items-center justify-between py-12">
      <div className="flex flex-col items-center gap-12">
        <Image
          src={"/img/logo.png"}
          alt="Logomarca"
          width={134}
          height={30}
        />

        <div className="flex flex-col gap-3">
          {SidebarItems.map((item, index) => (
            <SidebarItem
              variant={pathName === item.href ? "active" : "inactive"}
              href={item.href}
              key={index}
            >
              {item.icon}
              {item.label}
            </SidebarItem>
          ))}
        </div>
      </div>
      <SidebarItem
        onClick={async () =>
          await signOut({
            callbackUrl: "/",
            redirect: true,
          })
        }
        asChild
      >
        <LogoutCurve variant="Bulk" />
        Sair
      </SidebarItem>
    </div>
  );
}
