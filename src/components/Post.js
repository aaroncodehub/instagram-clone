import { Avatar } from "@material-ui/core";
import React from "react";
import "./Post.scss";

const Post = ({username, caption, imageUrl}) => {
  return (
    <div className="post">
      <div className="post__header">
        <Avatar className='post__avatar' alt='Aaron' />
              <h3>{username}</h3>
      </div>
        <img
          className="post__image"
          src={imageUrl}
          alt=""
        />
        <p className="post__text">
          <strong>{username}</strong> {caption}
        </p>
    </div>
  );
};

export default Post;
