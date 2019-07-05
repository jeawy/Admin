/**
 * 
 * @file 封装  cookie中操作token的方法，并且导出
 *  
 */

import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
//cookie中获取Tokey
export function getToken() {
  return Cookies.get(TokenKey)
}
//cookie中设置Toke
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
//cookie中删除Toke
export function removeToken() {
  return Cookies.remove(TokenKey)
}
