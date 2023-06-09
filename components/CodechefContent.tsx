/* eslint-disable react/no-danger */
import React, { useState, useRef } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, MenuItem, Typography } from "@material-ui/core";
import { Paper, TextField } from "@mui/material";
import GitHubIcon from "@material-ui/icons/GitHub";
import BubbleChartIcon from "@material-ui/icons/BubbleChart";
import ImageIcon from "@material-ui/icons/Image";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import IconButton from "./IconButton";
import { themes } from "../static/theme";

const ENDPOINT = "https://coding-profile.vercel.app";
// const ENDPOINT = "http://localhost:3000";

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: "auto",
    backgroundColor: theme.palette.info.light,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: theme.spacing(5),
  },
  successStatus: {
    color: theme.palette.primary.main,
  },
  errorStatus: {
    color: theme.palette.secondary.main,
  },
  colSection: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },
  rowSection: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "row",
  },
  textFieldLabel: {
    color: theme.palette.primary.main,
    marginRight: "30px",
  },
  textInput: {
    color: "white",
  },
}));

function CodechefContent(): JSX.Element {
  const classes = useStyles();

  // Username
  const nameRef = useRef("");

  const getValue = (ref: React.MutableRefObject<string>): string => {
    const cur = ref.current as unknown as HTMLTextAreaElement;
    return cur.value;
  };

  // Theme
  const [theme, setTheme] = useState("Light");

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    setTheme(target.value);
  };

  // Status
  const [statusText, setStatusText] = useState("Status: awaiting generation");

  // Action buttons
  const [generated, setGenerated] = useState(false);
  const [imgCopied, setImgCopied] = useState(false);
  const [mdCopied, setMdcopied] = useState(false);

  // Dynamic svg component
  const [svg, setSvg] = useState("");

  const resetStates = () => {
    setImgCopied(false);
    setMdcopied(false);
    setSvg("");
    setGenerated(false);
  };

  // onClick function for git button
  const gitOnClick = () => {
    window.open(
      "https://github.com/Pranshu321/coding-profiles",
      "_blank",
      "noopener, noreferrer"
    );
  };

  // onClick function for generate button
  const genOnClick = () => {
    resetStates();
    setStatusText("Status: generating...");

    const username = getValue(nameRef);
    // User did not enter username
    if (username === "") {
      setStatusText("Status : please enter username above");
      return;
    }

    axios
      .get(`${ENDPOINT}/api/check?username=${username}&theme=${theme}`, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((response) => {
        setSvg(response.data as string);
        setGenerated(true);
        setStatusText("Status : successfully generated");
      })
      .catch(() => {
        setGenerated(false);
        setStatusText(`Status : backend error occurred`);
      });
  };

  // onClick function for copy image button
  const imgCopyOnClick = () => {
    const username = getValue(nameRef);
    navigator.clipboard.writeText(
      `${ENDPOINT}/api/check?username=${username}&theme=${theme}`
    );
    setImgCopied(true);
  };

  // onClick function for copy markdwn button
  const mdCopyOnClick = () => {
    const username = getValue(nameRef);
    const imgUrl = `${ENDPOINT}/api/check?username=${username}&theme=${theme}`;
    const redirectUrl = "https://github.com/Pranshu321/coding-profiles";
    navigator.clipboard.writeText(
      `[![${username}'s LeetCode Stats](${imgUrl})](${redirectUrl})`
    );
    setMdcopied(true);
  };

  return (
    <Grid item>
      <Paper
        elevation={12}
        className={classes.paper}
        sx={{
          width: { xs: "90%", md: "50%" },
          backgroundColor: "#191B21",
          color: "white",
        }}
      >
        <div className={classes.colSection}>
          <Typography
            color="primary"
            align="center"
            variant="h2"
            className={classes.text}
          >
            Codechef Stats
          </Typography>
          <Typography
            color="primary"
            align="center"
            variant="body2"
            style={{ marginTop: "10px", marginBottom: "10px" }}
          >
            Made by Pranshu Jain with ❤️
          </Typography>
          <IconButton
            text="GitHub"
            icon={<GitHubIcon />}
            color="primary"
            onClick={gitOnClick}
          />
        </div>
        <div className={classes.rowSection}>
          <TextField
            fullWidth
            autoComplete="off"
            label="Username"
            placeholder="Username"
            sx={{
              width: { lg: "20rem" },
              input: { color: "white" },
            }}
            inputRef={nameRef}
            InputLabelProps={{
              shrink: true,
              className: classes.textFieldLabel,
              style: {
                color: "white",
              },
            }}
            InputProps={{
              className: classes.textInput,
              style: {
                color: "white",
              },
            }}
          />
          <TextField
            fullWidth
            select
            label="Theme"
            value={theme}
            onChange={handleThemeChange}
            InputLabelProps={{
              className: classes.textFieldLabel,
              style: {
                color: "white",
              },
            }}
            InputProps={{
              className: classes.textInput,
              style: {
                color: "white",
              },
            }}
            sx={{
              color: "white",
            }}
            style={{ marginLeft: "30px" }}
          >
            {Object.keys(themes).map((themeX) => {
              const key = themeX as keyof typeof themes;
              return (
                <MenuItem key={themes[key].value} value={themes[key].value}>
                  {themes[key].value}
                </MenuItem>
              );
            })}
          </TextField>
        </div>
        <div
          className={generated ? classes.successStatus : classes.errorStatus}
        >
          {statusText}
        </div>
        <div className={classes.rowSection}>
          <IconButton
            text="Generate"
            icon={<BubbleChartIcon />}
            color="primary"
            onClick={genOnClick}
          />
        </div>
        <div dangerouslySetInnerHTML={{ __html: svg }} />
        {generated && (
          <div className={classes.rowSection}>
            <IconButton
              text={imgCopied ? "Copied" : "Copy Image URL"}
              icon={<ImageIcon />}
              color="primary"
              onClick={imgCopyOnClick}
            />
            <IconButton
              text={mdCopied ? "Copied" : "Copy Markdown"}
              icon={<BorderColorIcon />}
              color="primary"
              onClick={mdCopyOnClick}
            />
          </div>
        )}
      </Paper>
    </Grid>
  );
}

export default CodechefContent;
