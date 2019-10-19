/**
 * 用户相关接口封装模块
 * 最佳实践：建议将所有请求都封装成一个一个的小函数，在需要的时候直接调用
 *   好处：1. 好维护，统一管理 2. 可重用
 * 遵循一个原则：不要直接在组件中发请求，都封装成函数进行调用
 */
import request from '@/utils/request'

export const login = ({ mobile, code }) => {
  // 其它逻辑。。。
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data: {
      mobile,
      code
    }
  })
}

// 关注用户
export function followUser (userId) {
  return request({
    method: 'POST',
    url: '/app/v1_0/user/followings',
    data: {
      target: userId
    }
  })
}

// 取消关注用户
export function unFollowUser (userId) {
  return request({
    method: 'DELETE',
    url: '/app/v1_0/user/followings/' + userId
  })
}

// 获取用户自己信息
export function getUserSelf (userId) {
  return request({
    method: 'GET',
    url: '/app/v1_0/user'
  })
}

// 编辑用户个人资料
export function getProfile (userId) {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/profile'
  })
}

// 编辑用户照片资料（头像、身份证照片）
export function updateUserPhoto (data) {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/photo',
    data
  })
}

/**
 * 更新用户基本信息
 */
export const updateUserProfile = ({
  name,
  gender,
  birthday
}) => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/profile',
    data: {
      name, // 昵称
      gender, // 性别
      birthday // 生日
    }
  })
}
