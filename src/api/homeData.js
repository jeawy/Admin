import AXIOS from '@/utils/request'
//获取首页信息
export function getHomeData(params) {
  return AXIOS.get('/', {params})
}