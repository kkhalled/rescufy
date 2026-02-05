import InputFiled from "../../../../shared/ui/FormInput/InputFiled";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { Link } from "react-router";

// import { Link } from 'react-dom';
import { useFormik } from "formik";
import * as yup from "yup";
import { ROLE_ROUTES } from "../../roles/auth.roles";
import { setRole } from "../../store/auth.slice";
import { useDispatch } from "react-redux";
import type { responseType } from "../../types/auth.types";


export default function SignInForm() {
   const navigate = useNavigate();
  const dispatch = useDispatch();
  
  type SignInFormValues = {
    email: string;
    password: string;
  };

function handleSubmit(values: SignInFormValues) {
  console.log(values);
  
  const fakeResponse:responseType = {
    id: 1,
    name: "Aya",
    email: "aya@example.com",
    roleId: "admin" ,
  };

  dispatch(setRole(fakeResponse.roleId));
  navigate(ROLE_ROUTES[fakeResponse.roleId ]);
}


  const validationSchema = yup.object({
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: handleSubmit,
    validationSchema: validationSchema,
  });

 
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
      <form className="text-sm" onSubmit={formik.handleSubmit}>
        {/* Title */}
        <h2 className="text-3xl font-bold text-center my-6 text-heading">
          Sign In
        </h2>

        {/* Inputs */}
        <div className=" px-6">
          <InputFiled
            label="Email Address"
            id="email"
            icon={faEnvelope}
            placeholder="Enter your email address"
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
          />

          <InputFiled
            label="Password"
            id="password"
            icon={faLock}
            placeholder="Enter your password"
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && formik.errors.password ? formik.errors.password : undefined}
          />

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
              Sign In
            </button>
          </div>
        </div>
      </form>

      <div className="mt-6 px-6 pt-6 border-t border-slate-300 dark:border-white/10 text-center">
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Do you have an account?{" "}
          <Link
            to={"/signup"}
            className="text-primary font-semibold hover:text-primary/80 transition"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
