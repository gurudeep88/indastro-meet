import React, { useEffect, useRef, useState} from "react";
import {
    Avatar,
    Box,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    makeStyles,
    Typography,
    Tooltip
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import clsx from "clsx";
import IconButton from "@material-ui/core/IconButton";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import SendIcon from "@material-ui/icons/Send";
import {color} from "../../../assets/styles/_color";
import { encodeHTML, formatAMPM, linkify } from "../../../utils";		
import MediaChat from "../MediaChat";
import FileAttached from "../FileAttached";


const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        height: "93%",
        right: "2px",
        justifyContent: "space-between",
        margin: theme.spacing(3, 0, 0, 0),
        paddingBottom: theme.spacing(3),
    },
    form: {
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
        border: `1px solid ${color.primaryLight}`,
        borderRadius: '40px',
        "& fieldset": {
            border: 'none'
        }
    },
    margin: {
        width: '100%',
        "& label": {
            fontSize: '0.8rem',
            color: color.white,
        },
        "& .MuiFormLabel-root.Mui-focused": {
            color: 'transparent'
        },
        "& .MuiInputBase-input":{
            fontSize: '0.8rem'
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: `${color.secondary} !important`
        },
        "& .MuiOutlinedInput-root.Mui-focused": {
            "& svg": {
                color: color.white
            }
        },
        "& textarea": {
            color: color.white
        },
        "& .MuiOutlinedInput-multiline": {
            padding: '12.5px 14px'
        }
    },
    link: {
        color: 'red !important'
    },
    outlinedInput: {
        background: color.lightgray,
        borderRadius: "30px",
        padding: '12.5px 14px',
        "& svg": {
            color: color.white
        },
    },
    input: {
        "&::placeholder": {
            color: 'white',
            background: 'red',

        }
    },
    chatList: {
        overflow: "auto",
        height: "100%",
        boxSizing: 'border-box',
        "& .MuiAvatar-root": {
            width: '30px',
            height: '30px',
            fontSize: '0.8rem'
        },
        "& h6": {
            fontSize: '1rem',
            lineHeight: 1,
            marginBottom: '8px',
        },
        "& p": {
            fontSize: "0.75rem",
            "& a": {
                color: `${color.link} !important`
            }
        }
    },
    listItem: {
        alignItems: 'flex-start',
        paddingLeft: '12px',
        paddingRight: '12px'
    },
    listItemText: {
        paddingRight: '5px',
        wordBreak: 'break-word',
        marginTop: 0,
        color: color.white,
        "& p": {
            color: color.white
        }
    },
    time: {
        whiteSpace: 'nowrap',
        color: color.secondaryLight
    },
    sendIcon: {
        padding: '2px 12px 2px 6px',
        color: color.white,
        '&:hover':{
            background: 'none'
        },
        '&:hover svg':{
            color: color.primaryLight
        }
    }
}));

