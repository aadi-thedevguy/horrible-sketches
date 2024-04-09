import SignIn from "@/components/SignIn";
import UserAuthForm from "@/components/UserAuthForm";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FC } from "react";

const page: FC = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  if (!error && data.user) {
    redirect("/dashboard");
  }

  return (
    <div className="h-full max-w-2xl mx-auto">
      <Link
        href="/"
        className={cn(buttonVariants({ variant: "ghost" }), "text-left")}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Home
      </Link>

      <SignIn>
        <UserAuthForm />
      </SignIn>
    </div>
  );
};

export default page;
