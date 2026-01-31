import SignInForm from "../components/AuthForm/SignInForm";
import SignInHero from "../components/AuthHero/SignInHero";
import SignUpHero from "../components/AuthHero/SignUpHero";

export default function SignIn() {
  return (
    <>
      <div className="min-h-screen flex justify-center items-center  bg-background  dark:bg-background  ">
        {/* Hero Section */}
        <div className="w-full grid lg:grid-cols-2  gap-10 items-center ">
          <div className=" hidden lg:block "><SignUpHero /></div>
          <div><SignInForm /> </div>
        </div>
      </div>
    </>
  );
}
