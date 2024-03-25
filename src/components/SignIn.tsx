import { LucideSkull } from "lucide-react";
import Link from "next/link";
import React from "react";

type SignInProps = {
  children: React.ReactNode;
  signUp?: boolean;
};

const SignIn = ({ children, signUp }: SignInProps) => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <LucideSkull className="mx-auto h-8 w-8 text-primary" />

        <h1 className="text-2xl font-semibold tracking-tight">
          {signUp ? "Welcome Bad Artist" : "Welcome back"}
        </h1>
        <h4 className="text-md max-w-xs mx-auto">
          Enter Your Email to Continue!
        </h4>
      </div>
      {children}

      {!signUp ? (
        <p className="px-8 text-center text-sm text-muted-foreground">
          New to Breaddit?{" "}
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
    </div>
  );
};

export default SignIn;
