import "./styles/index.css";

import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";

import router from "./app/routes/Router";
import { store } from "./app/store/store";
import { AuthProvider } from "./app/provider/AuthContext";

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <div className="min-h-screen bg-white dark:bg-gray-900">
          <RouterProvider router={router} />
        </div>
      </AuthProvider>
    </Provider>
  );
}

export default App;
