import AXIOS from '@/utils/request'
//获取首页信息
export function ApiGetHomedata(params) {
    return AXIOS.get('api/', { params })
}
//获取平衡率
export function ApiGetBalance(params) {
    return AXIOS.get('/api/realdata/balance/', { params })
}
//获取首页告警
export function ApiGetAlarm(params) {
    return AXIOS.get('/api/warning/stat/', { params })
}