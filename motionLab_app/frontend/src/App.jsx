import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <div className="h-screen w-screen overflow-x-hidden">
      <Outlet />
    </div>
  );
}

export default App;
