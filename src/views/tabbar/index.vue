<template>
  <div>
      <!-- 路由出口 -->
        <router-view />
      <!-- /路由出口 -->
      <!-- 底部导航栏 -->
      <van-tabbar v-model="active" @change=' changeActive'>
        <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
        <van-tabbar-item icon="search">问答</van-tabbar-item>
        <van-tabbar-item icon="friends-o">视频</van-tabbar-item>
        <van-tabbar-item icon="setting-o" to="/my">{{ $store.state.user ? '我的' : '未登录'}}</van-tabbar-item>
      </van-tabbar>
  </div>
</template>

<script>
import { getItem, setItem } from '@/utils/storage'
export default {
  name: 'TabbarIndex',
  data () {
    return {
      active: getItem('active') || 0
    }
  },
  methods: {
    changeActive (data) {
      if (!this.$store.state.user) {
        return
      }
      this.active = data
      setItem('active', data)
    }
  }
}
</script>

<style lang='less' scoped>
.van-tabbar {
  height: 103px;
  /deep/.van-tabbar-item {
    font-size: 20px;
  }
  /deep/ .van-tabbar-item__icon {
    font-size: 40px;
  }
  /deep/.van-tabbar-item--active{
    color:#3296FA
  }
}
</style>
