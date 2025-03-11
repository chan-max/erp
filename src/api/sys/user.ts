import { defHttp } from '/@/utils/http/axios'
import { LoginParams, LoginResultModel, GetUserInfoModel } from './model/userModel'

import { ErrorMessageMode } from '/#/axios'
import CryptoJS from 'crypto-js'
import { pwdKey } from '/@/enums/config'

enum Api {
  Login = '/api/login',
  Logout = '/api/logout',
  GetUserInfo = '/getUserInfo',
  GetPermCode = '/getPermCode',
  TestRetry = '/testRetry',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {

  params.password = CryptoJS.MD5(params.password + pwdKey).toString()

  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  )
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' })
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode })
}

export function doLogout() {
  return defHttp.post({ url: Api.Logout })
}

export function getUserList() {
  return defHttp.get({ url: '/api/users' })
}

export function addUser(userInfo) {
  return defHttp.post({ url: '/api/users', data: userInfo })
}

export function updateUser(userInfo) {
  return defHttp.put({ url: `/api/users/${userInfo.id}`, data: userInfo })
}

export function deleteUser(id) {
  return defHttp.delete({ url: `/api/users/${id}` })
}


export function testRetry() {
  return defHttp.get(
    { url: Api.TestRetry },
    {
      retryRequest: {
        isOpenRetry: true,
        count: 5,
        waitTime: 1000,
      },
    },
  )
}
