import SignInForm from "@/components/SignInForm";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { redirect } from "next/navigation";
import { FC } from "react";

const page: FC = async () => {
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
                {/* {signUp ? "Welcome Bad Artist"  */}
                {/* <p className="px-8 text-left text-sm text-muted-foreground">
              Already have an account? <br />
              <Link
                href="/sign-in"
                className="hover:text-primary text-sm underline underline-offset-4"
              >
                Sign In
              </Link>
            </p> */}
                Welcome back
              </h1>
            </div>
          </CardTitle>
          <CardDescription className="text-md max-w-xs mx-auto">
            Enter Your Email to Continue!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
        <CardFooter>
          <p className="px-8 text-center text-sm text-muted-foreground">
            New 🧑‍🎨 Here?{" "}
            <Link
              href="/sign-up"
              className="hover:text-primary text-sm underline underline-offset-4"
            >
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default page;
