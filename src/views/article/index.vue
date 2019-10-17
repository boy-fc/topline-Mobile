<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      fixed
      left-arrow
      @click-left="$router.back()"
      title="文章详情"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <!-- 加载中 loading -->
    <van-loading class="article-loading" vertical color="#1989fa" v-if="loading">正在加载中···
    </van-loading>
    <!-- /加载中 loading -->

    <!-- 文章详情 -->
    <div class="detail" v-else-if="article.title">
      <h3 class="title">{{article.title}}</h3>
      <div class="author">
        <van-image round width="4rem" height="4rem" fit="fill" :src="article.aut_photo"/>
        <div class="text">
          <p class="name">{{article.aut_name}}</p>
          <p class="time">{{article.pubdate |relativeTime}}</p>
        </div>
        <van-button
          round
          size="small"
          type="info"
          @click="isFollowing"
        >{{article.is_followed?'已关注':'+ 关注'}}</van-button>
      </div>
      <div class="content" v-html="article.content"></div>
      <div class="zan">
        <van-button round size="small" hairline type="primary"
        plain :icon="article.attitude === 1?'good-job':'good-job-o'"
        @click="addLike"
        >{{this.article.attitude === 1? '已点赞':'点赞'}}</van-button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button round size="small" hairline type="danger"
        plain icon="delete"
        @click="deleteLike"
        >{{this.article.attitude === 0 ? '取消不喜欢':'不喜欢'}}</van-button>
      </div>
    </div>
    <!-- /文章详情 -->

    <!-- 加载失败的消息提示 -->
    <div class="error" v-else>
      <p>网络超时，点击 <a href="#" @click.prevent="loadArticle">刷新</a> 试一试。</p>
    </div>
    <!-- /加载失败的消息提示 -->
  </div>
</template>

<script>
import { getArticle, likings, unLikings, dislike, unDislike } from '@/api/article'
import { followUser, unFollowUser } from '@/api/user'
import '@/utils/date'
export default {
  name: 'ArticleIndex',
  data () {
    return {
      loading: true, // 控制加载中的 loading 状态
      // 文章详情
      article: []
    }
  },
  methods: {
    //   获取文章详情
    async loadArticle () {
      this.loading = true
      try {
        const { data } = await getArticle(this.$route.params.articleID)
        this.article = data.data
      } catch (err) {
        //   如果请求失败，就意味着数据加载失败
        console.log(err)
      }
      this.loading = false
    },
    // 关注和取消关注用户
    async isFollowing () {
    //   判断用户是否被关注
      if (this.article.is_followed) {
        await unFollowUser(this.article.aut_id)
      } else {
        await followUser(this.article.aut_id)
      }
      this.article.is_followed = !this.article.is_followed
    },
    // 是否取消对文章点赞
    async addLike () {
      const articleId = this.article.art_id.toString()
      // 判断点赞状态
      if (this.article.attitude === 1) {
        await unLikings(articleId)
        this.article.attitude = -1
      } else {
        await likings(articleId)
        this.article.attitude = 1
      }
    },
    // 取消对文章不喜欢
    async deleteLike () {
      const articleId = this.article.art_id.toString()
      // 判断文章是否是不喜欢状态
      if (this.article.attitude === 0) {
        await unDislike(articleId)
        this.article.attitude = -1
      } else {
        await dislike(articleId)
        this.article.attitude = 0
      }
    }
  },
  created () {
    //   获取文章详情
    this.loadArticle()
  }
}
</script>

<style scoped lang='less'>
.van-nav-bar .van-icon{
    color:#f9f9f9;
    font-size: 35px;
    vertical-align: top;
}
.article-container{
  position: absolute;
  left: 0;
  top: 0;
  overflow-y: scroll;
  width: 100%;
  height: 100%;
}
.article-loading {
  padding-top: 180px;
  text-align: center;
  /deep/ .van-loading__text{
      font-size: 25px;
  }
}
.error{
  padding-top: 180px;
  text-align: center;
  font-size: 25px;
}
.detail {
  padding: 40px 29px;
  .title {
    font-size: 40px;
  }
  .zan{
    text-align: center;
  }
  .author {
    padding: 10px 0;
    display: flex;
    /deep/.van-button--small{
        height: 58px;
        width: 200px;
        font-size: 28px;
    }
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.3;
      .name {
        font-size: 28px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 25px;
        color: #999;
      }
    }
  }
  .content {
    font-size: 28px;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img{
      max-width:100%;
      background: #f9f9f9;
    }
  }
  .zan{
      /deep/.van-button--small{
          height: 58px;
          min-width: 170px;
          font-size: 25px;
      }
  }
}
</style>
