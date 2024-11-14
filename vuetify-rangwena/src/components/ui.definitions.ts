export interface AlertResponse {
  status:
    | "success"
    | "error"
    | "warning"
    | "info"
    // | "success-fill"
    // | "error-fill"
    // | "warning-fill"
    // | "info-fill";
  message: any;
}

export type DeleteResponse = AlertResponse;
