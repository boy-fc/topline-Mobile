<template>
    <div>
        <!-- 登录导航 -->
        <van-nav-bar title="登录"/>
        <ValidationObserver tag="form" ref="loginForm">
            <!-- 用户名 -->
            <van-cell-group>
              <!-- name 提示文本 rules 验证规则 v-slot="{ errors }"显示验证失败消息-->
                <ValidationProvider name="用户名" rules="required" v-slot="{ errors }">
                    <van-field required v-model="user.mobile" label='用户名' center placeholder="请输入用户名" :error-message="errors[0]"/>
                </ValidationProvider>
                <ValidationProvider name="验证码" rules="required" v-slot="{ errors }">
                    <van-field required v-model="user.code" label='验证码' center type='password' placeholder="请输入短信验证码" :error-message="errors[0]">
                        <van-button slot="button" type="info" :round="true" color="#ededed">获取验证码</van-button>
                    </van-field>
                 </ValidationProvider>
            </van-cell-group>
        </ValidationObserver>
        <!-- 登录按钮 -->
        <div class="login">
            <van-button type="info" size="large" @click="onLogin">登录</van-button>
        </div>
    </div>
</template>

<script>
import { login } from '@/api/user'
import { setItem } from '@/utils/storage'
export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '15830322153',
        code: '246810'
      }
    }
  },
  methods: {
    async onLogin () {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: '正在登录···'
      })
      try {
        // 表单验证
        const isValid = await this.$refs.loginForm.validate()
        if (!isValid) {
          return
        }
        // 请求提交表单数据
        const { data } = await login(this.user)
        // 把token令牌储存到store容器中
        this.$store.commit('setUser', data.data)
        // 讲token令牌进行本地存储，防止刷新丢失
        setItem('user', data.data)
        // 轻提示
        this.$toast.success('登录成功')
      } catch (err) { // 所有大于等于 400 的状态码都会进入 catch
        if (err.response && err.response.status === 400) {
          this.$toast.fail('登录失败，手机号或验证码错误')
        }
      }
    }
  }
}
</script>

<style lang='less' scroped>
.van-cell{
    width: 750px;
    height: 91px;
    font-size: 26px;
    padding-left: 40px;
    .van-field__label{
        margin-right: 39px;
    }
    .van-button{
        width: 152px;
        height: 46px;
        margin-right: 10px;
        .van-button__text{
          color:#666;
          font-size: 22px;
        }
    }
}
.van-cell--required::before {
      left: 30px;
}
.login{
    margin-left: 28px;
    .van-button{
        width: 694px;
        height: 88px;
        font-size: 30px;
    }
}
</style>
