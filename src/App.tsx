import "./styles/index.css";
// import "./styles/themes.css";

import { RouterProvider } from "react-router";
import router from "./app/routes/Router.tsx";

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* <SignUp /> */}

      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
