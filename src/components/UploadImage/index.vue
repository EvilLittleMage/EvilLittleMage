<template>
  <div>
    <!-- :show-file-list="false"

     -->
    <el-upload
      class="avatar-uploader"
      :class="{disabled: fileList.length>0}"
      action=""
      :on-success="handleAvatarSuccess"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :file-list="fileList"
      :on-progress="onProgress"
      :on-change="onChange"
      :http-request="onUpload"
      :before-upload="onBeforeUpload"
    >
      <i class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <el-progress v-show="showPercent" :percentage="percent" style="width:198px;"></el-progress>
    <el-dialog title="图片预览" :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
// 文件上传关键点
// 1.选取文件(不需要我做,el-upload已经完成了)
// 2.得到文件对象(钩子函数,http-request,file)
// 3.使用npm包(复制之前代码)
var COS = require('cos-js-sdk-v5')

// SECRETID 和 SECRETKEY请登录 https://console.cloud.tencent.com/cam/capi 进行查看和管理
var cos = new COS({
  SecretId: 'AKID230ug4O5jToCXdf4e4GJFuJnKceZN1Rj',
  SecretKey: 'We2Igv0DI9AUuRp5EEKSbbQOj2NZbmqm'
})
export default {
  name: 'UploadImage',
  components: {},
  props: {
  },
  data() {
    return {
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      showPercent: false,
      percent: 0
    }
  },
  created() {},
  mounted() {},
  methods: {
    onProgress(event, file, fileList) {
      console.log('onProgress', event, file, fileList)
    },
    onUpload({ file }) {
      this.showPercent = true
      cos.uploadFile({
        Bucket: 'rrzt-1255651667', /* 填写自己的bucket，必须字段 */
        Region: 'ap-nanjing', /* 存储桶所在地域，必须字段 */
        Key: Date.now() + file.name, /* 存储在桶里的对象键（例如:1.jpg，a/b/test.txt，图片.jpg）支持中文，必须字段 */
        Body: file, // 上传文件对象
        SliceSize: 1024 * 1024 * 5, /* 触发分块上传的阈值，超过5MB使用分块上传，小于5MB使用简单上传。可自行设置，非必须 */
        onProgress: (progressData) => {
          console.log(JSON.stringify(progressData))
          this.percent = progressData.percent * 100
        }
      }, (err, data) => {
        this.showPercent = false
        if (err) {
          console.log('上传失败', err)
        } else {
          console.log('上传成功', data)
          // this.fileList.push({ url: 'http://' + data.Location })
          this.fileList[0].url = 'http://' + data.Location
        }
      })
    },
    onChange(file, fileList) {
      // console.log('onChange', file, fileList)
      this.fileList.push({ url: file.url })
    },
    onBeforeUpload({ type, size }) {
      console.log('onBeforeUpload', type, size)
      if (!['image/jpeg', 'image/gif', 'image/bmp', 'image/png'].includes(type)) {
        this.$message.error('文件类型不对')
        return false
      }
      if (size > 5 * 1024 * 1024) {
        this.$message.error('文件太大')
        return false
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList)
      this.fileList = []
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    }
  }
}
</script>

<style lang="scss" scoped>
// scoped会实际生成的样式最后添加自定义属性[data-v-34520046],代表了针对组件本身
// .avatar-uploader .el-upload[data-v-34520046]
::v-deep .avatar-uploader.disabled .el-upload--picture-card{
  display: none;
}
</style>
