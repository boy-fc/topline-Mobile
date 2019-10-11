<template>
    <div>
        <!-- 登录导航 -->
        <van-nav-bar title="登录"/>
        <ValidationObserver tag="form" ref="loginForm">
            <!-- 用户名 -->
            <van-cell-group>
                <ValidationProvider tag="div" name="手机号" rules="required" v-slot="{ errors }">
                    <van-field v-model="user.mobile" label='用户名' placeholder="请输入用户名" :error-message="errors[0]"/>
                </ValidationProvider>
                <ValidationProvider tag="div" name="验证码" rules="required" v-slot="{ errors }">
                    <van-field v-model="user.code" label='验证码' center type='password' placeholder="请输入短信验证码" :error-message="errors[0]">
                        <van-button slot="button">获取验证码</van-button>
                    </van-field>
                 </ValidationProvider>
            </van-cell-group>
        </ValidationObserver>
        <!-- 登录按钮 -->
        <div class="login">
            <van-button type="info" size="large" @click="onLogin" :loading="isLoginLoading">登录</van-button>
        </div>
    </div>
</template>

<script>
import { login } from '@/api/user'
export default {
  name: 'LoginIndex',
  data () {
    return {
      isLoginLoading: false,
      user: {
        mobile: '15830322153',
        code: '246810'
      }
    }
  },
  methods: {
    async onLogin () {
      try {
        const isValid = await this.$refs.loginForm.validate()
        if (!isValid) {
          return
        }
        this.isLoginLoading = true
        // 请求提交表单数据
        await login(this.user)
        this.$toast.success('登录成功')
        this.isLoginLoading = false
      } catch (err) { // 所有大于等于 400 的状态码都会进入 catch
        if (err.response && err.response.status === 400) {
          this.$toast.fail('登录失败，手机号或验证码错误')
        }
      }
      this.isLoginLoading = false
    }
  }
}
</script>

<style lang='less' scroped>
.van-cell{
    width: 750px;
    height: 91px;
    line-height: 91px;
    font-size: 26px;
    padding-left: 40px;
    .van-field__label{
        margin-right: 39px;
    }
    .van-button{
        width: 152px;
        height: 46px;
        margin-right: 10px;
        color: #666
    }
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
