import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return <table className={cn("table", className)} {...props} />;
}

export const THead = ({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={cn(className)} {...props} />
);

export const TBody = ({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={cn(className)} {...props} />
);

export const TR = ({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) => <tr className={cn(className)} {...props} />;

export const TH = ({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) => <th className={cn(className)} {...props} />;

export const TD = ({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) => <td className={cn(className)} {...props} />;
