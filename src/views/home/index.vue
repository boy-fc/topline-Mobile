<template>
    <div>
        <!-- 顶部导航栏 -->
        <van-nav-bar title="首页" fixed/>
        <!-- 频道列表 -->
        <van-tabs v-model="active">
            <van-tab :title="channel.name" v-for="channel in channels" :key="channel.id">
                <!-- 文章列表 -->
              <van-pull-refresh v-model="channel.isPullDownLoading" @refresh="onRefresh">
                <van-list v-model="channel.loading" :finished="channel.finished"
                    finished-text="没有更多了" @load="onLoad">
                    <!-- 数据列表 -->
                    <van-cell v-for="(article, index) in channel.articles" :key="index" :title="article.title">
                      <div slot="label">
                        <van-grid :border="false" :column-num="3">
                          <van-grid-item v-for="(img, index) in article.cover.images" :key="index">
                            <van-image height="146" width="232" :src="img" lazy-load/>
                          </van-grid-item>
                        </van-grid>
                         <div class="article-info">
                          <div class="meta">
                            <span>{{ article.aut_name }}</span>
                            <span>{{ article.comm_count }}评论</span>
                            <span>{{ article.pubdate| relativeTime }}</span>
                          </div>
                          <van-icon name="close" />
                        </div>
                      </div>
                    </van-cell>
                </van-list>
              </van-pull-refresh>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>
import { getDefaultChannels } from '@/api/channel'
import { getArticles } from '@/api/article'
import '@/utils/date'

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
        channel.timestamp = null // 存储获取频道下一页的时间戳
        channel.isPullDownLoading = false // 存储频道的下拉刷新 loading 状态
      })
      this.channels = data.data.channels
    },
    async onLoad () {
      const activeChannel = this.channels[this.active]
      // 1.获取请求数据
      const { data } = await getArticles({
        channel_id: activeChannel.id, // 频道id
        timestamp: activeChannel.timestamp || Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
        with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
      })
      // 2.将数据添加到当前文章列表
      activeChannel.articles.push(...data.data.results)
      // 3.结束当前刷新频道
      activeChannel.loading = false
      // 4.判断是否还有下一页数据
      if (data.data.pre_timestamp) {
        activeChannel.timestamp = data.data.pre_timestamp
      }
    },
    async onRefresh () {
      const activeChannel = this.channels[this.active]
      // 1.获取请求数据
      const { data } = await getArticles({
        channel_id: activeChannel.id, // 频道id
        timestamp: Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
        with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
      })
      // 2.将数据添加到当前文章列表
      activeChannel.articles.unshift(...data.data.results)
      // 3. 关闭下拉刷新的 loading 状态
      activeChannel.isPullDownLoading = false
      // 4. 提示
      this.$toast('刷新成功')
    }
  },
  created () {
    // 加载频道列表
    this.loadChannels()
  }
}
</script>

<style lang='less'>
.van-tabs--line .van-tabs__wrap {
    position: fixed;
    top: 128px;
    left: 0;
    right: 0;
    z-index: 2;
    height: 82px;
    .van-tab{
      line-height: 82px;
      font-size: 30px;
      color:#333;
      .van-tabs__content {
        margin-top: 210px;
      }
    }
    .van-tabs__line{
      background-color:#3296FA;
      height: 6px;
      width: 31px
    }
}
.van-tabs .van-tabs__content {
    margin-top: 210px;
}
.van-cell:not(:last-child)::after{
    border-bottom: 1px solid #999;
}
.van-cell {
  font-size: 32px;
  color:#3A3A3A;
  line-height: 50px;
  .van-grid-item__content{
    padding: 16px 2px;
  }
  .article-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 23px;
    margin-top: 24px;
    margin-bottom: 24px;
    .meta span {
      margin-right: 10px;
    }
  }
}

</style>
