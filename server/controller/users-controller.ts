import { Request, Response, NextFunction } from "express";
import User from "../model/user";
import BaseContext from "./base-context";
import { interfaces, controller, httpGet } from "inversify-express-utils";
import { injectable } from "inversify";

@injectable()
@controller(UsersController.BASE_PATH)
export default class UsersController implements interfaces.Controller {
  public static readonly TAG = "UsersController";
  public static readonly BASE_PATH = "/users";
  private static readonly PATH_ROOT = "/";

  private users = [
    { fname: "John", lname: "Snow", age: 27 },
    { fname: "Ned", lname: "Stark", age: 26 },
    { fname: "Rob", lname: "Stark", age: 54 },
    { fname: "Aria", lname: "Stark", age: 54 },
    { fname: "Bran", lname: "Stark", age: 54 },
    { fname: "Sanza", lname: "Stark", age: 54 },
    { fname: "Cathelyn", lname: "Stark", age: 25 },
    { fname: "Thyrion", lname: "Lannister", age: 30 },
    { fname: "Jamie", lname: "Lannister", age: 30 },
    { fname: "Cersei", lname: "Lannister", age: 10 },
    { fname: "Tywin", lname: "Lannister", age: 19 }
  ];

  @httpGet(UsersController.PATH_ROOT)
  protected get(req: Request, res: Response, next: NextFunction): any {
    let ctx = this.searchUsers(req.query.search ? req.query.search : "");
    res.render("UsersView", { context: ctx });
  }

  private searchUsers(terms: string): UsersContext {
    let context = new UsersContext(terms);
    context.users = context.search
      ? this.users.filter(
          u => u.fname === context.search || u.lname === context.search
        )
      : this.users;

    return context;
  }
}

class UsersContext extends BaseContext {
  users: Array<User>;
  search: string;

  constructor(search: string) {
    super("My Users");
    this.search = search;
  }
}
