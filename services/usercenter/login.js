import { POST } from '../../config/http'

// 根据CODE登录wx.login()
export const handleUserWxapplogin = (params) => POST('user/wxapplogin', params, true)

// 根据CODE获取手机号注册/登录
export const handleWxapplogin = (params) => POST('user/wxAppMobileLogin', params)

// 获取授权手机号
export const getPhonenumber = (params) => POST('user/getphonenumber', params)

// 获取用户信息
export const getUserInfo = (params) => POST('user/getuserinfo', params)

// 账户密码登录
export const handleUserLogin = (params) => POST('user/login', params)

// 短信验证码登录
export const handleMobileLogin = (params) => POST('user/changemobile', params)

// 发送短信验证码
export const handleSmsSend = (params) => POST('sms/send', params)

// 绑定抖音列表
export const getMyDouYinList = (params) => POST('dou_user/getMyList', params)

// 绑定生成二维码
export const getMyDouYinCode = (params) => POST('dou_user/getCode', params)

// 检测抖音扫码状态
export const handleDouYinCheckCode = (params) => POST('dou_user/checkCode', params)

// 退出登录
export const handleLoginOut = (params) => POST('user/logout', params, true)
