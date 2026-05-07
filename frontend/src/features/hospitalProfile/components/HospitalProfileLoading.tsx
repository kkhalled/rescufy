export default function HospitalProfileLoading() {
  return (
    <div
      className="
        min-h-screen

        bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.06),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(239,68,68,0.05),transparent_24%),var(--background)]

        px-3 py-5
        sm:px-5 sm:py-6
        lg:px-8
      "
    >
      <div className="mx-auto max-w-6xl animate-pulse">
        {/* Header */}
        <div
          className="
            mb-6

            flex flex-col gap-4

            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >
          {/* Left */}
          <div className="space-y-3">
            <div
              className="
                h-3 w-32

                rounded-full

                bg-cyan-500/20
              "
            />

            <div
              className="
                h-10 w-72

                rounded-2xl

                bg-white/[0.06]
              "
            />

            <div
              className="
                h-4 w-[28rem]

                rounded-full

                bg-white/[0.05]
              "
            />
          </div>

          {/* Refresh */}
          <div
            className="
              h-11 w-36

              rounded-2xl

              bg-cyan-500/10
            "
          />
        </div>

        {/* Main Card */}
        <div
          className="
            rounded-3xl

            border border-white/[0.05]

            bg-surface-card/95

            p-5 sm:p-6

            shadow-card
          "
        >
          {/* Identity */}
          <div
            className="
              flex flex-col gap-5

              lg:flex-row
              lg:items-start
              lg:justify-between
            "
          >
            {/* Left */}
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div
                className="
                  h-16 w-16

                  rounded-2xl

                  bg-cyan-500/10
                "
              />

              {/* Text */}
              <div className="space-y-3">
                <div
                  className="
                    h-6 w-52

                    rounded-xl

                    bg-white/[0.06]
                  "
                />

                <div
                  className="
                    h-4 w-72

                    rounded-full

                    bg-white/[0.05]
                  "
                />

                <div
                  className="
                    h-10 w-40

                    rounded-xl

                    bg-white/[0.06]
                  "
                />
              </div>
            </div>

            {/* Metrics */}
            <div
              className="
                grid grid-cols-2 gap-3
                sm:grid-cols-3
              "
            >
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="
                    rounded-2xl

                    border border-white/[0.05]

                    bg-background-second/40

                    px-4 py-3
                  "
                >
                  <div
                    className="
                      h-3 w-20

                      rounded-full

                      bg-white/[0.05]
                    "
                  />

                  <div
                    className="
                      mt-3

                      h-6 w-16

                      rounded-xl

                      bg-white/[0.06]
                    "
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="mt-8 space-y-5">
            {[1, 2, 3, 4].map((row) => (
              <div
                key={row}
                className="
                  grid gap-4
                  sm:grid-cols-2
                "
              >
                {[1, 2].map((field) => (
                  <div key={field} className="space-y-2">
                    <div
                      className="
                        h-3 w-24

                        rounded-full

                        bg-white/[0.05]
                      "
                    />

                    <div
                      className="
                        h-12 w-full

                        rounded-2xl

                        bg-background-second/50
                      "
                    />
                  </div>
                ))}
              </div>
            ))}

            {/* Actions */}
            <div
              className="
                flex flex-col gap-3

                border-t border-white/[0.05]

                pt-5

                sm:flex-row
              "
            >
              <div
                className="
                  h-12 w-40

                  rounded-2xl

                  bg-cyan-500/15
                "
              />

              <div
                className="
                  h-12 w-32

                  rounded-2xl

                  bg-white/[0.05]
                "
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
