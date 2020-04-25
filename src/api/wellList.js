import AXIOS from '@/utils/request'
// 获取油井列表
export function ApiGetWellList(params) {
    return AXIOS.get('api/well/well/?list', { params })
}
//添加油井
export function ApiAddWell(data) {
    return AXIOS.post('/api/well/well/', data)
}
//修改油井
export function ApiAlterWell(data) {
    return AXIOS.put('/api/well/well/', data)
}
//删除油井
export function ApiDeleteWellList(data) {
    return AXIOS.post ('/api/well/well/', data)
}