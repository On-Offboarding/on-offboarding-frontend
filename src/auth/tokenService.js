import { msalInstance, loginRequest } from "./msalConfig.js";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

export const getAccessToken = async () => {
  const account = msalInstance.getActiveAccount();
  if (!account) {
    await msalInstance.loginRedirect(loginRequest);
    return;
  }

  try {
    const response = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account
    });
    return response.accessToken;
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      await msalInstance.loginRedirect({ ...loginRequest, account });
    } else {
      throw error;
    }
  }
};