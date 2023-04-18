import type { AssignmentStatus, UserRole } from "@prisma/client";

interface ChangeStatusPortugueseProps {
  status: AssignmentStatus;
  isUppercase?: boolean;
}

export function changeStatusPortuguese(props: ChangeStatusPortugueseProps) {
  const status = {
    PENDING: "PENDENTE",
    IN_PROGRESS: "EM ANDAMENTO",
    FINALIZED: "FINALIZADO",
    CANCELED: "CANCELADO",
    INACTIVE: "INATIVO",
  };

  return props.isUppercase
    ? status[props.status]
    : status[props.status].toLowerCase();
}

export function changeStatusColor(status: AssignmentStatus) {
  const colors = {
    PENDING: "bg-yellow-600 hover:bg-yellow-700",
    IN_PROGRESS: "bg-blue-600 hover:bg-blue-700",
    FINALIZED: "bg-green-600 hover:bg-green-700",
    CANCELED: "bg-red-600 hover:bg-red-700",
    INACTIVE: "bg-red-600 hover:bg-red-700",
  };
  return colors[status];
}

type ColorsRoles = "error" | "success" | "info";

export function colorRoles(role: UserRole): ColorsRoles {
  const colors = {
    ADMIN: "error" as const,
    USER: "success" as const,
    TECH: "info" as const,
  };

  return colors[role];
}
