"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { RefreshCcw } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
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
import { signinSchema } from "@/lib/validations";
import { signIn } from "@/server/actions/user";

const SignInForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
    },
  });
  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: z.infer<typeof signinSchema>) {
    const formData = new FormData();
    formData.append("email", values.email);

    const { message, type } = await signIn(formData);

    toast({
      title: type.toUpperCase(),
      description: message,
      variant: type === "error" ? "destructive" : null,
      className: type !== "error" ? "bg-green-300" : undefined,
    });
    form.reset();
  }

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
      toast({
        title: "Error",
        description: genericMessages.GOOGLE_LOGIN_FAILED,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
  );
};

export default SignInForm;
