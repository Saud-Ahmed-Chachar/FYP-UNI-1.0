import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../backend/firebase-fetchingDB'; // Adjust the import path as needed
import 'chart.js/auto';

const Dashboard = () => {
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState({
    registeredCandidates: 0,
    registeredUniversities: 0,
    totalVisits: 13 // Assuming this data is not dynamically fetched
  });

  useEffect(() => {
    // Fetch the total number of students
    const fetchStudents = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      setMetrics(prevMetrics => ({
        ...prevMetrics,
        registeredCandidates: querySnapshot.docs.length
      }));
    };
      // Fetch the total number of universities
      const fetchUniversities = async () => {
        const querySnapshot = await getDocs(collection(db, "universities"));
        setMetrics(prevMetrics => ({
          ...prevMetrics,
          registeredUniversities: querySnapshot.docs.length
        }));
      };
  
      fetchStudents();
      fetchUniversities();
    }, []);






  // Placeholder data for the chart
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [5, 6, 7, 8, 5],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return (
    <div className="flex">
    


      {/* Main Content */}
      <div className="flex-1 p-10">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {/* <div className="flex-1 flex flex-col p-10">
        <h1 className="text-2xl font-bold mb-8">Overview</h1> */}
        {/* Metrics */}
        <hr className="my-6" />

        <div className="flex-grow grid grid-cols-3 gap-4">
        <div className="bg-white rounded shadow p-6">
            <Bar data={chartData} />
          </div>
          <div className="bg-white rounded shadow p-6">
            <Doughnut data={chartData} />
          </div>
          <div className="bg-white rounded shadow p-6">
            <Line data={chartData} />
          </div>
          <div className="bg-white rounded shadow p-6 flex flex-col items-center justify-center">
            <span className="text-gray-500">Registered Candidates</span>
            <span className="text-3xl font-semibold">{metrics.registeredCandidates}</span>
          </div>
          <div className="bg-white rounded shadow p-6 flex flex-col items-center justify-center">
            <span className="text-gray-500">Registered Universities</span>
            <span className="text-3xl font-semibold">{metrics.registeredUniversities}</span>
          </div>
          <div className="bg-white rounded shadow p-6 flex flex-col items-center justify-center">
            <span className="text-gray-500">Available Scholarship</span>
            <span className="text-3xl font-semibold">{metrics.totalVisits}</span>
          </div>

         
        </div>
        </div>
        </div>
  );
};

export default Dashboard;































