/**
 * 频道相关接口模块
 */
import request from '@/utils/request'

// 获取频道列表数据
export function getDefaultChannels () {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}
