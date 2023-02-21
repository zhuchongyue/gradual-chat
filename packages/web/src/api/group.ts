

// name: string;
//   ids: string[];
//   creator: string; // 创建者

import request from "./request";

export interface IGroup {
  _id: string;
  name: string;
  creator: string;
  members: Array<{
    username: string;
    avatar: string;
    bio: string;
  }>;
  bio?: string;
}

// 创建群组
export async function createGroup(info: {
  name: string;
  ids: string[];
  creator: string; // 创建者
}) {
  const group = await request<IGroup>('createGroup', info)
  return group
}