
import { getModelForClass, prop } from "@typegoose/typegoose"
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import mongoose from "mongoose";

class Group extends TimeStamps{
  @prop({ required: true})
  public name!: string; // group name

  @prop({ required: true, ref: 'User' })
  public members!: mongoose.Types.ObjectId[]; // group 成员

  @prop({ required: true, ref: 'User' })
  public creator!: mongoose.Types.ObjectId; // 创建者

  @prop()
  public bio?: string; // group bio
}

const GroupModel = getModelForClass(Group)

export default GroupModel