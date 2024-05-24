import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from "./components/pages/Dashboard";
import FoodOrder from "./components/pages/FoodOrder";
import Invalid from "./components/pages/Invalid";
import History from "./components/pages/History";
import Login from "./components/pages/Login";
import Restaurant from "./components/pages/Restaurants";
import RequireAuthWithNavbar from "./components/wrappers/RequireAuthWithNavbar";

function App() {
  return (
    <BrowserRouter>
        <Routes>
          {/* with navbar*/}
          <Route exact path='/' element={<RequireAuthWithNavbar><Dashboard /></RequireAuthWithNavbar>} />
          <Route exact path='/restaurant/:id' element={<RequireAuthWithNavbar><Restaurant /></RequireAuthWithNavbar>} />
          <Route exact path='/orders' element={<RequireAuthWithNavbar><FoodOrder /></RequireAuthWithNavbar>} />
          <Route exact path='/history' element={<RequireAuthWithNavbar><History /></RequireAuthWithNavbar>} />

          {/* without navbar */}
          <Route exact path='login' element={<Login />} />
          <Route exact path='*' element={<Invalid />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;