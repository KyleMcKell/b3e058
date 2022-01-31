import React from "react";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 4
    // 100% - 2x the height of our header to center plus a little more to make it look nicer
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    minWidth: "380px",
    gap: "3rem",
    [theme.breakpoints.down("xs")]: {
      minWidth: "90vw"
    }
  },
  heading: {
    fontWeight: 600,
    fontSize: "clamp(1.875rem, 2vw + 1rem, 2.4rem)"
  },
  adornmentLink: {
    fontWeight: 600
  },
  textfield: {
    width: "100%",
    maxWidth: "400px",
    "&:last-of-type": {
      marginBottom: "1.5rem"
    }
  }
}));

const Form = ({ onSubmit, children }) => {
  const classes = useStyles();

  return (
    <form onSubmit={onSubmit} className={classes.root}>
      <Box className={classes.formContainer}>{children}</Box>
    </form>
  );
};

export default Form;
