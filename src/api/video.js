import AXIOS from '@/utils/request'
/**
 * 截图
 * @param {} params 
 */
export function drawImage(params = null) {
    return AXIOS.get('http://tl.chidict.com:8081/video/', {
        params,
        headers: {
            1: 111
        }
    })
}
//我的待审批任务
export function getApprove(params = null) {
    return AXIOS.get('/approve/approve/', {
        params
    })
}
//提交审核
export function postApprove(data) {
    return AXIOS.post('/approve/approve/', data, {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        transformRequest: [params => {
            return JSON.stringify(params)
        }],
    })
}
//获取审核备注列表/approve/approve/
export function getApproveRemark(params) {
    return AXIOS.get('/approve/approve_result/', {
        params
    })
}
//根据任务id查询审核信息
export function getApproveDetail(params) {
    return AXIOS.get('/approve/approve/', {
        params
    })
}
//提交外网审核
export function postApproveToclient(data) {
    return AXIOS.post('/approve/toclient/', data)
}