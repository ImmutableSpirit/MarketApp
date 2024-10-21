// Watchlist.jsx
import React, { useState } from 'react';
import './Watchlist.css';

const Watchlist = ({ selectedTicker, onSelectTicker }) => {
  const [ticker, setTicker] = useState('');
  const [watchlist, setWatchlist] = useState([]);  

  const handleAddTicker = () => {
    if (ticker && !watchlist.includes(ticker.toUpperCase())) {
      setWatchlist([...watchlist, ticker.toUpperCase()]);
      setTicker('');
    }
  };

  const handleRemoveTicker = (tickerToRemove) => {
    setWatchlist(watchlist.filter(t => t !== tickerToRemove));
    if (selectedTicker === tickerToRemove) {
        onSelectTicker(null);
    }
  };

  return (
    <div className="watchlist">
      <div className="watchlist-input">
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          placeholder="Enter stock ticker"
        />
        <button className="add-button" onClick={handleAddTicker}>+</button>
      </div>
      <div className="watchlist-container">
        <ul className="watchlist-items">
            {watchlist.map((item) => (
            <li key={item}>
                <span 
                className={`ticker-span ${selectedTicker === item ? 'selected' : ''}`}
                onClick={() => onSelectTicker(item)}
                >
                {item}
                </span>
                <button className="remove-button" onClick={() => handleRemoveTicker(item)}>-</button>
            </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Watchlist;