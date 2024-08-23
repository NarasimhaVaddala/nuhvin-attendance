import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminHome({url,setadminTrue}) {
  const navigate = useNavigate()

  const [data , setData] = useState([])
  const [search , setsearch] = useState("")


  

  useEffect(()=>{
      if (localStorage.getItem('role')!='admin') {
          return navigate('/')
      }
      else{
        setadminTrue(true)
      }
  },[])


  const getAttendance = async()=>{
    
    try {
      const response = await axios.get(`${url}/attendance/admin-nuhvin`)
      setData(response.data.data)

    } catch (error) {
        console.log(error.message);
        
    }
}




useEffect(()=>{
    getAttendance()
},[])
  return (
    <div className="container mt-8 col-span-3 p-4">


      <h3 className="mt-2 font-bold text-2xl mb-3">
        Today Attendance - {new Date().toDateString()}
      </h3>

      
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 "
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
          value={search}
          onChange={(e)=>setsearch(e.target.value)}
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-orange-500 focus:border-orange-500  outline-none "
            placeholder="Search By Name / Id"
            required
          />
         
        </div>
     
      <Todaytable data={data} search={search}/>
    </div>
  );
}

function Todaytable({data , search}) {
  return (
    <div className="relative overflow-x-auto mt-4">
      <table className="w-full text-sm text-left rtl:text-right  ">
        <thead className="text-xs text-gray-700 uppercase bg-gray-300  ">
          <tr>
            <th scope="col" className="px-6 py-3">
              Employee Name
            </th>
            <th scope="col" className="px-6 py-3">
              Employee Id
            </th>
            <th scope="col" className="px-6 py-3">
              Login
            </th>
            <th scope="col" className="px-6 py-3">
              Logout
            </th>
            <th scope="col" className="px-6 py-3">
              Active Hours
            </th>
          </tr>
        </thead>
        <tbody>
          

          {
            data

            .filter((e)=>{
              if(search)return e.name.toLowerCase().includes( search.toLowerCase()) || e._id.toLowerCase().includes( search.toLowerCase())
              return true
            })
            
            .map((e, index)=>{
              return <tr className="bg-white border-b" key={index}>
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
               {e.name}
              </th>
  
              <td className="px-6 py-4">{e.emp_id}</td>
              <td className="px-6 py-4">{e.startTime}</td>
              <td className="px-6 py-4">{e.endTime}</td>
              <td className="px-6 py-4">{e.noOfHours}</td>
            </tr>
            })
          }
         
        </tbody>
      </table>
    </div>
  );
}



// ff6600
