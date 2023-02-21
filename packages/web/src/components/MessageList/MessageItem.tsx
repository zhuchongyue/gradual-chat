import React, { useState } from 'react';
import { Avatar, Popover } from '@mui/material';
import './MessageItem.scss';
import moment from 'moment';
import { IMsgItem } from '@/store/chat/chatSlice'
import { formatGMTTime } from '@/utils/util';

import FormatQuoteOutlinedIcon from '@mui/icons-material/FormatQuoteOutlined';
import DeleteIcon from '@mui/icons-material/Delete';

export default function MessageItem(props: {
  onMsgRef: (msg: IMsgItem) => void;
  msg: IMsgItem;
  userId: string;
}
  //   {
  //   // avatar: string;
  //   // uname: string;
  //   // timestamp: string;
  //   // content: string;
  //   // isCurUser?: boolean;
  // }
) {

  const msg = props.msg

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <div className={`msg-item ${props.userId === msg.from._id ? 'msg-item-reverse' : ''}`}>
        <div className='msg-item-ava'>
          <Avatar src={msg.from.avatar} />
        </div>
        <div className='msg-item-info'>
          <div className='msg-item-name'>
            {msg.from.username}<span>
              {formatGMTTime(msg.createdAt)}
            </span>
          </div>
          <div className='msg-item-content' onClick={handleClick} >
            {msg.content}
          </div>
          {
            msg.ref &&
            <div className='msg-item-ref'>
              <div className='msg-item-ref-content'>
                {msg.ref.from.username}: {msg.ref.content}
              </div>
            </div>
          }
        </div>
      </div>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorReference='anchorEl'
        // anchorPosition={{top: 100, left: 220}}
        anchorOrigin={{
          vertical: props.userId === msg.from._id ? 'bottom' : 'top',
          horizontal: props.userId === msg.from._id ? 'left' : 'right',
        }}
      >
        <div className='msg-item-action'>
          <FormatQuoteOutlinedIcon onClick={(e) => {
            handleClose()
            props.onMsgRef(msg)
          }
          } />
          <DeleteIcon />
        </div>
      </Popover>
    </>
  )
}