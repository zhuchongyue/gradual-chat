
import { getModelForClass, prop } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import mongoose from "mongoose";
export class Message extends TimeStamps {
  // @prop({ required: true, default: Date.now(), index: true })
  // public createAt!: Date; 

  @prop({ required: true, ref: 'User' })
  public from!: mongoose.Types.ObjectId;

  @prop({ required: true, refPath: 'targetType' })
  public to!: mongoose.Types.ObjectId; // userid or groupId

  @prop({
    required: true,
    default: 'User',
    enum: ['User', 'Group']
  })
  public targetType!: string; // member 私信 group 群消息

  @prop({ 
    enum: ['text', 'iamge', 'file', 'addGroup'],
    default: 'text',
    required: true
  })
  public type!: string;

  @prop({ required: true })
  public content!: string;

  @prop({ ref: 'Message' })
  public ref?: mongoose.Types.ObjectId; // 引用消息id
}

const MessageModel = getModelForClass(Message)

export default MessageModel