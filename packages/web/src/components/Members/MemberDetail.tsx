import React from 'react';
import './MemberDetail.scss'
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { curChatSelector } from '@/store/chat/chatSlice';
import { userIdSelector } from '@/store/user/userSlice';
import { sendMsg } from '@/api';
import { IUser } from '@/store/user/userSlice';
import { Avatar, Button, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { newChat } from '@/api';

export default function MemberDetail(props: {
  member?: IUser;
}) {

  // const curChat = useAppSelector(curChatSelector);
  const navigate = useNavigate()
  const user = useAppSelector(state => state.user.id)!

  const handleNewChat = (member?: IUser) => {
    newChat({ user, member: member?._id! }).then((res) => {
      navigate(`/chat?chatId=${res._id}`)
    })
  }

  return (
    <div className='mem-frame' >
      <div className='mem-frame-head'>
        <div className='mem-frame-head-label'>
          {props.member?.username}
        </div>
      </div>
      <div>
      <Card sx={{ maxWidth: 345, margin: '0 auto' }}>
        <Avatar variant="square" sx={{margin: '20px auto'}} src={process.env.PUBLIC_URL + '/img/a1.svg'} ></Avatar>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {props.member?.username}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.member?.bio || 'Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica'}
          </Typography>
        </CardContent>
      </Card>
      </div>
      <div className='mem-frame-btn'>
        <Button disabled={user === props.member?._id} onClick={() => handleNewChat(props.member) } variant="contained">Send Message</Button>
      </div>
      {/* <ChatFrameHead label='Share Your Story' isGroup count={5}/> */}
      {/* <ChatInput onSendMsg={(msg) => {
        console.log('msg: ', msg)
        sendMsg(curChat!.name, 'private', msg)
      }} /> */}
    </div>
  )
}