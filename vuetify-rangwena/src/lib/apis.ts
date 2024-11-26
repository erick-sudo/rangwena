export const apiHost = `${import.meta.env.VITE_NEST_HOST}`;

export const APIS = {
  account: {
    signin: `${apiHost}/auth/signin`,
    signup: `${apiHost}/auth/signup`,
    currentUser: `${apiHost}/auth/current-user`,
    signout: `${apiHost}/auth/signout`,
    requestPasswordReset: `${apiHost}/auth/request-password-reset`,
    resetPassword: `${apiHost}/auth/reset-password`,
    requestAuthenticatedOtp: `${apiHost}/auth/request-otp/authenticated`,
    requestPublicOtp: `${apiHost}/auth/request-otp/public`,
  },
  init: {
    indexBrief: `${apiHost}/users/index/brief`,
    index: `${apiHost}/users`,
    retrieve: `${apiHost}/users/<:id>`,
  },
  users: {
    index: `${apiHost}/users`,
    retrieve: `${apiHost}/users/<:userId>`,
    checkExists: `${apiHost}/users/check/exists`,
  },
  suggestions: {
    index: `${apiHost}/suggestions`,
    retrieve: `${apiHost}/suggestions/<:suggestionId>`,
    likes: `${apiHost}/suggestions/<:suggestionId>/toggle`,
    countReactions: `${apiHost}/suggestions/<:suggestionId>/count-reactions`,
  },
  activities: {
    index: `${apiHost}/activities`,
    retrieve: `${apiHost}/activities/<:activityId>`,
  },
  polls: {
    index: `${apiHost}/polls`,
    retrieve: `${apiHost}/polls/<:pollId>`,
    currentUserStatus: `${apiHost}/polls/<:pollId>/current-user-status`,
    castVote: `${apiHost}/polls/<:pollId>/cast-vote`,
    tally: `${apiHost}/polls/<:pollId>/tally`,
  },
};
