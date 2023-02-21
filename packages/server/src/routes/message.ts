
import MessageModel, { type Message } from '@/models/message'
import { Context } from '@/middlewares/regisRoutes'
import { UserModel } from '@/models';
// import mongoose from 'mongoose';
import { wrapObjectId } from '@/utils';
import ChatModel from '@/models/chat';
import GroupModel from '@/models/group';


export async function _createMsg(msg: Message) {
  return await MessageModel.create(msg)
}

export async function sendMsg(ctx: Context<{
  from: string;
  to: string;
  type: string;
  targetType: 'User' | 'Group';
  content: string;
  refId?: string;
}>) {
  const { from, content, to, type, targetType, refId } = ctx.data

  const msg = await _createMsg({
    content,
    from: wrapObjectId(from),
    to: wrapObjectId(to),
    type,
    targetType,
    ref: refId ? wrapObjectId(refId) : undefined,
    createdAt: new Date()
  })

  // 私聊逻辑处理

  if (targetType === 'User') {
    // 对方的最近联系人 没有 则创建
    await ChatModel.findOneAndUpdate({
      user: wrapObjectId(to),
      member: wrapObjectId(from),
      type: 'User'
    }, {
      message: wrapObjectId(msg._id)
    }, {
      upsert: true, // creates the object if it doesn't exist. defaults to false.
      new: true
    })

    /**
     * 1. 如果对方在线直接发送过去
     * 2. 如果不在线，只存储
     */
    const onlineUser = await UserModel.findOne({
      _id: wrapObjectId(to)
    })

    console.log('sendMsg onlineUser: ', onlineUser)

    const msgItem = await MessageModel.findOne({
      // from: wrapObjectId(from),
      // to: wrapObjectId(to),
      _id: wrapObjectId(msg._id)
    })
      .populate({
        path: 'ref',
        populate: { path: 'from', select: '-password -salt' }
      })
      .populate('from', '-password -salt')
      .populate('to', '-password -salt')
    if (onlineUser) {
      ctx.socket.to(ctx.data.to).emit('privateMsg', msgItem)
    }

    // 更新Chat lastMessage
    await ChatModel.findOneAndUpdate({
      member: wrapObjectId(to)
    }, {
      // @ts-ignore
      message: msg._id
    })

    return msgItem

  }

  // 群聊逻辑处理
  if (targetType === 'Group') {
    // 1. 找到所以群成员
    const group = await GroupModel.findOne({
      _id: wrapObjectId(to)
    });

    const members = group?.members;

    const msgItem = await MessageModel.findOne({
      // from: wrapObjectId(from),
      // to: wrapObjectId(to),
      _id: wrapObjectId(msg._id)
    })
      .populate({
        path: 'ref',
        populate: { path: 'from', select: '-password -salt' }
      })
      .populate('from', '-password -salt')
      .populate('to', '-password -salt')


    members?.forEach(async memberId => {
      // 对方的最近联系人 没有 则创建
      await ChatModel.findOneAndUpdate({
        user: memberId,
        member: wrapObjectId(to), // to 是群聊id
        type: 'Group'
      }, {
        message: wrapObjectId(msg._id)
      }, {
        upsert: true, // creates the object if it doesn't exist. defaults to false.
        new: true
      })

      /**
        * 1. 如果对方在线直接发送过去
        * 2. 如果不在线，只存储
        */
      const onlineUser = await UserModel.findOne({
        _id: memberId,
      })

      console.log('sendMsg group onlineUser: ', onlineUser)

      if (onlineUser) {
        ctx.socket.to(memberId.toString()).emit('privateMsg', msgItem)
      }
    })
    return msgItem
  }

}

// 获取消息列表
export async function messageList(ctx: Context<{
  user: string;
  member: string;
  targetType: 'User' | 'Group';
}>) {

  if (ctx.data.targetType === 'Group') {
    const groupMsgList = await MessageModel.find({
      to: wrapObjectId(ctx.data.member) // 任意消息只要是发给群聊对象的 均返回
    })
    .populate({
      path: 'ref',
      populate: { path: 'from', select: '-password -salt' }
    })
    .populate('from', '-password -salt')
    .populate('to', '-password -salt')
    .sort([['createdAt', 1]])
    .limit(100)
    return groupMsgList || []
  } else {
    const msgList = await MessageModel.find({
      from: { $in: [wrapObjectId(ctx.data.user), wrapObjectId(ctx.data.member)] },
      to: { $in: [wrapObjectId(ctx.data.user), wrapObjectId(ctx.data.member)] }
    })
      .populate({
        path: 'ref',
        populate: { path: 'from', select: '-password -salt' }
      })
      .populate('from', '-password -salt')
      .populate('to', '-password -salt')
      .sort([['createdAt', 1]])
      .limit(100)

    return msgList;
  }

}

// 发送群聊消息
export async function sendGroupMsg(ctx: Context<{
  from: string; // 成员id
  to: string;   // 群id
  type: string; // text image
  targetType: 'Group';
  content: string; // string
  refId?: string; // 引用消息id
}>) {
  const { from, content, to, type, targetType, refId } = ctx.data

  // 创建群消息
  const msg = await _createMsg({
    content,
    from: wrapObjectId(from),
    to: wrapObjectId(to),
    type,
    targetType,
    ref: refId ? wrapObjectId(refId) : undefined,
    createdAt: new Date()
  })
}

