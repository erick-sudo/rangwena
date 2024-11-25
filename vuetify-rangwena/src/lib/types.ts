import * as Joi from "joi";

export interface Entity {
  id: string;
}

export interface Principal extends Entity {
  email: string;
  username: string;
}

export interface Initials {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface TimeStamps {
  createdAt: string;
  updatedAt: string;
}

export interface GrantedAuthority extends Entity, TimeStamps {
  name: string;
}

export type Role = GrantedAuthority;

// Authentication context
export interface AuthenticationContext {
  principal: Principal;
  authorities: GrantedAuthority[];
  initials: Initials;
}

export interface RUser extends Entity, TimeStamps {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
}

export interface LoginForm {
  identity: string;
  password: string;
  rememberMe?: boolean;
}

export interface ResetPasswordForm {
  newPassword: string;
  confirmNewPassword: string;
  otp: string;
}

export const loginSchema = Joi.object({
  identity: Joi.string().required().messages({
    "string.identity": "at least one of username, email, or phone is required",
  }),
  password: Joi.string()
    .min(8)
    .required()
    .messages({ "string.min": "Weak password" }),
});

export type SuggestionToggleAction =
  | "dismiss"
  | "like"
  | "dislike"
  | "resolve"
  | "unresolve";

export type MessageStatus =
  | "new"
  | "draft"
  | "pending"
  | "sent"
  | "delivered"
  | "viewed";

export interface RawWSChatMessage {
  from: string;
  to: string;
  conversationType: ConversationType;
  content: string;
  time: string;
}

export interface WSChatMessage extends RawWSChatMessage {
  status: MessageStatus;
}

export type Conversations = WSChatMessage[];

export type ConversationPartner = RUser;

export interface LocalConversation {
  partner: ConversationPartner;
  conversations: Conversations;
}

export type LocalConversationsStore = Record<string, LocalConversation>;

export type ChatMessagePosition = "left" | "right";
export type ConversationType = "individual" | "channel";

export interface UIChatMessage extends WSChatMessage {
  pos: ChatMessagePosition;
  next: boolean;
  prev: boolean;
}

export interface CreateSuggestion {
  title: string;
  description: string;
}

export interface Suggestion extends Entity, TimeStamps, CreateSuggestion {
  userId: string;
  resolved: boolean;
  user: string;
}

export interface SuggestionReactions {
  like: boolean;
  dislike: boolean;
  me: "like" | "dislike" | null;
}

export interface CreateActivity {
  title: string;
  description: string;
  date: Date;
}

export interface Activity extends Entity, CreateActivity, TimeStamps {
  completed: boolean;
}

export type PollTally = Record<string, number>;

export interface Poll extends Entity {
  title: string;
  description: string;
  choices: PollChoice[];
  totalNumberOfvoters: number;
  closed: boolean;
}

export interface PollChoice extends Entity {
  value: string;
  pollId?: string;
}

export interface LoggedInUserPollStatus {
  voted: boolean;
}

export interface CreatePoll {
  title: string;
  description: string;
  totalNumberOfvoters: number;
}
