import AXIOS from '@/utils/request'
//获取告警列表
export function ApiAlarmQuery(params) {
  return AXIOS.get('/warning/warning/', {
    params
  })
}
//添加告警
export function ApiaddAlarm(data) {
  return AXIOS.post('/warning/warning/', data)
}