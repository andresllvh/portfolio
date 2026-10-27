"use client";

import { useEffect } from "react";
import StatusPage, { HomeLink } from "@/components/StatusPage";
import { useLanguage } from "@/components/LanguageProvider";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLanguage();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusPage title={t("error.title")} body={t("error.body")}>
      <button type="button" onClick={reset} className="frost-btn frost-btn--primary">
        {t("error.retry")}
      </button>
      <HomeLink label={t("error.back")} />
    </StatusPage>
  );
}
