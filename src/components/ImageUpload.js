import { Button } from "@material-ui/core";
import React, { useState } from "react";
import db, { storage } from "../firebase";
import firebase from "firebase";
import './ImageUpload.scss'

const ImageUpload = ({username}) => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`instagramImages/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      // err  function
      (err) => {
        console.log(err.message);
      },
      // complete function
      () => {
          storage
              .ref("instagramImages")
              .child(image.name)
              .getDownloadURL()
              .then(url => {
                  db.collection('intagram').add({
                      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                      caption,
                      imageUrl: url,
                      username
                  })
                setProgress(0)
                setCaption('')
                setImage(null)
              })
      }
    );
  };

  return (
    <div className="imageUpload">
      <progress className="imageUpload__progress" value={progress} max="100" />
      <input
        type="text"
        value={caption}
        placeholder="Enter a caption ..."
        onChange={(e) => setCaption(e.target.value)}
      />
      <input type="file" name="" id="" onChange={handleChange} />
      <Button className="imageUpload__button" onClick={handleUpload}>Upload</Button>
    </div>
  );
};

export default ImageUpload;
