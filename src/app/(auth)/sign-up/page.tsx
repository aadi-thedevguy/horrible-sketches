import SignUpForm from "@/components/SignUpForm";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

const page = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (!error && data.user) {
    redirect("/dashboard");
  }
  return (
    <div className="h-screen max-w-2xl mx-auto">
      <Link
        href="/"
        className={cn(buttonVariants({ variant: "ghost" }), "text-left")}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Home
      </Link>

      <Card className="mx-auto w-full max-w-xs">
        <CardHeader>
          <CardTitle>
            <div className="flex flex-col space-y-2 text-center">
              <Image
                src="/logo.png"
                width={90}
                height={90}
                alt="logo"
                className="mx-auto text-primary"
              />
              <h1 className="text-2xl font-semibold tracking-tight">
                Welcome Bad Artist
              </h1>
            </div>
          </CardTitle>
          <CardDescription className="text-md max-w-xs mx-auto">
            Enter Your Details to Sign Up!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
        <CardFooter>
          <p className="px-8 text-left text-sm text-muted-foreground">
            Already have an account? <br />
            <Link
              href="/sign-in"
              className="hover:text-primary text-sm underline underline-offset-4"
            >
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default page;
