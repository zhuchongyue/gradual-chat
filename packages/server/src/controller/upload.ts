
import { Context } from 'koa'

export default class UploadController {
  public static async upload(ctx: Context) {
    const files = ctx.request.files
  }
}