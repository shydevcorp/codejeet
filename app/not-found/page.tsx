"use client";

import React, { Suspense } from "react";
import Custom404Component from "@/components/Custom404Component";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-6xl font-bold">404 - Page Not Found</h1>
      <p className="mt-4 text-xl">Sorry, the page you are looking for does not exist.</p>
      <Suspense fallback={<div>Loading additional information...</div>}>
        <Custom404Component />
      </Suspense>
    </div>
  );
}
