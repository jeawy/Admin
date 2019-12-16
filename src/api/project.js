import AXIOS from '@/utils/request'
// 获取项目列表或者项目详情
export function getProjects(params = null) {
  return AXIOS.get('/projects/projects/', { params })
}
// 创建项目
export function addProjects(data) {
  return AXIOS.post('/projects/projects/', data)
}
// 编辑项目
export function putProjects(data) {
  return AXIOS.post('/projects/projects/?01', data)
}
// 我的项目
export function getMyProject(params) {
  return AXIOS.get('/projects/projects/?mine', { params })
}
// 添加/删除项目参与的工种
export function projectProfession(data) {
  return AXIOS.post('/projects/projects/?method=put', data)
}
// 删除项目
export function delOneProject(data) {
  return AXIOS.post('/projects/projects/?delete', data)
}
// 练习生项目新建分组
export function createTeam(data) {
  return AXIOS.post('/projects/team/', data)
}

// 练习生项目修改分组
export function putTeam(data) {
  return AXIOS.post('/projects/team/?put', data)
}

// 练习生项目删除分组
export function delTeam(data) {
  return AXIOS.post('/projects/team/?delete', data)
}
// 练习生项目获取分组列表
export function getTeamList(params) {
  return AXIOS.get('/projects/team/', { params })
}
//修改项目的制作内容
export function updateRequirement(data){
  return AXIOS.post("/projects/projects/",data)
}
//设置菜单项(镜头与任务中展示列设置)
export function setupMenu(data){
  return AXIOS.post('/menu/menu/',data)
}
//获取菜单设置
export function getMenu(params) {
  return AXIOS.get('/menu/menu/', { params })
}
