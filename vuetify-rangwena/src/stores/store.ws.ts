import { AlertResponse } from "@/components/ui.definitions";
import useAPI from "@/composables/useAPI";
import { APIS } from "@/lib/apis";
import { axiosDelete, axiosGet, axiosPatch, axiosPost } from "@/lib/lib.axios";
import socket from "@/lib/socket";
import {
  Principal,
  WSChatMessage,
  Entity,
  LocalConversationsStore,
  ConversationPartner,
  LocalConversation,
  RawWSChatMessage,
  RUser,
  Conversations,
  Poll,
  LoggedInUserPollStatus,
  PollTally,
  WSChatMessageReceipt,
} from "@/lib/types";
import { defineStore } from "pinia";

const handleRequest = useAPI();

export const useWsStore = defineStore("ws-chat", {
  state: () => ({
    _currentUser: null as Principal | null,
    _conversations: {} as LocalConversationsStore,
    _conversation: undefined as LocalConversation | undefined,
    _selectedConversationKey: undefined as string | undefined,
    _onlineUsers: [] as Entity[],
    _online: null as boolean | null,
    _polls: [] as Poll[],
  }),
  getters: {
    online(state) {
      return state._online;
    },
    onlineUsers(state) {
      return state._onlineUsers;
    },
    conversations(state) {
      return state._conversations;
    },
    conversation(state) {
      return state._conversation;
    },
    selectedConversationKey(state) {
      return state._selectedConversationKey;
    },
    activePolls(state) {
      return state._polls.filter((p) => !p.closed);
    },
    previousPolls(state) {
      return state._polls.filter((p) => p.closed);
    },
  },
  actions: {
    setCurrentUser(currentUser: Principal | null) {
      this._currentUser = currentUser;
    },
    async fetchPolls() {
      await handleRequest<Poll[]>({
        func: axiosGet,
        args: [APIS.polls.index],
      }).then((res) => {
        if (res.status === "ok" && res.result) {
          this._polls = res.result;
        }
      });
    },
    async fetchTally(pollId: string): Promise<PollTally | null> {
      return await handleRequest<PollTally>({
        func: axiosGet,
        args: [APIS.polls.tally.replace("<:pollId>", pollId)],
      }).then((res) => {
        if (res.status === "ok" && res.result) {
          return res.result;
        }
        return null;
      });
    },
    async createPoll(payload: any): Promise<AlertResponse> {
      return await handleRequest<Poll>({
        func: axiosPost,
        args: [APIS.polls.index, payload],
      }).then((res) => {
        if (res.status === "ok" && res.result) {
          this._polls.push(res.result);
          return {
            status: "success",
            message: "Successfully created a new poll.",
          };
        }

        return {
          status: "error",
          message:
            res.errors?.message ||
            "Sorry! an error occured while creating poll.",
        };
      });
    },
    async updatePoll(pollId: string, payload: any): Promise<AlertResponse> {
      return await handleRequest<Poll>({
        func: axiosPatch,
        args: [APIS.polls.retrieve.replace("<:pollId>", pollId), payload],
      }).then((res) => {
        if (res.status === "ok" && res.result) {
          const indexOfUpdatedPoll = this._polls.findIndex(
            (p) => p.id === pollId
          );
          this._polls.splice(indexOfUpdatedPoll, 1, res.result);
          return {
            status: "info",
            message: "Successfully updated poll.",
          };
        }

        return {
          status: "error",
          message:
            res.errors?.message ||
            "Sorry! an error occured while updating poll.",
        };
      });
    },
    async deletePoll(pollId: string): Promise<AlertResponse> {
      return await handleRequest<Poll>({
        func: axiosDelete,
        args: [APIS.polls.retrieve.replace("<:pollId>", pollId)],
      }).then((res) => {
        if (res.status === "ok") {
          const indexOfDeletedPoll = this._polls.findIndex(
            (p) => p.id === pollId
          );
          if (indexOfDeletedPoll >= 0) {
            this._polls.splice(indexOfDeletedPoll, 1);
            return {
              status: "warning",
              message: "Successfully deleted poll",
            };
          }
        }

        return {
          status: "error",
          message:
            res.errors?.message ||
            "Sorry! an error occured while deleting poll.",
        };
      });
    },
    async castVote(
      pollId: string,
      selectedChoice: string
    ): Promise<AlertResponse> {
      return await handleRequest<Poll>({
        func: axiosPost,
        args: [
          APIS.polls.castVote.replace("<:pollId>", pollId),
          { choice: selectedChoice },
        ],
      }).then((res) => {
        if (res.status === "ok" && res.result) {
          const indexOfCastPoll = this._polls.findIndex((p) => p.id === pollId);
          if (indexOfCastPoll >= 0) {
            this._polls.splice(indexOfCastPoll, 1, res.result);
            return {
              status: "success",
              message: "Thank you for casting your vote.",
            };
          }
        }

        return {
          status: "error",
          message:
            res.errors?.message ||
            "Sorry! an error occured while casting your vote please try again later.",
        };
      });
    },
    async fetchVoteStatus(
      pollId: string
    ): Promise<LoggedInUserPollStatus | null> {
      return await handleRequest<LoggedInUserPollStatus>({
        func: axiosGet,
        args: [APIS.polls.currentUserStatus.replace("<:pollId>", pollId)],
      }).then((res) => {
        if (res.status === "ok" && res.result) {
          return res.result;
        }

        return null;
      });
    },
    isOnline(id: string) {
      return this._onlineUsers.some((usr) => usr.id === id);
    },
    initConversations() {
      this._conversations = JSON.parse(
        localStorage.getItem("chat-messages") || "{}"
      );
    },
    sync() {
      localStorage.setItem(
        "chat-messages",
        JSON.stringify(this._conversations)
      );
    },
    initiateConversation(
      partner: ConversationPartner,
      initConversations: Conversations = []
    ) {
      const conversationKey = partner.id;
      if (!this._conversations[conversationKey]) {
        this._conversations[conversationKey] = {
          partner: partner,
          conversations: initConversations,
        };
      }
      this.bindConversationEvents(conversationKey);
      this.sync();
    },
    sendMessage(msg: WSChatMessage, partner: ConversationPartner) {
      socket.emit("chat:message:new", msg, (ack: RawWSChatMessage) => {
        if (this._conversations[msg.to]) {
          this._conversations[msg.to].conversations.push({
            ...ack,
            status: "sent",
          });
        } else {
          this._conversations[msg.to] = {
            partner: partner,
            conversations: [{ ...ack, status: "sent" }],
          };
        }
        this.sync();
      });
    },
    bindWsEvents() {
      // Listen to an initial connection
      // Emit an authentication event
      // Retrieve online users
      socket.on("connect", () => {
        this._online = true;
        // socket.emit("users:auth", this._currentUser, (res: Principal | null) => {
        //   if (res) {
        //     socket.emit("users:online", (res: Entity[]) => {
        //       this._onlineUsers = res;
        //     });
        //   }
        // });
      });

      // Handle socket exceptions
      socket.on("exception", (error) => {
        console.log("Error: ", error);
      });

      // Detect disconnecting
      socket.on("disconnect", () => {
        this._online = false;
      });

      // Subscribe to new vote casts
      socket.on("poll:vote:new", (poll: Poll) => {
        const indexOfCastPoll = this._polls.findIndex((p) => p.id === poll.id);
        if (indexOfCastPoll >= 0) {
          this._polls.splice(indexOfCastPoll, 1, poll);
        }
      });

      // Subscribe to an anonymous sender
      socket.on(
        `chat:message:new:from:anonymous:to:${this._currentUser?.id}`,
        async (msg: WSChatMessage) => {
          // Attempt to find the anonymous user from the API
          await handleRequest<RUser>({
            func: axiosGet,
            args: [APIS.users.retrieve.replace("<:userId>", msg.from)],
          }).then((res) => {
            if (res.status === "ok" && res.result) {
              // Initiate conversation and subscribe to subsequent events
              const usr = res.result;
              if (this._conversations[usr.id]) {
                this._conversations[usr.id].conversations.push({
                  ...msg,
                  status: "new",
                });
              } else {
                this.initiateConversation(usr, [{ ...msg, status: "new" }]);
              }
              this.sync();
            }
          });
        }
      );
    },
    // Subscribe to events for my previous conversations
    bindConversationsEvents() {
      Object.keys(this._conversations).forEach((key) => {
        this.bindConversationEvents(key);
      });
    },

    bindConversationEvents(conversationId: string) {
      socket.on(`user:${conversationId}:up`, (userUp: Principal) => {
        this._onlineUsers.push({ id: conversationId });
      });

      socket.on(`user:${conversationId}:down`, (userDown: Principal) => {
        this._onlineUsers = this.onlineUsers.filter(
          (usr) => usr.id !== conversationId
        );
      });

      socket.on(
        `chat:message:new:from:${conversationId}:to:${this._currentUser?.id}`,
        (msg: WSChatMessage) => {
          if (this._conversations[msg.from]) {
            this._conversations[msg.from].conversations.push({
              ...msg,
              status: "new",
            });
          }
          this.sync();
        }
      );

      socket.on(
        `chat:message:receipts:${conversationId}`,
        (receipt: WSChatMessageReceipt) => {
          console.log("Receipt: ", receipt);
          // const localConversation = this._conversations[receipt.conversationId];
          // if (localConversation) {
          //   this._conversations[receipt.conversationId] = {
          //     partner: localConversation.partner,
          //     conversations: localConversation.conversations.map((msg) => {
          //       if (msg.id === receipt.messageId) {
          //         msg.status = receipt.status;
          //       }
          //       return msg;
          //     }),
          //   };
          //   this.sync();
          // }
        }
      );
    },
    connect() {
      socket.connect();
    },
    unselectConversation() {
      this._selectedConversationKey = undefined;
      this._conversation = undefined;
    },
    selectConversation(id: string) {
      let localConversation = this._conversations[id];
      if (localConversation) {
        this._selectedConversationKey = id;
        localConversation = {
          partner: localConversation.partner,
          conversations: localConversation.conversations.map((msg) => {
            if (msg.status === "new") {
              msg.status = "viewed";
              // socket.emit(`chat:message:to:${this._currentUser?.id}:viewed:${msg.id}`)
            }
            return msg;
          }),
        };
        this._conversation = localConversation;
        this._conversations[id] = localConversation;
        this.sync();
      }
    },
    deleteConversation(conversationId: string) {
      const copy = { ...this._conversations };
      delete copy[conversationId];
      this._conversations = copy;
      this.sync();
    },
  },
});
