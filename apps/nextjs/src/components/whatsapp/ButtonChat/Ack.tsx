import { ChevronDown, Clock } from "lucide-react";

interface AckIconProps {
  ack: number;
}
export const AckIcon = ({ ack }: AckIconProps) => {

  if (ack === 1) {
    return <span className="text-xs text-gray-500"><ChevronDown /></span>
  }
  if (ack === 2) {
    return <div className="flex">
      <span className="text-xs"><ChevronDown /></span>
      <span className="ml-[-24px] mt-[5px]"><ChevronDown /></span>
    </div>
  }
  if (ack === 3 || ack === 4) {
    return <div className="flex">
      <span className="text-xs text-blue-500"><ChevronDown /></span>
      <span className="ml-[-24px] mt-[5px] text-xs text-blue-500"><ChevronDown /></span>
    </div>
  }

  return <span className="text-xs"><Clock /></span>
}