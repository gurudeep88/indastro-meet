import React, { useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core";
import { color } from "../../../assets/styles/_color";

const useStyles = makeStyles(() => ({
  video: {},
}));

const Video = (props) => {
  const classes = useStyles();
  const { track, isPresenter, borderRadius, width, height, left } = props;
  const videoElementRef = useRef(null);
  useEffect(() => {
    track?.attach(videoElementRef.current);
  }, [track]);

  if (!track) {
    return null;
  }

  return (
    <video
      playsInline="1"
      autoPlay="1"
      ref={videoElementRef}
      style={{
        left: "-1px",
        top: "-1px",
        position: props.position || "absolute",
        width: "calc(100% + 2px)",
        height: props.height || "calc(100% + 2px)",
        objectFit: "contain",
        borderRadius: "8px",
        transform: isPresenter ? 'initial' : `scaleX(-1)`,
      }}
    />
  );
};

export default Video;
