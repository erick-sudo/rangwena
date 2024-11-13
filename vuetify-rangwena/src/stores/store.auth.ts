import { AlertResponse } from "@/components/ui.definitions";
import useAPI from "@/composables/useAPI";
import { APIS } from "@/lib/apis";
import { axiosGet, axiosPost } from "@/lib/lib.axios";
import {
  AuthenticationContext,
  LoginForm,
  ResetPasswordForm,
} from "@/lib/types";
import { defineStore } from "pinia";
const handleRequest = useAPI();

export const useAuthStore = defineStore("auth", {
  state: () => ({
    auth: null as AuthenticationContext | null,
  }),
  getters: {
    principal(state) {
      return state.auth?.principal;
    },
    isAdmin(state) {
      return state.auth?.authorities.some((a) => a.name === "ROLE_ADMIN");
    },
    authorities(state) {
      return state.auth?.authorities;
    },
  },
  actions: {
    clear() {
      this.auth = null;
    },
    async login(payload: LoginForm): Promise<AlertResponse> {
      return await handleRequest<any>({
        func: axiosPost,
        args: [APIS.account.signin, payload],
      }).then(async (res) => {
        if (res.status === "ok") {
          // Fetch the details of the just logged in user
          await this.fetchCurrentUser();
          return {
            status: "success",
            message: "Signed in successfully.",
          };
        }
        return {
          status: "error",
          message: res.errors.message || "Could not sign in.",
        };
      });
    },
    async fetchCurrentUser() {
      await handleRequest<AuthenticationContext>({
        func: axiosGet,
        args: [APIS.account.currentUser],
      }).then((data) => {
        if (data.status === "ok" && data.result) {
          this.auth = data.result;
        } else {
          this.clear();
        }
      });
    },
    async signout(): Promise<AlertResponse> {
      return await handleRequest({
        func: axiosGet,
        args: [APIS.account.signout],
      }).then((res) => {
        if (res.status === "ok") {
          this.clear();
          return {
            status: "success",
            message: "Signed out successfully.",
          };
        }
        return {
          status: "error",
          message: res.errors.message || "Could not sign out.",
        };
      });
    },
    async requestPasswordReset(identity: string): Promise<AlertResponse> {
      return await handleRequest<{ message: string }>({
        func: axiosPost,
        args: [APIS.account.requestPasswordReset, { identity }],
      }).then((res) => {
        if (res.status === "ok") {
          this.clear();
          return {
            status: "success",
            message:
              res.result?.message ||
              "Please follow the instructions sent to your email to reset your password.",
          };
        }
        return {
          status: "error",
          message:
            res.errors.message ||
            "Could not satisfy your request. Please  try again later.",
        };
      });
    },
    async resetPassword(payload: ResetPasswordForm): Promise<AlertResponse> {
      return await handleRequest<{ message: string }>({
        func: axiosPost,
        args: [APIS.account.resetPassword, payload],
      }).then((res) => {
        if (res.status === "ok") {
          this.clear();
          return {
            status: "success",
            message:
              res.result?.message ||
              "You have successfully reset your password.",
          };
        }
        return {
          status: "error",
          message:
            res.errors.message ||
            "Could not satisfy your request. Please  try again later.",
        };
      });
    },
  },
});
