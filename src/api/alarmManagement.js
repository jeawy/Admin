import AXIOS from '@/utils/request'
//获取告警列表
export function ApiAlarmQuery(params) {
    return AXIOS.get('api/warning/warning/', {
        params
    })
}
//添加告警
export function ApiaddAlarm(data) {
    return AXIOS.post('api/warning/warning/', data)
}
//删除告警
export function ApiDeleteAlarm(data) {
    return AXIOS.post('api/warning/warning/?delete', data)
}
//修改告警处置状态
export function ApiPutAlarm(data) {
    return AXIOS.post('api/warning/warning/?put', data)
}
//查看告警详情
export function ApiAlarmDetail(params) {
    return AXIOS.get('api/warning/warning/?id=9151', { params })
}
//提交评论
export function ApiSubmitComment(data) {
    return AXIOS.post('api/warning/comment/', data)
}
//删除评论
export function ApiDeleteComment(data) {
    return AXIOS.post('api/warning/comment/?method=delete', data)
}
//获取评论管理权限
export function ApiGetAuthority(params) {
    return AXIOS.get('api/warning/comment/', { params })
}
//告警类型获取
export function ApiGetWarnCategory(params) {
    return AXIOS.get('/api/warning/category/', { params })
}