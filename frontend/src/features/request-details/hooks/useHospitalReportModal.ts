import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import { toast } from "sonner";
import { getApiUrl } from "@/config/api.config";
import { getAuthToken } from "@/features/auth/utils/auth.utils";

const REPORT_STATUS_OPTIONS = [
  "Stable",
  "Critical",
  "Under Observation",
  "Transferred",
] as const;

export type HospitalReportStatus = (typeof REPORT_STATUS_OPTIONS)[number];

export const hospitalReportStatusOptions = REPORT_STATUS_OPTIONS.map((option) => ({
  label: option,
  value: option,
}));

type HospitalReportFormErrors = {
  dischargedAt?: string;
  status?: string;
  treatment?: string;
  submit?: string;
};

type UseHospitalReportModalParams = {
  isOpen: boolean;
  requestId: string;
  initialArrivalTime?: string;
  onSuccess: () => void;
};

function toDateTimeLocal(value?: string) {
  if (!value) {
    return "";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const timezoneOffset = parsedDate.getTimezoneOffset() * 60000;
  return new Date(parsedDate.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

function toErrorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return "Failed to submit report. Please try again.";
  }

  if (typeof error.response?.data === "string") {
    return error.response.data;
  }

  const data = error.response?.data as { message?: string } | undefined;
  return data?.message || "Failed to submit report. Please try again.";
}

export function useHospitalReportModal({
  isOpen,
  requestId,
  initialArrivalTime,
  onSuccess,
}: UseHospitalReportModalParams) {
  const [arrivedAt, setArrivedAt] = useState("");
  const [dischargedAt, setDischargedAt] = useState("");
  const [status, setStatus] = useState<"" | HospitalReportStatus>("");
  const [treatment, setTreatment] = useState("");
  const [errors, setErrors] = useState<HospitalReportFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setArrivedAt(toDateTimeLocal(initialArrivalTime));
    setDischargedAt("");
    setStatus("");
    setTreatment("");
    setErrors({});
    setIsSubmitting(false);
  }, [isOpen, initialArrivalTime]);

  const validate = () => {
    const nextErrors: HospitalReportFormErrors = {};

    if (!dischargedAt) {
      nextErrors.dischargedAt = "Discharge time is required.";
    }

    if (!status) {
      nextErrors.status = "Status is required.";
    }

    if (!treatment.trim()) {
      nextErrors.treatment = "Treatment is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const updateArrivedAt = (value: string) => {
    setArrivedAt(value);
    setErrors((previous) => ({ ...previous, submit: undefined }));
  };

  const updateDischargedAt = (value: string) => {
    setDischargedAt(value);
    setErrors((previous) => ({
      ...previous,
      dischargedAt: undefined,
      submit: undefined,
    }));
  };

  const updateStatus = (value: string) => {
    setStatus(value as HospitalReportStatus);
    setErrors((previous) => ({
      ...previous,
      status: undefined,
      submit: undefined,
    }));
  };

  const updateTreatment = (value: string) => {
    setTreatment(value);
    setErrors((previous) => ({
      ...previous,
      treatment: undefined,
      submit: undefined,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const token = getAuthToken();

    if (!token) {
      setErrors({ submit: "Authentication token not found. Please sign in again." });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await axios.post(
        getApiUrl("/api/requests/" + requestId + "/report"),
        {
          arrivedAt: arrivedAt ? new Date(arrivedAt).toISOString() : null,
          dischargedAt: new Date(dischargedAt).toISOString(),
          status,
          treatment: treatment.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        },
      );

      onSuccess();
      toast.success("Hospital report submitted successfully.");
    } catch (error) {
      setErrors({ submit: toErrorMessage(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    arrivedAt,
    dischargedAt,
    status,
    treatment,
    errors,
    isSubmitting,
    statusOptions: hospitalReportStatusOptions,
    updateArrivedAt,
    updateDischargedAt,
    updateStatus,
    updateTreatment,
    handleSubmit,
  };
}
