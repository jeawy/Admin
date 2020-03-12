import AXIOS from '@/utils/request'
//获取井的信息
export function getWellDetail(params){
    return AXIOS.get('/well/well/',{ params })
}
//查看月耗电量
export function viewPowersMonth(params){
    return AXIOS.get('/stats/consuption/',{ params })
}
//获取历史数据
export function getHistoryData(params){
    return AXIOS.get('/clientdata/clientdata/',{ params })
}
//开关井记录
export function ApiGetWellRecord(params){
    return AXIOS.get('/well/record/',{ params })
}
//填写实测数据
export function ApiMeasureData(data) {
    return AXIOS.post('/clientdata/clientdata/', data)
}
//获取实测数据
export function ApiGetMeasureData(params){
    return AXIOS.get('/clientdata/clientdata/',{ params })
}
//获取指令列表
export function ApiGetOrders(params){
    return AXIOS.get('/orders/orders/',{ params })
}
//创建指令
export function ApiCreateOrder(data) {
    return AXIOS.post('/orders/orders/', data)
}