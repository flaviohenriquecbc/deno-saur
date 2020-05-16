import { Drash } from "https://deno.land/x/drash@v1.0.0/mod.ts";

import { readFileContents } from '../utils/file-reader.ts'

export default class UsersResource extends Drash.Http.Resource {

  static paths = [
    "/users/:id",
  ];

  public GET() {
    let userId = this.request.getPathParam("id");
    let user = this.getUser(userId);
    
    // Read the Accept header and check if text/html is acceptable
    if (this.request.accepts("text/html")) {
      return this.generateHtml(user);
    }

    // Default to a JSON representation
    return this.generateJson(user);
  }

  protected getUser(userId: number) {
    let user = null;

    try {
      const file = readFileContents("./users/data/users.json");
      const users = JSON.parse(file);
      user = users[userId]
    } catch (error) {
      throw new Drash.Exceptions.HttpException(400, `Error getting user with ID "${userId}". Error: ${error.message}.`);
    }

    if (!user) {
      throw new Drash.Exceptions.HttpException(404, `User with ID "${userId}" not found.`);
    }

    return user;
  }

  protected generateHtml(user: any) {
    this.response.headers.set("Content-Type", "text/html");
    try {
      let html = readFileContents("./users/view/profile-card.html");
      html = html
        .replace(/\{\{ alias \}\}/, user.alias)
        .replace(/\{\{ name \}\}/, user.name);
      this.response.body = html;

      return this.response;
    } catch (error) {
      throw new Drash.Exceptions.HttpException(500, error.message);
    }
  }

  protected generateJson(user: any) {
    this.response.headers.set("Content-Type", "application/json");
    user.api_key = "**********";
    user.api_secret = "**********";
    this.response.body = user;

    return this.response;
  }
}