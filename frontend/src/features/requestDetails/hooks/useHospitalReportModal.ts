import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import { toast } from "sonner";
import { getApiUrl, API_CONFIG } from "@/config/api.config";
import { getAuthToken } from "@/features/auth/utils/auth.utils";
import type { TripReport } from "../types/requestDetails.types";

type FormErrors = {
  admissionTime?: string;
  dischargeTime?: string;
  medicalProcedures?: string;
  submit?: string;
};

type UseHospitalReportModalParams = {
  isOpen: boolean;
  requestId: number;
  hospitalId: number | null;
  existingReport: TripReport | null;
  onSuccess: () => void;
};

function toDateTimeLocal(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 16);
}

function toErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) return "Failed to submit report. Please try again.";
  const data = error.response?.data as { message?: string; title?: string } | string | undefined;
  if (typeof data === "string") return data;
  return data?.message || data?.title || "Failed to submit report. Please try again.";
}

export function useHospitalReportModal({
  isOpen,
  requestId,
  hospitalId,
  existingReport,
  onSuccess,
}: UseHospitalReportModalParams) {
  const isEdit = existingReport !== null;

  const [admissionTime, setAdmissionTime] = useState("");
  const [dischargeTime, setDischargeTime] = useState("");
  const [medicalProcedures, setMedicalProcedures] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate fields when modal opens
  useEffect(() => {
    if (!isOpen) return;
    setAdmissionTime(toDateTimeLocal(existingReport?.admissionTime));
    setDischargeTime(toDateTimeLocal(existingReport?.dischargeTime));
    setMedicalProcedures(existingReport?.medicalProcedures ?? "");
    setErrors({});
    setIsSubmitting(false);
  }, [isOpen, existingReport]);

  function validate(): boolean {
    const next: FormErrors = {};
    if (!admissionTime) next.admissionTime = "Admission time is required.";
    if (!dischargeTime) next.dischargeTime = "Discharge time is required.";
    if (!medicalProcedures.trim()) next.medicalProcedures = "Medical procedures are required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    const token = getAuthToken();
    if (!token) {
      setErrors({ submit: "Authentication token not found. Please sign in again." });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    const body = {
      requestId,
      hospitalId: hospitalId ?? 0,
      medicalProcedures: medicalProcedures.trim(),
      admissionTime: new Date(admissionTime).toISOString(),
      dischargeTime: new Date(dischargeTime).toISOString(),
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      if (isEdit && existingReport) {
        await axios.put(
          getApiUrl(API_CONFIG.ENDPOINTS.REQUESTS.UPDATE_TRIP_REPORT(existingReport.id)),
          body,
          { headers },
        );
        toast.success("Trip report updated successfully.");
      } else {
        await axios.post(
          getApiUrl(API_CONFIG.ENDPOINTS.REQUESTS.CREATE_TRIP_REPORT),
          body,
          { headers },
        );
        toast.success("Trip report submitted successfully.");
      }
      onSuccess();
    } catch (error) {
      setErrors({ submit: toErrorMessage(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isEdit,
    admissionTime,
    dischargeTime,
    medicalProcedures,
    errors,
    isSubmitting,
    setAdmissionTime: (v: string) => { setAdmissionTime(v); setErrors((p) => ({ ...p, admissionTime: undefined, submit: undefined })); },
    setDischargeTime: (v: string) => { setDischargeTime(v); setErrors((p) => ({ ...p, dischargeTime: undefined, submit: undefined })); },
    setMedicalProcedures: (v: string) => { setMedicalProcedures(v); setErrors((p) => ({ ...p, medicalProcedures: undefined, submit: undefined })); },
    handleSubmit,
  };
}
