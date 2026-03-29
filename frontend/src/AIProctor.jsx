import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';
import { io } from 'socket.io-client';

// Connect to the Node.js proctoring events websocket server
const socket = io('http://localhost:5000');

const AIProctor = () => {
  const webcamRef = useRef(null);
  const [model, setModel] = useState(null);
  const [status, setStatus] = useState('Initializing AI Proctoring... ⏳');
  const [isFlagged, setIsFlagged] = useState(false);

  useEffect(() => {
    // Ensure TensorFlow.js backend is fully ready before loading
    const loadAiModel = async () => {
      await tf.ready();
      const loadedModel = await blazeface.load();
      setModel(loadedModel);
      setStatus('AI Proctoring Active ✅');
    };
    loadAiModel();
  }, []);

  useEffect(() => {
    let interval;
    if (model) {
      interval = setInterval(() => {
        detectFaces();
      }, 1500); // Check frames every 1.5 seconds
    }
    return () => clearInterval(interval);
  }, [model]);

  const detectFaces = async () => {
    if (
      webcamRef.current &&
      webcamRef.current.video &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      // Predict faces
      const predictions = await model.estimateFaces(video, false);

      let eventData = null;
      if (predictions.length === 0) {
        eventData = { type: 'NO_FACE_DETECTED', timestamp: Date.now() };
        setStatus('⚠️ WARNING: Face not detected in frame!');
        setIsFlagged(true);
      } else if (predictions.length > 1) {
        eventData = { type: 'MULTIPLE_FACES_DETECTED', timestamp: Date.now() };
        setStatus('🚨 ALERT: Multiple faces detected! Possible cheating attempt.');
        setIsFlagged(true);
      } else {
        setStatus('AI Proctoring Active ✅ - Environment Secure');
        setIsFlagged(false);
        eventData = { type: 'HEARTBEAT_OK', timestamp: Date.now() };
      }

      if (eventData) {
        // Emit securely to backend
        socket.emit('proctoring_event', eventData);
      }
    }
  };

  return (
    <div className={`glass-panel ${isFlagged ? 'flagged-alert' : ''}`} style={{ padding: '1.5rem', marginTop: '1.5rem', transition: 'border-color 0.3s', borderColor: isFlagged ? 'var(--danger-color)' : 'var(--border-color)' }}>
      <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', color: isFlagged ? 'var(--danger-color)' : 'inherit' }}>
        <span>👁️</span> AI Live Proctoring
      </h3>
      <div style={{ position: 'relative', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid', borderColor: isFlagged ? 'var(--danger-color)' : 'var(--border-color)' }}>
        <Webcam
          ref={webcamRef}
          audio={false}
          style={{ width: '100%', display: 'block' }}
        />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: isFlagged ? 'rgba(218,54,51,0.85)' : 'rgba(0,0,0,0.7)', color: '#fff', padding: '0.6rem', fontSize: '0.9rem', textAlign: 'center', fontWeight: 600, backdropFilter: 'blur(4px)' }}>
           {status}
        </div>
      </div>
    </div>
  );
};

export default AIProctor;
