

import moment from "moment";



// 服务器返回的GMT时间， 改造为几秒前，几分钟前，几天前
export function formatGMTTime(time: string) {

  if (!time) return ''

  // const localeDate = new Date(time).toLocaleString();
  // const date = new Date(localeDate)
  // const timetamp = date.getTime()

  const timetamp = new Date(time).getTime()
  const now = Date.now()

  const HOUR_GAP = 24 * 60 * 60 * 1000; // 大于一天
  
  const gap = now - timetamp 
  
  return gap > HOUR_GAP ? moment(timetamp).format('YYYY/MM/DD HH:mm') : moment(timetamp).format('HH:mm') 
}