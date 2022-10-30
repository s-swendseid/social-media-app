import React from "react";
import Masonry from "react-masonry-css";
import Pin from "./Pin";

// setting up the masonry layout for different screen sizes
const breakpointObj = {
  default: 4,
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 2,
  500: 1,
};

// displays the pins in a masonry layout
const MasonryLayout = ({ pins }) => {
  return (
    <Masonry className="flex animate-slide-fw" breakpointCols={breakpointObj}>
      {/* displaying the pin(s) */}
      {pins?.map((pin) => (
        <Pin key={pin._id} pin={pin} className="w-max"/>
      ))}
    </Masonry>
  );
};

export default MasonryLayout;
