"use client";

import React from "react";
import {
  CanvasPath,
  ReactSketchCanvas,
  ReactSketchCanvasRef,
} from "react-sketch-canvas";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  canvasBg: string | null;
  canvasPath: CanvasPath[] | unknown;
};

function SketchView({ data }: { data: Props }) {
  const canvasRef = React.useRef<ReactSketchCanvasRef>(null);
  const [pathLoaded, setPathLoaded] = React.useState(false);

  React.useEffect(() => {
    if (data) {
      canvasRef.current?.loadPaths(data.canvasPath as CanvasPath[]);
      setPathLoaded(true);
    }
  }, []);

  return (
    <>
      <div className="hidden md:grid gap-2 my-8 mx-auto">
        {pathLoaded ? (
          <ReactSketchCanvas
            className={
              "w-11/12 mx-auto min-h-80 border border-gray-300 rounded-md"
            }
            ref={canvasRef}
            canvasColor={data?.canvasBg || "#ffffff"}
            // @ts-ignore
            readOnly={true}
            allowOnlyPointerType="none"
          />
        ) : (
          <>
            <h1 className="font-semibold text-xl my-8 text-center">
              Wait Till we load the sketch...
            </h1>
            <Skeleton className="min-h-80 w-11/12 mx-auto rounded-md" />
          </>
        )}
      </div>
    </>
  );
}

export default SketchView;
