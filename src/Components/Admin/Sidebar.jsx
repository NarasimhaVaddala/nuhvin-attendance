import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Sidebar({ sidebar, setSidebar,setadminTrue }) {
  const location = useLocation();
  const navigate = useNavigate()
 

  return (
    <>
    

    <div
      className={`fixed top-0 left-0 h-full z-10 lg:static lg:z-0 p-3 transform transition-transform duration-300 ease-in-out
        ${
          sidebar ? "-translate-x-full" : "translate-x-0"
        } lg:translate-x-0 w-[20rem] bg-[#ff6600] shadow-xl flex flex-col
        items-center justify-center`}
    >
      <div>
        <img
          src="https://www.nuhvin.com/images/Frame%2012.png"
          alt=""
          className="h-10 w-50 absolute top-4 left-24 grayscale"
        />
      </div>

      <div className="flex flex-col w-full gap-2">
        <Link
          className={`w-full text-center rounded-md font-semibold p-2 hover:scale-105 cursor-pointer transition-all ${
            location.pathname === "/admin" ? "bg-orange-300" : "bg-white"
          }`}
          to="/admin"
          onClick={() => setSidebar(!sidebar)}
        >
          Today's Attendance
        </Link>

        <Link
          className={`w-full text-center rounded-md font-semibold p-2 hover:scale-105 cursor-pointer transition-all ${
            location.pathname === "/student-list" ? "bg-orange-300" : "bg-white"
          }`}
          to="/student-list"
          onClick={() => setSidebar(!sidebar)}
        >
          Students List
        </Link>

        <Link
          className={`w-full text-center rounded-md font-semibold p-2 hover:scale-105 cursor-pointer transition-all ${
            location.pathname === "/history" ? "bg-orange-300" : "bg-white"
          }`}
          to="/history"
          onClick={() => setSidebar(!sidebar)}
        >
          Attendance History
        </Link>

        <Link
          onClick={() => setSidebar(!sidebar)}
          className="w-full text-center rounded-md font-semibold bg-white p-2 hover:scale-105 cursor-pointer transition-all "
        >
          Tasks
        </Link>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('role')
            setadminTrue(false)
            return navigate('/login')
          }}
          className="w-full text-center rounded-md font-semibold bg-white p-2 hover:scale-105 cursor-pointer transition-all "
        >
          Logout
        </button>
      </div>
    </div>
    
    </>
  );
}
