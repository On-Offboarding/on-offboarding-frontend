import { msalInstance, loginRequest } from "./msalConfig.js";

export const getAccessToken = async () => {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length === 0) {
    throw new Error("No user logged in");
  }

  const response = await msalInstance.acquireTokenSilent({
    ...loginRequest,
    account: accounts[0]
  });
  
  return response.accessToken;
};