import React from "react";
import { Button } from "@/components/ui/button";
import { FiEdit2, FiList, FiPlus, FiMenu } from "react-icons/fi";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteProposalButton } from "./DeleteProposalButton";

interface ProposalActionsProps {
  proposalId?: string;
  proposalStatus?: string;
}

export function ProposalActions({
  proposalId,
  proposalStatus,
}: ProposalActionsProps) {
  return (
    <>
      {/* Desktop view */}
      <div className="hidden @[1100px]:flex items-center gap-5">
        <Button className="flex gap-2 items-center" variant="outline" asChild>
          <Link href="/proposals">
            <FiList />
            <span>View All Proposals</span>
          </Link>
        </Button>

        <Button className="flex gap-2 items-center" asChild>
          <Link href="/proposals/create">
            <FiPlus />
            <span>Create New Proposal</span>
          </Link>
        </Button>

        {proposalStatus !== "WON" && proposalId && (
          <Button className="flex gap-3 items-center" asChild>
            <Link href={`/proposals/${proposalId}/edit`}>
              <span className="aspect-square">
                <FiEdit2 />
              </span>
              <span>Edit Proposal</span>
            </Link>
          </Button>
        )}

        {proposalId && <DeleteProposalButton proposalId={proposalId} />}
      </div>

      {/* Mobile view */}
      <div className="@[1100px]:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <FiMenu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link
                href="/proposals"
                className="flex items-center gap-2 w-full"
              >
                <FiList className="h-4 w-4" />
                <span>View All Proposals</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/proposals/create"
                className="flex items-center gap-2 w-full"
              >
                <FiPlus className="h-4 w-4" />
                <span>Create New Proposal</span>
              </Link>
            </DropdownMenuItem>
            {proposalStatus !== "WON" && proposalId && (
              <DropdownMenuItem asChild>
                <Link
                  href={`/proposals/${proposalId}/edit`}
                  className="flex items-center gap-2 w-full"
                >
                  <FiEdit2 className="h-4 w-4" />
                  <span>Edit Proposal</span>
                </Link>
              </DropdownMenuItem>
            )}
            {proposalId && (
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <DeleteProposalButton
                  proposalId={proposalId}
                  variant="ghost"
                  className="h-auto w-full justify-start p-0 font-normal text-destructive focus:text-destructive hover:bg-transparent"
                />
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
