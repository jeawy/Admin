import AXIOS from '@/utils/request'
//获取井的信息
export function getWellDetail(params) {
    return AXIOS.get('api/well/well/', { params })
}
//查看月耗电量
export function viewPowersMonth(params) {
    return AXIOS.get('api/stats/consuption/', { params })
}
//获取历史数据
export function getHistoryData(params) {
    return AXIOS.get('api/clientdata/clientdata/', { params })
}
//开关井记录
export function ApiGetWellRecord(params) {
    return AXIOS.get('api/well/record/', { params })
}
//填写实测数据
export function ApiMeasureData(data) {
    return AXIOS.post('api/clientdata/clientdata/', data)
}
//获取实测数据
export function ApiGetMeasureData(params) {
    return AXIOS.get('api/clientdata/clientdata/', { params })
}
//获取指令列表
export function ApiGetOrders(params) {
    return AXIOS.get('api/orders/orders/', { params })
}
//创建指令
export function ApiCreateOrder(data) {
    return AXIOS.post('api/orders/orders/', data)
}
//删除指令
export function ApiDeleteOrder(data) {
    return AXIOS.post('api/orders/orders/?put', data)
}