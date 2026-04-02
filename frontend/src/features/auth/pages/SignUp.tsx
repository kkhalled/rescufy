import SignUpHero from "../components/AuthHero/SignUpHero";
import SignUpForm from "../components/AuthForm/SignUpForm";
import { LanguageSwitcher } from "@/shared/ui/LanguageSwitcher";

export default function SignUp() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — Hero */}
      <div className="hidden lg:block relative">
        <SignUpHero />
      </div>

      {/* Right — Form */}
      <div className="relative flex items-center justify-center bg-white dark:bg-slate-900 p-6 sm:p-10 lg:p-14 xl:p-20 overflow-y-auto">
        {/* Language Switcher */}
        <div className="absolute top-5 right-5 z-50 rtl:right-auto rtl:left-5">
          <LanguageSwitcher showLabel />
        </div>

        <SignUpForm />
      </div>
    </div>
  );
}
