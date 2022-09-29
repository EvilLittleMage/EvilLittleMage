<template>
  <div>
    <el-dialog :visible="visible" v-bind="$attrs" :title="form.id?'编辑部门':'新增部门'" v-on="$listeners" @open="onOpen" @close="onClose">
      <el-form ref="formRef" :model="form" :rules="rules" size="medium" label-width="120px">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入单行文本部门名称" clearable :style="{width: '100%'}">
          </el-input>
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入部门编码" clearable :style="{width: '100%'}"></el-input>
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <el-select v-model="form.manager" placeholder="请选择部门负责人" clearable :style="{width: '100%'}">
            <el-option
              v-for="(item, index) in managerOptions"
              :key="index"
              :label="item.username"
              :value="item.username"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input
            v-model="form.introduce"
            type="textarea"
            placeholder="请输入部门介绍"
            :autosize="{minRows: 4, maxRows: 4}"
            :style="{width: '100%'}"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="handelConfirm">确定</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { getEmployeeSimple } from '@/api/employees.js'
import { addDept, getList, updateDept } from '@/api/departments'
export default {
  components: {},
  inheritAttrs: false,
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    node: { // 在新增环境,node-父部门, 编辑的时候node-本部门
      type: Object,
      required: true
    }
  },
  data() {
    const checkName = async(rule, value, callback) => {
      // 同级部门中禁止出现重复部门
      // 理解:当前添加的部门名称,不能和兄弟部门重名
      // 当前添加的部门名称:value/ this.from.name
      // 父部门-this.node
      // 兄弟部门-this.node.children
      let brothers
      if (this.form.id) {
        // 编辑
        const allDepts = (await getList()).depts
        brothers = allDepts.filter(t => t.pid === this.form.pid && t.id !== this.form.id)
      } else {
        // 新增
        brothers = this.node.children || []
      }
      const f = brothers.find(t => t.name === value)
      if (!f) {
        callback()
      } else {
        callback(new Error('存在重复名称的兄弟部门'))
      }
    }
    const checkCode = async(rule, value, callback) => {
      // 部门编码在整个模块中都不允许重复
      // 理解:当前添加的部门编号能和其他部门重复
      // 当前添加的部门编号: value / this.form.code
      // 其他部门:发请求,获取所有部门
      const allDepts = (await getList()).depts
      let f
      if (this.form.id) {
        // 编辑,排除当前部门,允许部门自己修改自己编辑
        f = allDepts.filter(t => t.id !== this.form.id).find(t => t.code === value)
      } else {
        // 新增
        f = allDepts.find(t => t.code === value)
      }
      if (!f) {
        callback()
      } else {
        callback(new Error('存在重复编号的部门'))
      }
    }
    return {
      form: {
        name: undefined,
        code: undefined,
        manager: undefined,
        introduce: undefined
      },
      rules: {
        // 部门名称（name）：必填 1-50个字符  / 同级部门中禁止出现重复部门
        name: [{
          required: true,
          message: '请输入单行文本部门名称',
          trigger: 'blur'
        }, { min: 1, max: 50, message: '请输1-50个字符', trigger: 'blur' },
        { validator: checkName, trigger: 'blur' }],
        // 部门编码（code）：必填 1-50个字符  / 部门编码在整个模块中都不允许重复
        code: [{
          required: true,
          message: '请输入部门编码',
          trigger: 'blur'
        }, { min: 1, max: 50, message: '请输1-50个字符', trigger: 'blur' },
        { validator: checkCode, trigger: 'blur' }],
        // 部门负责人（manager）：必填
        manager: [{
          required: true,
          message: '请选择部门负责人',
          trigger: 'change'
        }],
        // 部门介绍 ( introduce)：必填 1-300个字符
        introduce: [{
          required: true,
          message: '请输入部门介绍',
          trigger: 'blur'
        }, { min: 1, max: 300, message: '请输1-300个字符', trigger: 'blur' }]
      },
      managerOptions: []
    }
  },
  computed: {},
  watch: {},
  async created() {
    this.managerOptions = await getEmployeeSimple()
  },
  mounted() {},
  methods: {
    onOpen() {},
    onClose() {
      // 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      // 理解:
      // 初始值-最开始打开对话框之前form的值
      // 所有字段值-部分字段,在el-from-item有prop字段才可以
      this.$refs['formRef'].resetFields()
      this.form = {
        name: undefined,
        code: undefined,
        manager: undefined,
        introduce: undefined
      }
    },
    close() {
      this.$emit('update:visible', false)
    },
    handelConfirm() {
      this.$refs['formRef'].validate(async valid => {
        if (!valid) return

        // 发请求
        if (this.form.id) {
          // 编辑
          await updateDept(this.form)
        } else {
          // 新增
          await addDept({
            ...this.form,
            pid: this.node.id
          })
        }
        // 提示一下
        this.$message.success('操作成功')
        // 刷新列表
        this.$emit('success')
        this.close()
      })
    }
  }
}

</script>
<style>
</style>
