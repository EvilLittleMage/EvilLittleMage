<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-tabs>
        <el-tab-pane label="角色管理">
          <el-row>
            <el-button type="primary" size="small" @click="showDialog = true">新增角色</el-button>
          </el-row>
          <el-table
            :data="list"
            border
            stripe
            style="width: 100%;margin-top: 20px;"
          >
            <el-table-column
              label="序号"
              align="center"
              type="index"
            ></el-table-column>
            <el-table-column
              label="角色"
              align="center"
              prop="name"
            >
            </el-table-column>
            <el-table-column
              label="描述"
              align="center"
              prop="description"
            >
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
            >
              <template v-slot="{row}">
                <el-button type="success" size="small" @click="onShowAsignPermDialog(row.id)">分配权限</el-button>
                <el-button type="primary" size="small" @click="onEdit(row.id)">编辑</el-button>
                <el-button type="danger" size="small" @click="onDel(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row type="flex" justify="end">
            <el-pagination
              layout="prev, pager, next"
              :page-size="page.pagesize"
              :total="page.total"
              @current-change="onPageChange"
            >
            </el-pagination>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="公司信息">
          <el-alert
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            type="info"
            show-icon
            :closable="false"
          >
          </el-alert>
          <el-form label-width="80px" style="width:500px;margin-top:20px;">
            <el-form-item label="公司名称"><el-input v-model="info.name" disabled></el-input></el-form-item>
            <el-form-item label="公司地址"><el-input v-model="info.companyAddress" disabled></el-input></el-form-item>
            <el-form-item label="公司邮箱"><el-input v-model="info.mailbox" disabled></el-input></el-form-item>
            <el-form-item label="备注"><el-input v-model="info.remarks" disabled></el-input></el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog :visible="showDialog" v-bind="$attrs" :title="form.id?'编辑角色':'新增角色'" v-on="$listeners" @open="onOpen" @close="close">
      <el-form ref="formRef" :model="form" :rules="rules" size="medium" label-width="120px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" clearable :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入角色描述" clearable :style="{width: '100%'}">
          </el-input>
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="handelConfirm">确定</el-button>
      </el-row>
    </el-dialog>
    <el-dialog
      title="分配权限"
      :visible.sync="showAsignPermDialog"
      width="50%"
      @close="showAsignPermDialog = false"
    >
      <!-- @check="onCheck"

      :default-checked-keys="permIds"
       -->
      <el-tree ref="permRef" :data="permList" :props="{label: 'name'}" default-expand-all show-checkbox node-key="id" check-strictly></el-tree>
      <el-row slot="footer" type="flex" justify="center">
        <el-button @click="showAsignPermDialog = false">取消</el-button>
        <el-button type="primary" @click="asignPerm">确定</el-button>
      </el-row>
    </el-dialog>

  </div>
</template>
<script>
import { addRole, assignPerm, delRole, getCompanyById, getRoleById, getRolesList, updateRole } from '@/api/settings.js'
import { getPermissionList } from '@/api/permisson'
import { translateListToTree } from '@/utils'
export default {
  name: 'Setting',
  components: {},
  props: {},
  data() {
    return {
      showDialog: false,
      list: [],
      info: {},
      page: {
        page: 1,
        pagesize: 2,
        total: 0
      },
      form: {
        name: undefined,
        description: undefined
      },
      rules: {
        name: [{
          required: true,
          message: '请输入角色名称',
          trigger: 'blur'
        }],
        description: []
      },
      showAsignPermDialog: false,
      permList: [],
      permIds: [],
      roleId: undefined
    }
  },
  async created() {
    this.info = await getCompanyById(this.$store.state.user.userInfo.companyId)
    this.getList()
    this.permList = translateListToTree(await getPermissionList(), '0')
  },
  mounted() {},
  methods: {

    async onShowAsignPermDialog(id) {
      this.showAsignPermDialog = true
      // 回显
      // const {permIds} = await getRoleById(id)
      // this.permIds = permIds
      this.permIds = (await getRoleById(id)).permIds
      this.$refs.permRef.setCheckedKeys(this.permIds)
      this.roleId = id
    },
    async asignPerm() {
      const ids = this.$refs.permRef.getCheckedKeys()
      await assignPerm({
        id: this.roleId,
        permIds: ids
      })
      this.showAsignPermDialog = false
      this.$message.success('操作成功')
    },
    async getList() {
      const { total, rows } = await getRolesList(this.page)
      this.page.total = total
      this.list = rows
    },
    async onEdit(id) {
      // 回显数据
      this.form = await getRoleById(id)
      // 显示对话框
      this.showDialog = true
    },
    onDel(id) {
      // 通过代码片段elmecon
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async action => {
        await delRole(id)
        this.$message.success('操作成功')
        this.getList()
      })
    },
    onPageChange(val) {
      this.page.page = val
      this.getList()
    },
    onOpen() {},
    close() {
      this.$refs['formRef'].resetFields()
      this.form = {
        name: undefined,
        description: undefined
      }
      this.showDialog = false
    },
    handelConfirm() {
      this.$refs['formRef'].validate(async valid => {
        if (!valid) return
        if (this.form.id) {
          // 发请求
          // 编辑
          await updateRole(this.form)
        } else {
          // 新增
          await addRole(this.form)
        }
        // 提示成功
        this.$message.success('操作成功')
        // 刷新列表
        this.getList()
        this.close()
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
