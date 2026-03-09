"use client";

import { useEffect } from "react";

export default function ClearSignedOutParam() {
  useEffect(() => {
    const url = new URL(window.location.href);
    if (!url.searchParams.has("signedOut")) {
      return;
    }

    url.searchParams.delete("signedOut");
    const nextQuery = url.searchParams.toString();
    const nextUrl = `${url.pathname}${nextQuery ? `?${nextQuery}` : ""}${url.hash}`;

    window.history.replaceState({}, "", nextUrl);
  }, []);

  return null;
}
