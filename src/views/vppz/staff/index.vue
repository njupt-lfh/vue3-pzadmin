<template>
  <panel-head :route="route" />
  <div class="bts">
    <el-button :icon="Plus" type="primary" @click="open(null)" size="small">添加陪护师</el-button>
    <!-- 气泡组件 -->
    <el-popconfirm
    confirm-button-text="删除"
    cancel-button-text="取消"
    :icon="InfoFilled"
    icon-color="#626AEF"
    title="确认删除吗？"
    @confirm="confirmEvent"
    >
      <template #reference>
        <el-button :icon="Delete" type="danger" size="small">删除</el-button>
      </template>
    </el-popconfirm>
  </div>
  <!-- 陪护师列表 -->
  <el-table 
    :data="tableData.list" 
    style="width: 100%"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column label="陪护师ID" prop="id" />
    <el-table-column label="昵称" prop="name" />
    <el-table-column label="头像" prop="avatar">
      <template #default="scope">
        <el-image 
          :src="scope.row.avatar" 
          style="width: 50px; height: 50px;"
        />
      </template>
    </el-table-column>
    <el-table-column label="性别" prop="sex">
      <template #default="scope">
        {{scope.row.sex === '1' ? '男' : '女'}}
      </template>
    </el-table-column>
    <el-table-column label="手机号" prop="mobile" />
    <el-table-column label="状态" prop="active">
      <template #default="scope">
        <el-tag :type="scope.row.active ? 'success' : 'danger'">
          {{scope.row.active ? '正常' : '失效'}}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="创建时间" >
      <template #default="scope">
        <div class="fix-box">
          <el-icon><Clock /></el-icon>
          <span style="margin-left: 10px">{{scope.row.created_time}}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="primary" @click="open(scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
<!-- 分页组件 -->
  <div class="pagination-info">
    <el-pagination
      v-model:current-page="paginationData.pageNum"
      size="small"
      :background="false"
      layout="total, prev, pager, next"
      :total="tableData.total"
      @current-change="handleCurrentChange"
    />
  </div>
  <!-- 陪护师添加弹窗 -->
  <el-dialog
    v-model="dialogFormVisible"
    :before-close="beforeClose"
    title="陪护师添加"
    width="500"
  >
    <el-form 
      :model="form" 
      :rules="rules" 
      ref="formRef" 
      label-width="100px"
      label-position="left"
    >
      <el-form-item v-show="false" prop="id">
        <el-input v-model="form.id" />
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input v-model="form.name", placeholder="请输入昵称" />
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-button v-if="!form.avatar" type="primary" @click="dialogImgVisible = true">上传头像</el-button>
        <el-image 
          v-else 
          :src="form.avatar" 
          style="width: 100px; height: 100px;"
          @click="dialogImgVisible = true"
        />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="form.sex" placeholder="请选择性别">
          <el-option label="男" value="1" />
          <el-option label="女" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input-number v-model="form.age", :min="18" :max="50" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile", placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="是否生效" prop="active">
        <el-radio-group v-model="form.active">
          <el-radio :value="0">失效</el-radio>
          <el-radio :value="1">生效</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm(formRef)">确定</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
    v-model="dialogImgVisible"
    :before-close="beforeClose"
    title="选择头像"
    width="680"
  >
    <div class="image-list">
      <div 
        v-for="(item, index) in fileList" 
        :key="item.name" 
        class="img-box"
        @click="selectIndex = index"
      >
        <div v-if="index === selectIndex" class="select">
          <el-icon color="#fff"><Check /></el-icon>
        </div>
        <el-image 
          :src="item.url" 
          style="width: 148px; height: 148px"
        />
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirmImg(formRef)">确定</el-button>
        <el-button @click="dialogImgVisible=false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { Clock, Plus, Check, InfoFilled, Delete } from '@element-plus/icons-vue'
import { photoList, companion, companionList, deleteCompanion } from '@/api/index.js'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'

const route = useRoute()

onMounted(() => {
  photoList().then(({ data }) =>{
    fileList.value = data.data
  })
  getListData()
})
// 分页数据
const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
})
const tableData = reactive({
  total: 0,
  list: [],
})

const getListData = () => {
  companionList(paginationData).then(({ data }) => {
    const { list, total } = data.data
    
    tableData.list = list
    tableData.total = total
  })
}

const dialogFormVisible = ref(false)
const beforeClose = () => {
  dialogFormVisible.value = false
  formRef.value.resetFields()
}
const formRef = ref()
const form = reactive({
  id: '',
  mobile: '',
  active: 1,
  age: 28,
  avatar: '',
  name: '',
  sex: ''
})
const rules = reactive({
  name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  avatar: [{ required: true, message: '请上传头像' }],
  sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
  mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
})

const confirm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      companion(form).then(({ data }) => {
        if (data.code === 10000) {
          ElMessage.success('添加成功')
          beforeClose()
          getListData()
        }else{
          ElMessage.error(data.message)
        }
      })
    } else {
      console.log('校验失败', fields)
    }
  })
}

const open = (rowData={}) => {
  dialogFormVisible.value = true
  nextTick(() => {
    //如果是编辑，将数据赋值给form
    if (rowData) {
      Object.assign(form, rowData)
    }
  })
}

// 上传头像
const dialogImgVisible = ref(false)
const fileList = ref([])
const selectIndex = ref(0)
const confirmImg = (formEl) => {
  form.avatar = fileList.value[selectIndex.value].url
  dialogImgVisible.value = false
  formEl.validateField('avatar')
}

const handleSizeChange = (val) => {
  paginationData.pageSize = val
  getListData()
}
const handleCurrentChange = (val) => {
  paginationData.pageNum = val
  getListData()
}
const selectionList = ref([])
const handleSelectionChange = (val) => {
  selectionList.value = val.map(item => ({id: item.id}))
}

// 删除
const confirmEvent = () => {
  //没有选择数据
  if (!selectionList.value.length) {
    return ElMessage.warning('至少选择一项数据')
  }
  deleteCompanion({
    id: selectionList.value}).then(({ data }) => {
    if (data.code === 10000) {
      ElMessage.success('删除成功')
      getListData()
    }else{
      ElMessage.error(data.message)
    }
  })
}
</script>

<style lang="less" scoped>
  .btns {
    padding: 10px 0 10px 10px;
    background-color: #fff;
}
.image-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .img-box {
    position: relative;
    .select {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 24px;
      height: 24px;
      background-color: #67c23a;
      z-index: 999;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .el-image {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>