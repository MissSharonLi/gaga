import { POST } from '../../config/http'

// 获取首页Banner
export const handleGetBannerList = (params) => POST('index/getBannerList', params)

// 获取商品分类
export const handleGetGoodsCat = (params) => POST('material/goods/getCat', params)

// 获取商品列表
export const handleGetGoodsList = (params) => POST('material/goods/getList', params)

// 获取作业状态
export const handleGetReceiveStatus = (params) => POST('material/receive/getStatus', params)

// 获取作业列表
export const handleGetReceiveList = (params) => POST('material/receive/getList', params)

// 添加页面选项
export const handleGgetAddConfig = (params) => POST('material/work/getAddConfig', params)

// 添加作业
export const handleAddWork = (params) => POST('material/work/addWork', params, true)

// 上传附件
export const handleCommonUpload = (params) => POST('common/upload', params)
