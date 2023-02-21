import { Context } from '@/middlewares/regisRoutes'
import { writeFile, writeFileSync } from 'fs'
import path from 'path'
import { config } from '@/config';

export async function uploadFile(
  ctx: Context<{
    file: ArrayBufferView;
    fileName: string;
  }>
) {
  const filePrefix = `http://${config.hostname}:${config.port}/upload/`
  // @ts-ignore
  writeFileSync(path.join(process.cwd(), './public/upload/' + ctx.data.fileName), ctx.data.file)
  return {
    code: 200,
    data: filePrefix + ctx.data.fileName
  }
}