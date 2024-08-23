import React, { useEffect, useState } from "react";
import "./Home.css";
import UserLocationMap from "../UserLocationMap/UserLocationMap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = ({ url }) => {
  const [location, setLocation] = useState({ lat: 17.385, lng: 78.4867 }); // Default to Hyderabad
  const [error, setError] = useState(null);
  const [isLocationLoaded, setIsLocationLoaded] = useState(false);
  const [username, setusername] = useState("");
  const [userid, setuserid] = useState("");
  const [disabled, setdisabled] = useState(false);
  const [checkIn, setCheckIn] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [userAttendance, setUserAttendance] = useState([]);
  const [attId, setattId] = useState("");
  const [distance, setDistance] = useState(0);
  const [time, setTime] = useState("");
  const [checkinTime, setCheckInTime] = useState("");
  const [checkoutTime, setCheckoutTime] = useState("");
  const [noOfHours, setnoOfHours] = useState("");

  const presentTime = setInterval(() => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12; // Convert hour '0' to '12'
    hours = String(hours).padStart(2, "0");

    const formattedTime = `${hours}:${minutes}:${seconds} ${ampm}`;
    setTime(formattedTime);
  }, 1000);

  const navigate = useNavigate();
  let token = localStorage.getItem("token");
  let role = localStorage.getItem("role");
  useEffect(() => {
    if (!token) {
      return navigate("/login");
    }

    if (token && role == "admin") {
      return navigate("/admin");
    }

    if (token && role !== "admin") {
      return navigate("/");
    }
  }, []);

  useEffect(() => {
    getAttendance();
  }, []);

  const getDate = () => {
    const d = new Date();
    const date = d.getDate();
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // Get today's day number (0 for Sunday, 1 for Monday, etc.)
    const today = d.getDay();

    // Get the weekday name
    const dayName = weekdays[today];

    console.log(dayName);

    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, "0"); // Ensures two-digit minutes

    // Convert to 12-hour format
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Converts '0' or '12' hours to '12'

    let todaydate = `${date}-${month}-${year}`;
    let timeNow = `${hours}:${minutes} ${ampm}`;

    return { todaydate, timeNow };
  };

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Radius of the Earth in meters

    // Convert degrees to radians
    const φ1 = lat1 * (Math.PI / 180);
    const φ2 = lat2 * (Math.PI / 180);
    const Δφ = (lat2 - lat1) * (Math.PI / 180);
    const Δλ = (lon2 - lon1) * (Math.PI / 180);

    // Haversine formula
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Distance in meters
    const distance = R * c;

    return distance;
  }

  const getAttendance = async () => {
    console.log("getAttendance started");

    const { todaydate, timeNow } = getDate();

    const data = await axios.get(`${url}/attendance/`, {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });

    console.log(data);

    const isThere = data.data.attendance.find((e) => e.date == todaydate);
    if (isThere) {
      setattId(isThere._id);
      setusername(isThere.name);
      setdisabled(true);
      setCheckIn(true);
      setCheckInTime(isThere.startTime);
      isThere.noOfHours ? setnoOfHours(isThere.noOfHours) : setnoOfHours("");
      isThere.endTime ? setCheckout(true) : setCheckout(false);
      isThere.endTime ? setCheckoutTime(isThere.endTime) : setCheckoutTime("");
    }

    const attendance = data.data.attendance;
    setuserid(data.data.details.id);
    setusername(data.data.details.name);
    setUserAttendance([...attendance]);
    console.log("getAttendance ended");
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLocationLoaded(true);
          console.log(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    const distance = calculateDistance(
      17.458687,
      78.370563,

      location.lat,
      location.lng
    );

    setDistance(Math.round(distance));

    console.log(`Distance: ${distance} meters`);
  }, [location]);

  const postcheckIn = async () => {
    console.log("cehckin started");

    const { todaydate, timeNow } = getDate();
    const data = await axios.post(
      `${url}/attendance/start`,
      {
        date: todaydate,
        startTime: timeNow,
        emp_id: userid,
      },
      {
        headers: {
          Authorization: `bearer ${token}`,
        },
      }
    );

    if (data.data.success) {
      setCheckIn(true);
    }

    setdisabled(true);
    getAttendance();
  };

  const postCheckout = async () => {
    const { todaydate, timeNow } = await getDate();
    const data = await axios.patch(
      `${url}/attendance/end/${attId}`,
      {
        date: todaydate,
        endTime: timeNow,
      },
      {
        headers: {
          Authorization: `bearer ${token}`,
        },
      }
    );

    if (data.data.success) {
      setCheckout(true);
    }
  };

  return (
    <div className="home-container">
      <UserLocationMap
        location={location}
        error={error}
        isLocationLoaded={isLocationLoaded}
      />

      <div className="flex home-second-main">
        <div className="details">
          <div className="emp-details">
            <p>
              <span>Date:</span> <span>{new Date().toDateString()}</span>
            </p>
            <p>
              <span>Time:</span> <span>{time}</span>
            </p>
            <p>
              <span>Check-in Time:</span> <span>{checkinTime}</span>
            </p>
            <p>
              <span>Check-out Time:</span> <span>{checkoutTime}</span>
            </p>
            <p>
              <span>No of hours:</span> <span>{noOfHours}</span>
            </p>
          </div>

          <div className="home-all-button-cards">
            <button disabled={disabled || distance > 500} onClick={postcheckIn} >
              Check-In
            </button>
            <button disabled={!checkIn || checkout} onClick={postCheckout}>
              Check-Out
            </button>
            {/* <button
              onClick={() => {
                window.location.reload();
              }}
            >
              Refresh
            </button> */}

            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <div
          className="container c-table"
          style={{
            padding: "2rem",
            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
            height: "30rem",
            overflowY: "scroll",
          }}
        >
          <h1 style={{ textAlign: "center" }}>
            Welcome {username} ({userid})
          </h1>

          <table>
            <thead>
              <tr>
                <th>DATE / DAY</th>
                <th>CHECK IN TIME</th>
                <th>CHECK OUT TIME</th>
                <th>NO OF HOURS</th>
              </tr>
            </thead>

            <tbody>
              {userAttendance.map((e, index) => {

                
                
                return (
                  <tr key={index} style={{ textAlign: "center" }}>
                    <td>{e.date} / {new Date(e.date.split("-").reverse().join("-")).toLocaleDateString('en-US', { weekday: 'long' })}</td>
                    <td>{e.startTime}</td>
                    <td>{e.endTime}</td>
                    <td>{e.noOfHours}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;
