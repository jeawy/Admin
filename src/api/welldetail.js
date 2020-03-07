import AXIOS from '@/utils/request'
//获取井的信息
export function getWellDetail(params){
    return AXIOS.get('/well/well/',{ params })
}
//查看月耗电量
export function viewPowersMonth(params){
    return AXIOS.get('/stats/consuption/',{ params })
}