"use client"

import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import ImageGallery from '../../components/ImageGallery';
import styles from './dashboard.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [galleryData, setGalleryData] = useState({ isOpen: false, images: [], title: '' });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      const result = await response.json();
      
      if (result.success) {
        setDashboardData(result.data);
      } else {
        console.error('Failed to fetch dashboard data:', result.error);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const openGallery = (images, title) => {
    setGalleryData({ isOpen: true, images, title });
  };

  const closeGallery = () => {
    setGalleryData({ isOpen: false, images: [], title: '' });
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>Loading Dashboard...</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className={styles.errorContainer}>
        <p>Failed to load dashboard data</p>
      </div>
    );
  }

  // Prepare chart data
  const feedbackData = {
    labels: ['Correct', 'Incorrect'],
    datasets: [{
      data: [
        dashboardData.feedbackStats.find(f => f._id === true)?.count || 0,
        dashboardData.feedbackStats.find(f => f._id === false)?.count || 0
      ],
      backgroundColor: ['#5ce1e6', '#fc67fa'],
      borderColor: ['#33bbcf', '#e94a95'],
      borderWidth: 2,
    }]
  };

  const ageData = {
    labels: dashboardData.ageStats.map(stat => {
      if (stat._id === 0) return '0-18';
      if (stat._id === 18) return '18-25';
      if (stat._id === 25) return '25-35';
      if (stat._id === 35) return '35-45';
      if (stat._id === 45) return '45-55';
      if (stat._id === 55) return '55-65';
      if (stat._id === 65) return '65+';
      return stat._id;
    }),
    datasets: [{
      label: 'Count',
      data: dashboardData.ageStats.map(stat => stat.count),
      backgroundColor: 'rgba(92, 225, 230, 0.8)',
      borderColor: '#33bbcf',
      borderWidth: 2,
    }]
  };

  const genderData = {
    labels: dashboardData.genderStats.map(stat => stat._id),
    datasets: [{
      data: dashboardData.genderStats.map(stat => stat.count),
      backgroundColor: ['#def9fa', '#9dedf0', '#5ce1e6'],
      borderColor: ['#bef3f5', '#7de7eb', '#33bbcf'],
      borderWidth: 2,
    }]
  };

  const emotionData = {
    labels: dashboardData.emotionStats.map(stat => stat._id),
    datasets: [{
      label: 'Count',
      data: dashboardData.emotionStats.map(stat => stat.count),
      backgroundColor: [
        '#def9fa', '#bef3f5', '#9dedf0', '#7de7eb', '#5ce1e6', '#33bbcf'
      ],
      borderColor: '#fff',
      borderWidth: 2,
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#fff',
          font: {
            family: 'Poppins',
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 16, 29, 0.9)',
        titleColor: '#5ce1e6',
        bodyColor: '#fff',
        borderColor: '#33bbcf',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        ticks: { color: '#fff', font: { family: 'Poppins' } },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      x: {
        ticks: { color: '#fff', font: { family: 'Poppins' } },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Analytics Dashboard</h1>
        <p className={styles.subtitle}>
          Track and analyze facial recognition results with beautiful visualizations
        </p>
        <div className={styles.statsCard}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{dashboardData.totalAnalyses}</span>
            <span className={styles.statLabel}>Total Analyses</span>
          </div>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        {/* User Feedback Chart */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>User Feedback Distribution</h3>
          <div className={styles.chartContainer}>
            <Pie data={feedbackData} options={chartOptions} />
          </div>
          <div className={styles.dropdownSection}>
            <button 
              className={styles.dropdownBtn}
              onClick={() => setActiveDropdown(activeDropdown === 'feedback' ? null : 'feedback')}
            >
              View Feedback Images {activeDropdown === 'feedback' ? '▲' : '▼'}
            </button>
            {activeDropdown === 'feedback' && (
              <div className={styles.dropdownContent}>
                {dashboardData.feedbackImages.map((feedback, index) => (
                  <button
                    key={index}
                    className={styles.categoryBtn}
                    onClick={() => openGallery(
                      feedback.images, 
                      `${feedback._id ? 'Correct' : 'Incorrect'} Feedback (${feedback.images.length} images)`
                    )}
                  >
                    {feedback._id ? 'Correct' : 'Incorrect'} ({feedback.images.length})
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Age Distribution Chart */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Age Distribution</h3>
          <div className={styles.chartContainer}>
            <Bar data={ageData} options={chartOptions} />
          </div>
          <div className={styles.dropdownSection}>
            <button 
              className={styles.dropdownBtn}
              onClick={() => setActiveDropdown(activeDropdown === 'age' ? null : 'age')}
            >
              View Age Groups {activeDropdown === 'age' ? '▲' : '▼'}
            </button>
            {activeDropdown === 'age' && (
              <div className={styles.dropdownContent}>
                {dashboardData.ageStats.map((age, index) => {
                  let ageLabel = '';
                  if (age._id === 0) ageLabel = '0-18';
                  else if (age._id === 18) ageLabel = '18-25';
                  else if (age._id === 25) ageLabel = '25-35';
                  else if (age._id === 35) ageLabel = '35-45';
                  else if (age._id === 45) ageLabel = '45-55';
                  else if (age._id === 55) ageLabel = '55-65';
                  else if (age._id === 65) ageLabel = '65+';
                  else ageLabel = age._id;
                  
                  return (
                    <button
                      key={index}
                      className={styles.categoryBtn}
                      onClick={() => openGallery(
                        age.images, 
                        `Age Group ${ageLabel} (${age.images.length} images)`
                      )}
                    >
                      {ageLabel} ({age.images.length})
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Gender Distribution Chart */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Gender Distribution</h3>
          <div className={styles.chartContainer}>
            <Doughnut data={genderData} options={chartOptions} />
          </div>
          <div className={styles.dropdownSection}>
            <button 
              className={styles.dropdownBtn}
              onClick={() => setActiveDropdown(activeDropdown === 'gender' ? null : 'gender')}
            >
              View Gender Categories {activeDropdown === 'gender' ? '▲' : '▼'}
            </button>
            {activeDropdown === 'gender' && (
              <div className={styles.dropdownContent}>
                {dashboardData.genderStats.map((gender, index) => (
                  <button
                    key={index}
                    className={styles.categoryBtn}
                    onClick={() => openGallery(
                      gender.images, 
                      `${gender._id} (${gender.images.length} images)`
                    )}
                  >
                    {gender._id} ({gender.images.length})
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Emotion Distribution Chart */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Emotion Distribution</h3>
          <div className={styles.chartContainer}>
            <Bar data={emotionData} options={chartOptions} />
          </div>
          <div className={styles.dropdownSection}>
            <button 
              className={styles.dropdownBtn}
              onClick={() => setActiveDropdown(activeDropdown === 'emotion' ? null : 'emotion')}
            >
              View Emotions {activeDropdown === 'emotion' ? '▲' : '▼'}
            </button>
            {activeDropdown === 'emotion' && (
              <div className={styles.dropdownContent}>
                {dashboardData.emotionStats.map((emotion, index) => (
                  <button
                    key={index}
                    className={styles.categoryBtn}
                    onClick={() => openGallery(
                      emotion.images, 
                      `${emotion._id} (${emotion.images.length} images)`
                    )}
                  >
                    {emotion._id} ({emotion.images.length})
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ImageGallery 
        isOpen={galleryData.isOpen}
        images={galleryData.images}
        title={galleryData.title}
        onClose={closeGallery}
      />
    </div>
  );
}
