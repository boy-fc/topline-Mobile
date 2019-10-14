<template>
    <div>
        <!-- 顶部导航栏 -->
        <van-nav-bar title="首页"/>
        <!-- 频道列表 -->
        <van-tabs v-model="active">
            <van-tab :title="channel.name" v-for="channel in channels" :key="channel.id">
                <!-- 文章列表 -->
                <van-list v-model="channel.loading" :finished="channel.finished"
                    finished-text="没有更多了" @load="onLoad">
                    <!-- 数据列表 -->
                    <van-cell v-for="item in channel.articles" :key="item" :title="item"/>
                </van-list>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>
import { getDefaultChannels } from '@/api/channel'
export default {
  name: 'HomeIndex',
  data () {
    return {
      active: 0,
      //   文章列表
      list: [],
      loading: false,
      finished: false,
      //   频道列表
      channels: []
    }
  },
  methods: {
    //   获取频道列表
    async loadChannels () {
      const { data } = await getDefaultChannels()
      //   定制频道的数据内容
      data.data.channels.forEach(channel => {
        // 频道的文章列表
        channel.articles = []
        // 频道的上啦加载更多的loading状态
        channel.loading = false
        // 频道的加载结束时的状态
        channel.finished = false
      })
      this.channels = data.data.channels
    },
    onLoad () {
      const activeChannel = this.channels[this.active]
      // 1. 请求获取数据
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          // 2. 将数据添加到 当前频道.articles 中
          activeChannel.articles.push(activeChannel.articles.length + 1)
        }

        // 3. 结束本次 loading
        activeChannel.loading = false

        // 4. 判断数据是否已全部加载结束，如果没有数据了，将 finish 设置为 true
        if (activeChannel.articles.length >= 40) {
          activeChannel.finished = true
        }
      }, 500)
    }
  },
  created () {
    this.loadChannels()
  }
}
</script>

<style lang='less' scroped>
.van-tabs--line .van-tabs__wrap {
    height: 82px;
    .van-tab{
      line-height: 82px;
      font-size: 30px;
      color:#333
    }
    .van-tabs__line{
      background-color:#3296FA;
      height: 6px;
      width: 31px
    }
}
</style>
