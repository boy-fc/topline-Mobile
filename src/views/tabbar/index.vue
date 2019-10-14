<template>
  <div>
      <!-- 路由出口 -->
        <router-view />
      <!-- /路由出口 -->

      <!-- 底部导航栏 -->
      <van-tabbar v-model="active">
        <van-tabbar-item icon="home-o">首页</van-tabbar-item>
        <van-tabbar-item icon="search">问答</van-tabbar-item>
        <van-tabbar-item icon="friends-o">视频</van-tabbar-item>
        <van-tabbar-item icon="setting-o">我的</van-tabbar-item>
      </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'TabbarIndex',
  data () {
    return {
      active: 0
    }
  }
}
</script>

<style lang='less' scroped>
.van-tabbar {
  height: 98px;
  .van-tabbar-item__text {
    font-size: 20px;
  }
  .van-icon {
    font-size: 40px;
  }
  .van-tabbar-item--active{
    color:#3296FA
  }
}
</style>
