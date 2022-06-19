import React from "react";
import "./ShowPopUp.css";
import { Rating } from "react-simple-star-rating";
import moment from "moment";

const ShowPopUp = ({ data }) => {
  return (
    <div className="mapContainer">
      <h1>Pin Details</h1>
      <h3>Location Name: {`${data?.location}`}</h3>
      <h3>
        Current Time: {`${moment(new Date(data.time)).format("HH:mm A")}`}
      </h3>
      <h3>Current Temp: {`${data?.temp} C`}</h3>
      <h3>Weather: {`${data?.weather}`}</h3>

      <div className="box">
        <label htmlFor="name">Name</label>
        <span>{data.name}</span>
      </div>
      <div className="box">
        <label htmlFor="name">Description</label>
        <span>{data.description}</span>
      </div>
      <div className="box">
        <label htmlFor="name">Rating</label>
        <span>
          <Rating ratingValue={data.rating} />
        </span>
      </div>
      <div className="box">
        <label htmlFor="name">Tags</label>
        <span>{data.tags}</span>
      </div>
      <div className="added">
        <label className="addedlabel" htmlFor="addedBy">
          Added By
        </label>
        <span className="addedname">{data.userId.name}</span>
      </div>
    </div>
  );
};

export default ShowPopUp;
