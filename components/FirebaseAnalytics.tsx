"use client";

import { useEffect } from "react";
import { initializeAnalytics } from "@/lib/firebase";
import { usePathname, useSearchParams } from "next/navigation";

export function FirebaseAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const init = async () => {
      await initializeAnalytics();
    };

    init();
  }, []);

  useEffect(() => {
    const handleRouteChange = async () => {
      const { logEvent } = await import("firebase/analytics");
      const analytics = await initializeAnalytics();

      if (analytics) {
        logEvent(analytics, "page_view", {
          page_path: pathname,
          page_search: searchParams?.toString(),
        });
      }
    };

    handleRouteChange();
  }, [pathname, searchParams]);

  return null;
}
