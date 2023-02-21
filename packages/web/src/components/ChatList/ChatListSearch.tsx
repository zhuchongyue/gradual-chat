import React from 'react';

import { IconButton, InputBase, Input, InputAdornment, Box, TextField, Divider } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import './ChatListSearch.scss'

export default function ChatListSearch() {
  return (
    <div className='chat-list-search'>
    <InputBase placeholder='Search' startAdornment={
       <InputAdornment position="start">
       <SearchIcon></SearchIcon>
     </InputAdornment>
    } />
    {/* <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField color={'error'} id="outlined-basic" label="Outlined" variant="standard" />
    </Box> */}
      
      {/* <Input startAdornment={
        <InputAdornment position="start">
          <SearchIcon></SearchIcon>
        </InputAdornment>
      }></Input> */}
    </div>
  )
}