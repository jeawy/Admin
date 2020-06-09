import AXIOS from '@/utils/request'
//获取首页开关井信息
export function ApiGetHomedata(params) {
    return AXIOS.get('api/', { params })
}
//获取首页产量和液面高度
export function ApiGetTotalData(params) {
    return AXIOS.get('/api/stats/totaloutput/', { params })
}
//获取平衡度
export function ApiGetBalance(params) {
    return AXIOS.get('/api/realdata/balance/', { params })
}
//获取首页告警
export function ApiGetAlarm(params) {
    return AXIOS.get('/api/warning/stat/', { params })
}
//获取首页油井的组织结构
export function ApiGetDept(params) {
    return AXIOS.get('/api/dept/dept/', { params })
}