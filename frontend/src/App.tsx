import "./styles/index.css";

import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";

import router from "./app/routes/Router";
import { store } from "./app/store/store";
import { AuthProvider } from "./app/provider/AuthContext";
import { LanguageProvider } from "./i18n/LanguageProvider";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <LanguageProvider>
      <Provider store={store}>
        <AuthProvider>
          <div className="min-h-screen bg-white  dark:bg-gray-900">
            <RouterProvider router={router} />
             <Toaster />
          </div>
        </AuthProvider>
      </Provider>
    </LanguageProvider>
  );
}

export default App;

