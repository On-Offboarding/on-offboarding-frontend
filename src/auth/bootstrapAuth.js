import { msalInstance } from "./msalConfig";
import { syncCurrentUser } from "../Api/services/userService";

export const initAuth = async () => {
  await msalInstance.initialize();
  const response = await msalInstance.handleRedirectPromise();

  if (response?.account) {
    msalInstance.setActiveAccount(response.account);
    return await syncCurrentUser();
  } else {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      msalInstance.setActiveAccount(accounts[0]);
    }
  }

  return null;
};