import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";

import { Navbar, Feed, PinDetail, CreatePin, Search } from "../components";

// back in home component, we're passing as prop to the Pin container
const Pins = ({ user }) => {
   // creating search in pins since we need this accross multiple components 
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="px-2 md:px-5">
      <div className="bg-grey-50">
        {/* Navbar will contain a seach component */}
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} user={user && user}/>
      </div>
      {/* Setting up the routes */}
      <div className="h-full">
        <Routes>
            <Route path="/" element={<Feed />}/>
            <Route path="/category/:categoryId" element={<Feed />}/>
            <Route path="/pin-detail/:pinId" element={<PinDetail user={ user }/>}/>
            <Route path="/create-pin" element={<CreatePin user={ user }/>}/>
            <Route path="/search" element={<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>}/>
        </Routes>
      </div>
    </div> 
  );
};

export default Pins;
