import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default PublicLayout;