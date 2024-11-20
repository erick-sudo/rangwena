import useAPI from "@/composables/useAPI";
import { APIS } from "@/lib/apis";
import { axiosGet } from "@/lib/lib.axios";
import { RUser } from "@/lib/types";
import { defineStore } from "pinia";

const handleRequest = useAPI();
export const useMemberStore = defineStore("memebers", {
  state: () => ({
    _members: [] as RUser[],
  }),
  getters: {
    members(state) {
      return state._members;
    },
  },
  actions: {
    async fetchMembers() {
      return await handleRequest<RUser[]>({
        func: axiosGet,
        args: [APIS.users.index],
      }).then((res) => {
        if (res.status === "ok" && res.result) {
          this._members = res.result;
        }
      });
    },
  },
});
