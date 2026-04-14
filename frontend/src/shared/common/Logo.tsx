import logo from "@/assets/Rescufy-Logo.svg";

export default function Logo() {
  return (
    <div className="flex mx-auto items-center justify-center gap-2 mb-1">
      <img
        src={logo}
        alt="Rescufy Logo"
        className="h-auto w-[190px] object-contain md:w-full md:scale-[2.05] md:object-center"
      />
    </div>
  );
}
