
// ref: https://socket.io/zh-CN/docs/v4/server-api/#socketusefn
// 通过socket 的 use 统一拦截 on('event')

import { Socket } from 'socket.io';

function defaultCallback() {
  console.error('Server Error: emit event with callback');
}

export interface Context<T> {
  data: T;
  socket: Socket
  //  {
  //   id: string;
  //   user: string;
  // }
}


export default function regisRoutes(socket: Socket, routes: Routes) {
  console.log('regisRoutes in ...')
  return async ([event, data, cb = defaultCallback]: MiddlewareArgs, next: MiddlewareNext) => {
   
    const route = routes[event];
    console.log('regisRoutes exec ...' + event + data)
    if (route) {
      const ctx: Context<any> = {
        data,
        socket
        // socket: {
        //   id: socket.id,
        //   user: 'fake user'
        // }
      }

      const res = await route(ctx);
      cb(res)
    } else {

    }
  };
}