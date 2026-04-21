import { PublicClientApplication } from "@azure/msal-browser";

export const msalInstance = new PublicClientApplication({
  auth: {
    clientId: "44a194a3-d54b-41e4-905f-05d9f9094e34",
    authority: "https://login.microsoftonline.com/f622d913-8a09-415f-a525-b65e4ba829c5/v2.0",
    redirectUri: "http://localhost:5173"
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false
  }
});

export const loginRequest = {
  scopes: ["api://982061fd-95fa-4903-8695-954bebad6c39/access_as_user"],
};
