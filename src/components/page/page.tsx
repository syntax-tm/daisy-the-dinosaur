import { Paper, PaperProps } from "@mui/material";
import { ReactNode } from "react";

export function Page({ props, children }: { props: PaperProps, children: ReactNode }) {
  return (
    <Paper elevation={2} {...props}>
      {children}
    </Paper>
  )
}