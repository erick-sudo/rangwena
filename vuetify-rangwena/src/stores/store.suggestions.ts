import { AlertResponse } from "@/components/ui.definitions";
import useAPI from "@/composables/useAPI";
import { APIS } from "@/lib/apis";
import { axiosDelete, axiosGet, axiosPatch, axiosPost } from "@/lib/lib.axios";
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
    async update(suggestionId: string, payload: Record<string, string>) {
      return await handleRequest<Suggestion>({
        func: axiosPatch,
        args: [
          APIS.suggestions.retrieve.replace("<:suggestionId>", suggestionId),
          payload,
        ],
      }).then((res) => {
        if (res.status === "ok" && res.result) {
          const updatedSugestion = res.result;
          const indexOfStaleSuggestion = this._suggestions.findIndex(
            (s) => s.id === updatedSugestion.id
          );
          this._suggestions.splice(indexOfStaleSuggestion, 1, updatedSugestion);
          return true;
        }

        return false;
      });
    },
    async delete(suggestionId: string): Promise<AlertResponse> {
      return await handleRequest<any>({
        func: axiosDelete,
        args: [
          APIS.suggestions.retrieve.replace("<:suggestionId>", suggestionId),
        ],
      }).then((res) => {
        if (res.status === "ok") {
          const indexOfStaleSuggestion = this._suggestions.findIndex(
            (s) => s.id === suggestionId
          );
          this._suggestions.splice(indexOfStaleSuggestion, 1);
          return {
            status: "success",
            message:
              res.result?.message || "You have just deleted a suggestion.",
          };
        }
        return {
          status: "error",
          message:
            res.errors?.message || "Sorry! We could not delete the suggestion.",
        };
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
