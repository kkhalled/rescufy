/**
 * Language Switcher Component
 * Toggle button for switching between Arabic and English
 */

import { useLanguage } from '@/i18n/useLanguage';

interface LanguageSwitcherProps {
    showLabel?: boolean;
    className?: string;
}

export function LanguageSwitcher({ showLabel = false, className = '' }: LanguageSwitcherProps) {
    const { language, toggleLanguage, languageConfig } = useLanguage();

    const isArabic = language === 'ar';
    const switchToLabel = isArabic ? 'English' : 'العربية';

    return (
        <button
            onClick={toggleLanguage}
            className={`
        flex items-center gap-2 
        cursor-pointer
        p-2 rounded-lg 
        hover:bg-muted 
        transition-colors
        ${className}
      `}
            aria-label={`Switch to ${switchToLabel}`}
            title={`Switch to ${switchToLabel}`}
        >
            
            {showLabel && (
                <span className="text-sm font-medium text-heading">
                    {languageConfig.nativeName}
                </span>
            )}
            <span className="text-xs font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                {language.toUpperCase()}
            </span>
        </button>
    );
}

export default LanguageSwitcher;
