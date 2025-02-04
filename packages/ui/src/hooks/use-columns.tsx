"use client";

import { CellContext, ColumnDef } from "@tanstack/react-table";
import React, { DependencyList, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { IconDotsVertical } from "@tabler/icons-react";

interface Props<TData, TValue> {
  hideSelection?: boolean;
  actions?: (props: CellContext<TData, TValue>) => React.JSX.Element;
  columns: ColumnDef<TData, TValue>[];
}

function useColumns<TData, TValue = unknown>(
  { hideSelection, actions, columns }: Props<TData, TValue>,
  deps: DependencyList,
): ColumnDef<TData, TValue>[] {
  return useMemo(() => {
    const result: ColumnDef<TData, TValue>[] = [];

    if (!hideSelection) {
      result.push(SelectColumn());
    }

    result.push(...columns);

    if (actions) {
      result.push(ActionsColumn(actions));
    }

    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export default useColumns;

function SelectColumn<TData, TValue>() {
  return {
    id: "select",
    size: 34,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Выбрать все"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Выбрать строку"
      />
    ),
  } as ColumnDef<TData, TValue>;
}

function ActionsColumn<TData, TValue>(
  items: (props: CellContext<TData, TValue>) => React.JSX.Element,
) {
  return {
    id: "actions",
    size: 48,
    cell: (props) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Открыть меню</span>
              <IconDotsVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">{items(props)}</DropdownMenuContent>
        </DropdownMenu>
      );
    },
  } as ColumnDef<TData, TValue>;
}
