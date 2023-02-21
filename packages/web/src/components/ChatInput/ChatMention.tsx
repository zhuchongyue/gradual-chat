import React, { useState } from 'react'
import { Image as ImageIcon, Work as WorkIcon, BeachAccess as BeachAccessIcon } from '@mui/icons-material'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { Button, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Badge, Box, ListItemButton } from '@mui/material';
import { IUser } from '@/store/user/userSlice';

export default function ChatMention(props: {
  members?: Array<IUser>;
  filter?: string;
  open: boolean;
  children: any;
  onSelectedMember: (member: IUser) => void;
}) {
  return (
    <>
      <Tooltip placement='top-start' open={props.open} arrow title={
        <Box sx={{ width: '100%', maxWidth: 360 }}>
        <List>
          {
            props.members?.filter(mem => mem.username.includes(props.filter || '')).map((info, index) => {
              return <ListItemButton key={info._id} onClick={() => props.onSelectedMember && props.onSelectedMember(info)}
              >
                <ListItemAvatar>
                  <Avatar src={info.avatar}></Avatar>
                </ListItemAvatar>
                <ListItemText primary={info.username} secondary={
                  <span>
                    {info.bio}
                  </span>
                } />
              </ListItemButton>
            })
          }
        </List>
        </Box>
      }>
        {props.children}
      </Tooltip>
    </>
  )
}