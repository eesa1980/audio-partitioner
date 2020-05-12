export const getSpritesLs = () => {
  let sprites = localStorage.getItem(
    `sprites.${process.env.REACT_APP_ENV_TITLE}`
  );

  if (!sprites) {
    setSpritesLs({});
  }

  return JSON.parse(sprites);
};

export const setSpritesLs = (sprites) => {
  localStorage.setItem(
    `sprites.${process.env.REACT_APP_ENV_TITLE}`,
    JSON.stringify(sprites)
  );
};

export const fancyTimeFormat = (input) => {
  const time = input / 1000;
  // Hours, minutes and seconds
  const hrs = ~~(time / 3600);
  const mins = ~~((time % 3600) / 60);
  const secs = ~~time % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  let ret = "";

  if (hrs > 0) {
    ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
  }

  ret += "" + mins + ":" + (secs < 10 ? "0" : "");
  ret += "" + secs;
  return ret;
};

export const jsonSyntaxHighlight = (json) => {
  json = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      let cls = "number";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "key";
        } else {
          cls = "string";
        }
      } else if (/true|false/.test(match)) {
        cls = "boolean";
      } else if (/null/.test(match)) {
        cls = "null";
      }
      return '<span class="' + cls + '">' + match + "</span>";
    }
  );
};

export const initStart = (vals) => {
  const values = Object.values(vals);
  const res = values[values.length - 1];
  if (!res) {
    return 0;
  }

  return res[0] + res[1];
};

export const createMarkup = (__html) => {
  return { __html };
};
