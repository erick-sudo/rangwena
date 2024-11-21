import { AlertResponse } from "@/components/ui.definitions";
import useAPI from "@/composables/useAPI";
import { APIS } from "@/lib/apis";
import { axiosGet, axiosPost } from "@/lib/lib.axios";
import {
  CreateSuggestion,
  Suggestion,
  SuggestionToggleAction,
} from "@/lib/types";
import { defineStore } from "pinia";

const handleRequest = useAPI();
export const useSuggestionStore = defineStore("suggestions", {
  state: () => ({
    _suggestions: [] as Suggestion[],
  }),
  getters: {
    suggestions(state) {
      return state._suggestions;
    },
  },
  actions: {
    async fetchSuggestions() {
      return await handleRequest<Suggestion[]>({
        func: axiosGet,
        args: [APIS.suggestions.index],
      }).then((res) => {
        if (res.status === "ok" && res.result) {
          this._suggestions = res.result;
        }
      });
    },
    async addSuggestion(
      payload: CreateSuggestion,
      user: string
    ): Promise<AlertResponse> {
      return await handleRequest<any>({
        func: axiosPost,
        args: [APIS.suggestions.index, { ...payload, user }],
      }).then((res) => {
        if (res.status === "ok") {
          return {
            status: "success",
            message: res.result?.message || "Thank you for your suggestion.",
          };
        }
        return {
          status: "error",
          message:
            res.errors?.message || "Sorry! Your suggestion was not recorded.",
        };
      });
    },
    async toggle(suggestion: Suggestion, action: SuggestionToggleAction) {
      await handleRequest<Suggestion>({
        func: axiosPost,
        args: [
          APIS.suggestions.likes.replace("<:suggestionId>", suggestion.id),
          { action },
        ],
      }).then((res) => {
        if (res.status === "ok" && res.result) {
          const updatedSugestion = res.result;
          const indexOfStaleSuggestion = this._suggestions.findIndex(
            (s) => s.id === updatedSugestion.id
          );
          this._suggestions.splice(indexOfStaleSuggestion, 1, updatedSugestion);
        }
      });
    },
  },
});
