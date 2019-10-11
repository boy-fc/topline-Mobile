// axios 请求相关操作封装到这里
import axios from 'axios'
import JSONbig from 'json-bigint'

// 配置请求基础路径
const request = axios.create({
  // 请求的基础路径
  baseURL: 'http://ttapi.research.itcast.cn'
})

// 处理后端返回数据超出 JS 安全整数范围问题
request.defaults.transformResponse = [function (data) {
  return data ? JSONbig.parse(data) : {}
}]
// 请求拦截器

// 响应拦截器

export default request
