import axios from 'axios'

const api = axios.create({
  baseURL: 'https://6a2bbcf43e2b60ab038eb99f.mockapi.io/api/',
})

export default api