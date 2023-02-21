import React, { useEffect, useState } from 'react';
import Members from '@/components/Members/Members';
import MemberDetail from '@/components/Members/MemberDetail';
import { fetchMembers } from '@/api'
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setMembers, membersSelector } from '@/store/user/userSlice';


export default function MembersPage() {

  const dispatch = useAppDispatch()
  const members = useAppSelector(membersSelector) || []

  const [memIndex, setMemIndex] = useState(0)

  useEffect(() => {
    fetchMembers()
    .then(res => {
      dispatch(setMembers(res))
    })
  }, [])

  return (
    <>
      <Members activeIndex={memIndex} memberList={members}  onSelectedMemberChange={(index) => { setMemIndex(index)}}/>
      <MemberDetail member={members[memIndex]}/>
    </>
  )
}