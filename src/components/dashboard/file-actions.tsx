"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CheckIcon,
  Copy,
  DownloadIcon,
  MoreVertical,
  RefreshCwOff,
  SendIcon,
  TrashIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ISketch } from "@/lib/db/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSketch } from "@/server/actions/sketch";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { genericMessages } from "@/constants";

export function FileCardActions({
  file,
  query,
}: {
  file: ISketch;
  query?: string;
}) {
  const { toast } = useToast();
  const [link, setlink] = useState("");
  useEffect(() => {
    if (window && typeof window !== "undefined") {
      const link = `${window.location.origin}/sketch/${file.id}`;
      setlink(link);
    }
  }, [file.id]);

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey: ["delete-sketch"],
    mutationFn: async () => await deleteSketch(file.id),
    onSuccess: () => {
      toast({
        title: "Success",
        description: genericMessages.DELETE_SKETCH_SUCCESS,
        className: "bg-green-300",
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error?.message,
        variant: "destructive",
      });
    },
    onSettled: async () => {
      if (query)
        return await queryClient.invalidateQueries({
          queryKey: ["search-sketch", query],
        });
      else {
        return await queryClient.invalidateQueries({
          queryKey: ["sketches"],
        });
      }
    },
  });

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  function copyText() {
    if (window && typeof window !== "undefined" && window.navigator.clipboard) {
      navigator.clipboard.writeText(link);
      setIsCopied(true);
    }
  }

  return (
    <>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              Your sketch cannot be recovered after deletion
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 items-center">
            <DialogClose asChild disabled={isPending}>
              <Button type="button" variant="ghost" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              disabled={isPending}
              variant="destructive"
              onClick={() => mutate()}
            >
              {isPending ? "Deleting" : "Delete"}
              {isPending ? (
                <RefreshCwOff className="animate-spin w-4 h-4 ml-2" />
              ) : (
                <TrashIcon className="w-4 h-4 ml-2" />
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sketch URL</DialogTitle>
            <DialogDescription>
              Anyone who has this link will be able to view this.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Sharable Link
              </Label>
              <Input id="link" value={link} readOnly />
            </div>
            <Button
              type="submit"
              size="sm"
              variant="ghost"
              className="px-3"
              onClick={copyText}
            >
              <span className="sr-only">Copy</span>
              {isCopied ? (
                <CheckIcon className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsCopied(false)}
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              if (!file.url) return;
              window.open(file.url, "_blank");
            }}
            className="flex gap-1 items-center cursor-pointer text-primary-foreground"
          >
            <DownloadIcon className="w-4 h-4" /> Download
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            className="flex gap-1 text-red-600 items-center cursor-pointer"
          >
            <TrashIcon className="w-4 h-4" /> Delete
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsShareDialogOpen(true)}
            className="flex gap-1 text-secondary items-center cursor-pointer"
          >
            <SendIcon className="w-4 h-4" /> Share
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
