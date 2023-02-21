import React from 'react'
import { Avatar, Grid, Badge } from '@mui/material'
import ImageIcon from '@mui/icons-material/Image';
import './ChatGroupAvatar.scss'


export default function ChatGroupAvatar(props: {
  avatars: string[],
  width?: number,
  unread?: number
}) {

  const avatars = props.avatars.slice(0, 9)
  const len = avatars.length

  const SQUARE_WIDTH = props.width || 40;
  const cols = len > 4 ? 3 : 2
  const singleWidth = SQUARE_WIDTH / cols
  const rows = Math.ceil(len / cols)
  const singleHeight = SQUARE_WIDTH / rows

  return (
    <Badge badgeContent={props.unread} color={'error'}>
    <div className='chat-group-avatar'>
      
      <Grid container columnSpacing={0.6} rowSpacing={0.3} justifyContent={'space-evenly'}>
        {
          avatars.map(avatar => (
            <Grid key={avatar} item xs={(12 / cols)}>
              <Avatar variant="square" src={avatar} sx={{ width: singleWidth, height: singleHeight}}></Avatar>
            </Grid>
          ))
        }
      </Grid>
    </div>
    </Badge>
  )
}