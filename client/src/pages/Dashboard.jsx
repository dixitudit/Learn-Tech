import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
//4:0:0
const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    // console.log(tabFromUrl);
    setTab(tabFromUrl);
  }, [location.search]);


  return (
    <div className="sm:flex w-full min-h-screen sm:flex-row max-sm:items-center">
      <div className="sm:w-56">
        {/* sidebar */}
        <DashSidebar active={tab} />
      </div>
        {/* profile */}
        {tab==='profile' && <DashProfile />}
        {/* posts */}
        {tab==='posts' && <DashPosts />}
        {/* users */}
        {tab==='users' && <DashUsers />}
    </div>
  );
};

export default Dashboard;
