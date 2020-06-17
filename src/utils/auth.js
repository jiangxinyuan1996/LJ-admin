import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const username = 'username'
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function setUsername(username,token){
  return Cookies.set(username,token)
}
export function getUsername(username){
  return Cookies.get(username)
}
