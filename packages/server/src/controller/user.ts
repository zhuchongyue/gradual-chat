
import type { Context } from 'koa';

import { request, path, body, tagsAll, responsesAll } from 'koa-swagger-decorator';

import { UserModel } from '../models'

@responsesAll({ 200: { description: "success" }, 400: { description: "bad request"}})
@tagsAll(["User"])
export default class UserController {
  public static async getUsers(ctx: Context) {
    const users = [{
      name: 'u1',
      age: 18
    }, {
      name: 'u2',
      age: 30
    }]

    ctx.status = 200
    ctx.body = users
  }

  // public static async createUser(ctx: Context) {
  //   const { name, password, avatar } = ctx.request.body;

  //   // UserModel
  // }
}

