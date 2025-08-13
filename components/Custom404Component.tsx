"use client";

import React, { Suspense } from "react";

const SearchParamsContent: React.FC = () => {
  return <></>;
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
