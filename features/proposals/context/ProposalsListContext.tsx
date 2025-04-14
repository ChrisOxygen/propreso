"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useFilteredProposals } from "../hooks/useFilteredProposals";
import { Proposal, ProposalStatus } from "@prisma/client";

interface ProposalsListContextState {
  proposals: Proposal[];
  pagination: {
    total: number;
    pageCount: number;
    page: number;
    pageSize: number;
  };
  filters: {
    search: string;
    statuses: ProposalStatus[];
    sortField: string;
    sortDirection: "asc" | "desc";
  };
  isLoading: boolean;
  actions: {
    handleSearch: (term: string) => void;
    handleStatusFilter: (status: ProposalStatus) => void;
    handleMultipleStatusFilter: (statuses: ProposalStatus[]) => void;
    toggleStatusFilter: (status: ProposalStatus) => void;
    handleSort: (field: string) => void;
    setSortOrder: (order: "asc" | "desc") => void;
    handlePageChange: (page: number) => void;
    clearFilters: () => void;
  };
}

const ProposalsListContext = createContext<
  ProposalsListContextState | undefined
>(undefined);

export function ProposalsListProvider({ children }: { children: ReactNode }) {
  // Filtering and sorting state
  const [search, setSearch] = useState("");
  const [statuses, setStatuses] = useState<ProposalStatus[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    field: string;
    direction: "desc" | "asc";
  }>({ field: "updatedAt", direction: "desc" });
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });

  // Fetch filtered proposals using our hook
  const {
    proposals,
    pagination: paginationData,
    isLoading,
  } = useFilteredProposals({
    search,
    statuses,
    sortField: sortConfig.field,
    sortDirection: sortConfig.direction,
    page: pagination.page,
    pageSize: pagination.pageSize,
  });

  // Action handlers
  const handleSearch = useCallback((term: string) => {
    setSearch(term);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleStatusFilter = useCallback((newStatus: ProposalStatus) => {
    setStatuses([newStatus]);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleMultipleStatusFilter = useCallback(
    (newStatuses: ProposalStatus[]) => {
      setStatuses(newStatuses);
      setPagination((prev) => ({ ...prev, page: 1 }));
    },
    []
  );

  const toggleStatusFilter = useCallback((status: ProposalStatus) => {
    setStatuses((prevStatuses) => {
      // If status is already in the array, remove it
      if (prevStatuses.includes(status)) {
        return prevStatuses.filter((s) => s !== status);
      }
      // Otherwise add it
      return [...prevStatuses, status];
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const clearFilters = useCallback(() => {
    setSearch("");
    setStatuses([]);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleSort = useCallback((field: string) => {
    setSortConfig((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const setSortOrder = (order: "asc" | "desc") => {
    setSortConfig((prev) => ({
      ...prev,
      direction: order,
    }));
  };

  const handlePageChange = useCallback((newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  }, []);

  const value = {
    proposals,
    pagination: paginationData || {
      total: 0,
      pageCount: 0,
      page: pagination.page,
      pageSize: pagination.pageSize,
    },
    filters: {
      search,
      statuses,
      sortField: sortConfig.field,
      sortDirection: sortConfig.direction,
    },
    isLoading,
    actions: {
      handleSearch,
      handleStatusFilter,
      handleMultipleStatusFilter,
      toggleStatusFilter,
      handleSort,
      setSortOrder,
      handlePageChange,
      clearFilters,
    },
  };

  return (
    <ProposalsListContext.Provider value={value}>
      {children}
    </ProposalsListContext.Provider>
  );
}

export const useProposalsList = () => {
  const context = useContext(ProposalsListContext);
  if (!context) {
    throw new Error(
      "useProposalsList must be used within ProposalsListProvider"
    );
  }
  return context;
};
