import MyTabs from './MyTabs.tsx';
import { useAuth } from "react-oidc-context";
import './App.css';
import { useEffect } from 'react';

function App() {

  const auth = useAuth();

  useEffect(() => {
    // Listen for background refresh (silent renew) failures
    return auth.events.addSilentRenewError((error) => {
      console.error("Background token refresh failed:", error);

      // If it's a network/CORS failure overnight, automatically bounce them to login
      if (error.message.includes("NetworkError") || error.message.includes("fetch")) {
        auth.signinRedirect();
      }
    });
  }, [auth]);

/*
  const signOutRedirect = () => {
    const clientId = "6dmaip976mpqdf8tjs0q6n15qj";
    const logoutUri = "<logout uri>";
    const cognitoDomain = "https://<user pool domain>";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };
*/

  if (auth.isLoading) {
    return <div>載入中 Auth loading...</div>;
  }

  if (auth.error) {
    if (auth.error.message.includes("NetworkError")) {
      return (<>
        <h1>川榮引用 Welcome to Quote Central!</h1>
        <button onClick={() => auth.signinRedirect()}>登入 Sign Back in</button>
      </>);
    }
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <main>
        <MyTabs />
      </main>
    );
  }

  return (<>
    <h1>川榮引用 Welcome to Quote Central!</h1>
    <button onClick={() => auth.signinRedirect()}>登入 Sign in</button>
  </>);
  //      <button onClick={() => void auth.removeUser()}>Log out</button>
}

export default App;
