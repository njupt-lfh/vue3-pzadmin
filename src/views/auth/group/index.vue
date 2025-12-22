<template>
  <panel-head />
  <div class="btns">
    <el-button :icon="Plus" type="primary" @click="open(null)">
      添加</el-button>
  </div>
  <el-table :data="tableData.list" style="width: 100%">
    <el-table-column label="id" prop="id" />
    <el-table-column label="昵称" prop="name" />
    <el-table-column label="菜单权限" prop="permissionName" width="500px" />
    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="primary" @click="open(scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="pagination-info">
    <!-- 分页组件 -->
    <el-pagination
      v-model:currentPage="paginationData.pageNum"
      :page-size="paginationData.pageSize"
      :background="false"
      :small="small"
      :total="tableData.total"
      layout="total, prev, pager, next"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div> 
  <el-dialog
    v-model="dialogFormVisible"
    :before-close="beforeClose"
    title="添加权限"
    width="500"
  >
    <el-form 
      :model="form" 
      ref="formRef" 
      label-width="100px"
      label-position="left"
      :rules="rules"
      >
      <el-form-item v-show="false" prop="id">
        <el-input v-model="form.id" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请填写权限名称" />
      </el-form-item>
      <el-form-item label="权限" prop="permissions">
        <el-tree
          ref="treeRef" 
          style="max-width: 600px;"
          :data="permissionData" 
          show-checkbox 
          node-key="id" 
          :default-checked-keys="defaultKeys" 
          :default-expanded-keys="[2]"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm(formRef)">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { userGetMenu, userSetmenu, menuList } from '@/api'
import { Plus } from '@element-plus/icons-vue'

onMounted(() => {
  //菜单数据
  userGetMenu().then(({ data }) => {
    console.log(data)
    permissionData.value = data.data
  })
  getListData()
})

//列表数据
const tableData = reactive({
  list: [],
  total: 0,
})

//打开编辑弹窗
const open = (rowData = {}) => {
  dialogFormVisible.value = true
  //弹窗打开form生成是异步的
  nextTick(() => {
    if(rowData) {
      Object.assign(form, { id: rowData.id, name: rowData.name })
      treeRef.value.setCheckedKeys(rowData.permission)
    }
  })
}

//分页数据
const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
})

//点击页码回调
const handleCurrentChange = (val) => {
  paginationData.pageNum = val
  getListData()
}
//改变每页显示条数回调
const handleSizeChange = (val) => {
  paginationData.pageSize = val
  getListData()
}

//请求列表数据
const getListData = () => {
  menuList(paginationData).then(({ data }) => {
    const { list, total } = data.data
    tableData.list = list
    tableData.total = total
  })
}

const formRef = ref() //表单引用

//form表单数据
const form = reactive({
  id: '',
  name: '',
  permissions:''
})

//树状结构数据
const permissionData = ref([])

//控制弹窗的显示和隐藏
const dialogFormVisible = ref(false)
//关闭弹窗的回调
const beforeClose = () => {
  dialogFormVisible.value = false
  //重置表单数据
  formRef.value.resetFields()
  //重置树状结构数据
  treeRef.value.setCheckedKeys(defaultKeys)
}

//选中权限
const defaultKeys = [4, 5]
const treeRef = ref()

const rules = reactive({
  name: [
    { required: true, message: '请输入权限名称', trigger: 'blur' }
  ],
})
//表单提交
const confirm = async (formEl) => {
  if(!formEl) return
  await formEl.validate((valid, fields) => {
    if(valid) {
      //获取选中的权限
      const permissions = JSON.stringify(treeRef.value.getCheckedKeys())
      //提交表单
      userSetmenu({ name: form.name, permissions, id: form.id }).then(({ data }) => {
        // console.log(data)
        beforeClose()
        getListData()
      })
    } else {
      console.log('添加失败',fields)
    }
  })
}

</script>

<style lang="less" scoped>
  .btns {
    padding: 10px 0 10px 10px;
    background-color: #fff;
  }
</style>