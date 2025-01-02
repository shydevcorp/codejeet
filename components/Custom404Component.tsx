"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";

const SearchParamsContent: React.FC = () => {
  const searchParams = useSearchParams();
  const referrer = searchParams?.get("ref");

  return (
    <>
      {referrer ? (
        <p>Oops! It seems like there was an issue coming from {referrer}.</p>
      ) : (
        <p>It looks like nothing was found at this location.</p>
      )}
    </>
  );
};

const Custom404Component: React.FC = () => {
  return (
    <div className="mt-8 text-center">
      <Suspense fallback={<p>Loading...</p>}>
        <SearchParamsContent />
      </Suspense>
    </div>
  );
};

export default Custom404Component;
