import React, { useState } from 'react';
import { Avatar, Badge, Button, Divider, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { PeopleAlt } from '@mui/icons-material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import './ChatFrameHead.scss';
import { IUser } from '@/store/user/userSlice';


export default function ChatFrameHead(props: {
  label: string;
  // isGroup: boolean;
  type?: 'User' | 'Group';
  // count?: number;
  members?: IUser[];
  onApplyNewGroup: () => void;

}) {
  let members: IUser[] | undefined = []
  if (props.type === 'Group') {
    members = props.members?.slice().sort((p, v) => v.status - p.status)
  }

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [anchorMemEl, setAnchorMemEl] = useState<null | HTMLElement>(null);
  const openMem = Boolean(anchorMemEl);
  const handleMemClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorMemEl(event.currentTarget);
  };
  const handleMemClose = () => {
    setAnchorMemEl(null);
  };

  return (
    <>
      <div className='chat-frame-head'>
        <div className='chat-frame-head-label'>
          {props.label}
        </div>
        <div className='chat-frame-head-action'>
          {
            props.type === 'Group'
              ? <Button onClick={handleMemClick} variant='outlined' startIcon={<PeopleAlt color={'inherit'} />}>
                {props.members?.length || 0}
              </Button>
              // @ts-ignore
              : <MoreHorizIcon onClick={handleClick} />
          }
        </div>
        <Menu
          id="menu-group"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={props.onApplyNewGroup}>
            <ListItemIcon>
              <GroupAddIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>New Group Chat</ListItemText>
          </MenuItem>
        </Menu>
        <Menu
          id="menu-members"
          anchorEl={anchorMemEl}
          open={openMem}
          onClose={handleMemClose}
        >
          {
            members?.map(user => {
              return (
                <MenuItem key={user._id}>

                  <ListItemButton key={user._id}
                  >
                    <ListItemAvatar>
                      <Badge color={user.status === 2 ? 'error' : 'secondary'} variant="dot" anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}>
                        <Avatar src={user.avatar}></Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText primary={user.username} secondary={
                      <span>
                        {user.bio}
                      </span>
                    } />
                  </ListItemButton>

                </MenuItem>
              )
            })
          }
        </Menu>
      </div>
    </>
  )
}