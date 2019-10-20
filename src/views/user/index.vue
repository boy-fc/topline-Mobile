<template>
  <div>
    <van-nav-bar
      title="个人信息"
      left-arrow
      right-text="保存"
      @click-right='saveUser' @click-left='$router.push("/my")'
    />
    <van-cell-group class="userInfo">
      <van-cell title="头像" is-link @click="onChangePhoto">
        <van-image
          round
          class="imageStyle"
          :src="user.photo"
        />
      </van-cell>
      <van-cell title="昵称" :value="user.name" is-link  @click="isEditNameShow = true" />
      <van-cell title="性别" :value="user.gender === 0 ? '男' : '女'" is-link @click="isEditGenderShow = true" />
      <van-cell title="生日" :value="user.birthday" is-link  @click="isEditBirthdayShow = true"/>
    </van-cell-group>
    <input type="file" ref='file' @change="clickInput" hidden>

     <!-- 编辑用户昵称弹窗 -->
    <van-dialog v-model="isEditNameShow" title="用户昵称" class="dialog"
        show-cancel-button @confirm="onUserNameConfirm">
      <van-field placeholder="请输入用户名" :value="user.name" @input="onUserNameInput"/>
    </van-dialog>
    <!-- /编辑用户昵称弹窗 -->

        <!-- 编辑用户性别上拉菜单 -->
    <van-action-sheet v-model="isEditGenderShow" :actions="actions" cancel-text="取消" @select="onSelect"/>

     <!-- 编辑用户生日 -->
    <van-popup v-model="isEditBirthdayShow" position="bottom" :style="{ height: '30%' }">
      <van-datetime-picker type="date"
        @confirm="onUserBirthdayConfirm"
        @cancel="isEditBirthdayShow = false"/>
    </van-popup>
    <!-- /编辑用户生日 -->
  </div>
</template>

<script>
import { getProfile, updateUserPhoto, updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'
export default {
  name: 'UserIndex',
  data () {
    return {
      user: {},
      isEditNameShow: false,
      inputUserName: '', // 存储编辑用户名字的输入框数据
      isEditGenderShow: false, // 控制编辑性别的上拉菜单的显示状态
      // 上拉菜单的数据 name 会当作文本输出渲染 value 是我自己自定义添加的
      actions: [
        { name: '男', value: 0 },
        { name: '女', value: 1 }
      ],
      isEditBirthdayShow: false
    }
  },
  methods: {
    //   获取用户个人信息
    async getUser () {
      const { data } = await getProfile()
      this.user = data.data
    },
    // 点击打开文件按钮
    onChangePhoto () {
      this.$refs.file.click()
    },
    // 更换图片
    clickInput () {
      if (!this.$refs.file.files[0]) {
        return
      }
      this.user.photo = window.URL.createObjectURL(this.$refs.file.files[0])
    },
    // 保存编辑
    async saveUser () {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: '保存中'
      })
      try {
        const formData = new FormData()
        formData.append('photo', this.$refs.file.files[0])
        await updateUserPhoto(formData)
        await updateUserProfile(this.user)
        this.$toast.success('更新成功')
      } catch (err) {
        console.log(err)
        this.$toast.fail('保存失败')
      }
    },
    // 编辑用户名
    onUserNameConfirm () {
      this.user.name = this.inputUserName
    },
    onUserNameInput (value) {
      this.inputUserName = value
    },
    // 修改性别
    onSelect (item) {
      // 修改数据
      this.user.gender = item.value
      // 关闭上拉菜单
      this.isEditGenderShow = false
    },
    // 修改生日
    onUserBirthdayConfirm (value) {
      // 更新数据
      this.user.birthday = dayjs(value).format('YYYY-MM-DD')

      // 关闭弹层
      this.isEditBirthdayShow = false
    }
  },
  created () {
    //   获取个人用户信息
    this.getUser()
  }
}
</script>

<style lang='less' scoped>
/deep/ .imageStyle{
  height: 70px;
  width: 70px;
}
/deep/ .van-nav-bar .van-icon {
    left: 10px;
    bottom: 10px
}
/deep/ .van-nav-bar .van-icon {
    font-size: 35px;
    color:#fff
}
/deep/ .van-nav-bar__text{
    color: #fff;
    font-size: 28px;
    margin: 12px -16px;
}
.userInfo {
    /deep/ .van-cell{
        font-size: 28px;
        color: #333;
        padding: 31px 39px;
        line-height: 28px;
        /deep/ .van-cell__title{
            line-height: 67px;
        }
        /deep/.van-cell__right-icon {
            font-size: 28px;
            line-height: 67px;
        }
        /deep/ .van-cell__value{
            line-height: 67px;
        }
    }
}
// 名称弹层
/deep/ .van-dialog{
    width:500px;
   height:200px;
    // height: 200px;
    font-size: 25px;
    /deep/ .van-cell{
        font-size: 24px;
        padding: 30px 40px
    }
    /deep/ .van-button{
        font-size: 28px;
    }
}
// 性别
/deep/ .van-action-sheet__item {
    height: 90px;
    font-size: 35px;
    line-height: 80px;
}
/deep/ .van-action-sheet__cancel{
    font-size: 35px;
    line-height: 80px;
}
// 生日
/deep/ .van-picker__toolbar{
    height: 80px;
    line-height: 80px;
    /deep/ .van-picker__cancel, .van-picker__confirm{
        font-size: 35px;
        padding: 10px 40px;
    }
}
/deep/ .van-picker__columns, .van-picker__loading {
    /deep/ .van-picker-column{
        font-size: 35px;
    }
}
</style>
