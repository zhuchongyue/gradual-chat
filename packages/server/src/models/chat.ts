
// 最近聊天列表
import { getModelForClass, prop } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import mongoose from "mongoose";

class Chat extends TimeStamps {
  @prop({ required: true, ref: 'User' })
  public user!: mongoose.Types.ObjectId; // userId

  @prop({ required: true, refPath: 'type' })
  public member!:  mongoose.Types.ObjectId; // memberId or groupId

  @prop({ ref: 'Message' })
  public message?: mongoose.Types.ObjectId; // last message id 最新的一条消息

  @prop({ ref: 'Message' })
  public lastReadMessage?:  mongoose.Types.ObjectId; // 最后阅读的一条消息id

  @prop({ required: true, enum: ['User', 'Group'], default: 'User' }) // User私聊 Group 群聊
  public type!: 'User' | 'Group';

  // @prop({ required: true })
  // public updateAt!: Date; // 最后更新时间
}

const ChatModel = getModelForClass(Chat)

export default ChatModel