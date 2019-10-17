// 文章相关请求的接口模块
import request from '@/utils/request'

export function getArticles (params) {
  return request({
    method: 'get',
    url: '/app/v1_1/articles',
    params
  })
}

// 获取文章详情
export function getArticle (articleId) {
  return request({
    method: 'get',
    url: '/app/v1_0/articles/' + articleId
  })
}

// 对文章点赞
export function likings (articleId) {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/likings',
    data: {
      target: articleId
    }
  })
}

// 取消对文章点赞
export function unLikings (articleId) {
  return request({
    method: 'DELETE',
    url: '/app/v1_0/article/likings/' + articleId
  })
}

// 对文章不喜欢
export function dislike (articleId) {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/dislikes',
    data: {
      target: articleId
    }
  })
}

// 取消对文章不喜欢
export function unDislike (articleId) {
  return request({
    method: 'DELETE',
    url: '/app/v1_0/article/dislikes/' + articleId
  })
}
