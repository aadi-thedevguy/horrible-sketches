"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { AlertCircle, CheckCircle, RefreshCcw, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Icons } from "./Icons";
import { genericMessages } from "@/constants";
import { supabase } from "@/lib/supabase/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signupSchema, SignUpType } from "@/lib/validations";
import { signUp } from "@/server/actions/user";
import { useFormState, useFormStatus } from "react-dom";
import { Alert, AlertDescription } from "./ui/alert";

const SignUpForm = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isGoogleError, setIsGoogleError] = React.useState("");

  const [state, formAction] = useFormState(signUp, {
    message: "",
  });
  const { pending: isSubmitting } = useFormStatus()

  const form = useForm<SignUpType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      name: "",
      ...(state?.fields ?? {}),
    },
  });

  const formRef = React.useRef<HTMLFormElement>(null);

  const loginWithGoogle = async () => {
    setIsLoading(true);

    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${location.origin}/auth/validate`,
        },
      });
    } catch (error) {
      setIsGoogleError(genericMessages.GOOGLE_LOGIN_FAILED);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {state?.message !== "" && !state.issues && !state.success && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {state.message}
          </AlertDescription>
        </Alert>
      )}
      {isGoogleError.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {isGoogleError}
          </AlertDescription>
        </Alert>
      )}
      {state?.message !== "" && !state.issues && state.success && (
        <Alert className="border-green-500 text-green-500">
          <CheckCircle className="h-4 w-4" color="green" />
          <AlertDescription>
            {state.message}
          </AlertDescription>
        </Alert>
      )}
      {state?.issues && (
        <ul className="flex flex-col gap-2 justify-center">
          {state.issues.map((issue) => (
            <li key={issue} className="flex gap-1 items-center text-red-500 border-red-500 border rounded-lg p-2">
              <X fill="red" className="h-4 w-4" />
              {issue}
            </li>
          ))}
        </ul>
      )}
      <div className="flex justify-center mt-2">


        <Form {...form}>
          <form
            ref={formRef}
            action={formAction}
            onSubmit={(evt) => {
              evt.preventDefault();
              form.handleSubmit(() => {
                formAction(new FormData(formRef.current!));
              })(evt);
            }}
            className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="youremail@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full text-center disabled:cursor-not-allowed disabled:bg-opacity-75"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting" : "Submit"}{" "}
              {isSubmitting ? (
                <RefreshCcw className="animate-spin w-4 h-4 ml-2" />
              ) : null}
            </Button>
            <hr />
            <Button
              type="button"
              size="sm"
              className="w-full bg-blue-700 hover:bg-blue-600 text-white"
              onClick={loginWithGoogle}
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Icons.google className="h-4 w-4 mr-2" />
              )}
              Sign in with Google
            </Button>

          </form>
        </Form>
      </div>
    </>
  );
};

export default SignUpForm;
