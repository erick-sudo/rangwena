export const baseUrl = `${import.meta.env.VITE_NEST_API}`;

export const APIS = {
  account: {
    signin: `${baseUrl}/auth/signin`,
    signup: `${baseUrl}/auth/signup`,
    currentUser: `${baseUrl}/auth/current-user`,
    signout: `${baseUrl}/auth/signout`,
    requestPasswordReset: `${baseUrl}/auth/request-password-reset`,
    resetPassword: `${baseUrl}/auth/reset-password`,
  },
};
