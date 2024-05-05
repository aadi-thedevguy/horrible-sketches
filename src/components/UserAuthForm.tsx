"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { FC } from "react";
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
import { authformSchema } from "@/lib/validations";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const UserAuthForm: FC<UserAuthFormProps> = ({ className, ...props }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof authformSchema>>({
    resolver: zodResolver(authformSchema),
    defaultValues: {
      email: "",
      name: "",
    },
  });
  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: z.infer<typeof authformSchema>) {
    // first check if the username exists or not

    const { error } = await supabase.auth.signInWithOtp({
      email: values.email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
        data: {
          username: values.name ? values.name : "",
        },
      },
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    form.reset();

    return toast({
      title: "Success",
      description: genericMessages.SIGN_IN_MAIL_SENT,
      className: "bg-green-300",
    });
  }

  const loginWithGoogle = async () => {
    setIsLoading(true);

    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${location.origin}/auth/callback`,
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
    <div className={cn("flex justify-center", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* {props.signUp && ( */}
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
          {/* )} */}
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

export default UserAuthForm;
