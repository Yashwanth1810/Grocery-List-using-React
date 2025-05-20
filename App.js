import React, { useState } from 'react';
import './App.css';
import image from './shopping.jpg';
import imageTwo from './man.jpg';
import { GroceryList } from './GroceryList';
import Login from './Login';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div className='app'>
      <div className='container'>
        <img src={image} width="200px" alt="shopping"/>
      </div>
      <div className='container'>
        <GroceryList />
      </div>
      <div className='container'>
        <img src={imageTwo} width="200px" alt="man" />
      </div>
    </div>
  );
}

export default App;