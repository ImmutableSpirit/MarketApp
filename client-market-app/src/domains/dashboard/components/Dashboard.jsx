import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './Dashboard.css';
import Chart from './Chart';

const Dashboard = () => {
  const [userEmail, setUserEmail] = useState("example@email.com");
  const [price, setPrice] = useState(null);
  const [socket, setSocket] = useState(null);
  const ticker = 'EUR/USD'; // Example ticker

  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      withCredentials: true,
      transports: ['websocket']
    });
    setSocket(newSocket);
    
    const encodedTicker = encodeURIComponent(ticker);
    // Subscribe to ticker
    fetch(`/api/market-data/subscribe/${encodedTicker}`, { 
      method: 'POST',
      credentials: 'include'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Subscribed:', data);
      newSocket.on(`tickerUpdate:${ticker}`, (data) => {
        console.log('Received update:', data);
        setPrice(data.price);
      });
    })
    .catch(error => {
      console.error('Subscription error:', error);
      // Handle subscription error here
    });

    return () => {
      newSocket.off(`tickerUpdate:${ticker}`);
      newSocket.close();
      // Unsubscribe from ticker
      fetch(`/api/market-data/unsubscribe/${encodedTicker}`, { 
        method: 'POST',
        credentials: 'include'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Unsubscribed:', data);
        // Handle unsubscription success here
      })
      .catch(error => {
        console.error('Unsubscription error:', error);
        // Handle unsubscription error here
      });
    };
  }, []);

  return (    
    <div className="dashboard">
     <header className="header">
       <div className="logo">MarketApp</div>
       <div className="userInfo">Signed in as {userEmail}</div>
     </header>
     <aside className="sidebar">
       {/* Sidebar content */}
       <h2>Watchlist</h2>
       <p>Add your tickers here.</p>
     </aside>
     <main className="mainContent">      
      <div>
        <div className="priceInfo">
          <h2>{ticker} Price: {price || 'Loading...'}</h2>
        </div>
        <div className="chartWrapper">
          <Chart />
        </div>
      </div>
     </main>
   </div>
  );
};

export default Dashboard;
