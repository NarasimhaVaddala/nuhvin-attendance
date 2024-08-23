import axios from 'axios'
import React, { useEffect, useState } from 'react'

export default function ({urlSecond}) {

  const [allStudents , setAllStudents] = useState([])

  const onFetchAllStudent = async () => {
    try {
      const response = await axios.get(urlSecond)
      // setData(response.data.data)
      setAllStudents(response.data)
      console.log(allStudents);
      
      console.log(response)
    } catch (error) {
      console.log(error.message);
    }
  }


  useEffect(()=>{
    onFetchAllStudent()
  })


  return (
    <div className="container mt-8 col-span-3 p-4">

    <h3 className="mt-2 font-bold text-2xl mb-3">
        Employee List 
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
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-orange-500 focus:border-orange-500  outline-none "
            placeholder="Search By Name / Id"
            required
          />
         
        </div>

    <Todaytable data={allStudents}/>
      
    </div>
  )
}



function Todaytable({data}) {
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
                Email
              </th>
             
            </tr>
          </thead>
          <tbody>
            

            {
              data.map((e, index)=>{
                return <tr className="bg-white border-b  ">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {e.name}
                </th>
    
                <td className="px-6 py-4">{e.emp_id}</td>
                <td className="px-6 py-4">{e.email}</td>
                
              </tr>
              })
            }
            
           
          </tbody>
        </table>
      </div>
    );
  }
  
