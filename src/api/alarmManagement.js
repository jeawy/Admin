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
//删除告警
export function ApiDeleteAlarm(data) {
  return AXIOS.post('/warning/warning/?delete', data)
}
//修改告警处置状态
export function ApiPutAlarm(data) {
  return AXIOS.post('/warning/warning/?put', data)
}