import * as Joi from "joi";

export interface Entity {
  id: string;
}

export interface Principal extends Entity {
  email: string;
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
