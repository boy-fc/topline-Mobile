<template>
  <div>
    <!-- 用户信息 -->
    <van-cell-group class="user-info" v-if="$store.state.user">
      <van-cell
        class="base-info"
        is-link :border="false"
        @click="$router.push('/user')"
      >
        <div slot="title">
          <img class="avatar" :src="user.photo" alt="">
          <span class="title">{{ user.name }}</span>
        </div>
      </van-cell>
      <van-grid class="data-info" :border="false" v-if="$store.state.user">
        <van-grid-item>
          <span class="count">{{ user.art_count }}</span>
          <span class="text">头条</span>
        </van-grid-item>
        <van-grid-item>
          <span class="count">{{ user.follow_count }}</span>
          <span class="text">关注</span>
        </van-grid-item>
        <van-grid-item>
          <span class="count">{{ user.fans_count }}</span>
          <span class="text">粉丝</span>
        </van-grid-item>
        <van-grid-item>
          <span class="count">{{ user.like_count }}</span>
          <span class="text">获赞</span>
        </van-grid-item>
      </van-grid>
    </van-cell-group>
    <!-- /用户信息 -->

    <!-- 未登录 -->
    <div class="not-login" v-else>
        <div class="circle" @click="$router.push({ name: 'login' })">
            <span>登录</span>
        </div>
    </div>
        <!-- /未登录 -->
    <!-- 其它 -->
    <van-cell-group>
      <van-grid clickable>
        <van-grid-item icon="star" text="我的收藏"/>
        <van-grid-item icon="chat" text="我的评论"/>
        <van-grid-item icon="like" text="我的点赞"/>
        <van-grid-item icon="browsing-history" text="浏览历史"/>
      </van-grid>
    </van-cell-group>
    <van-cell-group>
      <van-cell title="消息通知" is-link />
      <van-cell title="用户反馈" is-link />
      <van-cell title="小智同学" is-link @click="$router.push('/chat')" />
      <van-cell title="系统设置" is-link to="/settings" />
    </van-cell-group>
    <!-- /其它 -->
  </div>
</template>

<script>
import { getUserSelf } from '@/api/user'
export default {
  name: 'UserIndex',
  data () {
    return {
      user: {} // 用户信息对象
    }
  },
  methods: {
    async loadUserSelf () {
      if (!this.$store.state.user) {
        return
      }
      const { data } = await getUserSelf()
      this.user = data.data
    }
  },
  created () {
    //   加载用户自己的个人信息
    this.loadUserSelf()
  }
}
</script>

<style lang="less" scoped>
.user-info{
    height: 401px;
    /deep/.van-cell{
        height: 290px;
        font-size: 30px;
        background-color: #3296FA;
        color: #fff

    }
}
.not-login {
  height: 401px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #3296FA;
  .circle {
    width: 132px;
    height: 132px;
    padding: 20px;
    background-color: #fff;
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #3296FA;
    font-size: 30px;
  }
}

.user-info {
  .base-info {
    display: flex;
    align-items: center;
    div {
      display: flex;
      align-items: center
    }
    .avatar {
      margin-right: 45px;
      width: 132px;
      height: 132px;
      border-radius: 100%;
    }
    /deep/ .van-cell__right-icon{
        color :#fff;
        font-size: 35px;
    }
  }
  .data-info {
    .text {
      font-size: 28px;
    }
    .count {
      font-size: 30px;
    }
  }
}
/deep/ .van-grid-item__text{
    font-size: 28px;
}
/deep/ .van-cell-group{
    /deep/.van-cell{
    height: 104px;
    font-size: 30px;
    padding: 32px 45px;
    color:#333333;
    // border-bottom: 1px solid #ccc;
    /deep/ .van-cell__right-icon {
    min-width: 1em;
    height: 24px;
    font-size: 31px;
    }
}
}
</style>
