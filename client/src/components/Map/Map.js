import React from "react";
import { useMapEvents } from "react-leaflet";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { Marker } from "react-leaflet/Marker";
import { Popup } from "react-leaflet/Popup";
import "./Map.css";
import * as L from "leaflet";
import ShowPopUp from "../ShowPopUp/ShowPopUp";
import AddPopUp from "../AddPopUp/AddPopUp";
import { useState } from "react";
import Login from "../Login/Login";
import Register from "../Register/Register";
import { useQuery } from "react-query";
import { pins } from "../../services/apiCalls";
import { useEffect } from "react";
import jwt_decode from "jwt-decode";
import Autocomplete from "react-google-autocomplete";

function MyComponent(props) {
  const map = useMapEvents({
    click: (e) => {
      if (props.currentUser) {
        props.callback(e.latlng.lat, e.latlng.lng);
        props.showAdd();
        map.setView([e.latlng.lat, e.latlng.lng], props.zoomValue);
      }
      map.locate();
    },
    locationfound: (e) => {},
  });
  props.zoomUpdate &&
    map.flyTo(
      { lat: props.selectedLatLng.lat, lng: props.selectedLatLng.lng },
      props.zoomValue,
      {
        duration: 2,
      }
    );
  props.updateZoom();
  return null;
}

const Map = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showAddPopUp, setShowAddPopUp] = useState(false);
  const [dataAdded, setDataAdded] = useState(false);
  const [currentLat, setCurrentLat] = useState("");
  const [currentLng, setCurrentLng] = useState("");
  const [zoomUpdate, setZoomUpdate] = useState(false);
  const [zoomValue, setZoomValue] = useState(3);
  const [selectedLatLng, setSelectedLatLng] = useState({
    lat: "32.2733",
    lng: "75.6522",
  });
  const [currentUser, setCurrentUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );

  const { data, error, isError, isLoading } = useQuery(["pins"], pins, {
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const LeafIcon = L.Icon.extend({
    options: {},
  });

  const blueIcon = new LeafIcon({
      iconUrl:
        "https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|abcdef&chf=a,s,ee00FFFF",
    }),
    greenIcon = new LeafIcon({
      iconUrl:
        "https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|2ecc71&chf=a,s,ee00FFFF",
    });

  useEffect(() => {
    const currentDate = new Date();
    const accessToken = currentUser?.accessToken;
    if (accessToken) {
      const decodedToken = jwt_decode(accessToken);
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        localStorage.clear();
        setCurrentUser(null);
      }
    }
  }, [currentUser]);

  const updateLatlng = (lat, lng) => {
    setCurrentLat(lat);
    setCurrentLng(lng);
  };

  const updateZoom = () => {
    setZoomUpdate(false);
  };

  const showPopUp = () => {
    setShowAddPopUp(true);
  };

  const closeRegisterPopUp = () => {
    setShowRegister(false);
  };

  const closeLoginPopUp = () => {
    setShowLogin(false);
  };

  const updateCurrentUser = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.clear();
    setCurrentUser(null);
  };

  if (isError) {
    return <p>Something Went Wrong - {error}</p>;
  }

  if (isLoading) {
    return (
      <p
        style={{
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
          margin: "auto",
          textAlign: "center",
          minHeight: "100vh",
        }}
      >
        Loading Map...
      </p>
    );
  }

  return (
    <div className="countryContainer">
      <div className="autocomplete">
        <Autocomplete
          apiKey="AIzaSyAXU2HNNzrbBHDQiG5-A0nSa9jpXNLPPDE"
          onPlaceSelected={(place) => {
            if (place) {
              const details = JSON.parse(
                JSON.stringify(place?.geometry?.location)
              );
              setSelectedLatLng({ lat: details.lat, lng: details.lng });
              setZoomUpdate(true);
              setZoomValue(10);
            }
          }}
          options={{}}
          defaultValue="Pathankot"
        />
        ;
      </div>
      <div className="upperButtons">
        {!currentUser ? (
          <>
            <button className="loginButton" onClick={() => setShowLogin(true)}>
              Login
            </button>
            <button
              className="registerButton"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </>
        ) : (
          <button className="logoutButton" onClick={handleLogout}>
            Log Out
          </button>
        )}
      </div>
      <MapContainer
        style={{ width: "100vw", height: "100vh" }}
        center={[selectedLatLng.lat, selectedLatLng.lng]}
        zoom={zoomValue}
        scrollWheelZoom={true}
      >
        <MyComponent
          callback={updateLatlng}
          showAdd={showPopUp}
          currentUser={currentUser}
          selectedLatLng={selectedLatLng}
          zoomUpdate={zoomUpdate}
          updateZoom={updateZoom}
          zoomValue={zoomValue}
        />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {data?.map((item) => {
          return (
            <Marker
              key={item._id}
              icon={
                currentUser?._id === item.userId?._id ? greenIcon : blueIcon
              }
              position={[item.lat, item.long]}
            >
              <Popup>
                <ShowPopUp data={item} />
              </Popup>
            </Marker>
          );
        })}
        {showAddPopUp || dataAdded ? (
          <Marker position={[currentLat, currentLng]} icon={blueIcon}>
            <Popup>
              <AddPopUp
                lat={currentLat}
                long={currentLng}
                setDataAdded={setDataAdded}
                user={currentUser}
              />
            </Popup>
          </Marker>
        ) : (
          ""
        )}
      </MapContainer>
      {showRegister && <Register callback={closeRegisterPopUp} />}
      {showLogin && (
        <Login
          callback={closeLoginPopUp}
          setCurrentUser={setCurrentUser}
          updateCurrentUser={updateCurrentUser}
          setShowLogin={setShowLogin}
        />
      )}
    </div>
  );
};

export default Map;
