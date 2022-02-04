import React, { useState, useRef } from "react";
import {
  FormControl,
  FilledInput,
  Grid,
  InputAdornment
} from "@material-ui/core";
import FileCopyIcon from "@material-ui/icons/FileCopyOutlined";
import SentimentSatisfiedOutlinedIcon from "@material-ui/icons/SentimentSatisfiedOutlined";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { postMessage } from "../../store/utils/thunkCreators";

const useStyles = makeStyles(() => ({
  root: {
    justifySelf: "flex-end",
    marginTop: 15
  },
  input: {
    padding: "0px 28px",
    height: 70,
    backgroundColor: "#F4F6FA",
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 20,
    color: "#9CADC8",
    fontWeight: 600,
    "&:hover": {
      backgroundColor: "#d7dade",
      color: "#77797d"
    }
  },
  previewGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
    gap: "10px",
    background: "#F4F6FA",
    padding: 10,
    borderRadius: 8
  },
  previewImg: {
    borderRadius: 8,
    width: 100,
    height: 100,
    objectFit: "cover"
  },
  endAdornment: {
    display: "flex",
    gap: 20,
    color: "#b7babd"
  },
  endAdornmentIcon: {
    "&:hover": {
      color: "#5a6066",
      cursor: "pointer"
    }
  },
  fileFormControl: {
    display: "none"
  }
}));

const Input = (props) => {
  const classes = useStyles();
  const [text, setText] = useState("");
  const [imageSrcs, setImageSrcs] = useState([]);
  const [sending, setSending] = useState(false);
  const { postMessage, otherUser, conversationId, user } = props;

  // text input ref to put focus
  const textInputRef = useRef(null);

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  // when files are added, display them as a preview
  const handleFileChange = (fileChangeEvent) => {
    const files = fileChangeEvent.target.files;
    // adjust focus to be able to send images without another click
    textInputRef.current.focus();
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = function (e) {
        setImageSrcs((previousSrcs) => [...previousSrcs, e.target.result]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSending(true);

    // uploading images to cloudinary
    const formData = new FormData();
    formData.append("upload_preset", "hatchways");

    // setting up array to call Promise.all on later
    const promises = [];

    for (let i = 0; i < imageSrcs.length; i++) {
      // if file already exists, this will replace the old file
      formData.append("file", imageSrcs[i]);

      // creating promise to upload file
      const fetchPromise = fetch(
        "https://api.cloudinary.com/v1_1/kylemckell/image/upload",
        {
          method: "POST",
          body: formData
        }
      )
        .then((res) => res.json())
        .then((data) => data.url);

      promises.push(fetchPromise);
    }

    // resolving all promises that upload to cloudinary
    const attachments = await Promise.all(promises);

    if (text || attachments.length > 0) {
      const reqBody = {
        text: event.target.text.value,
        attachments,
        conversationId,
        recipientId: otherUser.id,
        sender: conversationId ? null : user
      };
      postMessage(reqBody);
    }

    setText("");
    setSending(false);
    setImageSrcs([]);
  };

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      {imageSrcs.length > 0 && !sending && (
        <Grid className={classes.previewGrid}>
          {imageSrcs.map((src, index) => (
            <img
              key={index}
              src={src}
              alt="preview"
              className={classes.previewImg}
            />
          ))}
        </Grid>
      )}

      <FormControl fullWidth hiddenLabel>
        <FilledInput
          classes={{ root: classes.input }}
          disableUnderline
          placeholder="Type something..."
          value={text}
          name="text"
          inputProps={{
            ref: textInputRef
          }}
          endAdornment={
            <InputAdornment position="end" className={classes.endAdornment}>
              <SentimentSatisfiedOutlinedIcon
                className={classes.endAdornmentIcon}
              />
              <label htmlFor="file">
                <FileCopyIcon className={classes.endAdornmentIcon} />
              </label>
            </InputAdornment>
          }
          onChange={handleTextChange}
          disabled={sending}
        />
      </FormControl>
      <FormControl className={classes.fileFormControl}>
        <input
          accept="image/*"
          type="file"
          name="file"
          id="file"
          onChange={handleFileChange}
          multiple
          disabled={sending}
        />
      </FormControl>
    </form>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    postMessage: (message) => {
      dispatch(postMessage(message));
    }
  };
};

export default connect(null, mapDispatchToProps)(Input);
