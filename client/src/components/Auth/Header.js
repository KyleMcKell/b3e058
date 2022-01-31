import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "end",
    alignItems: "center",
    padding: "30px 42px",
    gap: "30px",
    // defining explicit height so Form calc always works12=\
    height: "60px"
  },
  question: {
    fontSize: "1rem",
    color: theme.palette.secondary.main,
    [theme.breakpoints.down("xs")]: {
      display: "none"
    }
  },
  button: {
    fontSize: "1rem",
    color: theme.palette.primary.main,
    padding: "16px 52px",
    boxShadow: "0px 2px 12px hsl(215 34% 44% / 0.2)",
    borderRadius: "5px"
  }
}));

const Header = ({ question, children }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Typography variant="h3" className={classes.question}>
        {question}
      </Typography>
      {children}
    </Box>
  );
};

export default Header;
