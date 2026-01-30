import SignInForm from "../components/AuthForm/SignInForm";
import SignInHero from "../components/AuthHero/SignInHero";
import SignUpHero from "../components/AuthHero/SignUpHero";

export default function SignIn() {
  return (
    <>
      <div className="min-h-screen flex justify-center items-center  bg-background  dark:bg-background  ">
        {/* Hero Section */}
        <div className="w-full grid lg:grid-cols-2  justify-between items-center ">
          <SignUpHero />
          <SignInForm />
        </div>
      </div>
    </>
  );
}
