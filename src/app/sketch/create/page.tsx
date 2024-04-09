"use client";
import React from "react";
import Link from "next/link";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Paintbrush } from "lucide-react";

function Create() {
  return (
    <section className="max-w-xl mx-auto">
      <h1 className="flex gap-2 items-center justify-center mb-8 text-3xl font-semibold ">
        <Paintbrush className="text-primary mr-1 w-8 h-8" />
          Let&apos;s Draw Some Stuff
      </h1>
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="first-name">First name</Label>
            <Input id="first-name" placeholder="Max" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="last-name">Last name</Label>
            <Input id="last-name" placeholder="Robinson" required />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-2">
          <ReactSketchCanvas
            className="w-full min-h-72"
            strokeWidth={4}
            strokeColor="red"
          />
        </div>
        <Button type="submit" className="w-full">
          Create
        </Button>
        <Button variant="secondary" className="w-full">
          Save
        </Button>
      </div>
    </section>
  );
}

export default Create;
