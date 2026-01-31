import SignUpHero from "../components/AuthHero/SignUpHero";
import SignUpForm from "../components/AuthForm/SignUpForm";


export default function SignUp() {
  return (
    <>
      <div className="min-h-screen relative grid lg:grid-cols-2 bg-background  dark:bg-background items-center justify-start ">
        <SignUpHero />

        <SignUpForm />
      </div>
    </>
  );
}
