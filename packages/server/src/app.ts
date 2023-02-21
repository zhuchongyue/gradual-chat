/// <reference path="types/server.d.ts" />

import Koa from 'koa';
import http from 'http';
import { Server } from 'socket.io';
// import * as moment from 'moment'
import * as moment from 'moment-timezone'
import jwt from 'koa-jwt';
import bodyParser from 'koa-bodyparser';
import koaBody from 'koa-body'

// import helmet from 'koa-helmet';
import cors from '@koa/cors';
// import winston from 'winston'
import { config } from './config'
import initDb from './models/db';
// import { router } from './routes'
import KoaStatic from 'koa-static';
import * as userRoutes from './routes/user'
import * as groupRoutes from './routes/group'
import * as chatRoutes from './routes/chat'
import * as msgRoutes from './routes/message'
import * as commonRoutes from './routes/common'
import regisRoutes from './middlewares/regisRoutes';
import { UserModel } from './models';
import mongoose from 'mongoose'
import path = require('path');

// 设置中国时区
// moment.tz.setDefault('Asia/Shanghai')

console.log('process.env.TZ: ', process.env.TZ)
console.log('new Date(): ', new Date())

initDb();
const app = new Koa();
app.proxy = true;

console.log('KoaStatic: ', path.join(__dirname + '../public'))
app.use(KoaStatic(path.join(process.cwd() + '/public')))

const httpServer = http.createServer(app.callback());
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
  pingTimeout: 10000,
  pingInterval: 5000,
});

const routes = {
  ...commonRoutes,
  ...userRoutes,
  ...groupRoutes,
  ...chatRoutes,
  ...msgRoutes
}

io.on('connection', async (socket) => {
  console.log('connection: ', socket.handshake)

  if (socket.handshake.auth.token && socket.handshake.auth.id) {
    // TODO: 这里需要判断token 合法性 以及是否过期
    socket.join(socket.handshake.auth.id)

    const user = await UserModel.findOne(
      // @ts-ignore
      { _id: socket.handshake.auth.id },
    )

    user!.status = 2
    user!.save()
  }

  socket.on('disconnecting', async () => {
    console.log('disconnecting: ', socket.handshake)

    if (socket.handshake.auth.token && socket.handshake.auth.id) {
      console.log('disconnecting if')
      const result = await UserModel.updateOne(
        { _id: new mongoose.Types.ObjectId(socket.handshake.auth.id) },
        { status: 1}
      )
      console.log('disconnecting if result: ', result)

    }
  })

  socket.use(regisRoutes(socket, routes))
})


// app.use(cors());
// app.use(koaBody({
//   multipart: true,
//   formidable: {
//     maxFieldsSize: 1024 * 1024 * 10
//   }
// }))
// app.use(bodyParser());

// app.use(router.routes()).use(router.allowedMethods());

httpServer.listen(config.port, () => {
  console.log(`Server running on port 3001.`)
})


