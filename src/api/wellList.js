import AXIOS from '@/utils/request'
// 获取油井列表
export function ApiGetWellList(params) {
    return AXIOS.get('api/well/well/?list', { params })
}