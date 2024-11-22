import { AlertResponse } from "@/components/ui.definitions";
import useAPI from "@/composables/useAPI";
import { APIS } from "@/lib/apis";
import { axiosDelete, axiosGet, axiosPatch, axiosPost } from "@/lib/lib.axios";
import { Activity, CreateActivity } from "@/lib/types";
import { defineStore } from "pinia";

const handleRequest = useAPI();
export const useActivityStore = defineStore("activities", {
  state: () => ({
    _activities: [] as Activity[],
  }),
  getters: {
    planned(state) {
      return state._activities.filter((a) => !!!a.completed);
    },
    previous(state) {
      return state._activities.filter((a) => !!a.completed);
    },
  },
  actions: {
    async fetchActivities() {
      return await handleRequest<Activity[]>({
        func: axiosGet,
        args: [APIS.activities.index],
      }).then((res) => {
        if (res.status === "ok" && res.result) {
          this._activities = res.result;
        }
      });
    },
    async update(activityId: string, payload: Record<string, string>) {
      return await handleRequest<Activity>({
        func: axiosPatch,
        args: [
          APIS.activities.retrieve.replace("<:activityId>", activityId),
          payload,
        ],
      }).then((res) => {
        if (res.status === "ok" && res.result) {
          const updatedActivity = res.result;
          const indexOfStaleActivity = this._activities.findIndex(
            (s) => s.id === updatedActivity.id
          );
          this._activities.splice(indexOfStaleActivity, 1, updatedActivity);
          return true;
        }

        return false;
      });
    },
    async delete(activityId: string): Promise<AlertResponse> {
      return await handleRequest<any>({
        func: axiosDelete,
        args: [APIS.activities.retrieve.replace("<:activityId>", activityId)],
      }).then((res) => {
        if (res.status === "ok") {
          const indexOfStaleActivity = this._activities.findIndex(
            (s) => s.id === activityId
          );
          this._activities.splice(indexOfStaleActivity, 1);
          return {
            status: "success",
            message:
              res.result?.message || "You have just deleted an activity.",
          };
        }
        return {
          status: "error",
          message:
            res.errors?.message || "Sorry! We could not delete the activity.",
        };
      });
    },
    async addActivity(payload: CreateActivity): Promise<AlertResponse> {
      return await handleRequest<any>({
        func: axiosPost,
        args: [APIS.activities.index],
      }).then((res) => {
        if (res.status === "ok") {
          return {
            status: "success",
            message:
              res.result?.message || "Successfully created a new activity.",
          };
        }
        return {
          status: "error",
          message: res.errors?.message || "Failed to create activity.",
        };
      });
    },
  },
});
