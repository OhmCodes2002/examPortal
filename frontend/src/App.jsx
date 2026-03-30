import React, { useState } from 'react';
import './index.css';
import AIProctor from './AIProctor';
import PracticeArena from './PracticeArena';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar glass-panel" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderTop: 'none', borderBottom: 'none' }}>
        <div style={{ padding: '0 1rem', marginBottom: '3.5rem' }}>
          <h2 style={{ color: 'var(--primary-color)', fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '2rem' }}>⚡</span> CodeExam
          </h2>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
             📊 Dashboard
          </div>
          <div className={`nav-item ${activeTab === 'arena' ? 'active' : ''}`} onClick={() => setActiveTab('arena')}>
            ⚔️ Practice Arena
          </div>
          <div className={`nav-item ${activeTab === 'mock' ? 'active' : ''}`} onClick={() => setActiveTab('mock')}>
            👁️ AI Proctor Monitoring
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h1>Welcome back, Alex 🚀</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Here is your performance snapshot for this week.</p>
              </div>
              <button className="btn-primary" onClick={() => setActiveTab('mock')}>
                 Start Proctored Exam
              </button>
            </header>

            <section className="dashboard-grid">
              <div className="stat-card glass-panel">
                <span className="stat-title">Global Percentile</span>
                <span className="stat-value">92.4%</span>
                <p style={{ color: 'var(--success-color)', fontSize: '0.9rem', marginTop: '0.75rem', fontWeight: 500 }}>
                  ↑ 4.2% from last week
                </p>
              </div>
              
              <div className="stat-card glass-panel" style={{ '--primary-color': '#a371f7' }}>
                <span className="stat-title">Tests Completed</span>
                <span className="stat-value">24</span>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.75rem' }}>
                  4 in the last 7 days
                </p>
              </div>
              
              <div className="stat-card glass-panel" style={{ '--primary-color': '#238636' }}>
                <span className="stat-title">Coding Accuracy</span>
                <span className="stat-value">88%</span>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.75rem' }}>
                  Based on 150 submissions
                </p>
              </div>
            </section>
          </>
        )}

        {activeTab === 'mock' && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <header style={{ marginBottom: '1.5rem' }}>
              <h1>Secure Exam Environment</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                The AI Proctor is actively monitoring your session using WebRTC and TensorFlow.js Face Detection.
              </p>
            </header>
            
            <div style={{ display: 'flex', gap: '2rem', flex: 1 }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                 {/* Exam Content Placeholder */}
                 <div className="glass-panel" style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3>Question 1 (Coding Module)</h3>
                    <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                       Implement an algorithm to detect a cycle in a linked list. Return true if a cycle exists, otherwise false.
                    </p>
                    <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(0,0,0,0.4)', borderRadius: '8px', color: '#58a6ff', fontFamily: 'monospace', border: '1px solid var(--border-color)' }}>
                       {'>_ Secure Docker execution container will mount here...'}
                    </div>
                 </div>
              </div>
              
              <div style={{ width: '420px' }}>
                <AIProctor />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'arena' && (
          <PracticeArena />
        )}
      </main>
    </div>
  );
}

export default App;
