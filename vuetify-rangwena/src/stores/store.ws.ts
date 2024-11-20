import useAPI from "@/composables/useAPI";
import { APIS } from "@/lib/apis";
import { axiosGet } from "@/lib/lib.axios";
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
} from "@/lib/types";
import { defineStore } from "pinia";

const handleRequest = useAPI();

export const useWsStore = defineStore("ws-chat", {
  state: () => ({
    _conversations: {} as LocalConversationsStore,
    _conversation: undefined as LocalConversation | undefined,
    _selectedConversationKey: undefined as string | undefined,
    _onlineUsers: [] as Entity[],
    _online: null as boolean | null,
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
  },
  actions: {
    isOnline(id: string) {
      return this.onlineUsers.some((usr) => usr.id === id);
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
      currentUser: Principal,
      initConversations: Conversations = []
    ) {
      const conversationKey = partner.id;
      if (!this._conversations[conversationKey]) {
        this._conversations[conversationKey] = {
          partner: partner,
          conversations: initConversations,
        };
      }
      this.bindConversationEvents(conversationKey, currentUser);
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
    bindWsEvents(currentUser: Principal) {
      // Listen to an initial connection
      // Emit an authentication event
      // Retrieve online users
      socket.on("connect", () => {
        this._online = true;
        socket.emit("users:auth", currentUser, (res: Principal | null) => {
          if (res) {
            socket.emit("users:online", (res: Entity[]) => {
              this._onlineUsers = res;
            });
          }
        });
      });

      // Handle socket exceptions
      socket.on("exception", (error) => {
        console.log("Error: ", error);
      });

      // Detect disconnecting
      socket.on("disconnect", () => {
        this._online = false;
      });

      // Subscribe to an anonymous sender
      socket.on(
        `chat:message:new:from:anonymous:to:${currentUser.id}`,
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
                this.initiateConversation(usr, currentUser, [
                  { ...msg, status: "new" },
                ]);
              }
              this.sync();
            }
          });
        }
      );
    },
    // Subscribe to events for my previous conversations
    bindConversationsEvents(currentUser: Principal) {
      Object.keys(this._conversations).forEach((key) => {
        this.bindConversationEvents(key, currentUser);
      });
    },

    bindConversationEvents(conversationId: string, currentUser: Principal) {
      socket.on(`user:${conversationId}:up`, (userUp: Principal) => {
        this._onlineUsers.push(userUp);
      });

      socket.on(`user:${conversationId}:down`, (userDown: Principal) => {
        this._onlineUsers = this.onlineUsers.filter(
          (usr) => usr.id !== userDown.id
        );
      });

      socket.on(
        `chat:message:new:from:${conversationId}:to:${currentUser.id}`,
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

      // socket.on(`chat:message:sent:${conv}`, (msg: WSChatMessage) => {});
      // socket.on(`chat:message:delivered:${conv}`, (msg: WSChatMessage) => {});
      // socket.on(`chat:message:viewed:${conv}`, (msg: WSChatMessage) => {});
    },
    connect() {
      socket.connect();
    },
    unselectConversation() {
      this._selectedConversationKey = undefined;
      this._conversation = undefined;
    },
    selectConversation(id: string) {
      const localConversation = this._conversations[id] || [];
      this._selectedConversationKey = id;
      this._conversation = localConversation;
    },
    deleteConversation(conversationId: string) {
      const copy = { ...this._conversations };
      delete copy[conversationId];
      this._conversations = copy;
      this.sync();
    },
  },
});
