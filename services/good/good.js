import { POST } from '../../config/http'

// 获取商品详情
export const getGoodsDetail = (params) => POST('material/goods/getDetail', params)

// 获取新手引导
export const getNewerGuide = (params) => POST('index/getGuide', params)

// 获取客服信息
export const getCustomer = (params) => POST('index/getCustomer', params)

// 添加橱窗
export const handleAddShowCase = (params) => POST('material/goods/addShowCase', params)
