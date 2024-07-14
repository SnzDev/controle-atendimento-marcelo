import { Clock } from "lucide-react";
import Image from "next/image";

interface AckIconProps {
  ack: number;
}
const ackOptions = [
  { ack: 1, alt: "enviado", src: "/icons/whatsapp/ack-1.svg" },
  { ack: 2, alt: "enviado e recebido", src: "/icons/whatsapp/ack-2.svg" },
  { ack: 3, alt: "lido", src: "/icons/whatsapp/ack-3.svg" },
  { ack: 4, alt: "ouvido", src: "/icons/whatsapp/ack-4.svg" },
];
export const AckIcon = ({ ack }: AckIconProps) => {
  const ackOption = ackOptions.find((option) => option.ack === ack);

  if (!ackOption)
    return (
      <span>
        <Clock size="16" className="h-[11px] w-[16px] text-white" />
      </span>
    );

  return (
    <span>
      <Image
        alt={ackOption.alt}
        src={ackOption.src}
        width={16}
        height={16}
        className="h-[11px] w-[16px]"
      />
    </span>
  );
};
