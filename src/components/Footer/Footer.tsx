import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="mt-12 pt-6 border-t border-gray-200">
      <div className="text-center text-xs text-gray-400">{t('footer.copyright')}</div>
    </footer>
  );
}
