"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { searchSchema, SearchType } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, SearchIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export function SearchBar({ query }: { query?: string }) {
  const router = useRouter();
  const form = useForm<SearchType>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query,
    },
  });

  async function onSubmit(values: SearchType) {
    router.push(`/sketch/search?query=${values.query}`);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-2 items-center"
      >
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Search Sketches" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          variant="secondary"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          <SearchIcon />
        </Button>
      </form>
    </Form>
  );
}
