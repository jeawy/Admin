import AXIOS from '@/utils/request'
// 获取实时数据和综合查询
export function ApiGetRealdata(params) {
    return AXIOS.get('api/realdata/realdata/', { params })
}
//获取历史数据
export function ApiGetHistorydata(params) {
    return AXIOS.get('api/clientdata/clientdata/', { params })
}
//获取电流曲线
export function ApiGetElectdata(params) {
    return AXIOS.get('api/p144/p144/', { params })
}

