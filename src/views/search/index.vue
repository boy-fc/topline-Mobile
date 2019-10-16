<template>
  <div class="home">
      <!-- 搜索栏 -->
      <van-nav-bar>
           <van-search
                slot="title"
                v-model="searchText"
                placeholder="请输入搜索关键词"
                show-action
                @search="onSearch"
                background='Transparent'
                @input="onSearchInput"
            />
      </van-nav-bar>
       <!-- 联想建议 -->
    <van-cell-group v-if="searchText">
      <van-cell v-for="(item, index) in searchSuggestions" :key="index"
      icon="search" :title="item"  @click="onSearch(item)">
        <!-- 高亮显示插槽 -->
        <div v-html="highlight(item)" slot="title"></div>
      </van-cell>
    </van-cell-group>
      <!-- 搜索历史记录 -->
     <van-cell-group v-else>
       <van-cell title="历史记录">
          <template v-if="isDeleteShow">
            <span @click="searchHistories = []">全部删除</span>&nbsp;&nbsp;
            <span @click="isDeleteShow = false">完成</span>
          </template>
        <van-icon v-else name="delete" @click="isDeleteShow = true" />
       </van-cell>
          <van-cell :title="item" v-for="item in searchHistories" :key="item" @click="onSearch(item)">
          <van-icon name="close" v-show="isDeleteShow" @click.stop="searchHistories.splice(index, 1)"/>
       </van-cell>
     </van-cell-group>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
import { getItem, setItem } from '@/utils/storage'
import { debounce } from 'lodash'
export default {
  name: 'SearchIndex',
  data () {
    return {
      // 搜索字段
      searchText: '',
      searchSuggestions: [], // 联想建议列表
      searchHistories: getItem('search-histories') || [], // 搜索历史记录
      isDeleteShow: false
    }
  },
  methods: {
    onSearch (str) {
      // 存储搜索历史记录
      // 如果搜索历史记录中已存在，则直接移除
      const index = this.searchHistories.indexOf(str)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(str)
      // 把最新的记录存储到数组的顶部
      // 持久化存储
      setItem('search-histories', this.searchHistories)
      this.$router.push('/search/' + str)
    },
    // 联想搜索
    onSearchInput: debounce(async function () {
      const searchText = this.searchText.trim()
      if (!searchText) {
        return
      }
      const { data } = await getSearchSuggestions({
        q: this.searchText
      })
      const searchSuggestions = data.data.options
      this.searchSuggestions = searchSuggestions
    }, 300),
    // 高亮显示
    highlight (str) {
      const reg = new RegExp(this.searchText, 'g')
      return str.replace(reg, '<span style="color: red">' + this.searchText + '</span>')
    }
  },
  watch: {
    searchHistories (newVal) {
      setItem('search-histories', newVal)
    }
  }

}
</script>

<style lang='less' scoped>
.van-nav-bar {
    /deep/ .van-nav-bar__title{
        max-width: 100%;
        padding-top: 55px;
        margin-left: 34px;
        width: 680px;
        .van-search{
            padding: 0 0 0 0;
            height: 56px;
            .van-search__action{
                font-size: 25px;
                color: #fff;
            }
        }
        .van-search__content{
            background-color: #fff;
            padding-left: 17px;
            /deep/ .van-cell {
                font-size: 25px;
                line-height: 56px;
                .van-field__left-icon .van-icon{
                    font-size: 25px;
                    color: #000;
                }
                .van-icon-clear {
                  font-size: 25px;
                }
            }

        }
    }
}
.van-cell {
    font-size: 25px;
    height: 85px;
    line-height: 65px;
    .van-cell__left-icon{
        line-height: 65px;
        font-size: 25px;
    }
}
</style>
