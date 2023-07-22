import {
  Avatar,
  Box,
  makeStyles,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { color } from "../../../assets/styles/_color";
import Video from "../Video";
import Audio from "../Audio";
import PanTool from "@material-ui/icons/PanTool";
import { useDispatch, useSelector } from "react-redux";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import { setPinParticipant } from "../../../store/actions/layout";
import PinParticipant from "../PinParticipant";
import classnames from "classnames";
import { videoShadow, calculateSteamHeightAndExtraDiff, isMobileOrTab } from "../../../utils";
import AudioLevelIndicator from "../AudioIndicator";
import SubTitle from "../SubTitle";
import { useDocumentSize } from "../../../hooks/useDocumentSize";
import { profile } from "../../../store/reducers/profile";
import { useWindowResize } from "../../../hooks/useWindowResize";

const VideoBox = ({
  participantTracks,
  participantDetails,
  localUserId,
  width,
  height,
  isPresenter,
  isActiveSpeaker,
  isFilmstrip,
  isLargeVideo,
  isTranscription,
  numParticipants
}) => {
    
  const useStyles = makeStyles((theme) => ({
    root: {
      position: "relative",
      overflow: "hidden",
      borderRadius: "8px",
      background: color.secondary,
      display: "flex",
      flexDirection: "column",
      transform: "translateZ(0)",
      "& .largeVideo": {
        height: theme.spacing(20),
        width: theme.spacing(20),
        fontSize: "40pt",
      },
      [theme.breakpoints.down("sm")]: {
          background: numParticipants>1 ? color.secondary : "transparent",
      },
    },
    audioBox: {
      background: numParticipants>1 ? color.secondary : "transparent",
      position: "absolute",
      top: 0,
      zIndex: 1,
      display: "flex",
      justifyContent: "flex-end",
      padding: theme.spacing(1),
      color: color.white,
      "& svg": {
        background: color.secondary,
        borderRadius: "50%",
        padding: "5px",
        [theme.breakpoints.down("sm")]: {
          background: numParticipants>1 ? color.secondary : "transparent",
        },
      },
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(0.25, 1, 1, 0.25),
      },
    },
    controls: {
      cursor: "pointer",
      color: "white",
      height: "20px",
      width: "20px",
      position: "absolute",
      margin: "auto",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      padding: "8px",
    },
    videoBorder: {
      boxSizing: "border-box",
      border: `3px solid ${color.primaryLight}`,
      borderRadius: "8px",
      position: "absolute",
      width: "100%",
      height: "100%",
      zIndex: "999",
    },
    textBox: {
      bottom: 0,
      display: "flex",
      justifyContent: "flex-start",
      padding: theme.spacing(1),
      color: color.white,
      background: "transparent",
      position: "absolute",
      "& p": {
        padding: "2px 4px",
      },
    },
    avatarBox: {
      height: "100%",
      width: "100%",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexGrow: 1,
    },
    avatar: {
      borderRadius: "50%",
      position: "absolute",
      transition: "box-shadow 0.3s ease",
      height: numParticipants === 1 ? theme.spacing(20) : theme.spacing(10),
      width: numParticipants === 1 ? theme.spacing(20) :theme.spacing(10),
      fontSize: numParticipants ===1 && '40pt'
    },
    rightControls: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      padding: theme.spacing(1),
      right: 0,
      zIndex: "9999",
    },
    handRaise: {
      marginLeft: "8px",
      color: color.primary,
      lineHeight: "0!important",
    },
    disable: {
      background: color.red,
      borderColor: `${color.red} !important`,
      "&:hover": {
        opacity: "0.8",
        background: `${color.red} !important`,
      },
    },
    subtitle: {
      position: "absolute",
      bottom: 0,
    },
    videoWrapper: {
      position: "absolute",
      right: 0,
      left: 0,
      top: 0,
      bottom: 0,
      margin: "auto",
    },
  }));
  const classes = useStyles();
  const { pinnedParticipant, raisedHandParticipantIds } = useSelector(
    (state) => state.layout
  );
  let videoTrack = isPresenter
    ? participantTracks?.find((track) => track?.getVideoType() === "desktop")
    : participantTracks?.find((track) => track?.getType() === "video");
  if (isLargeVideo && pinnedParticipant.isPresenter === false) {
    videoTrack = participantTracks?.find(
      (track) => track.getType() === "video"
    );
  }
  const audioTrack = participantTracks?.find((track) => track?.isAudioTrack());
  const audioIndicator = useSelector((state) => state.audioIndicator);
  const dispatch = useDispatch();
  const [visiblePinParticipant, setVisiblePinPartcipant] = useState(true);
  let audioLevel = audioIndicator[participantDetails?.id];
  const subtitle = useSelector((state) => state.subtitle);
  const conference = useSelector((state) => state.conference);
  const { documentWidth, documentHeight } = useDocumentSize();

  const togglePinParticipant = (id) => {
    dispatch(setPinParticipant(id, isPresenter));
  };

  const audioIndicatorActiveClasses = classnames(classes.avatar, {
    largeVideo: isLargeVideo,
  });

  const avatarActiveClasses = classnames(classes.avatarBox);
  const { videoStreamHeight, videoStreamDiff } =
    calculateSteamHeightAndExtraDiff(
      width,
      height,
      documentWidth,
      documentHeight,
      isPresenter,
      isActiveSpeaker
    );
  let avatarColor = participantDetails?.avatar || profile?.color;

   const getVideoContainerWidth = (videoStreamHeight) => {
      if(isMobileOrTab()) {
        if( isPresenter ) return '100%'; 
      }
      return `${(videoStreamHeight * 16) / 9}px`
    }
  return (
    <Box
      style={{ width: `${width}px`, height: `${height}px` }}
      onMouseEnter={() => setVisiblePinPartcipant(true)}
      onMouseLeave={() => setVisiblePinPartcipant(false)}
      className={classes.root}
    >
      {conference?.getParticipantCount() > 1 &&
        isActiveSpeaker &&
        !isPresenter && <div className={classes.videoBorder}></div>}
      <Box className={classnames(classes.audioBox, { audioBox: true })}>
        {audioTrack?.isMuted() ? <MicOffIcon /> : <MicIcon />}
        {!audioTrack?.isLocal() && <Audio track={audioTrack} />}
      </Box>
      {videoTrack?.isMuted() ? (
        <Box className={avatarActiveClasses}>
          <Avatar
            src={null}
            style={
              isFilmstrip
                ? {
                    boxShadow: videoShadow(audioLevel),
                    background: avatarColor,
                  }
                : { background: avatarColor }
            }
            className={audioIndicatorActiveClasses}
          >
            {participantDetails?.name?.slice(0, 1)?.toUpperCase()}
          </Avatar>
        </Box>
      ) : (
        <Box
          style={{
            width: getVideoContainerWidth(videoStreamHeight),
            height: `${videoStreamHeight}px`,
            left: `-${videoStreamDiff / 2}px`,
            position: "absolute",
          }}
          className={classes.videoWrapper}
        >
          <Video isPresenter={isPresenter} track={videoTrack} />
        </Box>
      )}
      <Box
        className={classnames(classes.rightControls, { rightControls: true })}
      >
        {visiblePinParticipant && (
          <PinParticipant
            participantId={participantDetails?.id}
            pinnedParticipantId={pinnedParticipant.participantId}
            togglePinParticipant={togglePinParticipant}
          />
        )}
        {raisedHandParticipantIds[participantDetails?.id] && (
          <Typography className={classes.handRaise}>
            <PanTool />
          </Typography>
        )}
      </Box>
      <Box className={classnames(classes.textBox, { userDetails: true })}>
        <Typography>
          {localUserId === participantDetails?.id
            ? "You"
            : participantDetails?.name}
        </Typography>
      </Box>
      {!isFilmstrip && (
        <Box>
          <AudioLevelIndicator passedAudioLevel={audioLevel} />
        </Box>
      )}
      {isTranscription && subtitle.text && (
        <Box className={classes.subtitle}>
          <SubTitle subtitle={subtitle} />
        </Box>
      )}
    </Box>
  );
};

export default VideoBox;
