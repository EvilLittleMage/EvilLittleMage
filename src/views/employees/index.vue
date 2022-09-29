<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTool>
        <!-- vue2.6之后写法v-slot:插槽名 -->
        <!-- <template v-slot:before>
          <span>共多少条数据</span>
        </template> -->
        <!-- vue2.6v-solot简写# -->
        <!-- <template #before>
          <span>共多少条数据</span>
        </template> -->
        <!-- vue2.6之前写法,slot="插槽名" -->
        <span slot="before">共{{ page.total }}条数据</span>
        <template #after>
          <el-button type="danger" size="small" @click="onExport">Excel导出</el-button>
          <el-button type="success" size="small" @click="$router.push('/import')">Excel导入</el-button>
          <el-button type="primary" size="small" @click="showAddDialog = true">新增员工</el-button>
        </template>
      </PageTool>
      <el-card>
        <el-table :data="list" border stripe>
          <!-- el-table-column[label="" :sortable="true" prop=""]*10 -->
          <el-table-column label="序号" :sortable="true" type="index" width="50"></el-table-column>
          <el-table-column label="姓名" prop="username" :sortable="true"></el-table-column>
          <el-table-column label="头像" :sortable="true" width="130">
            <template v-slot="{row}">
              <!-- <img v-imgerror="require('@/assets/common/head.jpg')" :src="row.staffPhoto" style="width: 100px;height:100px;border-radius:50%;"> -->
              <el-image :src="row.staffPhoto" @click="onShowQrCodeDialog(row.staffPhoto)">
                <!-- <template #error>
                  <img src="@/assets/common/head.jpg">
                </template> -->
                <img slot="error" src="@/assets/common/head.jpg" @click="onShowQrCodeDialog(require('@/assets/common/head.jpg'))">
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="手机号" prop="mobile" :sortable="true"></el-table-column>
          <el-table-column label="工号" prop="workNumber" :sortable="true"></el-table-column>
          <el-table-column label="聘用形式" prop="formOfEmployment" :sortable="true">
            <template v-slot="{row}">{{ row.formOfEmployment | formatHireType }}</template>
          </el-table-column>
          <el-table-column label="部门" prop="departmentName" :sortable="true"></el-table-column>
          <el-table-column label="入职时间" prop="timeOfEntry" :sortable="true">
            <template v-slot="{row}">{{ row.timeOfEntry | formatdate }}</template>
          </el-table-column>
          <el-table-column label="状态" prop="enableState" :sortable="true">
            <template v-slot="{row}">
              <el-switch
                v-model="row.enableState"
                disabled
                :active-value="1"
                :inactive-value="0"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="" :sortable="true" fixed="right" width="280">
            <template v-slot="{row}">
              <el-button type="text" @click="$router.push('/employees/detail/'+row.id)">查看</el-button>
              <el-button type="text">转正</el-button>
              <el-button type="text">调岗</el-button>
              <el-button type="text">离职</el-button>
              <el-button type="text" @click="onShowAsignRoleDialog(row.id)">角色</el-button>
              <el-button type="text" @click="onDel(row.id)">删除</el-button>

            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="end">
          <el-pagination
            layout="total, prev, pager, next"
            :total="page.total"
            :page-size="page.size"
            @current-change="onPageChange"
          >
          </el-pagination>
        </el-row>
      </el-card>
    </div>
    <!-- <el-dialog title="显示二维码" :visible="showQrCodeDialog" @close="showQrCodeDialog = false"> -->
    <el-dialog title="显示二维码" :visible.sync="showQrCodeDialog">
      <qrcode-vue :value="staffPhotoUrl"></qrcode-vue>
    </el-dialog>
    <el-dialog :visible="showAddDialog" v-bind="$attrs" title="新增员工" v-on="$listeners" @open="onOpen" @close="close">
      <el-form ref="formRef" :model="form" :rules="rules" size="medium" label-width="120px">
        <el-form-item label="姓名" prop="username">
          <el-input v-model="form.username" placeholder="请输入单行文本姓名" clearable :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入手机" clearable :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="timeOfEntry">
          <el-date-picker
            v-model="form.timeOfEntry"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :style="{width: '100%'}"
            placeholder="请选择入职时间"
            clearable
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="聘用形式" prop="formOfEmployment">
          <el-select v-model="form.formOfEmployment" placeholder="请选择聘用形式" clearable :style="{width: '100%'}">
            <el-option
              v-for="(item, index) in formOfEmploymentOptions"
              :key="index"
              :label="item.value"
              :value="item.id"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工号" prop="workNumber">
          <el-input v-model="form.workNumber" placeholder="请输入工号" clearable :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="departmentName">
          <el-input v-model="form.departmentName" placeholder="请输入部门" clearable :style="{width: '100%'}" @focus="getDeptsList">
          </el-input>
          <el-tree
            v-if="showTree"
            :data="depts"
            :props="{label: 'name'}"
            @node-click="handleNodeClick"
          >
          </el-tree>
        </el-form-item>
        <el-form-item label="转正时间" prop="correctionTime">
          <el-date-picker
            v-model="form.correctionTime"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :style="{width: '100%'}"
            placeholder="请选择转正时间"
            clearable
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="handelConfirm">确定</el-button>
      </el-row>
    </el-dialog>
    <!-- 通过eldi代码片段 -->
    <el-dialog
      title="分配角色"
      :visible.sync="showAsignRoleDialog"
      width="50%"
      @close="showAsignRoleDialog = false"
    >
      <el-checkbox-group v-model="roleIds">
        <el-checkbox v-for="(item, index) in roleList" :key="index" :label="item.id">{{ item.name }}</el-checkbox>
      </el-checkbox-group>
      <el-row slot="footer" type="flex" justify="center">
        <el-button @click="showAsignRoleDialog = false">取消</el-button>
        <el-button type="primary" @click="asignRole">确定</el-button>
      </el-row>
    </el-dialog>

  </div>
