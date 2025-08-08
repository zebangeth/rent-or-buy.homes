import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-12 pt-6 border-t border-gray-200">
      <div className="text-center text-xs text-gray-400">{t("footer.copyright")}</div>
      <div className="mt-2 text-center text-2xs text-gray-400">
        <span>{t("footer.dataCreditsPrefix")}</span>
        <a
          href="https://www.xiaohongshu.com/user/profile/6405a865000000001001f538"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-500"
        >
          @Spectre
        </a>
        <span>{t("footer.dataCreditsSuffix")}</span>
      </div>
    </footer>
  );
}
