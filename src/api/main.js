import request from '../utils/request'

export const login = (data) => {
  return request.post('users/login', data)
}

export const list = (name, data) => {
  return request.post(`${name}/list`, data)
}

export const add = (name, data) => {
  return request.post(`${name}/add`, data)
}

export const updateOne = (name, data) => {
  return request.post(`${name}/updateOne`, data)
}

export const deleteOne = (name, data) => {
  return request.post(`${name}/deleteOne`, data)
}

export const deleteMany = (name, data) => {
  return request.post(`${name}/deleteMany`, data)
}

export const detail = (name, data) => {
  return request.get(`${name}/detail`, { params: data })
}

export const upload = (formData) => {
  return request.post(`file/upload`, formData, {headers: { 'Content-Type': 'multipart/form-data' }})
}

export const fileStream = (params) => {
  return request.get(`file/fileStream`, { params, responseType: 'blob', headers: { 'X-Requested-With': 'XMLHttpRequest' } })
}

export const fileStreamManual = (params) => {
  return request.get(`file/fileStreamManual`, { params, responseType: 'blob', headers: { 'X-Requested-With': 'XMLHttpRequest' } })
}

export const importData = (name, data) => {
  return request.post(`${name}/import`, data)
}