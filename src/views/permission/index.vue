<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 控制子组件插槽,方式1-通过父传子 -->
      <!-- <page-tool :show-before="false"> -->
      <!-- 控制子组件插槽,方式2-子组件通过$slots自行判断 -->
      <page-tool>
        <el-button slot="after" type="primary" size="small" @click="onShowDialog()">新增权限</el-button>
      </page-tool>
      <el-table :data="list" border row-key="id">
        <!-- 快速生成同样代码-代码,方式1-通过emmet -->
        <!-- el-table-column[label="" prop="" align="center"]*4 -->
        <!-- 快速生成同样代码-代码,方式2-shift+alt+下箭头 -->
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="标识" prop="code" align="center"></el-table-column>
        <el-table-column label="描述" prop="description" align="center"></el-table-column>
        <el-table-column label="操作" prop="" align="center">
          <!-- el-button[type="text"]*3 -->
          <template v-slot="{row}">
            <el-button type="text" @click="onEdit(row.id)">编辑</el-button>
            <el-button type="text" @click="onShowDialog({pid:row.id, type: row.type+1})">添加</el-button>
            <el-button type="text" @click="onDel(row.id)">删除</el-button>

          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 清空数据-通过v-if -->
    <!-- :node="node" -->
    <add-perm v-if="showDialog" ref="addPermRef" :visible="showDialog" @close="showDialog = false"></add-perm>
  </div>
</template>

<script>
import { delPermission, getPermissionDetail, getPermissionList } from '@/api/permisson.js'
import { translateListToTree } from '@/utils'
import AddPerm from './components/add-perm.vue'
export default {
  name: 'Permission',
  components: { AddPerm },
  props: {},
  data() {
    return {
      list: [],
      showDialog: false
      // node: {}
    }
  },
  created() {
    this.getPermissionList()
  },
  mounted() {},
  methods: {
    async onEdit(id) {
      this.showDialog = true
      await this.$nextTick()
      this.$refs.addPermRef.form = await getPermissionDetail(id)
    },
    onShowDialog(node) {
      this.showDialog = true
      this.$nextTick(() => {
        Object.assign(this.$refs.addPermRef.form, node)
      })
    },
    onDel(id) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async action => {
        await delPermission(id)
        this.$message.success('操作成功')
        this.getPermissionList()
      })
    },
    async getPermissionList() {
      // const list = await getPermissionList()
      // this.list = translateListToTree(list, '0')
      this.list = translateListToTree(await getPermissionList(), '0')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
