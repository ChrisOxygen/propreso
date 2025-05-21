"use client";

import React from "react";
import { useProposalsList } from "../context/ProposalsListContext";
import ProposalsTable from "./ProposalsTable";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { ProposalStatus } from "@prisma/client";

function AllProposals() {
  const { proposals, pagination, filters, isLoading, actions } =
    useProposalsList();

  // Create pagination items
  const renderPaginationItems = () => {
    const items = [];
    const { page, pageCount } = pagination;

    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink
          onClick={() => actions.handlePageChange(1)}
          isActive={page === 1}
          className={
            page === 1
              ? "bg-[#BF4008] text-white hover:bg-[#BF4008]/90"
              : "font-[Lato]"
          }
        >
          1
        </PaginationLink>
      </PaginationItem>,
    );

    // If we're not at the beginning, add ellipsis
    if (page > 3) {
      items.push(
        <PaginationItem key="ellipsis1">
          <span className="flex h-9 w-9 items-center justify-center font-[Lato] text-[#404040]">
            ...
          </span>
        </PaginationItem>,
      );
    }

    // Add pages around current page
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(pageCount - 1, page + 1);
      i++
    ) {
      if (i > 1 && i < pageCount) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => actions.handlePageChange(i)}
              isActive={page === i}
              className={
                page === i
                  ? "bg-[#BF4008] text-white hover:bg-[#BF4008]/90"
                  : "font-[Lato]"
              }
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    }

    // If we're not at the end, add ellipsis
    if (page < pageCount - 2 && pageCount > 3) {
      items.push(
        <PaginationItem key="ellipsis2">
          <span className="flex h-9 w-9 items-center justify-center font-[Lato] text-[#404040]">
            ...
          </span>
        </PaginationItem>,
      );
    }

    // Always show last page if we have more than one page
    if (pageCount > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            onClick={() => actions.handlePageChange(pageCount)}
            isActive={page === pageCount}
            className={
              page === pageCount
                ? "bg-[#BF4008] text-white hover:bg-[#BF4008]/90"
                : "font-[Lato]"
            }
          >
            {pageCount}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  };

  // Handle status filter toggling with visual feedback via badges
  const getStatusBadgeClass = (status: ProposalStatus) => {
    const isActive = filters.statuses.includes(status);
    return isActive
      ? "bg-[#BF4008] text-white"
      : "bg-zinc-200 text-[#404040] hover:bg-zinc-300 font-[Lato]";
  };

  return (
    <div className="container mx-auto w-full py-8">
      {/* Filters and search */}
      <Card className="mb-6 flex justify-between gap-5 rounded-none border-x-0 border-t-0 border-zinc-200 px-6 shadow-none lg:flex-row">
        <h3 className="font-[Poppins] text-xl font-semibold tracking-[-0.4px] text-[#2C2C2C]">
          All Proposals
        </h3>
        <CardContent className="px-0">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-zinc-500" />
              <Input
                placeholder="Search proposals..."
                className="bg-white pl-8 font-[Lato]"
                value={filters.search}
                onChange={(e) => actions.handleSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              {/* Status filter badges */}
              <div className="flex w-full flex-wrap gap-2">
                <Badge
                  className={`grow cursor-pointer font-[Lato] font-normal transition-colors duration-200 ${
                    filters.statuses.length === 0
                      ? "bg-[#BF4008] text-white"
                      : "bg-zinc-200 text-[#404040] hover:bg-zinc-300"
                  }`}
                  onClick={() => actions.handleMultipleStatusFilter([])}
                >
                  All
                </Badge>
                <Badge
                  className={`grow cursor-pointer font-[Lato] font-normal transition-colors duration-200 ${getStatusBadgeClass(
                    "DRAFT",
                  )}`}
                  onClick={() => actions.toggleStatusFilter("DRAFT")}
                >
                  Draft
                </Badge>
                <Badge
                  className={`grow cursor-pointer font-[Lato] font-normal transition-colors duration-200 ${getStatusBadgeClass(
                    "SENT",
                  )}`}
                  onClick={() => actions.toggleStatusFilter("SENT")}
                >
                  Sent
                </Badge>
                <Badge
                  className={`grow cursor-pointer font-[Lato] font-normal transition-colors duration-200 ${getStatusBadgeClass(
                    "WON",
                  )}`}
                  onClick={() => actions.toggleStatusFilter("WON")}
                >
                  Won
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results info and sorting */}
      <div className="mb-4 flex flex-col items-start justify-between gap-2 px-6 sm:flex-row sm:items-center">
        <p className="font-[Lato] text-sm tracking-[0.08px] text-[#404040]">
          Showing{" "}
          {pagination.total > 0
            ? `${(pagination.page - 1) * pagination.pageSize + 1}-${Math.min(
                pagination.page * pagination.pageSize,
                pagination.total,
              )}`
            : "0"}{" "}
          of {pagination.total} proposals
        </p>

        <div className="flex items-center gap-2">
          <p className="font-[Lato] text-sm tracking-[0.08px] text-[#404040]">
            Sort by:
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 bg-white font-[Lato] text-[#2C2C2C]"
              >
                Date {filters.sortDirection === "desc" ? "Newest" : "Oldest"}
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="font-[Lato]">
              <DropdownMenuItem
                onClick={() => {
                  actions.handleSort("updatedAt");
                  actions.setSortOrder("desc");
                }}
                className="font-[Lato] text-[#404040]"
              >
                Newest First
                {filters.sortField === "updatedAt" &&
                  filters.sortDirection === "desc" && (
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  actions.handleSort("updatedAt");
                  actions.setSortOrder("asc");
                }}
                className="font-[Lato] text-[#404040]"
              >
                Oldest First
                {filters.sortField === "updatedAt" &&
                  filters.sortDirection === "asc" && (
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Proposals table with loading state handling */}
      <ProposalsTable
        proposals={proposals}
        isLoading={isLoading}
        emptyMessage={
          filters.search || filters.statuses.length > 0
            ? "No proposals match your search criteria. Try adjusting your filters."
            : "You haven't created any proposals yet."
        }
      />

      {/* Pagination */}
      {pagination && pagination.total > 0 && (
        <Pagination className="mt-6 justify-start">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  actions.handlePageChange(Math.max(pagination.page - 1, 1))
                }
                className={`font-[Lato] ${
                  pagination.page === 1 ? "pointer-events-none opacity-50" : ""
                }`}
              />
            </PaginationItem>

            {renderPaginationItems()}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  actions.handlePageChange(
                    Math.min(pagination.page + 1, pagination.pageCount),
                  )
                }
                className={`font-[Lato] ${
                  pagination.page === pagination.pageCount
                    ? "pointer-events-none opacity-50"
                    : ""
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Clear filters button (only shown when filters are active) */}
      {(filters.search || filters.statuses.length > 0) && (
        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={actions.clearFilters}
            className="font-[Lato] text-[#404040] transition-colors duration-200 hover:text-[#BF4008]"
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}

export default AllProposals;