</template>

<script>
import { addEmployee, assignRoles, delEmployee, getEmployees } from '@/api/employees'
import QrcodeVue from 'qrcode.vue'
import employeesEnum from '@/api/constant/employees.js'
import { getList } from '@/api/departments'
import { translateListToTree } from '@/utils'
import { pick } from 'lodash'
import { formatdate, formatHireType } from '@/filters/index.js'
import { getRolesList } from '@/api/settings'
import { getEmplyeeBaseInfo} from '@/api/user'
export default {
  name: 'Employees',
  components: {
    QrcodeVue
  },
  props: {
  },
  data() {
    return {
      list: [],
      showQrCodeDialog: false,
      staffPhotoUrl: undefined,
      page: {
        page: 1,
        size: 2,
        total: 0
      },
      form: {
        username: undefined,
        mobile: undefined,
        timeOfEntry: null,
        formOfEmployment: undefined,
        workNumber: undefined,
        departmentName: undefined,
        correctionTime: null
      },
      rules: {
        username: [{
          required: true,
          message: '请输入单行文本姓名',
          trigger: 'blur'
        }],
        mobile: [{
          required: true,
          message: '请输入手机',
          trigger: 'blur'
        }],
        timeOfEntry: [{
          required: true,
          message: '请选择入职时间',
          trigger: 'change'
        }],
        formOfEmployment: [{
          required: true,
          message: '请选择聘用形式',
          trigger: 'change'
        }],
        workNumber: [{
          required: true,
          message: '请输入工号',
          trigger: 'blur'
        }],
        departmentName: [{
          required: true,
          message: '请输入部门',
          trigger: 'change'
        }],
        correctionTime: []
      },
      formOfEmploymentOptions: employeesEnum.hireType,
      showAddDialog: false,
      depts: [],
      showTree: false,
      showAsignRoleDialog: false,
      roleList: [],
      roleIds: [],
      userId: undefined
    }
  },
  created() {
    this.getList()
  },
  mounted() {},
  methods: {
    async onShowAsignRoleDialog(id) {
      const { roleIds } = await getEmplyeeBaseInfo(id)
      this.roleIds = roleIds
      const { rows } = await getRolesList({ page: 1, pagesize: 50 })
      this.roleList = rows
      this.showAsignRoleDialog = true
      this.userId = id
    },
    async asignRole() {
      await assignRoles({
        id: this.userId,
        roleIds: this.roleIds
      })
      this.showAsignRoleDialog = false
      this.$message.success('操作成功')
    },
    onExport() {
      import('@/vendor/Export2Excel').then(async excel => {
        const headers = {
          '姓名': 'username',
          '手机号': 'mobile',
          '入职日期': 'timeOfEntry',
          '聘用形式': 'formOfEmployment',
          '转正日期': 'correctionTime',
          '工号': 'workNumber',
          '部门': 'departmentName'
        }

        const { rows } = await getEmployees({
          page: 1,
          size: this.page.total
        })
        const values = Object.values(headers)
        const data = rows.map(t => {
          const item = pick(t, values)
          item.timeOfEntry = formatdate(item.timeOfEntry)
          item.correctionTime = formatdate(item.correctionTime)
          item.formOfEmployment = formatHireType(item.formOfEmployment)
          return Object.values(item)
        })
        /**/
        excel.export_json_to_excel({
          header: Object.keys(headers), // 表头 必填
          data: data, // 具体数据 必填
          filename: 'excel-list', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填
        })
      })
    },
    onDel(id) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async action => {
        if (this.list.length === 1) {
          this.page.page -= 1
        }
        await delEmployee(id)
        this.$message.success('操作成功')
        this.getList()
      })
    },
    handleNodeClick(data) {
      this.form.departmentName = data.name
      this.showTree = false
    },
    async getDeptsList() {
      this.showTree = true
      /*
      const { depts } = await getList()
      this.depts = translateListToTree(depts, '')
      */
      this.depts = translateListToTree((await getList()).depts, '')
    },
    close() {
      this.$refs['formRef'].resetFields()
      this.showAddDialog = false
    },
    onShowQrCodeDialog(url) {
      this.staffPhotoUrl = url
      this.showQrCodeDialog = true
    },
    async getList() {
      const { total, rows } = await getEmployees(this.page)
      this.page.total = total
      this.list = rows
    },
    onPageChange(val) {
      this.page.page = val
      this.getList()
    },
    onOpen() {},
    handelConfirm() {
      this.$refs['formRef'].validate(async valid => {
        if (!valid) return
        await addEmployee(this.form)
        this.$message.success('操作成功')
        this.getList()
        this.close()
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
