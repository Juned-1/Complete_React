"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import classes from "./image-picker.module.css";
export default function ImagePicker({ label, name }) {
  //we will hide input element(to hide its ugly button look) and make explicit connect it to input
  const [pickedImage, setPickedImage] = useState();
  const imageRef = useRef();
  function handlePick() {
    imageRef.current.click();
  }
  function handleImageChange(event) {
    const file = event.target.files[0]; //multiple click upload multiple file in files array by adding multiple in input element
    if (!file) {
      //if user did not pick up a file
      setPickedImage(null);
      return;
    }
    //to prview image we have to convert it inot data url, we do it using FileReader class
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPickedImage(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }
  return (
    <div className={classes.picker}>
      <label htmlFor="image">{label}</label>
      <div className={classes.controls}>
      <div className={classes.preview}>
          {!pickedImage && <p>No image picked yet!</p>}
          {pickedImage && (
            <Image
              src={pickedImage}
              alt="The image selected by the user"
              fill
            />
          )}
        </div>
        <input
          className={classes.input}
          type="file"
          id={name}
          accept="image/png, image/jpeg"
          name={name}
          ref={imageRef}
          onChange={handleImageChange}
          required
        />
        <button className={classes.button} type="button" onClick={handlePick}>
          Pick An Image
        </button>
      </div>
    </div>
  );
}
