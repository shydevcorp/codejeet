"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

const Custom404Component: React.FC = () => {
  const searchParams = useSearchParams();
  const referrer = searchParams.get("ref");

  return (
    <div className="mt-8">
      {referrer ? (
        <p>Oops! It seems like there was an issue coming from {referrer}.</p>
      ) : (
        <p>It looks like nothing was found at this location.</p>
      )}
    </div>
  );
};

export default Custom404Component;
