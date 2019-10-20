<template>
  <div class="article-comments">
    <!-- 评论列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(comment,index) in list"
         :key="index"
      >
        <van-image
          slot="icon"
          round class="imageStyle"
          :src="comment.aut_photo"
        />
        <span style="color: #466b9d;" slot="title">{{comment.aut_name}}</span>
        <div slot="label">
          <p class='label'>{{comment.content}}</p>
          <p>
            <span class='spanStyle'>{{comment.pubdate| relativeTime}}</span>
            <van-button size="mini" type="default"
             @click="onReplyShow(comment)">回复{{ comment.reply_count }}</van-button>
          </p>
        </div>
        <van-icon slot="right-icon" :name="comment.is_liking ? 'like' : 'like-o'"
        class="rightIcon" @click="onAddCommentLike(comment)"/>
      </van-cell>
    </van-list>
    <!-- 评论列表 -->

    <!-- 发布评论 -->
    <van-cell-group class="publish-wrap">
      <van-field
        clearable
        placeholder="请输入评论内容"
        v-model="commentText"
      >
        <van-button slot="button" size="mini" type="info"  @click="onAddComment">发布</van-button>
      </van-field>
    </van-cell-group>
    <!-- /发布评论 -->
        <!-- 评论回复 -->
    <van-popup
      v-model="isReplyShow"
      round
      position="bottom"
      :style="{ height: '90%' }"
    > <comment-reply :comment="currentComment"  v-if="isReplyShow"   @close="isReplyShow = false"/></van-popup>
    <!-- /评论回复 -->
  </div>
</template>

<script>
import CommentReply from './comment-reply'
import { getComments, addComment, addCommentLike, deleteCommentLike } from '@/api/comment'
import '@/utils/date'
export default {
  components: {
    CommentReply
  },
  name: 'ArticleComment',
  props: ['articleId'],
  data () {
    return {
      list: [], // 评论列表
      loading: false, // 上拉加载更多的 loading
      finished: false, // 是否加载结束
      offset: null,
      // limit: 10, // 每页大小
      commentText: '',
      isReplyShow: false,
      currentComment: {} // 查看回复的当前评论
    }
  },

  methods: {
    // 加载评论列表
    async onLoad () {
      //   加载评论列表
      // 1. 请求获取数据
      const { data } = await getComments({
        type: 'a', // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
        source: this.$route.params.articleId, // 源id，文章id或评论id
        offset: this.offset // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
        // limit: this.limit
      })
      // 2. 将数据添加到数组中
      this.list.push(...data.data.results)
      // 3. 结束 loading
      this.loading = false
      // 4. 判断是否加载结束
      //    如果还有数据，则更新获取下一页数据的页码（offset）
      //    如果没有数据，则 finished = true
      if (data.data.results.length) {
        this.offset = data.data.last_id
      } else {
        this.finished = true
      }
    },
    // 发布评论
    async onAddComment () {
      const commentText = this.commentText.trim()
      if (!commentText) {
        return
      }
      const { data } = await addComment({
        target: this.articleId, // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
        content: commentText // 评论内容
      })
      this.list.unshift(data.data.new_obj)
      this.commentText = ''
    },
    // 对评论点赞
    async onAddCommentLike (comment) {
      const commentId = comment.com_id.toString()
      if (comment.is_liking) {
        await deleteCommentLike(commentId)
      } else {
        await addCommentLike(commentId)
      }
      comment.is_liking = !comment.is_liking
    },
    onReplyShow (comment) {
      this.currentComment = comment
      this.isReplyShow = true
    }
  }
}
</script>

<style scoped lang='less'>
/deep/.imageStyle{
  width:70px;
  height:70px
}
.label {
    color: #363636;
    font-size:25px
}
.spanStyle{
  margin-right: 10px;
  font-size:20px
}
/deep/ .van-cell {
    padding: 20px 50px;
    font-size: 25px;
}
/deep/ .van-image--round{
  margin-right: 30px;
}
.publish-wrap {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 128px;
  /deep/ .van-cell{
    font-size: 25px;
  }
  /deep/ .van-button--mini {
    display: inline-block;
    min-width: 100px;
    height: 44px;
    font-size: 25px;
  }
}
.van-list {
  margin-bottom: 45px;
  /deep/ .rightIcon{
      font-size: 30px;
  }
}
/deep/ .van-button--mini{
  font-size: 20px;
}
</style>
