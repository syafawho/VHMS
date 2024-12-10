import React, { useState, useEffect, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { HazardData } from "../types";
import { FaFireAlt, FaRuler, FaDownload } from "react-icons/fa";
import { RiSpeedLine } from "react-icons/ri";
import { GiPoisonGas, GiPathDistance } from "react-icons/gi";
import { MdOutlineCarCrash } from "react-icons/md";
import Map from "./Map.tsx";
import StyledIcon from "../components/StyledIcon.tsx";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  const [latest, setLatest] = useState<HazardData | null>(null);
  const [lastStatus, setLastStatus] = useState<string>("Vehicle Safe");
  const [isInitialRender, setIsInitialRender] = useState<boolean>(true);

  const defaultLatitude = 1.3998;
  const defaultLongitude = 103.9202;

  // Notification sound
  const playNotificationSound = () => {
    const audio = new Audio("/notification.mp3");
    audio.play();
  };

  // Memoized function to determine vehicle status
  const getVehicleStatus = useCallback((): string => {
    const flame = latest?.flame ?? 0;
    const smoke = latest?.smoke ?? 0;
    const distance = latest?.distance ?? 0;
    const accX = latest?.acc_x ?? 0;
    const accY = latest?.acc_y ?? 0;
    const accZ = latest?.acc_z ?? 9.8;

    if (distance < 5 || Math.abs(accX) > 10 || Math.abs(accY) > 10 || Math.abs(accZ - 9.8) > 3) {
      return "Vehicle Crashed";
    }
    if (flame >= 5 || smoke >= 36) {
      return "Vehicle Unsafe";
    }
    return "Vehicle Safe";
  }, [latest]);

  // Fetch data and manage notifications
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<HazardData[]>(
          "https://vhms-backend.onrender.com/api/log" // Updated backend endpoint
        );
        const data = response.data[response.data.length - 1];

        if (data.latitude === 0 && data.longitude === 0) {
          data.latitude = defaultLatitude;
          data.longitude = defaultLongitude;
        }

        setLatest(data);

        const newStatus = getVehicleStatus();

        if (!isInitialRender && newStatus !== lastStatus) {
          playNotificationSound();
          if (newStatus === "Vehicle Unsafe") {
            toast.warn("⚠️ Vehicle Status: Unsafe! Check parameters immediately.", {
              autoClose: false,
            });
          } else if (newStatus === "Vehicle Crashed") {
            toast.error("🚨 Vehicle Status: Crashed! Take immediate action.", {
              autoClose: false,
            });
          }
          setLastStatus(newStatus);
        }

        if (isInitialRender) setIsInitialRender(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Updates every 5 seconds
    return () => clearInterval(interval);
  }, [lastStatus, isInitialRender, getVehicleStatus]);

  // Download CSV function
  const downloadCSV = async () => {
    try {
      const response = await axios.get("https://vhms-backend.onrender.com/api/download_csv", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "historical_data.csv");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  };

  const vehicleStatus = getVehicleStatus();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Vehicle Hazard Monitoring System</h1>
          <p>A Project by Syafawie, UP2242015</p>
          <p className="last-updated">Last Updated Data: {new Date().toLocaleString()}</p>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-widgets">
          <div className="widget">
            <StyledIcon Icon={FaFireAlt} color="#ff5722" />
            <h3>Thermal Detection</h3>
            <p>{latest?.flame ?? 0}%</p>
          </div>

          <div className="widget">
            <StyledIcon Icon={GiPoisonGas} color="#5f8971" />
            <h3>Gas Concentration</h3>
            <p>{latest?.smoke ?? 0}%</p>
          </div>

          <div className="widget">
            <StyledIcon Icon={FaRuler} color="#DEB887" />
            <h3>Nearest Object</h3>
            <p>{latest?.distance ?? 0} cm</p>
          </div>

          <div className="widget">
            <StyledIcon Icon={RiSpeedLine} color="#ffc107" />
            <h3>Acceleration</h3>
            <p>X: {latest?.acc_x ?? 0} m/s²</p>
            <p>Y: {latest?.acc_y ?? 0} m/s²</p>
            <p>Z: {latest?.acc_z ?? 0} m/s²</p>
          </div>

          <div className="widget">
            <StyledIcon
              Icon={MdOutlineCarCrash}
              color={
                vehicleStatus === "Vehicle Safe"
                  ? "#4caf50"
                  : vehicleStatus === "Vehicle Unsafe"
                  ? "#ffc107"
                  : "#f44336"
              }
            />
            <h3>Vehicle Status</h3>
            <p>{vehicleStatus}</p>
          </div>

          <div className="widget">
            <StyledIcon Icon={FaDownload} color="#5a8b5d" />
            <h3>Download Data</h3>
            <button
              onClick={downloadCSV}
              style={{
                padding: "10px 15px",
                fontSize: "14px",
                backgroundColor: "#4caf50",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Download CSV
            </button>
          </div>
        </div>

        <div className="dashboard-right">
          <div className="dashboard-vehicle-detail">
            <h2>Vehicle Detail</h2>
            <div className="vehicle-detail-content">
              <img src="./tesla.jpg" alt="Vehicle" className="vehicle-image" />
              <div className="vehicle-info">
                <p>
                  <strong>ID:</strong> VH123456
                </p>
                <p>
                  <strong>Model:</strong> Tesla Model Y
                </p>
              </div>
            </div>
          </div>

          <div className="dashboard-map">
            <h2>
              <StyledIcon Icon={GiPathDistance} size="3.5rem" color="#fff" marginBottom="0px" />
              Vehicle Location
            </h2>
            <div className="map-container">
              <Map
                latitude={latest?.latitude || defaultLatitude}
                longitude={latest?.longitude || defaultLongitude}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="dashboard-footer">
        <p>© 2024 Vehicle Hazard Monitoring System by Syafawie, UP2242015. All Rights Reserved.</p>
      </footer>

      <ToastContainer
        position="top-center"
        autoClose={false}
        hideProgressBar={false}
        closeOnClick
        draggable
      />
    </div>
  );
};

export default Dashboard;
