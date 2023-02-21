
import ChatModel from "@/models/chat";

import { Context } from '@/middlewares/regisRoutes'
import { wrapObjectId } from '@/utils'
import MessageModel from "@/models/message";

// 新建一个聊天记录
export async function newChat(ctx: Context<{
  user: string;
  member: string;
}>) {

  const existChat = await ChatModel.findOne({
    user: ctx.data.user,
    member: ctx.data.member
  })

  let chat
  if (!!existChat) {
    chat = await ChatModel.findOneAndUpdate({
      user: wrapObjectId(ctx.data.user),
      member: wrapObjectId(ctx.data.member),
    }, { updatedAt: new Date() })
  } else {
    chat = await ChatModel.create({
      user: wrapObjectId(ctx.data.user),
      member: wrapObjectId(ctx.data.member),
      updatedAt: new Date()
    })
    chat.save();
  }
  return chat
}

// 获取完整的最近聊天记录
export async function chatList(ctx: Context<{
  user: string;
}>) {
  // const chatList = await ChatModel
  //   .find({user: wrapObjectId(ctx.data.user)})
  //   .populate({
  //     path: 'member',
  //     select: '-password -salt',
  //     strictPopulate: false,
  //     populate: {
  //       path: 'members',
  //       strictPopulate: false,
  //     }
  //   })
  //   .populate('message')
  //   .sort([['updatedAt', -1]])

  // return chatList

  const chatList = await ChatModel
    .find({user: wrapObjectId(ctx.data.user)})
    .populate({
      path: 'member',
      select: '-password -salt',
      strictPopulate: false,
      populate: {
        path: 'members',
        strictPopulate: false,
      }
    })
    .populate('message')
    .populate('lastReadMessage')
    .sort([['updatedAt', -1]])

    // 未读消息数量
    const chatWithUnreadList = await Promise.all(chatList.map(async (chat) => {

      let unread = 0;

      // @ts-ignore      
      const lastMsgDate = chat.lastReadMessage?.createdAt

      if (chat.type === 'User') {
        const filter = lastMsgDate
        ? { from: chat.member, to: chat.user, createdAt: { $gt: lastMsgDate } }
        : { from: chat.member, to: chat.user }
        unread = await MessageModel.countDocuments(filter)
      }
      else if (chat.type === 'Group') {
        // @ts-ignore
        console.log('group name: ', chat.member.name)
        const filterGroup = lastMsgDate
        ? { to: chat.member, createdAt: { $gt: lastMsgDate } }
        : { to: chat.member }
        unread = await MessageModel.countDocuments(filterGroup)

      }
      return Object.assign({}, chat.toObject(), { unread });
    }))

  return chatWithUnreadList
}

// 阅读消息  web端点开消息框，算阅读
export async function readMsg(ctx: Context<{
  user: string; // 用户id
  member: string; // 聊天对象id  memberId or groupId
  lastReadMessage: string; // 最后阅读消息id
}>) {
  const { user, member, lastReadMessage } = ctx.data
  await ChatModel.findOneAndUpdate({
    user: wrapObjectId(user),
    member: wrapObjectId(member)
  }, {
    lastReadMessage: wrapObjectId(lastReadMessage)
  })

  return true
}