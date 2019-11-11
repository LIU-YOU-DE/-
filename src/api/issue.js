import request from '@/utils/request'

export function listIssue(query) {
  return request({
    url: '/comment',
    method: 'get',
    params: query
  })
}

export function createIssue(data) {
  return request({
    url: '/issue/create',
    method: 'post',
    data
  })
}

// export function readIssue(data) {
//   return request({
//     url: '/issue/read',
//     method: 'get',
//     data
//   })
// }

export function showswitch(id,data){
  return request({
    url:`/comment/status/${id}?status=${data}`,
    method:"put"
  })
}
export function updateIssue(id,data) {
  return request({
    url: `/comment/${id}`,
    method: 'put',
    data
  })
}

export function deleteIssue(data) {
  return request({
    url: `/commnet/${data}`,
    method: 'delete',
    data
  })
}
