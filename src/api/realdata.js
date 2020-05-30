import AXIOS from '@/utils/request'
// 获取实时数据和综合查询
export function ApiGetRealdata(params) {
    return AXIOS.get('api/realdata/realdata/', { params })
}
// 获取功耗
export function ApiGetPower(params) {
    return AXIOS.get('/api/realdata/realdata/?active', { params })
}
//获取历史数据
export function ApiGetHistorydata(params) {
    return AXIOS.get('api/clientdata/clientdata/', { params })
}
//获取电流曲线
export function ApiGetElectdata(params) {
    return AXIOS.get('api/p144/p144/', { params })
}
//获取电流历史数据
export function ApiGetEleHistory(params) {
    return AXIOS.get('/api/realdata/realdata/?electricity', { params })
}
//获取井的实时数据
export function ApiGetWellData(params) {
    return AXIOS.get('/api/realdata/realdata/?', { params })
}
