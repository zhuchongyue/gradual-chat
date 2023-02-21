import { DocumentType, getModelForClass, pre, prop } from '@typegoose/typegoose';
import bcrypt from 'bcryptjs';

@pre<User>('save', async function() {
  if (this.isNew) {
    this.createTime = new Date()
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(this.password, salt)
    this.salt = salt
    this.password = hash
  }
})
class User {
  @prop({ required: true })
  public username!: string; // 用户名

  @prop()
  public sex!: number; // 1 男 2 女

  @prop()
  public salt?: string; // 密码salt值

  @prop({ required: true })
  public password!: string; // 密码（加密）

  @prop()
  public avatar?: string; // 头像

  @prop()
  public bio?: string; // 介绍

  @prop()
  public createTime!: Date; // 创建时间

  // @prop()
  // public updateAt!: Date; // 更新时间

  @prop({enum: [1, 2], default: 1 })
  public status!: number; /* 用户在线状态 1 不在线 2 在线 */

  @prop()
  public lastLoginTime?: Date; // 最后登录时间

  public validPass(this: DocumentType<User>, pass: string) {
    return bcrypt.compareSync(pass, this.password )
  }
}

const UserModel = getModelForClass(User)

export default UserModel