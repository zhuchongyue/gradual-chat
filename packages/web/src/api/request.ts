
import socket from '../socket'

export default function request<T = any>(
  event: string,
  data = {},
): Promise<T> {
  return new Promise((resolve) => {
    socket.emit(event, data, (res: any) => {
      resolve(res)
    })
  })
}