import React from "react";
import { useState, useEffect } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { client, urlFor } from "../client";
import MasonryLayout from "./MasonryLayout";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";
import Spinner from "./Spinner";

const PinDetail = ({ user }) => {
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const { pinId } = useParams(); // pinId is dynamic and can fetch with useParams

  // function to add a comment
  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(pinId) //update the pin
        .setIfMissing({ comments: [] }) // if there's no comments yet, set to empty array
        .insert("after", "comments[-1]", [
          // then insert the comment at the end
          {
            comment,
            _key: uuidv4(),
            postedBy: { _type: "postedBy", _ref: user?._id },
          },
        ])
        .commit() // after inserting, have to commit the insertion
        .then(() => {
          //returns a promise
          fetchPinDetails();
          setComment("");
          setAddingComment(false);
        });
    }
  };

  // fetch all pindetails from sanity
  const fetchPinDetails = () => {
    let query = pinDetailQuery(pinId);

    if (query) {
      //returns an array of pins
      //first getting one individual pin and setting to pinDetail
      client.fetch(query).then((data) => {
        setPinDetail(data[0]);

        //then later we want to get all related pins (similar title, same category)
        //used for recommendations
        if (data[0]) {
          //fetch more details about this pin
          query = pinDetailMorePinQuery(data[0]); //calling with the actual post we received

          //set pins equal to that response
          client.fetch(query).then((res) => setPins(res));
        }
      });
    }
  };

  // only change when the pinId changes
  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  if (!pinDetail) return <Spinner message="Loading pin..." />;

  return (
    <>
      {pinDetail && (
        <div
          className="flex xl-flex-row flex-col m-auto bg-white"
          style={{ maxWidth: "1500px", borderRadius: "32px" }}
        >
          {/* display image */}
          <div className="flex justify-center items-center md:items-start flex-initial">
            {/* if there's an image, then passes the image detail */}
            <img
              src={pinDetail?.image && urlFor(pinDetail?.image).url()}
              alt="user-post"
              className="rounded-t-3xl rounded-b-lg"
            />
          </div>

          {/* other details */}
          <div className="w-full p-5 flex-1 xl:min-w-620">
            <div className="flex items-center justify-between">
              {/* download image button */}
              <div className="flex gap-2 items-center">
                <a
                  href={`${pinDetail.image?.asset?.url}?dl=`}
                  download
                  // stopPropagation makes sure it only does downloading stuff and doesn't redirect to pin detail
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {/* display the url */}
              <a href={pinDetail.destination} target="_blank" rel="noreferrer">
                {pinDetail.destination}
              </a>
            </div>

            {/* display pin title */}
            <div>
              <h1 className="text-4xl font-bold break-words mt-3">
                {pinDetail.title}
              </h1>
              {/* about */}
              <p className="mt-3">{pinDetail.about}</p>
            </div>

            {/* link to user profile */}
            <Link
               to={`user-profile/${pinDetail.postedBy?._id}`}
              className="flex gap-2 mt-5 items-center bg-white rounded-lg"
            >
              <img
                src={pinDetail?.postedBy.image}
                alt="user-profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <p className="font-semibold capitalize">
                {pinDetail?.postedBy.userName}
              </p>
            </Link>

            <h2 className="mt-5 text-2xl">Comments</h2>
            {/* container for comments */}
            <div className="max-h-370 overflow-y-auto">
              {/* loop and render a div for each comment - some pindetails won't have comments */}
              {pinDetail?.comments?.map((item) => (
                <div
                  className="flex gap-2 mt-5 items-center bg-white rounded-lg"
                  key={item.comment}
                >
                  <img
                    src={item.postedBy?.image}
                    alt="user-profile"
                    className="w-10 h-10 rounded-full cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <p className="font-bold">{item.postedBy?.userName}</p>
                    <p>{item.comment}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* container for creating comments */}
            <div className="flex flex-wrap mt-6 gap-3">
              <Link to={`user-profile/${pinDetail?.postedBy?._id}`}>
                <img
                  src={pinDetail?.postedBy?.image}
                  alt="user-profile"
                  className="w-10 h-10 rounded-full cursor-pointer"
                />
              </Link>
              <input
                type="text"
                className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                type="button"
                className="bg-red-400 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
                onClick={addComment}
              >
                {addingComment ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}

      {pins?.length > 0 ? (
        <>
          <h2 className="text-center font-bold text-2xl mt-8 mb-4">
            More like this
          </h2>
          <MasonryLayout pins={pins} />
        </>
      ) : (
        <Spinner message="Loading more pins..." />
      )}
    </>
  );
};

export default PinDetail;
