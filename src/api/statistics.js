//统计相关http API

import AXIOS from '@/utils/request'
//获取项目进度统计
export function getProjectStatistic(params) {
  return AXIOS.get('/statistic/project/', {
    params
  })
}
//获取镜头状态统计
export function getAssetStatistic(params) {
  return AXIOS.get('/statistic/asset/', {
    params
  })
}
//获取任务状态统计
export function getTaskStatistic(params) {
  return AXIOS.get('/statistic/task/', {
    params
  })
}
//获取任务甘特图数据
export function getGanttData(params) {
  return AXIOS.get('/projects/stat/', {
    params
  })
}
//燃尽图接口
export function burnOut(params){
    return AXIOS.get('/projects/stat/',{params})
}
//外包
export function exportTask(params){
    return AXIOS.get('/projects/stat/',{params})
}
//查询项目提交次数
export function proCommitCount(params){
    return AXIOS.get('/projects/submitrecord/', {params})
}

//统计项目成员的资产和任务信息
export function statisticMemberDetail(params){
    return AXIOS.get('/statistic/member/',{params})
}
//成员排名
export function MemberSort(params){
    return AXIOS.get('/statistic/score/',{params})
}

//获取执行人
export function getingExecutorChart(params){
  return AXIOS.get('/projects/stat/?05',{params})
}