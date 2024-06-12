"use client";
import React from "react";
import {
  ReactSketchCanvas,
  type ReactSketchCanvasRef,
} from "react-sketch-canvas";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Undo2Icon,
  Redo2Icon,
  PenToolIcon,
  EraserIcon,
  TabletSmartphone,
  UserCheck2,
  Paintbrush,
  RefreshCcw,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { constants } from "@/constants";
import { sketchformSchema } from "@/lib/validations";
import { z } from "zod";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "./ui/use-toast";
import { createSketch } from "@/server/actions/sketch";
import { User } from "@supabase/supabase-js";

function SketchForm({ user }: { user: User }) {
  const router = useRouter();
  const canvasRef = React.useRef<ReactSketchCanvasRef>(null);
  const form = useForm({
    resolver: zodResolver(sketchformSchema),
    defaultValues: {
      name: "",
      canvasBg: "#ffffff",
      pencilColor: constants.TEXT,
      strokeWidth: 5,
      eraserWidth: 5,
    },
    mode: "onSubmit",
  });

  const { isSubmitting } = form.formState;
  const name = form.watch("name");
  const bg = form.watch("canvasBg");
  const stroke = form.watch("pencilColor");
  const pencil = form.watch("strokeWidth");
  const eraser = form.watch("eraserWidth");

  React.useEffect(() => {
    if (user.email && window.localStorage) {
      const data = localStorage.getItem(user.email);
      if (data) {
        const parsed = JSON.parse(data);
        canvasRef.current?.loadPaths(parsed.canvas);
        form.setValue("name", parsed.name);
      }
    }
  }, [user.email]);

  const onSubmit = async (values: z.infer<typeof sketchformSchema>) => {
    const file = await canvasRef.current?.exportImage("png");
    const filename = values.name.replace(/\s/g, "-").toLowerCase();

    const formData = new FormData();
    if (file) formData.append("file", file);
    formData.append("filename", filename + ".png");

    const { message, type } = await createSketch(formData);

    toast({
      title: type.charAt(0).toUpperCase() + type.slice(1),
      description: message,
      variant: type === "error" ? "destructive" : null,
      className: type !== "error" ? "bg-green-300" : undefined,
    });
    localStorage.removeItem(user.email || "");
    form.reset();
    canvasRef.current?.resetCanvas();
    router.push("/dashboard");
  };

  const saveLocaly = async () => {
    const data = await canvasRef.current?.exportPaths();
    const key = user.email || "";
    if (data && data.length > 0 && name.length > 0) {
      localStorage.setItem(
        key,
        JSON.stringify({
          name: name,
          canvas: data,
        })
      );
    }
  };

  return (
    <section className="max-w-xl mx-auto">
      <h1 className="sm:flex hidden gap-2 items-center justify-center mb-8 text-3xl font-semibold ">
        <Paintbrush className="text-primary mr-1 w-8 h-8" />
        Let&apos;s Draw Some Stuff
      </h1>
      {/* For Mobile Screens */}
      <div className="sm:hidden w-full p-8">
        <header className="flex justify-center w-full mb-20">
          <Image width={180} height={32} src="/preview.png" alt="logo" />
        </header>
        <h1 className="flex justify-center gap-1 my-4 text-2xl font-semibold ">
          <span>Sorry, Screen is Too small</span>
          <TabletSmartphone className="text-primary mr-1 w-8 h-8" />
        </h1>
        <h2 className="text-xl font-medium mb-4">
          Switch to a bigger device to Draw
        </h2>
        <p className="mb-4 font-medium opacity-70">
          Click below to see your sketches
        </p>
        <Link
          href={"/dashboard"}
          className={cn(
            buttonVariants({ variant: "link" }),
            "flex gap-2 w-15 h-10"
          )}
        >
          Dashboard
          <UserCheck2 />
        </Link>
      </div>
      <Form {...form}>
        <form
          className="hidden sm:grid gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sketch Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Fish Bones" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="pencilColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brush Color</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type="text" {...field} />
                        <Input
                          style={{ background: field.value }}
                          className="absolute right-0 top-1 w-8 h-8 rounded-full appearance-none cursor-pointer"
                          type="color"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="canvasBg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Canvas Color</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type="text" {...field} />

                        <Input
                          style={{ background: field.value }}
                          className="absolute right-0 top-1 w-8 h-8 rounded-full appearance-none cursor-pointer"
                          type="color"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="strokeWidth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brush Size</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="cursor-pointer"
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="eraserWidth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Eraser Size</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="cursor-pointer"
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              type="button"
              className={buttonVariants({ variant: "secondary" })}
              title="Undo"
              onClick={() => canvasRef.current?.undo()}
            >
              <Undo2Icon />
            </Button>
            <Button
              type="button"
              className={buttonVariants({ variant: "secondary" })}
              title="Redo"
              onClick={() => canvasRef.current?.redo()}
            >
              <Redo2Icon />
            </Button>
            <div className="h-[inherit] w-0.5 bg-gray-400/30" />
            <Button
              type="button"
              className={buttonVariants({ variant: "secondary" })}
              title="Pen"
              onClick={() => canvasRef.current?.eraseMode(false)}
            >
              <PenToolIcon />
            </Button>
            <Button
              type="button"
              className={buttonVariants({ variant: "secondary" })}
              title="Eraser"
              onClick={() => canvasRef.current?.eraseMode(true)}
            >
              <EraserIcon />
            </Button>
            <div className="h-[inherit] w-0.5 bg-gray-400/30" />

            <Button
              type="button"
              className={buttonVariants({ variant: "secondary" })}
              title="Clear"
              onClick={() => canvasRef.current?.clearCanvas()}
            >
              Clear
            </Button>
          </div>
          <div className="grid gap-2" onMouseLeave={saveLocaly}>
            <ReactSketchCanvas
              className={cn(
                "w-full min-h-80 border border-gray-300 rounded-md",
                {
                  "cursor-not-allowed pointer-events-none": isSubmitting,
                }
              )}
              ref={canvasRef}
              strokeWidth={pencil}
              eraserWidth={eraser}
              strokeColor={stroke}
              canvasColor={bg}
              exportWithBackgroundImage={true}
              backgroundImage={"/watermark.png"}
              preserveBackgroundImageAspectRatio="xMaxYMin"
            />
          </div>
          <div>
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Creating" : "Create"}{" "}
              {isSubmitting ? (
                <RefreshCcw className="animate-spin w-4 h-4 ml-2" />
              ) : null}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}

export default SketchForm;
