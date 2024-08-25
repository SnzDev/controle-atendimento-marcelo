import { Ban } from "lucide-react";
import { useSession } from "next-auth/react";
import { type ReactNode } from "react";

type MessageIsRevokedProps = {
  children: ReactNode;
  isRevoked: boolean;
}

export function MessageIsRevoked({ children, isRevoked }: MessageIsRevokedProps) {

  const session = useSession();

  const isAdmin = session.data?.user?.role === 'ADMIN';

  if (!isRevoked) return children;


  return <>
    <p className="text-gray-500 flex flex-row items-center gap-2">
      <Ban size={15} /> Mensagem apagada
    </p>
    {isAdmin && children}
  </>
}