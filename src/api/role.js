import request from '@/utils/request'

export function listRole(query) {
  return request({
    url: '/roles',
    method: 'get',
    params: query
  })
}

export function createRole(data) {
  return request({
    url: '/role',
    method: 'post',
    data
  })
}

export function readRole(data) {
  return request({
    url: '/role/${data.id}',
    method: 'get',
    data
  })
}

export function updateRole(id,data) {
  return request({
    url: `/role/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/role/${id}`,
    method: 'delete'
  })
}

export function getPermission(roleId) {
  return request({
    url: '/permissions?roleId='+roleId,
    method: 'get'
  })
}

export function updatePermission(data) {
  return request({
    url: '/permissions',
    method: 'post',
    data
  })
}

export function roleOptions(query) {
  return request({
    url: '/role/options',
    method: 'get',
    params: query
  })
}
