import { useState } from "react";
import { Rating } from "react-simple-star-rating";
import "./AddPopUp.css";
import { useMutation, useQueryClient } from "react-query";
import { addPin } from "../../services/apiCalls";
import { useEffect } from "react";

const AddPopUp = (props) => {
  const [data, setData] = useState({
    name: "",
    desc: "",
    rating: "",
    tags: "",
    lat: "",
    long: "",
    userId: "",
  });
  const [message, setMessage] = useState("");
  const query = useQueryClient();

  const handleRating = (ratingNumber) => {
    setData({ ...data, rating: ratingNumber });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  useEffect(() => {
    setData({
      ...data,
      lat: props.lat,
      long: props.long,
      userId: props?.user?._id,
    });

    return () => {
      setData({
        name: "",
        desc: "",
        rating: "",
        tags: "",
        lat: "",
        long: "",
        userId: "",
      });
    };
  }, [props.lat, props.long, props?.user?._id, message]);

  const { mutate, isLoading } = useMutation(addPin, {
    onSuccess: (res) => {
      setMessage("Pin Added Successfully");
      setData({
        name: "",
        desc: "",
        rating: "",
        tags: "",
      });
      props.setDataAdded(true);
      query.invalidateQueries("pins");
    },
    onError: (error) => {
      setMessage(error.message.data);
    },
    onSettled: (res, error) => {},
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ data });
  };

  return (
    <div className="mapContainer">
      <h1>Add Pin Details</h1>
      <form onSubmit={handleSubmit}>
        <div className="box">
          <label htmlFor="name">Name</label>
          <input
            name="name"
            type="text"
            value={data.name}
            autoComplete="off"
            onChange={handleChange}
            placeholder="Add name"
            className="input-class"
          />
        </div>
        <div className="box">
          <label htmlFor="name">Description</label>
          <textarea
            name="desc"
            type="text"
            value={data.desc}
            onChange={handleChange}
            placeholder="Add description"
            className="text-class"
            rows="50"
            cols="5"
          ></textarea>
        </div>
        <div className="box">
          <label htmlFor="name">Rating</label>
          <span>
            <Rating onClick={handleRating} ratingValue={data.rating} />
          </span>
        </div>
        <div className="box">
          <label htmlFor="name">Tags</label>
          <input
            name="tags"
            type="text"
            value={data.tags}
            autoComplete="off"
            onChange={handleChange}
            placeholder="Add tags"
            className="input-class"
          />
        </div>
        {message && (
          <p style={{ textAlign: "center", marginTop: "10px" }}>{message}</p>
        )}
        <div className="box">
          <button type="submit" className="submit">
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPopUp;
