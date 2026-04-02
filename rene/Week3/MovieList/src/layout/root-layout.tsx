import Navbar from "../components/NavBar";
import { Outlet } from "react-router-dom";
import ScrollToTopButton from "../components/ScrollToTopButton";

const RootLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <ScrollToTopButton />
    </>
  );
};

export default RootLayout;