"use client";

import { useEffect, useState, useRef } from "react";
import { LogOut, Briefcase, Users, TrendingUp, FileText } from "lucide-react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  BarController,
  LineController,
  PieController,
  DoughnutController
} from 'chart.js';

// Register semua komponen Chart.js yang diperlukan
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  BarController,
  LineController,
  PieController,
  DoughnutController
);

export default function DashboardPage() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [dataJob, setDataJob] = useState([45, 28, 32, 18, 22, 15])
  
  // Refs untuk chart canvas
  const jobsByCategoryRef = useRef(null);
  const applicantsStatusRef = useRef(null);
  const monthlyApplicationsRef = useRef(null);
  const jobsByTypeRef = useRef(null);
  
  // Refs untuk chart instances
  const jobsByCategoryChartRef = useRef<ChartJS | null>(null);
  const applicantsStatusChartRef = useRef<ChartJS | null>(null);
  const monthlyApplicationsChartRef = useRef<ChartJS | null>(null);
  const jobsByTypeChartRef = useRef<ChartJS | null>(null);

  const handleLogout = () => {
    setIsLoggingOut(true);
    // Simulasi logout
    setTimeout(() => {
      console.log("Logged out");
      setIsLoggingOut(false);
    }, 1000);
  };
  
  useEffect(() => {
    // Destroy existing charts before creating new ones
    if (jobsByCategoryChartRef.current) jobsByCategoryChartRef.current.destroy();
    if (applicantsStatusChartRef.current) applicantsStatusChartRef.current.destroy();
    if (monthlyApplicationsChartRef.current) monthlyApplicationsChartRef.current.destroy();
    if (jobsByTypeChartRef.current) jobsByTypeChartRef.current.destroy();

    // Bar Chart - Jobs by Category
    if (jobsByCategoryRef.current) {
      const ctx = jobsByCategoryRef.current.getContext('2d');
      jobsByCategoryChartRef.current = new ChartJS(ctx, {
        type: 'bar',
        data: {
          labels: ['IT & Software', 'Marketing', 'Sales', 'Design', 'Finance', 'HR'],
          datasets: [{
            label: 'Total Pekerjaan',
            data: dataJob,
            backgroundColor: [
              'rgba(1, 149, 159, 0.8)',
              'rgba(52, 211, 153, 0.8)',
              'rgba(251, 146, 60, 0.8)',
              'rgba(167, 139, 250, 0.8)',
              'rgba(248, 113, 113, 0.8)',
              'rgba(96, 165, 250, 0.8)',
            ],
            borderColor: [
              'rgba(1, 149, 159, 1)',
              'rgba(52, 211, 153, 1)',
              'rgba(251, 146, 60, 1)',
              'rgba(167, 139, 250, 1)',
              'rgba(248, 113, 113, 1)',
              'rgba(96, 165, 250, 1)',
            ],
            borderWidth: 2,
            borderRadius: 8,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Pekerjaan Berdasarkan Kategori',
              font: { size: 16, weight: 'bold' },
              padding: { bottom: 20 }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { stepSize: 10 }
            }
          }
        }
      });
    }

    // Pie Chart - Applicants Status
    if (applicantsStatusRef.current) {
      const ctx = applicantsStatusRef.current.getContext('2d');
      applicantsStatusChartRef.current = new ChartJS(ctx, {
        type: 'pie',
        data: {
          labels: ['Pending', 'Interview', 'Accepted', 'Rejected'],
          datasets: [{
            data: [125, 78, 45, 92],
            backgroundColor: [
              'rgba(251, 191, 36, 0.8)',
              'rgba(96, 165, 250, 0.8)',
              'rgba(52, 211, 153, 0.8)',
              'rgba(248, 113, 113, 0.8)',
            ],
            borderColor: [
              'rgba(251, 191, 36, 1)',
              'rgba(96, 165, 250, 1)',
              'rgba(52, 211, 153, 1)',
              'rgba(248, 113, 113, 1)',
            ],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { padding: 15, font: { size: 12 } }
            },
            title: {
              display: true,
              text: 'Status Pelamar',
              font: { size: 16, weight: 'bold' },
              padding: { bottom: 20 }
            }
          }
        }
      });
    }

    // Line Chart - Monthly Applications
    if (monthlyApplicationsRef.current) {
      const ctx = monthlyApplicationsRef.current.getContext('2d');
      monthlyApplicationsChartRef.current = new ChartJS(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
          datasets: [{
            label: 'Jumlah Lamaran',
            data: [65, 78, 90, 81, 96, 105, 118, 132, 145, 160],
            fill: true,
            backgroundColor: 'rgba(1, 149, 159, 0.2)',
            borderColor: 'rgba(1, 149, 159, 1)',
            borderWidth: 3,
            tension: 0.4,
            pointBackgroundColor: 'rgba(1, 149, 159, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Tren Lamaran Bulanan (2024)',
              font: { size: 16, weight: 'bold' },
              padding: { bottom: 20 }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { stepSize: 20 }
            }
          }
        }
      });
    }

    // Doughnut Chart - Jobs by Type
    if (jobsByTypeRef.current) {
      const ctx = jobsByTypeRef.current.getContext('2d');
      jobsByTypeChartRef.current = new ChartJS(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Full Time', 'Part Time', 'Contract', 'Freelance', 'Internship'],
          datasets: [{
            data: [85, 32, 28, 15, 20],
            backgroundColor: [
              'rgba(1, 149, 159, 0.8)',
              'rgba(52, 211, 153, 0.8)',
              'rgba(251, 146, 60, 0.8)',
              'rgba(167, 139, 250, 0.8)',
              'rgba(96, 165, 250, 0.8)',
            ],
            borderColor: [
              'rgba(1, 149, 159, 1)',
              'rgba(52, 211, 153, 1)',
              'rgba(251, 146, 60, 1)',
              'rgba(167, 139, 250, 1)',
              'rgba(96, 165, 250, 1)',
            ],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { padding: 15, font: { size: 12 } }
            },
            title: {
              display: true,
              text: 'Jenis Pekerjaan',
              font: { size: 16, weight: 'bold' },
              padding: { bottom: 20 }
            }
          }
        }
      });
    }

    // Cleanup function
    return () => {
      if (jobsByCategoryChartRef.current) jobsByCategoryChartRef.current.destroy();
      if (applicantsStatusChartRef.current) applicantsStatusChartRef.current.destroy();
      if (monthlyApplicationsChartRef.current) monthlyApplicationsChartRef.current.destroy();
      if (jobsByTypeChartRef.current) jobsByTypeChartRef.current.destroy();
    };
  }, [dataJob]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#01959F] p-2 rounded-lg">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut className="w-5 h-5" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pekerjaan</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">160</p>
                <p className="text-sm text-green-600 mt-1">+12% dari bulan lalu</p>
              </div>
              <div className="bg-[#01959F] bg-opacity-10 p-3 rounded-lg">
                <Briefcase className="w-8 h-8 text-[#01959F]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pelamar</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">340</p>
                <p className="text-sm text-green-600 mt-1">+8% dari bulan lalu</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lamaran Baru</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">78</p>
                <p className="text-sm text-blue-600 mt-1">Minggu ini</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tingkat Hire</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">13.2%</p>
                <p className="text-sm text-green-600 mt-1">+2.1% dari bulan lalu</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="h-80">
              <canvas ref={jobsByCategoryRef}></canvas>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="h-80">
              <canvas ref={applicantsStatusRef}></canvas>
            </div>
          </div>
        </div>

        {/* Line Chart - Full Width */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6 hover:shadow-md transition-shadow">
          <div className="h-80">
            <canvas ref={monthlyApplicationsRef}></canvas>
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="h-80">
              <canvas ref={jobsByTypeRef}></canvas>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-[#01959F] text-white rounded-lg hover:bg-[#017A82] transition duration-200 font-medium">
                + Tambah Pekerjaan Baru
              </button>
              <button className="w-full text-left px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition duration-200 font-medium">
                📋 Lihat Semua Lamaran
              </button>
              <button className="w-full text-left px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition duration-200 font-medium">
                👥 Kelola Pelamar
              </button>
              <button className="w-full text-left px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition duration-200 font-medium">
                📊 Export Laporan
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}