import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useURLSync } from "../../hooks/useURLSync";

interface ShareButtonProps {
  className?: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}

export function ShareButton({ className = "", variant = "secondary", size = "md" }: ShareButtonProps) {
  const { t } = useTranslation();
  const { shareCurrentState } = useURLSync();
  const [isSharing, setIsSharing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);

    try {
      const success = await shareCurrentState();

      if (success) {
        setShowSuccess(true);
        // Hide success message after 2 seconds
        setTimeout(() => setShowSuccess(false), 2000);
      } else {
        // Fallback: show an alert if clipboard API fails
        alert(t('share.failed'));
      }
    } catch (error) {
      console.error("Share failed:", error);
      alert(t('share.failed'));
    } finally {
      setIsSharing(false);
    }
  };

  // Base styles that work with any layout
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  // Variant styles
  const variantStyles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-500 border border-gray-300",
  };

  // Size styles (only padding and text size, no width overrides)
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  // Extract flex-related classes from className to apply to wrapper
  const flexClasses =
    className
      ?.split(" ")
      .filter(
        (cls) => cls.startsWith("flex") || cls.startsWith("w-") || cls.startsWith("min-w") || cls.startsWith("max-w")
      )
      .join(" ") || "";

  // Remove flex classes from button className to avoid duplication
  const buttonOnlyClasses =
    className
      ?.split(" ")
      .filter(
        (cls) =>
          !cls.startsWith("flex") && !cls.startsWith("w-") && !cls.startsWith("min-w") && !cls.startsWith("max-w")
      )
      .join(" ") || "";

  // Combine styles for the button (excluding flex/width classes which go on wrapper)
  const finalButtonClasses = [
    baseStyles,
    "w-full", // Make button take full width of its container
    !buttonOnlyClasses?.includes("bg-") && variantStyles[variant],
    !buttonOnlyClasses?.includes("px-") && !buttonOnlyClasses?.includes("py-") && sizeStyles[size],
    !buttonOnlyClasses?.includes("rounded") && "rounded-lg",
    buttonOnlyClasses,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`relative ${flexClasses}`}>
      <button
        onClick={handleShare}
        disabled={isSharing}
        className={finalButtonClasses}
        aria-label="Share this calculation"
      >
        {isSharing ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {t('share.copying')}
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
            {t('share.title')}
          </>
        )}
      </button>

      {/* Success notification - positioned above the button */}
      {showSuccess && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
          <div className="bg-green-600 text-white text-sm px-3 py-2 rounded-md shadow-lg whitespace-nowrap">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t('share.copied')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
