import { ChevronDown, Clock } from "lucide-react";
import Image from "next/image";

interface AckIconProps {
  ack: number;
}
export const AckIcon = ({ ack }: AckIconProps) => {

  if (ack === 1) {
    return <span className="text-xs text-gray-500">
      <Image alt="enviado" src="/icons/whatsapp/ack-1.svg" width={16} height={16} />
    </span >
  }
  if (ack === 2) {
    return <div className="flex">
      <Image alt="enviado e recebido" src="/icons/whatsapp/ack-2.svg" width={16} height={16} />
    </div>
  }
  if (ack === 3) {
    return <div className="flex">
      <Image alt="lido" src="/icons/whatsapp/ack-3.svg" width={16} height={16} />
    </div>
  }

  if (ack === 4) {
    return <div className="flex">
      <Image alt="ouvido" src="/icons/whatsapp/ack-4.svg" width={16} height={16} />
    </div>
  }
  return <span className="text-xs"><Clock /></span>
}