import axios from 'axios'

export function login(email, password) {
    return axios.post('/api/login', { email, password })
}
export function signup(params) {
    return axios.post('/api/signup', params)
}
export function logout() {
    return axios.post('/api/logout', {})
}
export function getSession() {
    return axios.post('/api/getSession')
}