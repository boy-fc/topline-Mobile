<template>
  <div class="serach-result">
    <!-- 导航栏 -->
    <van-nav-bar
      :title="$route.params.q +  '的搜索结果'"
      left-arrow
      fixed
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->

    <!-- 文章列表 -->
    <van-list
      class="article-list"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(item,index) in list"
        :key="index"
        :title="item.title"
      />
    </van-list>
    <!-- /文章列表 -->
  </div>
</template>

<script>
import { getSearch } from '@/api/search'
export default {
  name: 'SearchResult',
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 10
    }
  },

  methods: {
    async onLoad () {
      // 1. 请求获取数据
      const { data } = await getSearch({
        page: this.page, // 页数，不传默认为1
        per_page: this.perPage, // 每页数量，不传每页数量由后端决定
        q: this.$route.params.q // 搜索关键词
      })
      // 2. 将数据添加到数组中
      this.list.push(...data.data.results)
      // 3. 结束 loading
      this.loading = false
      // 4. 判断是否还有数据
      if (data.data.page) {
        // 如果有，更新页码
        this.page++
      } else {
        // 如果没有，则将 finished 设置为 true
        this.finished = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.serach-result {
  .article-list {
    margin-top: 46px;
  }
}
/deep/ .van-nav-bar .van-icon {
    color: #fff
}
/deep/ .van-nav-bar__arrow {
    font-size: 30px;
    margin-bottom: 18px;
}
.serach-result{
    /deep/ .article-list{
    margin-top: 128px;
    /deep/ .van-cell:not(:last-child)::after{
    border-bottom: 1px solid #999;
    }
    /deep/.van-cell{
        font-size: 25px;
        color:#3A3A3A;
        line-height: 50px;
    }
}
}

</style>
