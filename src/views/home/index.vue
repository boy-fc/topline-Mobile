<template>
    <div>
        <!-- 顶部导航栏 -->
        <van-nav-bar fixed>
          <van-button type="info" slot="title" round @click="$router.push('/search')" size="large">搜索
         </van-button>
        </van-nav-bar>
        <!-- 频道列表 -->
        <van-tabs v-model="active" animated swipeable>
          <!-- 面包屑按钮 -->
          <div slot="nav-right" class="bread" @click="isChannelEditShow = true">
             <van-icon name="wap-nav" size="40" />
          </div>
            <van-tab :title="channel.name" v-for="channel in channels" :key="channel.id">
                <!-- 文章列表 -->
              <van-pull-refresh v-model="channel.isPullDownLoading" @refresh="onRefresh">
                <van-list v-model="channel.loading" :finished="channel.finished"
                    finished-text="没有更多了" @load="onLoad">
                    <!-- 数据列表 -->
                    <van-cell v-for="(article, index) in channel.articles" :key="index"
                    :title="article.title" @click="$router.push({
                            name: 'article',
                            params: {
                              articleId: article.art_id.toString()
                            }
                          })">
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
        <!-- 频道弹层管理 -->
        <van-popup v-model="isChannelEditShow" round position="bottom"
        closeable close-icon-position="top-left" :style="{ height: '95%' }">
          <!-- 频道容器 -->
          <div class="channel-container">
            <!-- 我的频道编辑栏 -->
              <van-cell title="我的频道" :border='false'>
                <van-button slot='default' type="danger"
                @click="isEditShow=!isEditShow">{{isEditShow ? '完成':'编辑'}}</van-button>
              </van-cell>
            <!-- 我的频道 -->
            <van-grid :gutter='10'>
              <!-- 推荐频道 -->
               <van-grid-item text="推荐" @click="switchChannel(0)" />
              <van-grid-item v-for="(channel,index) in channels.slice(1)" @click="onMyChannelClick(index)"
              :key="index" :text="channel.name">
                <van-icon name="close" class="close-icon" slot="icon" v-show="isEditShow"/>
              </van-grid-item>
            </van-grid>
            <!-- 推荐频道 -->
            <van-cell title="推荐频道" :border='false'/>
            <van-grid :gutter='10'>
              <van-grid-item v-for="(channel, index) in recommondChannels" :key="index" :text="channel.name"
              @click="onAddChannel(channel)"/>
            </van-grid>
          </div>
        </van-popup>
    </div>
</template>

<script>
import { getDefaultChannels, getAllChannels } from '@/api/channel'
import { getArticles } from '@/api/article'
import '@/utils/date'
import { getItem, setItem } from '@/utils/storage'
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
      channels: [],
      // 所有频道列表
      allChannels: [],
      // 弹层显示
      isChannelEditShow: false,
      // 删除频道
      isEditShow: false,
      isPullDownLoading: false
    }
  },
  methods: {
    // 频道数据处理函数
    dealChannels (channels) {
      //   定制频道的数据内容
      channels.forEach(channel => {
        // 频道的文章列表
        channel.articles = []
        // 频道的上啦加载更多的loading状态
        channel.loading = false
        // 频道的加载结束时的状态
        channel.finished = false
        channel.timestamp = null // 存储获取频道下一页的时间戳
        channel.isPullDownLoading = false // 存储频道的下拉刷新 loading 状态
      })
    },
    //   获取频道列表
    async loadChannels () {
      let channels = []
      // 读取本地存储中的频道列表
      const localChannels = getItem('channels')
      // 如果有本地存储的频道列表就使用本地存储的频道列表
      if (localChannels) {
        channels = localChannels
      } else {
        // 如果没有本地存储的频道列表，则请求获取后台推荐的频道列表
        const { data } = await getDefaultChannels()
        channels = data.data.channels
      }
      this.dealChannels(channels)
      this.channels = channels
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
    },
    // 获取所有频道列表
    async loadAllChannels () {
      const { data } = await getAllChannels()
      const channels = data.data.channels
      this.dealChannels(channels)
      this.allChannels = channels
    },
    // 添加频道
    onAddChannel (channel) {
      // 将频道添加到我的频道中
      this.channels.push(channel)
    },
    // 删除频道
    onMyChannelClick (index) {
      if (this.isEditShow) {
        // 如果是编辑状态，删除频道
        this.channels.splice(index + 1, 1)
      } else {
        // 如果是非编辑状态，切换频道展示
        // 切换当前激活的频道
        this.switchChannel(index + 1)
      }
    },
    // 切换频道
    switchChannel (index) {
      this.active = index
      this.isChannelEditShow = false
    }
  },
  computed: {
    // 获取推荐频道列表
    recommondChannels () {
      const arr = []
      this.allChannels.forEach(channel => {
        const ret = this.channels.find(item => item.id === channel.id)
        if (!ret) {
          arr.push(channel)
        }
      })
      return arr
    }
  },
  created () {
    // 加载频道列表
    this.loadChannels()
    // 加载所有频道列表
    this.loadAllChannels()
  },
  // 事件监听
  watch: {
  // 函数名就是要监视的数据成员名称
    channels (newVal) {
      setItem('channels', newVal)
    }
  }
}
</script>

<style lang='less' scoped>
/deep/ .van-tabs--line .van-tabs__wrap {
    position: fixed;
    top: 128px;
    left: 0;
    right: 0;
    z-index: 2;
    height: 82px;
    /deep/.van-tab{
      line-height: 82px;
      font-size: 30px;
      color:#333;
      /deep/ .van-tabs__content {
        margin-top: 210px;
      }
    }
    /deep/.van-tabs__line{
      background-color:#3296FA;
      height: 6px;
      width: 31px
    }
}
/deep/.van-tabs .van-tabs__content {
    margin-top: 210px;
}
/deep/ .van-cell:not(:last-child)::after{
    border-bottom: 1px solid #999;
}
/deep/.van-cell {
  font-size: 32px;
  color:#3A3A3A;
  line-height: 50px;
  .van-grid-item__content{
    padding: 16px 2px;
  }
  /deep/.article-info {
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
// 面包屑样式
.bread{
  position: fixed;
  right: 0;
  top: 150px;
  background-color: #fff;
}
/deep/ .van-popup{
  // 弹层频道列表-关闭图标
  .van-popup__close-icon {
      font-size: 28px;
      color: #222
  }
  // 频道容器
  .channel-container {
    margin-top: 52px;
    // 编辑按钮
    /deep/.van-cell {
      margin-bottom: 25px;
        .van-button--danger{
        height: 40px;
        width: 100px;
        font-size: 20px;
      }
    }
    // 我的频道
    .van-grid {
      .van-grid-item__content--center{
        margin-bottom: 29px;
      }
      .close-icon {
          position: absolute;
          top: -5px;
          right: -5px;
          font-size: 30px;
        }
      .van-grid-item__text {
        font-size: 28px;
        color:#222
      }
    }
  }
}
// 搜索栏
.van-nav-bar {
   /deep/ .van-nav-bar__title{
    padding-top: 52px;
    max-width: 100%;
    .van-button--large {
      width: 555px;
      height: 64px;
      line-height: 64px;
      background: #5babfb;
      .van-button__text {
        font-size: 28px;
      }
    }
  }
}
</style>
