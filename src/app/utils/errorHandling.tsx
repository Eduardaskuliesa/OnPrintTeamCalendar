/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "react-toastify";

export const ErrorMessages = {
  UPDATE_STATUS: {
    SUCCESS: "Statusas buvo pakeistas",
    ERROR: "Klaida keičiant statusą",
  },
  GAP_RULES: {
    SUCCESS: "Atostogų tarpas buvo pakeistas",
    ERROR: "Klaida keičiant atostogų tarpą",
    NO_CHANGES: "Nepadarėte jokiu pakeitimu",
  },
  OVERLAP_RULES: {
    SUCCESS: "Maksimalus vienlaikių atostogų skaičius pakeistas",
    ERROR: "Klaida keičiant maksimalų vienlaikių atostogų skaičių",
    NO_CHANGES: "Nepadarėte jokiu pakeitimu",
  },
  BOOKING_RULES: {
    SUCCESS: "Atostogu taisykles buvo pakeistos",
    ERROR: "Klaida keičiant atostogų taisyklės",
    NO_CHANGES: "Nepadarėte jokiu pakeitimu",
  },
  SEASONAL_RULES: {
    SUCCESS: "Atnaujinta",
    ERROR: "KLAIDA",
    NO_CHANGES: "Nepadarėte jokiu pakeitimu",
  },
  RESTRICTED_DAYS: {
    SUCCESS: "Atnaujinta",
    ERROR: "KLAIDA",
    NO_CHANGES: "Nepadarėte jokiu pakeitimu",
  },
} as const;

interface ErrorHandlerOptions {
  onSuccess?: () => void;
  onError?: () => void;
}

export const handleMutationResponse = (
  success: boolean,
  messages: { SUCCESS: string; ERROR: string },
  options?: ErrorHandlerOptions
) => {
  if (success) {
    toast.success(messages.SUCCESS);
    options?.onSuccess?.();
  } else {
    toast.error(messages.ERROR);
    options?.onError?.();
  }
};

export const handleNoChanges = (message: string) => {
  toast.info(message);
  return false;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly details?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const errorHandler = (error: unknown) => {
  console.error("Error occurred:", error);

  if (error instanceof ApiError) {
    toast.error(error.message);
    return;
  }

  if (error instanceof Error) {
    toast.error("Įvyko klaida: " + error.message);
    return;
  }

  toast.error("Įvyko nenumatyta klaida");
};
