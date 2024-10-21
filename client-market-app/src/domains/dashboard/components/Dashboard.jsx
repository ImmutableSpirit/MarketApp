import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './Dashboard.css';
import Chart from './Chart';
import { useUser } from '../../authentication/context/UserContext';
import Watchlist from './Watchlist';

const Dashboard = () => {  
  const [socket, setSocket] = useState(null);  
  const { user } = useUser(); // Get the user object from context
  const email = user ? user.email : null; // Access email safely
  const [selectedTicker, setSelectedTicker] = useState('EUR/USD');  // Using a currency pair as a default since forex has more uptime
  const [prices, setPrices] = useState({});

  // Handler to be passed to Watchlist
  const handleSelectedTicker = (ticker) => {
    setSelectedTicker(ticker);
    // trigger any actions needed when a new ticker is selected
  };

  // Set up the initial connection (runs only once)
  useEffect(() => {
    if (!socket) {
      const newSocket = io('http://localhost:5000', {
        withCredentials: true,
        transports: ['websocket']
      });
      setSocket(newSocket);

      return () => {
        //newSocket.close();
        newSocket.disconnect();
      };
    }       
  }, []);
  
  // Update the ticker each time a new one is selected
  useEffect(() => {
    if (socket && selectedTicker) { 
      const encodedTicker = encodeURIComponent(selectedTicker);
  
      const subscribeTicker = async () => {
        try {
          const response = await fetch(`/api/market-data/subscribe/${encodedTicker}`, { 
            method: 'POST',
            credentials: 'include'
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log('Subscribed:', data);
  
          // Remove any existing listeners for this ticker
          socket.off(`tickerUpdate:${selectedTicker}`);
  
          // Add new listener
          socket.on(`tickerUpdate:${selectedTicker}`, (data) => {
            console.log('Received update:', data);
            setPrices(prevPrices => ({
              ...prevPrices,
              [selectedTicker]: data.price
            }));
          });
        } catch (error) {
          console.error('Subscription error:', error);
        }
      };
  
      subscribeTicker();
  
      return () => {
        socket.off(`tickerUpdate:${selectedTicker}`);
        
        const unsubscribeTicker = async () => {
          try {
            const response = await fetch(`/api/market-data/unsubscribe/${encodedTicker}`, { 
              method: 'POST',
              credentials: 'include'
            });
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Unsubscribed:', data);
          } catch (error) {
            console.error('Unsubscription error:', error);
          }
        };
  
        unsubscribeTicker();
      };
    }
  }, [socket, selectedTicker]);

  return (    
    <div className="dashboard">
     <header className="header">
       <div className="logo">MarketApp</div>
       <div className="userInfo">Signed in as {email ? email : 'Guest'}</div>
     </header>
     <aside className="sidebar">       
       <h2>Watchlist</h2>       
       <Watchlist 
          selectedTicker={selectedTicker} 
          onSelectTicker={handleSelectedTicker}
        />
     </aside>
     <main className="mainContent">      
      <div>
        <div className="priceInfo">
          <h2>{selectedTicker} Price: {prices[selectedTicker] || 'Loading...'}</h2>
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
