// const BASE_URL = "http://localhost:5000/api"
const BASE_URL = "http://10.39.241.45:5000/api"

// 🔐 get token safely
const getToken = () => {
  return localStorage.getItem("token") || ""
}

// 🔥 headers (ONLY attach token if exists)
const getHeaders = () => {
  const token = getToken()

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` })
  }
}

// 🔁 logout helper (centralized)
const forceLogout = () => {
  console.log("Session expired → logging out")
  localStorage.clear()
  window.location.href = "/"
}

// ✅ HANDLE RESPONSE SAFELY
const handleResponse = async (res) => {
  let data = null

  try {
    data = await res.json()
  } catch (err) {
    console.error("Invalid JSON response")
  }

  // ❌ auth issues
  if (res.status === 401 || res.status === 403) {
    forceLogout()
    return null
  }

  // ❌ other errors
  if (!res.ok) {
    console.error("API ERROR:", data?.message || res.status)
    return data
  }

  return data
}

// ✅ GET
export const getData = async (url) => {
  console.log("URL:", BASE_URL + url)
  try {
    const res = await fetch(BASE_URL + url, {
      method: "GET",
      headers: getHeaders()
    })

    return await handleResponse(res)

  } catch (err) {
    console.error("GET ERROR:", err)
    return null
  }
}

// ✅ POST
export const postData = async (url, body = {}) => {
  try {
    const res = await fetch(BASE_URL + url, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(body)
    })

    return await handleResponse(res)

  } catch (err) {
    console.error("POST ERROR:", err)
    return null
  }
}

// ✅ OPTIONAL: PUT
export const putData = async (url, body = {}) => {
  try {
    const res = await fetch(BASE_URL + url, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(body)
    })

    return await handleResponse(res)

  } catch (err) {
    console.error("PUT ERROR:", err)
    return null
  }
}

// ✅ OPTIONAL: DELETE
export const deleteData = async (url) => {
  try {
    const res = await fetch(BASE_URL + url, {
      method: "DELETE",
      headers: getHeaders()
    })

    return await handleResponse(res)

  } catch (err) {
    console.error("DELETE ERROR:", err)
    return null
  }
}

export const getRequests = async (req, res) => {
  const requests = await ApprovalRequest.findAll({
    where: { status: "pending" },
    order: [["createdAt", "DESC"]]
  })

  res.json({ requests })
}