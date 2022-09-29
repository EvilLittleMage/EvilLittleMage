<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <TreeTool :data="company">
          <el-dropdown-item>添加子部门</el-dropdown-item>
        </TreeTool>
        <el-tree v-loading="isLoading" :data="list" :props="{label: 'name'}" default-expand-all>
          <!-- 作用域插槽 -->
          <!-- data就是list每一行数据 -->
          <template v-slot="{data}">
            <tree-tool :data="data">
              <!-- el-dropdown-item组件通信,支持click事件吗?不支持 -->
              <!-- <el-dropdown-item v-if="$store.getters.points.includes('add-dept')" @click.native="onAdd(data)">添加子部门</el-dropdown-item> -->
              <!-- 通过全局指令,控制元素 -->
              <!-- <el-dropdown-item v-hasperm="'add-dept'" @click.native="onAdd(data)">添加子部门</el-dropdown-item> -->
              <!-- 通过方法,控制元素 -->
              <el-dropdown-item v-if="hasPerm('add-dept')" @click.native="onAdd(data)">添加子部门</el-dropdown-item>
              <el-dropdown-item @click.native="onEdit(data)">编辑部门</el-dropdown-item>
              <el-dropdown-item @click.native="onDel(data.id)">删除部门</el-dropdown-item>
            </tree-tool>
          </template>
        </el-tree>
      </el-card>
    </div>
    <!-- .sync修饰符,简化父组件的模板,只要传数据
    :xxx="yyy"
    @update:xxx="yyy = $event"
    简化成
    :xxx.sync -->
    <!-- <add-dept :visible="showDialog" @update:visible="showDialog = $event"></add-dept> -->
    <add-dept ref="addDeptRef" :visible.sync="showDialog" :node="currentNode" @success="getList()"></add-dept>
  </div>
</template>

<script>
import TreeTool from './components/tree-tool.vue'
import { delDept, getDeptById, getList } from '@/api/departments.js'
import { translateListToTree } from '@/utils'
import AddDept from './components/add-dept.vue'
export default {
  name: 'Departments',
  components: {
    TreeTool,
    AddDept
  },
  props: {},
  data() {
    return {
      isLoading: false,
      showDialog: false, // 控制对话框显示
      currentNode: {}, // 当前操作的部门
      company: { name: '', manager: '负责人' },
      list: []
    }
  },
  created() {
    this.getList()
  },
  mounted() {},
  methods: {

    async getList() {
      this.isLoading = true
      const { companyName, depts } = await getList()
      this.company.name = companyName
      this.list = translateListToTree(depts, '')
      this.isLoading = false
    },
    onAdd(node) {
      this.currentNode = node
      this.showDialog = true
    },
    async onEdit(node) {
      console.log('编辑')
      // 父传子
      // 方式1-props(不推荐,触发最开始想好,因为现在改动太大)
      // 方式2-ref(推荐)
      // 改变了初始值-
      this.currentNode = node
      this.$refs.addDeptRef.form = await getDeptById(node.id)
      this.showDialog = true
    },
    onDel(id) {
      console.log('删除', id)
      // 确认删除
      // 通过elmecon
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async action => {
        // 发请求
        await delDept(id)
        // 提示成功
        this.$message.success('操作成功')
        // 刷新
        this.getList()
      }).catch(() => {

      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-card {
  padding: 30px  140px;
  font-size:14px;
}
.el-dropdown-link{
  margin-left: 10px;
}
</style>
