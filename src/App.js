import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Home from "./Components/Home/Home";
import Login from "./Components/Login/Login";
import Signup from "./Components/Signup/Signup";
import Sidebar from "./Components/Admin/Sidebar";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { RiMenu3Fill } from "react-icons/ri";
import StudentList from "./Components/Admin/StudentList";
import AttendanceHistory from "./Components/Admin/AttendanceHistory";
import AdminHome from "./Components/Admin/AdminHome";

function App() {
  const loc = useLocation();
  const token = localStorage.getItem("token");
  const rolet = localStorage.getItem("role")
  const [adminTrue, setadminTrue] = useState(false);
  const [role, setRole] = useState("") 

  const [loggedin, setLoggedIn] = useState(false);
  const [sidebar, setSidebar] = useState(true);

  useEffect(() => {  

    if(token){
      setLoggedIn(true);
    }

    if (role) {      
      setRole(rolet)
    }   
    

  }, [token, rolet]);



  useEffect(()=>{

    if (
      role=='admin' && loc.pathname=='/admin' ||
      role=='admin' && loc.pathname=='/admin/' ||
      role=='admin' && loc.pathname=='/student-list' ||
      role=='admin' && loc.pathname=='/history' 
    
    ) {
      setadminTrue(true) 
    }

  },[loc])

  



  const url = "http://192.168.1.201:5000";
  const urlfirst = "http://localhost:5000/attendance/admin-nuhvin";
  const urlSecond = "http://localhost:5000/attendance/all-students";

  return (
    <div className="flex h-screen">
      {adminTrue && <Sidebar sidebar={sidebar} setSidebar={setSidebar} setadminTrue={setadminTrue}/>}

      <div className="flex-1 overflow-y-auto">
        {adminTrue && (
          <button
            className="bg-orange-600 lg:hidden absolute right-8 px-2 py-2"
            onClick={() => setSidebar(!sidebar)}
          >
            <RiMenu3Fill size={25} cursor="pointer" />
          </button>
        )}

        <Routes>
          <Route
            path="/"
            element={loggedin? <Home url={url} /> : <Navigate to="/admin" />}
          />
          <Route
            path="/login"
            element={<Login url={url} setLoggedIn={setLoggedIn} />}
          />
          <Route path="/signup" element={<Signup url={url} />} />


          <Route path="/admin" element={loggedin ?<AdminHome url={url} setadminTrue={setadminTrue}/>: <Navigate to="/login" />} />
          <Route
            path="/student-list"
            element={loggedin ?<StudentList url={urlfirst} urlSecond={urlSecond} setadminTrue={setadminTrue}/>: <Navigate to="/login" />}
          />
          <Route
            path="/history"
            element={loggedin ?<AttendanceHistory url={urlfirst} urlSecond={urlSecond} setadminTrue={setadminTrue}/> :<Navigate to="/login" /> }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
