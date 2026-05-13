import { getData, postData } from "./api"

export const createUserAPI = (body) => {
  return postData("/admin/create-user", body)
}

export const getUsersAPI = () => {
  return getData("/admin/users")
}

export const getPendingRequestsAPI = (token) => {
  return getData("/admin/pending", token)
}

export const approveRequestAPI = (id, token) => {
  return postData(`/admin/approve/${id}`, {}, token)
}

export const rejectRequestAPI = (id, token) => {
  return postData(`/admin/reject/${id}`, {}, token)
}