import { useEffect, useState } from "react";
import SideNav from "../components/mail/SideNav";
import Header from '../components/mail/Header'
import { useLocation, useNavigate } from "react-router-dom";
import NoView from "../components/mail/NoView";
import InboxView from "../components/mail/InboxView";

function Mail() {
  const Navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  useEffect(() => {
    if (!token) {
      Navigate("/login");
    }
    if (token) {
      localStorage.setItem("token", `Bearer ${token}`);
    }
  }, [token]);

  const [selectedComponent, setSelectedComponent] = useState('/'); 

  const handleMenuItemClick = (path) => {
    setSelectedComponent(path);
  };

  return (
    <div className="h-screen w-screen dark:bg-black bg-white pl-14">
      <SideNav onMenuItemClick={handleMenuItemClick} />
      <Header />
      <div>
        {selectedComponent === "/" && <NoView />}
        {selectedComponent === "/search" && <NoView />}
        {selectedComponent === "/mail" && <NoView />}
        {selectedComponent === "/send" && <NoView />}
        {selectedComponent === "/stack" && <NoView />}
        {selectedComponent === "/inbox" && <InboxView />}
        {selectedComponent === "/stacks" && <NoView />}
      </div>
    </div>
  );
}

export default Mail;