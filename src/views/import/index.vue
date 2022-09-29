<template>
  <div>
    <UploadExcel :on-success="handleSuccess"></UploadExcel>
    <!-- <UploadExcel @on-success="handleSuccess"></UploadExcel> -->
  </div>
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  name: 'Import',
  components: {},
  props: {
  },
  data() {
    return {

    }
  },
  created() {},
  mounted() {},
  methods: {
    async handleSuccess({ results }) {
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      const data = results.map(t => {
        const item = {}
        for (const k in t) {
          item[userRelations[k]] = t[k]
        }
        return item
      })
      await importEmployee(data)
      this.$message.success('操作成功')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
