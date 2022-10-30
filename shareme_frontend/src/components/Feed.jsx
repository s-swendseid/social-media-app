import React, { useState, useEffect } from "react";
import { useParams, userParams } from "react-router-dom";

import { client } from "../client";
import { feedQuery, searchQuery } from "../utils/data";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const Feed = () => {
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState(null);
  const { categoryId } = useParams();

  // called at start of app, and called anytime that those categories change (url)
  // recall useEffect everytime a category changes
  useEffect(() => {
    setLoading(true);

    // updates specific category, otherwise update/search for all categories
    if (categoryId) {
      const query = searchQuery(categoryId);

      // fetch all pins for a specific category
      client.fetch(query).then((data) => {
        setPins(data);
        setLoading(false);
      });
    } else {
      client.fetch(feedQuery).then((data) => {
        setPins(data);
        setLoading(false);
      });
    }
  }, [categoryId]);

  if (loading) return <Spinner message="Adding new ideas to your feed!" />;

  if (!pins?.length) return <h1 className="text-center text-2xl font-bold">No pins found</h1>;

  return <div>{pins && <MasonryLayout pins={pins} />}</div>;
};

export default Feed;
