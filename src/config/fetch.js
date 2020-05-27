import fetch from 'cross-fetch'
import { MessageBox, Message } from 'element-ui'
// import { baseUrl } from './env'
import store from '@/store'
import { getToken } from '@/utils/auth'

export default async(url = '', data = {}, type = 'GET', method = 'fetch') => {
  // console.log('VUE_APP_API_URL', process.env.VUE_APP_API_URL, baseUrl)

  type = type.toUpperCase()
  // url = baseUrl + url
  if (type === 'GET') {
    let dataStr = '' // 数据拼接字符串
    Object.keys(data).forEach(key => {
      dataStr += key + '=' + data[key] + '&'
    })

    if (dataStr !== '') {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'))
      url = url + '?' + dataStr
    }
  }

  const requestConfig = {
    credentials: 'include',
    method: type,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      // 'Content-type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': 'http://dlallinpay.sinaapp.com'
    },
    mode: 'cors',
    cache: 'force-cache'

  }
  // console.log(' store.getters.token ', store.getters.token)
  if (store.getters.token) {
    // let each request carry token
    // ['X-Token'] is a custom headers key
    // please modify it according to the actual situation
    // get token from cookies, cookies 有过期时间，可能为空
    requestConfig.headers['Authorization'] = 'Bearer ' + getToken()
  }

  if (type === 'POST' || type === 'PUT' || type === 'DELETE') {
    Object.defineProperty(requestConfig, 'body', {
      value: JSON.stringify(data)
    })
  }

  try {
    // console.log('url---------:', url)
    // console.log('requestConfig---:', requestConfig)
    const response = await fetch(url, requestConfig)
    // console.log('response----:', response)

    if (response.status >= 400) {
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (response.status === 401) {
        // unauthorized 401
        // unprocessable_entity 422
        // not_found 404
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      } else {
        throw new Error('Bad response from server')
      }
    }
    const responseJson = await response.json()

    return responseJson
  } catch (error) {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    throw new Error(error)
  }
}
