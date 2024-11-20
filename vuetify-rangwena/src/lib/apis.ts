export const apiHost = `${import.meta.env.VITE_NEST_HOST}`;

export const APIS = {
  account: {
    signin: `${apiHost}/auth/signin`,
    signup: `${apiHost}/auth/signup`,
    currentUser: `${apiHost}/auth/current-user`,
    signout: `${apiHost}/auth/signout`,
    requestPasswordReset: `${apiHost}/auth/request-password-reset`,
    resetPassword: `${apiHost}/auth/reset-password`,
  },
  users: {
    index: `${apiHost}/users`,
    retrieve: `${apiHost}/users/<:userId>`,
  },
};
