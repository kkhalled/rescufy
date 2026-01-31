
import AllRequests from "../components/AllRequests";

export default function Request() {
  return (
    <>
      <section className=" w-ful xl:px-12 ">
        <header>
          <h1 className="text-heading mb-2 text-4xl font-semibold">
            Emergency Requests
          </h1>
          <span className="text-muted text-sm">
            Manage and track all emergency response requests
          </span>
        </header>
        <main className="mt-8">
          {/* Request list and filters will go here */}

        

          {/* all requests here */}

          <AllRequests />
        </main>
      </section>
    </>
  );
}
