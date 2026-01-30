import InputFiled from "../../../../shared/ui/FormInput/InputFiled";
import { faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import SelectFiled from "../../../../shared/ui/SelectFiled";
import { Link } from "react-router";
// import { Link } from 'react-dom';

export default function SignUpForm() {
  return (
    <div
      className="
        w-full max-w-md mx-auto
        bg-gray-100
        dark:bg-background
        py-4
        rounded-2xl
        shadow-xl
        border border-slate-200 dark:border-white/10
        text-sm
      "
    >
      <form className="text-sm">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center my-6 text-heading">
          Create Account
        </h2>

        {/* Inputs */}
        <div className=" px-6">
          <InputFiled
            label="Full Name"
            id="fullName"
            icon={faUser}
            placeholder="Enter your full name"
            type="text"
          />

          <InputFiled
            label="Email Address"
            id="email"
            icon={faEnvelope}
            placeholder="Enter your email address"
            type="email"
          />

          <InputFiled
            label="Password"
            id="password"
            icon={faLock}
            placeholder="Enter your password"
            type="password"
          />

          <InputFiled
            label={"Confirm Password"}
            id={"confirmPassword"}
            icon={faLock}
            placeholder={"Re-enter your password"}
            type={"password"}
          />

          <SelectFiled label={"Role"} role={"admin"} id={"role"} />

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="
                w-full
                bg-primary
                text-white
                py-3
                rounded-lg
                font-semibold
                hover:bg-primary/90
                focus:outline-none
                focus:ring-2
                focus:ring-primary/40
                transition
              "
            >
              Sign Up
            </button>
          </div>
        </div>
      </form>

      <div className="mt-6 px-6 pt-6 border-t border-slate-300 dark:border-white/10 text-center">
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Do you have an account?{" "}
          <Link
            to={"/signin"}
            className="text-primary font-semibold hover:text-primary/80 transition"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
