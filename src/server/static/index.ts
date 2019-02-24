import * as express from "express";
import {ServeStaticOptions} from "serve-static";

const staticMiddleware = (path: string) => {
  const options: ServeStaticOptions = {
    dotfiles: "ignore",
    etag: false,
    extensions: ["htm", "html"],
    maxAge: "1d",
    redirect: false,
    setHeaders: (res) => {
      res.set("x-timestamp", Date.now().toString());
    },
  };
  return express.static(path, options);
};

export default staticMiddleware;
