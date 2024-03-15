import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  let [page, setPage] = useState(1);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    let params = {
      page: page, 
      limit: 20,
    }
  
    try {
      axios.post(`https://api.spacexdata.com/v4/launches/query`, { options: params })
        .then(res => {
          const data = res.data;
          console.log(data);
          setPage(page++);
          setItems((items) => [...items, ...data.docs]);
          console.log(page);
        })
      
    } catch (error) {
      setError(error);
      
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isLoading) {
      return;
    }
    fetchData();
  };
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading]);

  function formatDate(date) {
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString([],options);
  }

  return (
    <div className='container'>
      <ul className='display-list'>
        {
          items.map((item, index) => (
            <>
              <li key={item.id}>
                <div className="display-name">
                  <span className='rocket-number'>Flight No. {item.flight_number}: </span>
                  <span className='rocket-name'>{item.name}</span>
                  <span className='rocket-date'>({formatDate(item.date_local)})</span>
                </div>
                <p className='rocket-details'><strong>Details:</strong> <span>{item.details ? item.details : 'No details to share.'}</span></p>
              </li>
              { index == 204 && <li className='rocket-all' key={`${index}-last`}>All data have been fetched.</li> }
            </>
          ))
        }
      </ul>
      {
        isLoading && <p className='spinner'><span class="loader"></span></p>
      }
      {
        error && <p>Error: {error.message}</p>
      }
    </div>
  );
};

export default App
