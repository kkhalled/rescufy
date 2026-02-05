import AllHospitals from "../components/AllHospitals";

export default function HospitalsManagement() {
  return (
    <>
      <section className="w-full xl:px-12">
        <header>
          <h1 className="text-heading mb-2 text-4xl font-semibold">
            Hospitals Management
          </h1>
          <p className="text-muted text-sm mt-1">
            Manage hospital information and bed availability
          </p>
        </header>
        <AllHospitals />
      </section>
    </>
  );
}
