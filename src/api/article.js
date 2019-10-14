// 文章相关请求的接口模块
import request from '@/utils/request'

export function getArticles (params) {
  return request({
    method: 'get',
    url: '/app/v1_1/articles',
    params
  })
}
