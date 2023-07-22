import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {		
  Box,		
  makeStyles		
} from "@material-ui/core";		


const IOSTypeSwitch = withStyles((theme) => ({
  root: {
    width: 42,
    height: 28,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(16px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: '#52d869',
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: '#52d869',
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
    height: '26px'
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

const useStyles = makeStyles(()=>({		
  label: {		
    display: 'flex',		
    flexDirection: 'row',		
    flexWrap: 'nowrap'		
  }		
}))

export default function IOSSwitch(props) {
  const classes = useStyles();
  const {handleChange}  = props; 
  const [state, setState] = React.useState({
    checked: true
  });

  const handleChangeLocal = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
    handleChange(event.target);
  };

  return (
    <FormGroup>
      <Typography component="div">
        <Grid component="label" container alignItems="center" spacing={1} className={classes.label}>
          <Typography style={{fontSize:'0.8rem'}}>No</Typography>
          <Box style={{padding: '4px 0px'}}>
            <IOSTypeSwitch checked={state.checked} onChange={handleChangeLocal} name="checked" />
          </Box>
          <Typography style={{fontSize:'0.8rem'}}>Yes</Typography>
        </Grid>
      </Typography>
    </FormGroup>
  );
}
