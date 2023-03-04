import type { CircularProgressProps } from "@mui/material";
import { CircularProgress } from "@mui/material";

export const Loading = (props: CircularProgressProps) => {
  return <CircularProgress color="primary" {...props} />;
};
