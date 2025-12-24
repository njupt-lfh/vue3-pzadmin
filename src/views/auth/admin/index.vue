<template>
  <panel-head :route="route"/>
  <el-table :data="tableData.list" style="width: 100%">
    <el-table-column label="id" prop="id" />
    <el-table-column label="昵称" prop="name" />
    <el-table-column label="所属组别" prop="permissions_id" >
      <template #default="scope">
          {{permissionName(scope.row.permissions_id)}}
      </template>
    </el-table-column>
    <el-table-column label="手机号" prop="mobile" />
    <el-table-column label="状态" prop="active" >
      <template #default="scope">
          <el-tag :type="scope.row.active ? 'success' : 'danger'">{{scope.row.active ? '正常' : '失效'}}</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="创建时间">
      <template #default="scope">
        <div class="flex-box">
          <el-icon><Clock /></el-icon>
          <span style="margin-left: 10px;">{{scope.row.create_time}}</span>
        </div>
      </template>
    </el-table-column>/>
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
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" disabled />
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="菜单权限" prop="permissions_id">
        <el-select 
          v-model="form.permissions_id" 
          placeholder="请选择菜单权限"
          style="width: 240px"
          >
          <el-option 
            v-for="item in options" 
            :key="item.id" 
            :label="item.name" 
            :value="item.id" />
        </el-select>
      </el-form-item>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="confirm(formRef)">确定</el-button>
        </div>
      </template>
    </el-form>
  </el-dialog>
</template>
<script setup>
import { authAdmin, menuSelectList, updateUser } from '@/api'
import { ref, reactive, onMounted, nextTick } from 'vue'
import dayjs from 'dayjs'
import { useRoute } from 'vue-router'

const route = useRoute()

const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
})

//列表数据
const tableData = reactive({
  list: [],
  total: 0,
})

onMounted(() => {
  //请求列表
  getListData()
  //获取权限下拉列表
  menuSelectList().then(({ data }) => {
    // console.log(data, 'menuSelectList')
    options.value = data.data
  })
})
//请求列表
const getListData = () =>{
  authAdmin(paginationData).then(({ data }) => {
    // console.log(data, 'authAdmin')
    const { list, total } = data.data
    list.forEach(item => {
      item.create_time = dayjs(item.create_time).format('YYYY-MM-DD')
    })
    tableData.list = list
    tableData.total = total
  })
}

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

//弹窗
const dialogFormVisible = ref(false)
//弹窗关闭回调
const beforeClose = () => {
  dialogFormVisible.value = false
  //重置表单数据
  formRef.value.resetFields()
}
const rules = reactive({
  name: [
    { required: true, message: '请填写昵称', trigger: 'blur' }
  ],
  permissions_id: [
    { required: true, message: '请选择菜单权限', trigger: 'change' }
  ]
})

//编辑表单
const formRef = ref() //表单引用
//form表单数据
const form = reactive({
  id: '',
  name: '',
  permissions_id: ''
})
//表单提交
const confirm = async (formEl) => {
  if(!formEl) return
  await formEl.validate((valid, fields) => {
    if(valid) {
      const { name, permissions_id } = form
      //提交表单
      updateUser( {name, permissions_id }).then(({ data }) => {
        // console.log(data)
        if(data.code === 10000) {
          dialogFormVisible.value = false
          beforeClose()
          getListData()
        }
      })
    } else {
      console.log('添加失败',fields)
    }
  })
}
//权限下拉列表数据
const options = ref([])
//根据权限id匹配权限名称
const permissionName = (id) => {
  const data = options.value.find(el => el.id === id)
  return data ? data.name : '超级管理员'
}

//打开编辑弹窗
const open = (rowData = {}) => {
  dialogFormVisible.value = true
  //弹窗打开form生成是异步的
  nextTick(() => {
    if(rowData) {
      Object.assign(form, { mobile: rowData.mobile, name: rowData.name, permissions_id: rowData.permissions_id })
    }
  })
}

</script>

<style lang="less" scoped>
  .flex-box {
    display: flex;
    align-items: center;
  }
</style>