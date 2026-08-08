"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { ui } from "@/content/en/ui";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@mattofficial/veloce-ui";

const PAGE_SIZES = [10, 25, 50];

type TablePaginationProps = {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

/**
 * The footer under a paginated table: rows-per-page, a range readout and the
 * page controls. Collapses to a compact form on narrow screens.
 */
export function TablePagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: TablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages);
  const firstItem = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const lastItem = Math.min(safePage * pageSize, totalItems);

  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t px-6 py-4 sm:flex-row">
      <div className="flex w-full items-center justify-between gap-4 text-sm text-muted-foreground sm:w-auto sm:justify-start">
        <div className="flex items-center gap-2">
          <p>{ui.common.pagination.rowsPerPage}</p>
          <Select
            value={pageSize.toString()}
            onValueChange={(value: string) => {
              onPageSizeChange(Number(value));
              onPageChange(1);
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="hidden sm:block">
          {ui.common.pagination.showing(firstItem, lastItem, totalItems)}
        </div>
      </div>

      <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
        <div className="text-sm text-muted-foreground sm:hidden">
          {safePage} / {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, safePage - 1))}
            disabled={safePage === 1}
            className="h-8 gap-1 px-2 lg:px-3"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden lg:inline">
              {ui.common.pagination.previous}
            </span>
          </Button>
          <div className="mx-2 hidden text-sm font-medium sm:block">
            {ui.common.pagination.pageOf(safePage, totalPages)}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(totalPages, safePage + 1))}
            disabled={safePage >= totalPages}
            className="h-8 gap-1 px-2 lg:px-3"
          >
            <span className="hidden lg:inline">{ui.common.pagination.next}</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
