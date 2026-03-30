import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

const PracticeArena = () => {
  const [code, setCode] = useState('// Write your solution here\nfunction detectCycle(head) {\n  \n}\n\n// console.log("Test execution");\n');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('idle');

  const handleRunCode = async () => {
    setStatus('running');
    setOutput('Executing code in secure sandbox...');
    
    try {
      const response = await fetch('http://localhost:5000/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ language: 'javascript', code }),
      });
      
      const data = await response.json();
      setOutput(data.output || data.error || 'Execution finished with no output.');
    } catch (err) {
      setOutput('Failed to connect to execution engine.');
    } finally {
      setStatus('finished');
    }
  };

  return (
    <div style={{ display: 'flex', gap: '2rem', height: '100%', flexDirection: 'column' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Practice Arena</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Solve algorithmic challenges in your preferred language.</p>
        </div>
        <button 
          className="btn-primary" 
          onClick={handleRunCode}
          disabled={status === 'running'}
        >
          {status === 'running' ? '⚙️ Executing...' : '▶ Run Code'}
        </button>
      </header>

      <div style={{ display: 'flex', gap: '2rem', flex: 1, minHeight: '500px' }}>
        {/* Code Editor Pane */}
        <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '0.8rem 1rem', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 500 }}>index.js</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>JavaScript (Node)</span>
          </div>
          <div style={{ flex: 1 }}>
            <Editor
              height="100%"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val)}
              options={{ minimap: { enabled: false }, fontSize: 14 }}
            />
          </div>
        </div>

        {/* Output Pane */}
        <div className="glass-panel" style={{ width: '400px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '0.8rem 1rem', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--border-color)' }}>
            <span style={{ fontWeight: 500 }}>Execution Output</span>
          </div>
          <pre style={{ padding: '1rem', color: '#e6edf3', fontFamily: 'monospace', whiteSpace: 'pre-wrap', overflowY: 'auto', flex: 1 }}>
            {output || '> Waiting for execution...'}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default PracticeArena;
