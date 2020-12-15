import AXIOS from '@/utils/request'
// 获取实时数据和综合查询
export function ApiGetRealdata(params) {
    return AXIOS.get('api/realdata/realdata/', { params })
}
// 获取功耗
export function ApiGetPower(params) {
    return AXIOS.get('/api/realdata/realdata/?active', { params })
}
// 获取平均有功跟平衡度
export function ApiGetAverage(params) {
    return AXIOS.get('/api/realdata/realaverage/', { params })
}
// 能耗查询
export function ApiSearchPower(params) {
    return AXIOS.get('/api/realdata/realdata/?real', { params })
}
//获取历史数据
export function ApiGetHistorydata(params) {
    return AXIOS.get('api/clientdata/clientdata/', { params })
}
//获取电流曲线
export function ApiGetElectdata(params) {
    return AXIOS.get('api/p144/p144/', { params })
}
//获取历史电流、有功曲线
export function ApiGetHistorydatas(params) {
    return AXIOS.get('/api/p144/p144history/', { params })
}
//获取最新的位移和有功曲线
export function ApiGetPowerdata(params) {
    return AXIOS.get('/api/p144/newestp144/', { params })
}
//获取电流历史数据
export function ApiGetEleHistory(params) {
    return AXIOS.get('/api/realdata/realdata/?electricity', { params })
}
//获取井的实时数据
export function ApiGetWellData(params) {
    return AXIOS.get('/api/realdata/realdata/?', { params })
}
//获取抽油机的上下电流历史曲线
export function ApiGetUDEleHis(params) {
    return AXIOS.get('/api/realdata/ele/?wellid=97&line', { params })
}
//获取日核心数据
export function ApiGetCoreData(params) {
    return AXIOS.get('/api/realdata/realdata/?alldays', { params })
}
//导出日核心数据
export function ApiExportCoreData(params) {
    return AXIOS.get('/api/realdata/realdata/?alldays&print', { params })
}
//获取有功历史数据
export function ApiPowerData(params) {
    return AXIOS.get('/api/p144/p144history/', { params })
}