"use client";

import StatusPage, { HomeLink } from "@/components/StatusPage";
import { useLanguage } from "@/components/LanguageProvider";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <StatusPage
      kicker={t("notFound.code")}
      title={t("notFound.title")}
      body={t("notFound.body")}
    >
      <HomeLink label={t("notFound.back")} />
    </StatusPage>
  );
}
