import React, { useState, useEffect } from "react";
import "./App.scss";
import Post from "./components/Post";
import db, { auth } from "./firebase";
import { Modal, makeStyles, Input, Button } from "@material-ui/core";
import ImageUpload from "./components/ImageUpload";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    height: "300px",
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    height: 200,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  useEffect(() => {
    db.collection("intagram").onSnapshot((snapshot) =>
      setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    );
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [username, user]);

  const handleLogin = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpen(false);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    setRegisterOpen(false);
  };


  return (
    <div className="app">
      <ImageUpload/>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__login">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={handleLogin}>Login</Button>
          </form>
        </div>
      </Modal>

      <Modal open={registerOpen} onClose={() => setRegisterOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__login">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={handleRegister}>Register</Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
        {user?.displayName ? (
          <div className="app__headerRight">
            <Button onClick={() => auth.signOut()}>Logout</Button>
          </div>
        ) : (
          <form className="app__loginHome">
            <Button onClick={() => setOpen(true)}>Login</Button>
            <Button onClick={() => setRegisterOpen(true)}>Sign Up</Button>
          </form>
        )}
      </div>

      <Post
        username="Aaron"
        caption="it is working"
        imageUrl="http://sharpeye.co.nz/img/product/balustrade/Double-Disk01.jpg"
      />
      <Post />
      <Post />
    </div>
  );
}

export default App;
