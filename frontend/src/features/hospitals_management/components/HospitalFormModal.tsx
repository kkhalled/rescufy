import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import type { Hospital } from "../data/hospitals.data";

import { zodResolver } from "@hookform/resolvers/zod";

interface HospitalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (hospital: Hospital) => void;
  hospital?: Hospital;
  mode: "add" | "edit";
}

// Zod validation schema
const hospitalSchema = z
  .object({
    id: z.string(),
    name: z.string().min(1, "Hospital name is required"),
    email: z.email("Invalid email format").min(1, "Email is required"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^[\d\s\-+()]+$/, "Invalid phone number format"),
    address: z.string().min(1, "Address is required"),
    status: z.enum(["NORMAL", "BUSY", "CRITICAL", "FULL"]),
    totalBeds: z.number().int().positive("Total beds must be greater than 0"),
    usedBeds: z.number().int().min(0, "Used beds cannot be negative"),
  })
  .refine((data) => data.usedBeds <= data.totalBeds, {
    message: "Used beds cannot exceed total beds",
    path: ["usedBeds"],
  });

type HospitalFormData = z.infer<typeof hospitalSchema>;

export function HospitalFormModal({
  isOpen,
  onClose,
  onSubmit,
  hospital,
  mode,
}: HospitalFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HospitalFormData>({
    resolver: zodResolver(hospitalSchema),
    defaultValues: {
      id: "",
      name: "",
      email: "",
      phone: "",
      address: "",
      status: "NORMAL",
      totalBeds: 0,
      usedBeds: 0,
    },
  });

  useEffect(() => {
    if (hospital && mode === "edit") {
      reset(hospital);
    } else {
      reset({
        id: `Hospital-${Date.now()}`,
        name: "",
        email: "",
        phone: "",
        address: "",
        status: "NORMAL",
        totalBeds: 0,
        usedBeds: 0,
      });
    }
  }, [isOpen, hospital, mode, reset]);

  const onSubmitForm = (data: HospitalFormData) => {
    onSubmit(data as Hospital);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface-card w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col rounded-2xl shadow-card border border-border">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold text-heading">
            {mode === "add" ? "Add New Hospital" : "Edit Hospital"}
          </h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-heading transition-colors p-2 hover:bg-surface-muted rounded-lg"
            aria-label="Close modal"
          >
            <FontAwesomeIcon icon={faXmark} className="w-5 h-5 cursor-pointer" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmitForm)}
          className="flex-1 overflow-y-auto"
        >
          <div className="px-6 py-5 space-y-5">
            {/* Hidden ID field */}
            <input type="hidden" {...register("id")} />

            {/* Row 1: Hospital Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Hospital Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-body mb-1.5"
                >
                  Hospital Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name")}
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all bg-background text-heading placeholder:text-muted ${
                    errors.name
                      ? "border-danger focus:ring-danger/20"
                      : "border-border focus:ring-primary/30 focus:border-primary"
                  }`}
                  placeholder="Enter hospital name"
                />
                {errors.name && (
                  <p className="mt-1.5 text-xs text-danger">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-body mb-1.5"
                >
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all bg-background text-heading placeholder:text-muted ${
                    errors.email
                      ? "border-danger focus:ring-danger/20"
                      : "border-border focus:ring-primary/30 focus:border-primary"
                  }`}
                  placeholder="hospital@example.com"
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs text-danger">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Row 2: Phone & Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-body mb-1.5"
                >
                  Phone Number <span className="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  {...register("phone")}
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all bg-background text-heading placeholder:text-muted ${
                    errors.phone
                      ? "border-danger focus:ring-danger/20"
                      : "border-border focus:ring-primary/30 focus:border-primary"
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && (
                  <p className="mt-1.5 text-xs text-danger">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-body mb-1.5"
                >
                  Address <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  {...register("address")}
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all bg-background text-heading placeholder:text-muted ${
                    errors.address
                      ? "border-danger focus:ring-danger/20"
                      : "border-border focus:ring-primary/30 focus:border-primary"
                  }`}
                  placeholder="Enter hospital address"
                />
                {errors.address && (
                  <p className="mt-1.5 text-xs text-danger">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </div>

            {/* Row 3: Status & Bed Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-body mb-1.5"
                >
                  Status
                </label>
                <select
                  id="status"
                  {...register("status")}
                  className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-background text-heading transition-all"
                >
                  <option value="NORMAL">Normal</option>
                  <option value="BUSY">Busy</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="FULL">Full</option>
                </select>
              </div>

              {/* Total Beds */}
              <div>
                <label
                  htmlFor="totalBeds"
                  className="block text-sm font-medium text-body mb-1.5"
                >
                  Total Beds <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  id="totalBeds"
                  {...register("totalBeds", { valueAsNumber: true })}
                  min="0"
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all bg-background text-heading placeholder:text-muted ${
                    errors.totalBeds
                      ? "border-danger focus:ring-danger/20"
                      : "border-border focus:ring-primary/30 focus:border-primary"
                  }`}
                  placeholder="0"
                />
                {errors.totalBeds && (
                  <p className="mt-1.5 text-xs text-danger">
                    {errors.totalBeds.message}
                  </p>
                )}
              </div>

              {/* Used Beds */}
              <div>
                <label
                  htmlFor="usedBeds"
                  className="block text-sm font-medium text-body mb-1.5"
                >
                  Used Beds <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  id="usedBeds"
                  {...register("usedBeds", { valueAsNumber: true })}
                  min="0"
                  className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all bg-background text-heading placeholder:text-muted ${
                    errors.usedBeds
                      ? "border-danger focus:ring-danger/20"
                      : "border-border focus:ring-primary/30 focus:border-primary"
                  }`}
                  placeholder="0"
                />
                {errors.usedBeds && (
                  <p className="mt-1.5 text-xs text-danger">
                    {errors.usedBeds.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-surface-muted">
            <button
              type="button"
              onClick={onClose}
              className=" cursor-pointer px-5 py-2.5 text-sm font-medium text-body bg-background-second border border-border rounded-xl hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className=" cursor-pointer px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-lg active:scale-95"
            >
              {mode === "add" ? "Add Hospital" : "Update Hospital"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
