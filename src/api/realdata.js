import AXIOS from '@/utils/request'
// 获取实时数据和综合查询
export function getRealdata(params) {
    return AXIOS.get('/realdata/realdata/', { params })
  }