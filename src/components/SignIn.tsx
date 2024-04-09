import { LucideSkull } from "lucide-react";
import Link from "next/link";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

type SignInProps = {
  children: React.ReactNode;
  signUp?: boolean;
};

const SignIn = ({ children, signUp }: SignInProps) => {
  return (
    <>
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>
            <div className="flex flex-col space-y-2 text-center">
              <LucideSkull className="mx-auto h-8 w-8 text-primary" />

              <h1 className="text-2xl font-semibold tracking-tight">
                {signUp ? "Welcome Bad Artist" : "Welcome back"}
              </h1>
            </div>
          </CardTitle>
          <CardDescription className="text-md max-w-xs mx-auto">
            Enter Your Email to Continue!
          </CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
        <CardFooter>
          {!signUp ? (
            <p className="px-8 text-center text-sm text-muted-foreground">
              New 🧑‍🎨 Here?{" "}
              <Link
                href="/sign-up"
                className="hover:text-primary text-sm underline underline-offset-4"
              >
                Sign Up
              </Link>
            </p>
          ) : (
            <p className="px-8 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="hover:text-primary text-sm underline underline-offset-4"
              >
                Sign In
              </Link>
            </p>
          )}
        </CardFooter>
      </Card>
    </>
  );
};

export default SignIn;
