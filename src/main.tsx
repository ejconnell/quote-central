import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { AuthProvider, AuthProviderProps } from "react-oidc-context";

const remoteCognitoAuthConfig: AuthProviderProps = {
  authority: "https://cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_VQ0eXINVn",
  client_id: "6dmaip976mpqdf8tjs0q6n15qj",
  redirect_uri: "https://main.d2c06f7nh1jalc.amplifyapp.com",
  response_type: "code",
  scope: "phone openid email",
};

const localhostCognitoAuthConfig: AuthProviderProps = {
  authority: "https://cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_VQ0eXINVn",
  client_id: "3h66igtcn7d3819or7a8ftfemc",
  redirect_uri: "http://localhost:5173/",
  response_type: "code",
  scope: "email openid phone",
};

const cognitoAuthConfig = window.location.hostname === "localhost" ? localhostCognitoAuthConfig : remoteCognitoAuthConfig;

cognitoAuthConfig.onSigninCallback = (_user) => {
    window.history.replaceState(
      {},
      document.title,
      window.location.pathname
    );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
