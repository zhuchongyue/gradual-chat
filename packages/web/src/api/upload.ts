
import request from "./request";

export function uploadFile(file: File, fileName: string) {
  return request('uploadFile', { file, fileName })
}