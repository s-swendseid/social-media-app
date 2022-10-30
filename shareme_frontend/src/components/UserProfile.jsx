import React, { useState, useEffect } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import { GoogleLogout } from "react-google-login";

import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from "../utils/data";
import { client } from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const randomImg =
  "https://source.unsplash.com/1600x900/?nature,photography,technology";

const activeBtnStyles =
  "bg-red-400 text-white font-bold p-2 rounded-full w-25 outline-none";
const notActiveBtnStyles =
  "bg-primary mr-4 text-black font-bold p-2 rounded-full w-25 outline-none";

export const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState("Created"); //created or saved pins
  const [activeBtn, setActiveBtn] = useState("created");
  const navigate = useNavigate();
  const { userId } = useParams();

  //fetches the user info
  useEffect(() => {
    const query = userQuery(userId);

    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, [userId]);

  // fetching the created and saved posts
  useEffect(() => {
    if (text === "Created Posts") {
      const createdPinsQuery = userCreatedPinsQuery(userId);

      client.fetch(createdPinsQuery).then((data) => {
        setPins(data);
      });
    } else if(text === "Saved Posts") {
      const savedPinsQuery = userSavedPinsQuery(userId);

      client.fetch(savedPinsQuery).then((data) => {
        setPins(data);
      });
    }
  }, [text, userId]);

  // logout functionality
  const logout = () => {
    localStorage.clear();

    navigate("/login");
  };

  if (!user) {
    return <Spinner message="Loading profile..." />;
  }

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            {/* banner */}
            <img
              src={randomImg}
              alt="banner-pic"
              className="w-full h-370 2xl:h-510 shadow-lg object-cover"
            />
            {/* user image */}
            <img
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
              src={user.image}
              alt="user-pic"
            />
            {/* username */}
            <h1 className="font-bold text-3xl text-center mt-3">
              {user.userName}
            </h1>
            {/* logout */}
            <div className="absolute top-0 z-1 right-0 p-2">
              {userId === user._id && (
                <GoogleLogout
                  clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}
                  render={(renderProps) => (
                    <button
                      type="button"
                      className="bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      <AiOutlineLogout color="red" fontSize={21} />
                    </button>
                  )}
                  onLogoutSuccess={logout}
                  cookiePolicy={"single_host_origin"}
                />
              )}
            </div>
          </div>

          {/* buttons */}
          <div className="text-center mb-7">
            {/* Refers to the posts this user has created*/}
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent); //holds contents of button
                setActiveBtn("Created Posts");
              }}
              className={`${
                activeBtn === "Created Posts" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Created Posts
            </button>

            {/* Refers to the posts this user has saved*/}
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent); //holds contents of button
                setActiveBtn("Saved Posts");
              }}
              className={`${
                activeBtn === "Saved Posts" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Saved Posts
            </button>
          </div>

          {/* Displays the created pins */}
          {pins?.length ? (
            <div className="px-2">
              <MasonryLayout pins={pins} />
            </div>
          ) : (
            <div className="flex justify-center font-bold items-center w-full text-xl mt-2">
              <h2>No pins found</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
