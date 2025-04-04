"use client";

import React, { useState } from "react";
import {
  Download,
  Filter,
  Search,
  ArrowUpDown,
  ChevronDown,
  Calendar,
  DollarSign,
  ExternalLink,
  Trash2,
  Copy,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DashboardHeader from "@/features/proposals/components/dashboard/DashboardHeader";

// Mock data with expanded dataset for pagination example
const allProposals = [
  {
    id: "P-001",
    client: "Design Agency",
    date: "2025-04-01",
    status: "Won",
    value: "$2,500",
  },
  {
    id: "P-002",
    client: "Tech Startup",
    date: "2025-03-29",
    status: "Communication",
    value: "$3,800",
  },
  {
    id: "P-003",
    client: "E-commerce Site",
    date: "2025-03-27",
    status: "Opened",
    value: "$1,900",
  },
  {
    id: "P-004",
    client: "Marketing Firm",
    date: "2025-03-25",
    status: "Sent",
    value: "$4,200",
  },
  {
    id: "P-005",
    client: "Financial Services",
    date: "2025-03-22",
    status: "Won",
    value: "$5,600",
  },
  {
    id: "P-006",
    client: "Healthcare Provider",
    date: "2025-03-20",
    status: "Communication",
    value: "$3,200",
  },
  {
    id: "P-007",
    client: "Educational Platform",
    date: "2025-03-18",
    status: "Rejected",
    value: "$2,800",
  },
  {
    id: "P-008",
    client: "Real Estate Agency",
    date: "2025-03-15",
    status: "Won",
    value: "$6,100",
  },
  {
    id: "P-009",
    client: "Mobile App Developer",
    date: "2025-03-12",
    status: "Opened",
    value: "$4,500",
  },
  {
    id: "P-010",
    client: "Nonprofit Organization",
    date: "2025-03-10",
    status: "Sent",
    value: "$1,800",
  },
  {
    id: "P-011",
    client: "Travel Agency",
    date: "2025-03-08",
    status: "Communication",
    value: "$3,900",
  },
  {
    id: "P-012",
    client: "Food Delivery Service",
    date: "2025-03-05",
    status: "Rejected",
    value: "$2,300",
  },
  {
    id: "P-013",
    client: "Fitness Studio",
    date: "2025-03-03",
    status: "Won",
    value: "$1,700",
  },
  {
    id: "P-014",
    client: "Law Firm",
    date: "2025-03-01",
    status: "Opened",
    value: "$7,200",
  },
  {
    id: "P-015",
    client: "Content Platform",
    date: "2025-02-27",
    status: "Sent",
    value: "$4,800",
  },
];

const AllProposals: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({
    key: "date",
    direction: "desc",
  });

  const itemsPerPage = 8;

  // Filter proposals based on search term and status
  const filteredProposals = allProposals.filter((proposal) => {
    const matchesSearch =
      proposal.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || proposal.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort proposals
  const sortedProposals = [...filteredProposals].sort((a, b) => {
    if (sortConfig.key === "date") {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
    } else if (sortConfig.key === "value") {
      const valueA = parseFloat(a.value.replace("$", "").replace(",", ""));
      const valueB = parseFloat(b.value.replace("$", "").replace(",", ""));
      return sortConfig.direction === "asc" ? valueA - valueB : valueB - valueA;
    } else {
      if (
        a[sortConfig.key as keyof typeof a] <
        b[sortConfig.key as keyof typeof b]
      ) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (
        a[sortConfig.key as keyof typeof a] >
        b[sortConfig.key as keyof typeof b]
      ) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProposals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProposals = sortedProposals.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Won":
        return "bg-black text-white hover:bg-black/90";
      case "Communication":
        return "bg-zinc-800 text-white hover:bg-zinc-800/90";
      case "Opened":
        return "bg-zinc-600 text-white hover:bg-zinc-600/90";
      case "Rejected":
        return "bg-red-500 text-white hover:bg-red-600";
      default:
        return "bg-zinc-200 text-zinc-800 hover:bg-zinc-300/90";
    }
  };

  const handleSort = (key: string) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  // Mobile card view renderer
  const renderMobileCards = () => {
    return (
      <div className="space-y-4 md:hidden">
        {paginatedProposals.map((proposal) => (
          <div
            key={`mobile-${proposal.id}`}
            className="bg-white border border-zinc-100 rounded-lg p-4 shadow-sm"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-xs text-zinc-500 block">
                  {proposal.id}
                </span>
                <h3 className="font-medium">{proposal.client}</h3>
              </div>
              <Badge
                className={`${getStatusColor(
                  proposal.status
                )} flex items-center gap-1.5`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white opacity-70"></span>
                {proposal.status}
              </Badge>
            </div>

            <div className="flex items-center text-sm text-zinc-500 mb-4">
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              <span>{proposal.date}</span>
              <span className="mx-2">•</span>
              <DollarSign className="w-3.5 h-3.5 mr-1.5" />
              <span>{proposal.value}</span>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-zinc-200 hover:border-black hover:text-white hover:bg-black transition-all"
              >
                View
                <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-zinc-200"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Copy className="mr-2 h-4 w-4" />
                    <span>Duplicate</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    <span>Download</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Create pagination items
  const renderPaginationItems = () => {
    const items = [];

    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink
          onClick={() => setCurrentPage(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // If we're not at the beginning, add ellipsis
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis1">
          <span className="flex h-9 w-9 items-center justify-center">...</span>
        </PaginationItem>
      );
    }

    // Add pages around current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i > 1 && i < totalPages) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => setCurrentPage(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    // If we're not at the end, add ellipsis
    if (currentPage < totalPages - 2 && totalPages > 3) {
      items.push(
        <PaginationItem key="ellipsis2">
          <span className="flex h-9 w-9 items-center justify-center">...</span>
        </PaginationItem>
      );
    }

    // Always show last page if we have more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            onClick={() => setCurrentPage(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <DashboardHeader />

      {/* Filters and search */}
      <Card className="mb-6 shadow-none flex lg:flex-row justify-between gap-5  border-x-0 border-t-0 rounded-none border-zinc-200">
        <h3 className=" font-bold text-xl"> All Proposals</h3>
        <CardContent className=" px-0 ">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
              <Input
                placeholder="Search proposals..."
                className="pl-8 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px] bg-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Won">Won</SelectItem>
                  <SelectItem value="Communication">Communication</SelectItem>
                  <SelectItem value="Opened">Opened</SelectItem>
                  <SelectItem value="Sent">Sent</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-white">
                    <Filter className="mr-2 h-4 w-4" />
                    More Filters
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Date Range</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <DollarSign className="mr-2 h-4 w-4" />
                    <span>Value Range</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" className="bg-white">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <p className="text-sm text-zinc-500">
          Showing {startIndex + 1}-
          {Math.min(startIndex + itemsPerPage, filteredProposals.length)} of{" "}
          {filteredProposals.length} proposals
        </p>

        <div className="flex items-center gap-2">
          <p className="text-sm text-zinc-500">Sort by:</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 bg-white">
                {sortConfig.key.charAt(0).toUpperCase() +
                  sortConfig.key.slice(1)}
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSort("date")}>
                Date{" "}
                {sortConfig.key === "date" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("client")}>
                Client{" "}
                {sortConfig.key === "client" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("value")}>
                Value{" "}
                {sortConfig.key === "value" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("status")}>
                Status{" "}
                {sortConfig.key === "status" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile card view */}
      {renderMobileCards()}

      {/* Desktop table view */}
      <div className="hidden md:block overflow-hidden rounded-md mb-6">
        <Table>
          <TableHeader className="bg-zinc-50">
            <TableRow>
              <TableHead className="font-medium text-xs uppercase tracking-wider text-zinc-500">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-transparent font-medium text-xs uppercase tracking-wider text-zinc-500 p-0 flex items-center"
                  onClick={() => handleSort("id")}
                >
                  ID
                  {sortConfig.key === "id" && (
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  )}
                </Button>
              </TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-wider text-zinc-500">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-transparent font-medium text-xs uppercase tracking-wider text-zinc-500 p-0 flex items-center"
                  onClick={() => handleSort("client")}
                >
                  Client
                  {sortConfig.key === "client" && (
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  )}
                </Button>
              </TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-wider text-zinc-500">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-transparent font-medium text-xs uppercase tracking-wider text-zinc-500 p-0 flex items-center"
                  onClick={() => handleSort("date")}
                >
                  Date
                  {sortConfig.key === "date" && (
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  )}
                </Button>
              </TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-wider text-zinc-500">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-transparent font-medium text-xs uppercase tracking-wider text-zinc-500 p-0 flex items-center"
                  onClick={() => handleSort("status")}
                >
                  Status
                  {sortConfig.key === "status" && (
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  )}
                </Button>
              </TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-wider text-zinc-500">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-transparent font-medium text-xs uppercase tracking-wider text-zinc-500 p-0 flex items-center"
                  onClick={() => handleSort("value")}
                >
                  Value
                  {sortConfig.key === "value" && (
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  )}
                </Button>
              </TableHead>
              <TableHead className="font-medium text-xs uppercase tracking-wider text-zinc-500 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProposals.map((proposal) => (
              <TableRow
                key={proposal.id}
                className="hover:bg-zinc-50 border-b border-zinc-100"
              >
                <TableCell className="font-medium text-sm">
                  {proposal.id}
                </TableCell>
                <TableCell className="text-sm">{proposal.client}</TableCell>
                <TableCell className="text-sm">{proposal.date}</TableCell>
                <TableCell>
                  <Badge
                    className={`${getStatusColor(
                      proposal.status
                    )} flex w-fit items-center gap-1.5`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white opacity-70"></span>
                    {proposal.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm font-medium">
                  {proposal.value}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 border-zinc-200 hover:border-black hover:text-white hover:bg-black transition-all"
                    >
                      View
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 border-zinc-200"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" />
                          <span>Duplicate</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          <span>Download</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* No results */}
      {filteredProposals.length === 0 && (
        <Card className="bg-white shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-zinc-300 mb-4" />
            <h3 className="text-lg font-medium text-black mb-1">
              No proposals found
            </h3>
            <p className="text-zinc-500 text-center max-w-md mb-6">
              We couldn&apos;t find any proposals matching your search criteria.
              Try adjusting your filters or create a new proposal.
            </p>
            <Button className="bg-black text-white hover:bg-zinc-800">
              Create New Proposal
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {filteredProposals.length > 0 && (
        <Pagination className="justify-start mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {renderPaginationItems()}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default AllProposals;
