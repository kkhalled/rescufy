import Logo from "@/shared/common/Logo";

export default function SignInHero() {
  return (
    <>
      {/* Background glow */}
      <div className=" absolute   h-125 bg-purple-400/20 rounded-full blur-3xl" />

      <div className="relative z-10 h-full flex items-center  justify-center ">
        <div className="max-w-xl px-12">
          {/* Logo */}
          <div className="mb-10">
            <Logo />
          </div>

          {/* Headline */}
          <h1 className="text-5xl font-extrabold text-heading">
            Welcome <span className="text-indigo-600">Back</span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-md">
            Your command center for coordinating critical emergency response
            operations in real-time.
          </p>
        </div>
      </div>
    </>
  );
}
