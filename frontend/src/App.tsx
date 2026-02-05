import "./styles/index.css";

import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";

import router from "./app/routes/Router";
import { store } from "./app/store/store";

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <RouterProvider router={router} />
      </div>
    </Provider>
  );
}

export default App;
