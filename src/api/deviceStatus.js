import AXIOS from '@/utils/request'
//获取设备状态
export function ApigetDeviceStatus(params) {
  return AXIOS.get('/dtu/dtu/', {params})
}