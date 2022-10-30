import React, { useEffect } from "react";
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import shareVideo from "../assets/share.mp4";
import logo from "../assets/icons8-pin-40.png";

import { client } from "../client";

const Login = () => {
  // call as hook
  const navigate = useNavigate();
  // const clientId = `${process.env.REACT_APP_GOOGLE_API_TOKEN}`;

  useEffect(() => {
    gapi.load("client:auth2", () => {
      gapi.auth2.init({ clientId: process.env.REACT_APP_GOOGLE_API_TOKEN });
    });
  }, []);

  const responseGoogle = (response) => {
    console.log(response);
    localStorage.setItem("user", JSON.stringify(response.profileObj));

    // destructure some of the properties
    const { name, googleId, imageUrl } = response.profileObj || {};

    //create new sanity document for each user and save to db
    const doc = {
      _id: googleId,
      _type: "user",
      userName: name,
      image: imageUrl,
    };

    //will only create an account/document if it doesn't already exist in the db
    client.createIfNotExists(doc).then(() => {
      //specify what happens after new user is created - redirect to homepage
      navigate("/", { replace: true });
    });
  };

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />

        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="p-5 flex gap-2 mt-2 items-center">
            <img src={logo} width="50px" alt="logo" className="flex"/>
            <h1 className="text-3xl font-bold text-white drop-shadow-xl">PinMe</h1>
          </div>
          <GoogleLogin
            clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}
            render={(renderProps) => (
              <button
                type="button"
                className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
              >
                <FcGoogle className="mr-4" /> Sign in with Google
              </button>
            )}
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={"single_host_origin"}
          />
          <div className="shadow-2xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
