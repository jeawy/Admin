import AXIOS from '@/utils/request'
//获取告警列表
export function ApiAlarmQuery(params) {
  return AXIOS.get('/warning/warning/', {
    params
  })
}