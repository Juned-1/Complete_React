import { useRef, useState, useEffect, useCallback } from "react";

import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from "./loc.js";

const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
const storedPlaces = storedIds.map((id) =>
  AVAILABLE_PLACES.find((place) => place.id === id)
);
function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedPlace = useRef();
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);
  //to get current location of user native JS by default provide navigator obkect, this takes some time to load hence need a callback to get location -- async
  //this entire code is side effect -- because this code is needed but it is not directly related to main goal of application
  //this location caluculation might be called at some point when component execution is finished
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      //position object in callback return latitude and longitude
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      );
      setAvailablePlaces(sortedPlaces);
    });
  }, []);
  //redundant useEffect() -- local storage fetching is synchronous unlike fetching location which is asynchronous there is no callback or promise
  //Therefore App component is not finished executed before fetching this data from local storgae is done.
  /*useEffect(() => {
    const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    const storedPlaces = storedIds.map((id) =>
      AVAILABLE_PLACES.find((place) => place.id === id)
    );
    setPickedPlaces(storedPlaces);
  }, []);*/
  function handleStartRemovePlace(id) {
    setIsModalOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setIsModalOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });
    //following codes are side effect -- this storing of places is totally unrelated to JSX render
    //We do not need useEffect here as well as we can not use it inside function
    //This code get executed when only user select a place. And there is nothing wrong executing inside this function which run on click
    const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    if (storedIds.indexOf(id) === -1) {
      localStorage.setItem(
        "selectedPlaces",
        JSON.stringify([id, ...storedIds])
      );
    }
  }
  const handleRemovePlace = useCallback(function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setIsModalOpen(false);
    const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    localStorage.setItem(
      "selectedPlaces",
      JSON.stringify(storedIds.filter((id) => id !== selectedPlace.current))
    );
  }, []);

  return (
    <>
      <Modal open={isModalOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText="Sorting places by distances..."
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
