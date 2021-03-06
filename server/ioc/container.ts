import "reflect-metadata";

import * as config from "config";
import TYPES from "./types";
import { Container } from "inversify";
import { interfaces, TYPE } from "inversify-express-utils";

import HotModuleReloading from "../contract/hot-module-reloading";
import App from "../contract/app";
import UsersRestController from "../rest/v1/users-rest-controller";
import HomeController from "../controller/home-controller";
import UsersController from "../controller/users-controller";
import ElmExpressApp from "../elm-express-app";

function getContainer(): Container {
  const container = new Container();

  container
    .bind<interfaces.Controller>(TYPE.Controller)
    .to(HomeController)
    .whenTargetNamed(HomeController.TAG);
  container
    .bind<interfaces.Controller>(TYPE.Controller)
    .to(UsersController)
    .whenTargetNamed(UsersController.TAG);
  container
    .bind<interfaces.Controller>(TYPE.Controller)
    .to(UsersRestController)
    .whenTargetNamed(UsersRestController.TAG);

  if (config.get("env.hot")) {
    const WebpackHotModuleReloading = require("../webpack-hot-module-reloading").default;
    container
      .bind<HotModuleReloading>(TYPES.HotModuleReloading)
      .to(WebpackHotModuleReloading);
  }

  container.bind<App>(TYPES.App).to(ElmExpressApp).inSingletonScope();

  return container;
}

export default getContainer;
