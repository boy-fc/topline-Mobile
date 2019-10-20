<template>
  <div class="chat-container">
    <!-- 导航栏 -->
    <van-nav-bar
      title="小智同学"
      left-arrow
      @click-left="$router.back()"
      fixed
    />
    <!-- /导航栏 -->

    <!-- 消息列表 -->
    <div class="message-list" ref="message-list">
      <div
        class="message-item"
        :class="{ reverse: item.isMe }"
        v-for="(item,index) in messages"
        :key="index"
      >
        <van-image
          class="avatar"
          slot="icon"
          round
         :src="item.photo"
        />
        <div class="title">
          <span>{{item.message}}</span>
        </div>
      </div>
    </div>
    <!-- /消息列表 -->

    <!-- 发送消息 -->
    <van-cell-group class="send-message">
      <van-field
        v-model="message"
        center
        clearable
      >
        <van-button slot="button" size="small" type="info" @click="onSengMessage">发送</van-button>
      </van-field>
    </van-cell-group>
    <!-- /发送消息 -->
  </div>
</template>

<script>
import io from 'socket.io-client'
import { getProfile } from '@/api/user'
import { getItem, setItem } from '@/utils/storage'
export default {
  name: 'ChatIndex',
  data () {
    return {
      user: {}, // 用户信息对象
      message: '',
      socket: null, // 存储socket数据
      // [ { message: '消息数据', isMe: true, photo: '头像' }, ]
      messages: getItem('chat-messages') || [] // 存储所有的消息列表
    }
  },
  methods: {
    // 加载用户信息
    async getUser () {
      const { data } = await getProfile()
      this.user = data.data
    },
    onSengMessage () {
      const message = this.message.trim()
      if (!message) {
        return
      }
      // 发送消息
      this.socket.emit('message', {
        msg: 'message',
        timestamp: Date.now()
      })
      // 把消息储存到消息数组中
      this.messages.push({
        message,
        isMe: true,
        photo: this.user.photo
      })
      // 清空文本框
      this.message = ''
    }
  },
  created () {
    // 获取头像
    this.getUser()
    // 建立连接
    const socket = io('http://ttapi.research.itcast.cn')
    // 把socket储存到data数据中，然后就可以在methods中使用
    this.socket = socket
    // 当客户端与服务器建立连接成功时，触发connect 事件
    socket.on('connect', () => {
      console.log('建立连接成功')
    })
    // 监听既然收服务器消息
    socket.on('message', data => {
      console.log('收到服务器消息：', data)
      this.messages.push({
        message: data.msg,
        isMe: false,
        photo: 'https://img.yzcdn.cn/vant/cat.jpeg'
      })
    })
  },
  watch: {
    messages (newValue) {
      setItem('chat-messages', newValue)
      // 让列表滚动到最底部
      const messageList = this.$refs['message-list']
      this.$nextTick(() => {
        messageList.scrollTop = messageList.scrollHeight
      })
    }
  },

  mounted () {
    const messageList = this.$refs['message-list']
    messageList.scrollTop = messageList.scrollHeight
  }
}
</script>

<style scoped lang='less'>
.chat-container {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 128px 0 100px 0;
  top: 0;
  left: 0;
  box-sizing: border-box;
  background: #f5f5f6;
  .message-list {
    height: 100%;
    overflow-y: scroll;
    .message-item {
      display: flex;
      align-items: center;
      padding: 15px 30px;
      font-size: 28px;
      .title {
        background: #fff;
        padding: 25px;
        border-radius: 6px;
      }
      .avatar {
        margin-right: 5px;
        width: 70px;
        height: 70px;
      }
    }
    .reverse {
      flex-direction: row-reverse;
      .title {
        margin-right: 5px;
      }
    }
  }
  /deep/ .van-nav-bar .van-icon {
    font-size: 28px;
    color:#fff;
    bottom: 10px;
  }

  .send-message {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #f5f5f6 !important;
    /deep/ .van-cell {
      line-height: 75px;
      font-size: 25px;
      /deep/ .van-button--small{
        font-size: 25px;
        height: 45px;
        min-width: 95px
      }
    }
  }
}
</style>
