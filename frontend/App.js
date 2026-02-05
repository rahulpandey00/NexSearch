import React, { useState, useEffect } from 'react';

function App() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState({ results: [], source: '', latency: '' });

  // Debounce logic: Wait for the user to stop typing
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query) {
        fetch(`http://localhost:8000/search?q=${query}`)
          .then(res => res.json())
          .then(resData => setData(resData));
      }
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
      <h1>NexSearch 🚀</h1>
      <input 
        type="text" 
        placeholder="Search for products..." 
        style={{ padding: '10px', width: '300px' }}
        onChange={(e) => setQuery(e.target.value)} 
      />
      <div style={{ marginTop: '20px' }}>
        {data.source && <p><b>Source:</b> {data.source} | <b>Speed:</b> {data.latency}</p>}
        {data.results.map(item => (
          <div key={item.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <h3>{item.name}</h3>
            <p>{item.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
