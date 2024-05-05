"use client";
import React from "react";
import {
  ReactSketchCanvas,
  type ReactSketchCanvasRef,
} from "react-sketch-canvas";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Undo2Icon,
  Redo2Icon,
  PenToolIcon,
  EraserIcon,
  TabletSmartphone,
  UserCheck2,
  Paintbrush,
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
import { DEFAULTS } from "@/constants";
import { sketchformSchema } from "@/lib/validations";
import { z } from "zod";
import Link from "next/link";
import { cn } from "@/lib/utils";

function Create() {
  const canvasRef = React.useRef<ReactSketchCanvasRef>(null);
  const form = useForm({
    resolver: zodResolver(sketchformSchema),
    defaultValues: {
      title: "",
      canvasBg: "transparent",
      pencilColor: DEFAULTS.TEXT,
      strokeWidth: 5,
      eraserWidth: 5,
    },
    mode: "onSubmit",
  });

  const bg = form.watch("canvasBg");
  const stroke = form.watch("pencilColor");
  const pencil = form.watch("strokeWidth");
  const eraser = form.watch("eraserWidth");

  const onSubmit = (values: z.infer<typeof sketchformSchema>) => {};
  return (
    <section className="max-w-xl mx-auto">
      <h1 className="sm:flex hidden gap-2 items-center justify-center mb-8 text-3xl font-semibold ">
        <Paintbrush className="text-primary mr-1 w-8 h-8" />
        Let&apos;s Draw Some Stuff
      </h1>
      {/* For Mobile Screens */}
      <div className="sm:hidden w-full p-8">
        <header className="flex justify-center w-full mb-20">
          <Image
            width={180}
            height={32}
            src="https://firebasestorage.googleapis.com/v0/b/portfolio-52b82.appspot.com/o/Horrible%20Sketches.png?alt=media"
            alt="logo"
          />
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="My Sketch" {...field} />
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
              className={buttonVariants({ variant: "secondary" })}
              title="Undo"
              onClick={() => canvasRef.current?.undo()}
            >
              <Undo2Icon />
            </Button>
            <Button
              className={buttonVariants({ variant: "secondary" })}
              title="Redo"
              onClick={() => canvasRef.current?.redo()}
            >
              <Redo2Icon />
            </Button>
            <div className="h-[inherit] w-0.5 bg-gray-400/30" />
            <Button
              className={buttonVariants({ variant: "secondary" })}
              title="Pen"
              onClick={() => canvasRef.current?.eraseMode(false)}
            >
              <PenToolIcon />
            </Button>
            <Button
              className={buttonVariants({ variant: "secondary" })}
              title="Eraser"
              onClick={() => canvasRef.current?.eraseMode(true)}
            >
              <EraserIcon />
            </Button>
            <div className="h-[inherit] w-0.5 bg-gray-400/30" />

            <Button
              className={buttonVariants({ variant: "secondary" })}
              title="Clear"
              onClick={() => canvasRef.current?.clearCanvas()}
            >
              Clear
            </Button>
          </div>
          <div className="grid gap-2">
            <ReactSketchCanvas
              className="w-full min-h-72"
              ref={canvasRef}
              strokeWidth={pencil}
              eraserWidth={eraser}
              strokeColor={stroke}
              canvasColor={bg}
            />
          </div>
          <Button type="submit" className="w-full">
            Create
          </Button>
        </form>
      </Form>
    </section>
  );
}

export default Create;
