import { useEffect, useState } from "react";
import { getMe } from "./api.js";
import LoginForm from "./components/LoginForm.jsx";
import LeadsPage from "./components/LeadsPage.jsx";

export default function App() {
  // undefined = still checking, null = logged out, object = logged in
  const [user, setUser] = useState(undefined);
  const [bootError, setBootError] = useState("");

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch((err) => {
        if (err.status !== 401) setBootError(err.message);
        setUser(null);
      });
  }, []);

  if (user === undefined) {
    return <div className="center muted">Loading…</div>;
  }

  if (!user) {
    return <LoginForm onLogin={setUser} notice={bootError} />;
  }

  return <LeadsPage user={user} onLoggedOut={() => setUser(null)} />;
}
