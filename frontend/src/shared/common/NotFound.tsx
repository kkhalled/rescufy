import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectRole } from "@/features/auth/store/auth.slice";
import { ROLE_ROUTES } from "@/features/auth/roles/auth.roles";
import { Button } from "@/shared/ui/button";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const navigate = useNavigate();
  const role = useSelector(selectRole);
  const { t } = useTranslation('common');

  const handleNavigateHome = () => {
    if (role && ROLE_ROUTES[role as keyof typeof ROLE_ROUTES]) {
      navigate(ROLE_ROUTES[role as keyof typeof ROLE_ROUTES]);
    } else {
      navigate("/signin");
    }
  };

  return (
    <div className="min-h-screen w-full bg-background dark:bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Main Content Card */}
        <div className="relative">
          {/* Decorative circles background */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-brand-accent/10 dark:bg-brand-accent/5 rounded-full blur-3xl" />
          </div>

          {/* Card Content */}
          <div className="relative bg-surface-card dark:bg-surface-card rounded-2xl shadow-card dark:shadow-card p-6 sm:p-8 text-center border border-border-default dark:border-border-default/50">
            {/* 404 Number */}
            <div className="mb-3">
              <div className="text-5xl sm:text-6xl font-bold bg-linear-to-r from-primary to-brand-accent bg-clip-text text-transparent">
                404
              </div>
              <div className="h-1 w-12 bg-linear-to-r from-primary to-brand-accent rounded-full mx-auto mt-2" />
            </div>

            {/* Heading */}
            <h1 className="text-2xl sm:text-3xl font-bold text-heading dark:text-heading mb-2">
              {t('pages.notFound.title')}
            </h1>

            {/* Description */}
            <p className="text-text-muted dark:text-muted text-sm sm:text-base mb-4">
              {t('pages.notFound.description')}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handleNavigateHome}
                className="bg-primary hover:bg-primary/90 text-heading font-medium transition-all duration-300 h-10 px-6 text-sm"
              >
                {t('pages.notFound.goToDashboard')}
              </Button>
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="border-border-default dark:border-border-default/50 text-text-heading dark:text-heading hover:bg-surface-muted dark:hover:bg- font-medium h-10 px-6 text-sm"
              >
                {t('pages.notFound.goBack')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
