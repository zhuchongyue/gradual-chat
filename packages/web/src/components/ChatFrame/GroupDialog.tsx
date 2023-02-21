import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { Avatar, List, ListItem, ListItemButton, ListItemText, Checkbox, ListItemAvatar, TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { IUser, membersSelector, setMembers } from '@/store/user/userSlice';
import { fetchMembers } from '@/api';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}


export default function GroupDialog(props: {
  open: boolean;
  initUserId: Array<string | undefined>;
  onCreateGroup: (ids: string[], groupName: string) => void;
  onCancelNewGroup: () => void;
}) {

  const handleClose = props.onCancelNewGroup

  const dispatch = useAppDispatch()
  const members = useAppSelector(membersSelector) || []

  const [groupName, setGroupName] = useState<string>('');

  useEffect(() => {
    fetchMembers()
      .then(res => {
        dispatch(setMembers(res))
      })
  }, [])

  const [checkedMems, setCheckedMems] = useState<string[]>([]);
  // @ts-ignore
  useEffect(() => { setCheckedMems(props.initUserId ? [...props.initUserId] : []) }, [props.initUserId])

  const handleToggle = (id: string) => () => {
    const newCheckedMems = [...checkedMems]
    const index = checkedMems.indexOf(id);
    index > -1
      ? newCheckedMems.splice(index, 1)
      : newCheckedMems.push(id)
    setCheckedMems(newCheckedMems);
  };

  function ItemRenderer(props: {
    data: IUser[];
    index: number;
  }) {
    const item = props.data[props.index];
    const index = props.index

    return (

      <ListItem
        key={item._id}
        secondaryAction={
          <Checkbox
            edge="end"
            onChange={handleToggle(item._id)}
            checked={checkedMems.indexOf(item._id) !== -1}
            inputProps={{ 'aria-labelledby': item._id }}
          />
        }
        disablePadding
      >
        <ListItemButton>
          <ListItemAvatar>
            <Avatar
              alt={`Avatar n°${index + 1}`}
              // src={`${process.env.PUBLIC_URL}/img/a${index + 1}.svg`}
              src={item.avatar}
            />
          </ListItemAvatar>
          <ListItemText id={item._id} primary={item.username} secondary={
            <span style={{ color: '#7B798F' }}>
              {item.bio || 'I am a community member'}
            </span>} />
        </ListItemButton>
      </ListItem>
    )
  }

  return (
    <Dialog
      fullWidth
      maxWidth={'sm'}
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={props.open}
    >
      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
        New Group
      </BootstrapDialogTitle>

      <DialogContent dividers>

        <TextField
          fullWidth
          value={groupName}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setGroupName(event.target.value);
          }}
          id="outlined-gname"
          label="Input Group Name"
          placeholder="Input Group Name"
          variant="outlined" />

        <FixedSizeList
          height={400}
          width={360}
          itemData={members}
          itemSize={46}
          itemCount={members.length}
        // overscanCount={5}
        >
          {ItemRenderer}
        </FixedSizeList>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => props.onCreateGroup(checkedMems, groupName)}>
          Create Group
        </Button>
        <Button autoFocus onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}