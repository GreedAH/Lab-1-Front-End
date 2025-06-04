import { UserProvider } from "@/contexts/UserContext";
import { AppRouter } from "@/routes";

function App() {
  return (
    <UserProvider>
      <AppRouter />
    </UserProvider>
  );
}

export default App;
