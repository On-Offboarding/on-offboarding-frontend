import { msalInstance, loginRequest } from "./msalConfig.js";

export const getAccessToken = async () => {
  const accounts = msalInstance.getAllAccounts();
    console.log(msalInstance.getAllAccounts());
  if (accounts.length === 0) {
    console.log('KONTON =>', accounts)
    throw new Error("No user logged in");
  }

  const response = await msalInstance.acquireTokenSilent({
    ...loginRequest,
    account: accounts[0]
  });

  return response.accessToken;
};