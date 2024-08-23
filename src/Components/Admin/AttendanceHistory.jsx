import axios from "axios";
import React, { useEffect, useState } from "react";

export default function ({ url, urlSecond }) {
  const [data, setData] = useState([]);
  const [students, setAllStudents] = useState([]);
  let thisWeek = `${new Date().getFullYear()}-${String(
    new Date().getMonth() + 1
  ).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`;

  const [year, setyear] = useState(new Date().getFullYear());
  const [month, setmonth] = useState(new Date().getMonth() + 1);
  const [week, setweek] = useState(checkWeek(thisWeek));
  const [id, setid] = useState("");
  const [uniqueIds, setUniqueIds] = useState([]);

  useEffect(() => {
    getAttendance();
    onFetchAllStudent();
  }, []);

  const onFetchAllStudent = async () => {
    try {
      const response = await axios.get(urlSecond);
      setAllStudents(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getAttendance = async () => {
    try {
      const response = await axios.get(url);
      setData(response.data.data);
      console.log(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const [average, setAverage] = useState({ week: 0, month: 0 });

  useEffect(() => {
    if (id && week && month) {
      calculateAverages();
    }
  }, [year, month, week, id]);

  function parseDuration(duration) {
    //  console.log(duration);

    const [hours, minutes] = duration
      .split("H : ")
      .map((part) => parseInt(part));
    return hours * 60 + minutes;
  }

  function calculateAverages() {
    const filteredData = data
      .filter((e) => e.emp_id === id)
      .filter(
        (e) =>
          new Date(e.date.split("-").reverse().join("-")).getFullYear() ===
          parseInt(year)
      )
      .filter((e) => parseInt(e.date.split("-")[1]) === parseInt(month))
      .filter((e) => checkWeek(e.date.split("-").reverse().join("-")) === week);

    console.log(filteredData, "filteredData");

    const totalMinutes = filteredData.reduce(
      (sum, e) => sum + parseDuration(e.noOfHours),
      0
    );
    const weekAverage = totalMinutes / filteredData.length / 60; // Average in hours

    const monthData = data
      .filter((e) => e.head === id)
      .filter(
        (e) =>
          new Date(e.date.split("-").reverse().join("-")).getFullYear() ===
          parseInt(year)
      )
      .filter((e) => parseInt(e.date.split("-")[1]) === parseInt(month));

    console.log(monthData, "monthdata");

    const totalMonthMinutes = monthData.reduce(
      (sum, e) => sum + parseDuration(e.noOfHours),
      0
    );
    const monthAverage = totalMonthMinutes / monthData.length / 60; // Average in hours

    setAverage({
      week: weekAverage.toFixed(2),
      month: monthAverage.toFixed(2),
    });
  }

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="mt-8 container col-span-3 p-4">
      <h3 className="mt-2 font-bold text-2xl mb-3">Attendance History</h3>

      <div className="flex-col lg:flex-row flex w-full gap-2">
        <select
          value={year}
          onChange={(e) => setyear(e.target.value)}
          className="border-[1px] focus:border-orange-400 border-gray-300 px-4 py-2 rounded-md outline-none w-full"
        >
          <option defaultValue="">select year</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
        </select>
        <select
          value={month}
          onChange={(e) => setmonth(e.target.value)}
          className="border-[1px] focus:border-orange-400 border-gray-300 px-4 py-2 rounded-md outline-none w-full"
        >
          <option defaultValue="">Select Month</option>
          {months.map((e, index) => {
            return (
              <option key={index} value={index + 1}>
                {e}
              </option>
            );
          })}
        </select>

        <select
          value={week}
          onChange={(e) => setweek(e.target.value)}
          className="border-[1px] focus:border-orange-400 border-gray-300 px-4 py-1 rounded-md outline-none w-full"
        >
          <option defaultValue="">Select Week</option>
          <option value="week1">Week 1</option>
          <option value="week2">Week 2</option>
          <option value="week3">Week 3</option>
          <option value="week4">Week 4</option>
        </select>

        <select
          value={id}
          onChange={(e) => setid(e.target.value)}
          className="border-[1px] focus:border-orange-400 border-gray-300 px-4 py-1 rounded-md outline-none w-full"
        >
          <option defaultValue="">Select Name / Id</option>
          {students?.map((e, index) => {
            return (
              <option value={e.emp_id} key={index}>
                {`${e.name} - ${e.emp_id}`}{" "}
              </option>
            );
          })}
        </select>
      </div>

      {id && week && month && (
        <div className="my-3 w-full flex flex-col gap-2">
          <span>Week wise Average - {average.week} </span>
          <span>Month wise Average - {average.month} </span>
        </div>
      )}

      <Todaytable data={data} year={year} month={month} week={week} id={id} />
    </div>
  );
}

function Todaytable({ data, year, month, week, id }) {
  return (
    <div className="relative overflow-x-auto mt-4">
      <table className="w-full text-sm text-left rtl:text-right  ">
        <thead className="text-xs text-gray-700 uppercase bg-gray-300  ">
          <tr>
            <th scope="col" className="px-6 py-3">
              Employee Name
            </th>
            <th scope="col" className="px-6 py-3">
              Date
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
          {data
            .filter((e) => {

              console.log(year , e.date.split("-")[2] );
              
              if (year) return e.date.split("-")[2] == year;
              else return true;
            })
            .filter((e) => {
              console.log(month , (e.date.split("-")[1]));
              

              if (month)
                return parseInt(e.date.split("-")[1]) == parseInt(month);
              else return true;
            })
            .filter((e) => {
              if (week)return week == checkWeek(e.date.split("-").reverse().join("-"));
              else return true;
            })

            .filter((e) => {
              if (id) return e.emp_id == id;
              else return true;
            })

            .map((e, index) => {
              return (
                <tr key={index} className="bg-white border-b  ">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {e.name}
                  </th>

                  <td className="px-6 py-4">{e.date}</td>
                  <td className="px-6 py-4">{e.emp_id}</td>
                  <td className="px-6 py-4">{e.startTime}</td>
                  <td className="px-6 py-4">{e.endTime} </td>
                  <td className="px-6 py-4">{e.noOfHours}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

function getWeeksInMonth(year, month) {
  const weeks = {};
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // Total days in the month
  const daysPerWeek = Math.ceil(daysInMonth / 4); // Approximate days per week

  let startDay = 1;

  for (let i = 0; i < 4; i++) {
    let weekDays = [];
    let endDay = startDay + daysPerWeek - 1;
    if (endDay > daysInMonth) endDay = daysInMonth;

    for (let day = startDay; day <= endDay; day++) {
      weekDays.push(
        `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(
          2,
          "0"
        )}`
      );
    }

    weeks[`week${i + 1}`] = weekDays;
    startDay = endDay + 1;
  }

  return weeks;
}

function checkWeek(date) {
  const [year, month, day] = date.split("-").map(Number);
  const weeks = getWeeksInMonth(year, month - 1); // Month is 0-indexed

  for (const [week, days] of Object.entries(weeks)) {
    if (days.includes(date)) {
      return week;
    }
  }

  return null; // If the date doesn't fall within the month
}

function convertToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(":").map((str) => parseInt(str));
  return hours * 60 + minutes;
}
