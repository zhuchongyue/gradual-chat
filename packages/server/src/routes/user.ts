
import { UserModel } from "../models";
import jwt from 'jsonwebtoken'
import { config } from "@/config";
import assert from "assert";
import { AssertionError } from "assert";
import { Context } from '@/middlewares/regisRoutes'

function genToken(username: string, id: string) {
  return jwt.sign(
    { username, id },
    config.jwtSecret,
    { expiresIn: config.tokenExpiresTime }
  )
}

export async function register(
  ctx: Context<{
    username: string;
    password: string;
    avatar: string;
    bio: string;
}>) {

  const {username, password, avatar, bio } = ctx.data

  const existUser = await UserModel.findOne({ username })

  if (existUser) {
    throw new AssertionError({ message: '用户名已存在' })
  }
 
  const user = await UserModel.create({
    username,
    password,
    avatar,
    bio
  })

  
  return {_id: user._id, username: user.username, avatar: user.avatar}
}

export function logout(ctx: Context<{
  username: string;
}>) {
  ctx.socket.leave(ctx.data.username)
}

/**
 * 登录 - 账号密码
 * @param ctx 
 * @returns 
 */
export async function login(ctx: Context<{
  username: string;
  password: string;
}>) {
  const { username, password } = ctx.data
  const user = await UserModel.findOne({ username })
  console.log(username, password)

  if (!user) {
    throw new AssertionError({ message: '用户不存在!'})
  }

  const isRightPass = user.validPass(password)

  assert(isRightPass, '密码错误')

  const token = genToken(user.username, user._id)

  user.lastLoginTime = new Date();
  user.status = 2
  user.save();

  ctx.socket.join(user!._id)
  return {
    id: user._id,
    username: user.username,
    token,
    avatar: user.avatar
  }
}

export async function loginByToken(ctx: Context<{
  token: string;
}>) {
  const { token } = ctx.data;
  assert(token, 'token不能为空')

  let params = null
  try {
    params = await jwt.verify(token, config.jwtSecret)
  } catch(err: any) {
    return '用户凭证token非法'
  }
  
  const user = await UserModel.findOne(
    // @ts-ignore
    { _id: params.id },
    { username: 1, avatar: 1 }
  )

  user!.status = 2
  user!.save()

  ctx.socket.join(user!._id)

  return {
    id: user!._id,
    username: user!.username,
    avatar: user!.avatar,
  }
}

export async function fetchMembers(ctx: Context<{
  communityId?: string;
}>) {
  return await UserModel.find({}, { _id: 1, avatar: 1, username: 1, bio: 1 })
}