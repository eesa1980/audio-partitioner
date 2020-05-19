import {
  ButtonGroup,
  Chip,
  Container,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import "./App.css";
import {
  createMarkup,
  fancyTimeFormat,
  getSpritesLs,
  initStart,
  jsonSyntaxHighlight,
  setSpritesLs,
} from "./helpers";

const PREFIX = "part-";

const App = () => {
  const [duration, setDuration] = useState(0);
  const [end, setEnd] = useState(0);
  const [sprites, setSprites] = useState(getSpritesLs() || {});
  const [start, setStart] = useState(initStart(getSpritesLs()) || 0);

  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current &&
      start &&
      audioRef.current.seekTo(start / 1000, "seconds");
  }, [sprites, start]);

  const addDuration = () => {
    const cloned = { ...sprites };
    const { length } = Object.keys(cloned);
    cloned[`${PREFIX}${length + 1}`] = [start, end - start];
    setStart(initStart(cloned));
    setEnd(0);
    updateSprites(cloned);
  };

  const updateSprites = (updated) => {
    setSprites(updated);
    setSpritesLs(updated);
  };

  const deleteHandler = () => {
    const cloned = { ...sprites };
    const { length } = Object.keys(cloned);
    delete cloned[`${PREFIX}${length}`];
    setStart(initStart(cloned));
    setEnd(0);
    updateSprites(cloned);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Container align="center">
        <Paper elevation={3} style={{ padding: 30 }}>
          <Typography component="h1" variant="h5">
            {process.env.REACT_APP_ENV_TITLE}
          </Typography>
          <br />
          <Typography color="textSecondary" component="code" variant="body1">
            {duration}
          </Typography>
          <List
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ListItem>
              <ListItemText
                align="center"
                primary="Start"
                secondary={<code>{fancyTimeFormat(start)}</code>}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                align="center"
                primary="End"
                secondary={<code>{fancyTimeFormat(end)}</code>}
              />
            </ListItem>
          </List>

          <ButtonGroup component="div">
            <Button
              color="primary"
              variant="contained"
              disabled={!!start && Object.keys(sprites).length >= 1}
              onClick={() => setStart(duration)}
            >
              Start
            </Button>
            <Button
              color="primary"
              variant="contained"
              disabled={!start}
              onClick={() =>
                setEnd(
                  audioRef.current && audioRef.current.getCurrentTime() * 1000
                )
              }
            >
              End
            </Button>
            <Button
              color="secondary"
              variant="contained"
              disabled={!end || !start || start >= end}
              onClick={addDuration}
            >
              Add Duration
            </Button>
          </ButtonGroup>
          <br />
          <br />

          <div>
            {Object.entries(sprites).map((sprite, i) => {
              const [key, values] = sprite;
              const [st, dur] = values;

              const onDelete =
                i === Object.entries(sprites).length - 1
                  ? deleteHandler
                  : undefined;

              return (
                <Chip
                  styles={{ padding: "10px" }}
                  color="secondary"
                  key={key}
                  onClick={() => {
                    audioRef.current.seekTo(st / 1000);
                    // setStart(st);
                    // setEnd(dur + st);
                  }}
                  label={
                    <span>
                      <strong>{i + 1}) &nbsp;&nbsp;</strong>
                      {`${fancyTimeFormat(st)} - ${fancyTimeFormat(dur + st)}`}
                    </span>
                  }
                  onDelete={onDelete}
                />
              );
            })}
          </div>

          <ReactPlayer
            ref={audioRef}
            url={process.env.REACT_APP_ENV_AUDIO_FILE}
            controls
            progressInterval={1}
            height={54}
            style={{
              padding: "20px 0",
            }}
            width={"100%"}
            onProgress={(e) => {
              setDuration(e.playedSeconds * 1000);
            }}
          />
          <Container align="left">
            <Typography color="textSecondary" component="pre" variant="body2">
              <code style={{ whiteSpace: "pre-wrap" }}>
                <div
                  dangerouslySetInnerHTML={createMarkup(
                    jsonSyntaxHighlight(JSON.stringify(sprites, null, 2))
                  )}
                />
              </code>
            </Typography>
            <br />
            <Typography color="textSecondary" component="pre" variant="body2">
              <code style={{ whiteSpace: "pre-wrap" }}>
                <div
                  dangerouslySetInnerHTML={createMarkup(
                    JSON.stringify(sprites)
                  )}
                />
              </code>
            </Typography>
          </Container>
        </Paper>
      </Container>
    </div>
  );
};

export default App;