const ChatPanel = () => {
    const classes = useStyles();
    const conference = useSelector((state) => state.conference);
    const messages = useSelector((state) => state.message);
    const [currentMessage, setCurrentMessage] = useState("");
    let [fileAttached, setFileAttached] = useState([]);
    const avatarColors = useSelector(state=>state.color);
    const profile = useSelector(state => state.profile);
    const refEl = useRef(null);


    const handleChange = (event) => {
        setCurrentMessage(event.target.value);
    };

    const scrollRef = useRef(null);

    const scrollToBottom = () => {
        setTimeout(()=> {
            scrollRef.current.scrollIntoView({behavior: 'smooth'})
        }, 0);
    }
    
    const startFileUpload =(fileData)=> {
        const index = fileAttached.findIndex(item=>fileData.id === item.id);
                
        if ( index >= 0 ) {
           const item  = fileAttached[index];
           item.status = fileData.status;
           item.url = fileData.url;
           
           fileAttached[index] = item;
        } else {
           setFileAttached([...fileAttached, fileData]);
        }
     }

     const removeAttachment = (id) => {
        setFileAttached(fileAttached.filter(file => file.id !== id));
     }
    const handleClickSubmit = (e) => {
        if(fileAttached.find(item => item.status === 'loading')){
            return;
        }
        if(currentMessage){
            conference.sendMessage(encodeHTML(currentMessage));
        }
        if(fileAttached.length){
            fileAttached.map(item => {
                if(item.status === 'done'){
                    conference.sendMessage(encodeHTML(item.url));
                }
            })
        }
        setCurrentMessage("");
        setFileAttached([]);
    }
    
    const handleMouseDown = (event) => {
        event.preventDefault();
    };

    useEffect(()=>{
        const handler  = (e)=>{
            if (refEl?.current?.contains(e.target)) {
                e.preventDefault();
                e.stopPropagation();
            }
        }
        document.addEventListener('dblclick', handler, true);
        return ()=>{
            document.removeEventListener('dblclick', handler);
        }
    },[])
    
    useEffect(() => {
        scrollToBottom();
    }, [messages.length])

    return (
        <Box ref={refEl} className={classes.root}>
            <List className={classes.chatList}>
                {messages.map((newMessage, index) => {
                    return (
                    <ListItem key={index} className={classes.listItem}>
                        {/* <ListItemAvatar>
                            <Avatar src={ newMessage?.user?.avatar ? newMessage?.user?.avatar : null } style={{background: avatarColors[newMessage?.user?.id], marginTop: '5px'}} >{newMessage?.user?.name?.toUpperCase()?.slice(0, 1)}</Avatar>
                        </ListItemAvatar> */}
                        <ListItemText 
                            className={classes.listItemText}>
                            <Typography variant="h6" className="MuiTypography-root MuiListItemText-primary MuiTypography-body1 MuiTypography-displayBlock">{newMessage?.user?.name}</Typography>
                            <p className="MuiTypography-root MuiListItemText-secondary MuiTypography-body2 MuiTypography-colorTextSecondary MuiTypography-displayBlock"
                            dangerouslySetInnerHTML={{__html: linkify(newMessage?.text, {className: classes.link})}}>
                            </p>
                        </ListItemText>
                        <Typography variant = "caption" className={classes.time}>{formatAMPM(newMessage?.time)}</Typography>
                    </ListItem>
                    )}
                )}
                <ListItem ref={scrollRef} style={{height: '18px'}}></ListItem>
            </List>
            {
                fileAttached.length>0 && (
                    <Box className={classes.cb__chatWrapper__attachements}>
                        {
                            fileAttached.map((file, index)=>(
                                <FileAttached 
                                    key={index}
                                    fileData={file}
                                    removeAttachment={removeAttachment}
                                />
                            ))
                        }
                    </Box>
                )
            }
            <form onSubmit={handleClickSubmit} className={classes.form}>
            {<MediaChat
                                    startFileUpload={startFileUpload}
                                    sessionInfo={profile}
                                    currentMessage={currentMessage}
                                />}
                <FormControl
                    className={clsx(classes.margin, classes.textField)}
                    variant="outlined"
                >
{/*                     
                    <InputLabel htmlFor="outlined-adornment-submit">
                        Type Here
                    </InputLabel> */}
                    <OutlinedInput
                        placeholder="Send a message to everyone"
                        autoComplete='off'
                        id="outlined-adornment-submit"
                        value={currentMessage}
                        onChange={handleChange}
                        multiline
                        maxRows={1}
                        inputProps={{
                            classes: {input: classes.input}
                        }}
                        endAdornment={
                            <InputAdornment position="end">
                                
                                <Tooltip title="Send" placement='top'>
                                    <IconButton
                                        aria-label="handle submit"
                                        onClick={handleClickSubmit}
                                        onMouseDown={handleMouseDown}
                                        edge="end"
                                        className={classes.sendIcon}
                                    >
                                        <SendIcon />
                                    </IconButton>
                                </Tooltip>
                            </InputAdornment>
                        }
                        labelWidth={70}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleClickSubmit();
                                setCurrentMessage("");
                            }
                        }}
                    />
                </FormControl>

            </form>
        </Box>
    );
};

export default ChatPanel;
