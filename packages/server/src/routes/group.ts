
import GroupModel from "@/models/group";
import ChatModel from "@/models/chat";
import { Context } from '@/middlewares/regisRoutes';
import { wrapObjectId } from "@/utils";

export async function createGroup(ctx: Context<{
  name: string;
  ids: string[];
  creator: string; // 创建者
}>) {

  const { name, ids, creator } = ctx.data;
  const members = ids.map(id => wrapObjectId(id))
  const group = await GroupModel.create({
    name,
    members,
    creator: wrapObjectId(creator)
  })

  // 为创建者新建一个最近聊天框， 其他成员有消息的时候创建 【参照wechat】

  const chat = await ChatModel.create({
    user: wrapObjectId(creator),
    member: wrapObjectId(group._id),
    type: 'Group'
  })


  const createdGroup = await GroupModel.findOne({_id: wrapObjectId(group._id)})
  .populate('creator', '-password -salt')
  .populate('members')

  return {
    chat,
    group: createdGroup
  }
}

export async function addGroupMember(ctx: Context<{
  ids: string[]; // 新成员ids
}>) {

}