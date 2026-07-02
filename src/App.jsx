import { useState } from 'react';
import { convertValue } from './lib/converter.js';

function App() {
  const [architecture, setArchitecture] = useState('ARM64');
  const [type, setType] = useState('INT');
  const [value, setValue] = useState('');
  const [boolValue, setBoolValue] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleConvert = () => {
    setError(null);
    setResult(null);
    
    const inputValue = type === 'Boolean' ? String(boolValue) : value.trim();
    
    if (!inputValue) {
      setError('Please enter a value');
      return;
    }
    
    try {
      const conversionResult = convertValue(architecture, type, inputValue);
      setResult(conversionResult);
    } catch (err) {
      setError(err.message);
    }
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(`${type} copied!`);
    } catch {
      alert('Failed to copy');
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>GuraMods Tools</h1>
        <p>Advanced tools for game modding</p>
      </header>

      <div className="card">
        <div className="page-title">
          <h2>Value To Hex</h2>
        </div>

        <div className="form-group">
          <label>Architecture</label>
          <div className="radio-group">
            <div className="radio-item">
              <input
                type="radio"
                name="architecture"
                value="ARM32"
                id="arm32"
                checked={architecture === 'ARM32'}
                onChange={(e) => setArchitecture(e.target.value)}
              />
              <label htmlFor="arm32">ARM32</label>
            </div>
            <div className="radio-item">
              <input
                type="radio"
                name="architecture"
                value="ARM64"
                id="arm64"
                checked={architecture === 'ARM64'}
                onChange={(e) => setArchitecture(e.target.value)}
              />
              <label htmlFor="arm64">ARM64</label>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="typeSelect">Type</label>
          <select
            id="typeSelect"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="INT">INT</option>
            <option value="Float">Float</option>
            <option value="Boolean">Boolean</option>
          </select>
        </div>

        {type === 'Boolean' ? (
          <div className="form-group">
            <label>Value</label>
            <div className="boolean-options">
              <div className="radio-item">
                <input
                  type="radio"
                  name="booleanValue"
                  value="true"
                  id="boolTrue"
                  checked={boolValue === true}
                  onChange={() => setBoolValue(true)}
                />
                <label htmlFor="boolTrue">True</label>
              </div>
              <div className="radio-item">
                <input
                  type="radio"
                  name="booleanValue"
                  value="false"
                  id="boolFalse"
                  checked={boolValue === false}
                  onChange={() => setBoolValue(false)}
                />
                <label htmlFor="boolFalse">False</label>
              </div>
            </div>
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="valueInput">Value</label>
            <input
              type="text"
              id="valueInput"
              placeholder={type === 'Float' ? 'Enter float value (e.g., 3.14)' : 'Enter value'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
        )}

        <button className="btn" onClick={handleConvert}>
          Convert
        </button>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {result && (
          <div className="result-section">
            <div className="result-item">
              <div className="result-header">
                <h3>
                  Hex Code
                  <span className="result-label">ARM</span>
                </h3>
                <button
                  className="copy-btn"
                  onClick={() => copyToClipboard(result.hex, 'Hex')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  Copy
                </button>
              </div>
              <div className="result-box">
                {result.hex}
              </div>
            </div>

            <div className="result-item">
              <div className="result-header">
                <h3>
                  Assembly Code
                  <span className="result-label">ASM</span>
                </h3>
                <button
                  className="copy-btn"
                  onClick={() => copyToClipboard(result.assembly, 'Assembly')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  Copy
                </button>
              </div>
              <div className="result-box asm">
                {result.assembly}
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="footer">
        <p>&copy; 2025 GuraMods. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
