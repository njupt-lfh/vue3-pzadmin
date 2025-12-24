<template>
  <template v-for="(item, index) in props.menuData" >
    <!-- 没有子菜单的情况 -->
    <el-menu-item 
    v-if="!item.children || item.children.length == 0"
    :index="`${props.index}-${item.meta.id}`" 
    :key="`${props.index}-${item.meta.id}`"
    @click="handleClick(item, `${props.index}-${item.meta.id}`)"> 
      <el-icon size="20">
        <component :is="item.meta.icon" />
      </el-icon>
      <span>{{ item.meta.name }}</span>
    </el-menu-item> 
    <!-- 有子菜单的情况 -->
     <el-sub-menu 
      v-else 
      :index="`${props.index}-${item.meta.id}`"
      :key="index+1">
      <template #title>
        <el-icon size="20">
          <component :is="item.meta.icon" />
        </el-icon>
        <!-- 这里必须要用span包裹，要不然有bug -->
        <span>{{ item.meta.name }}</span>
      </template>
      <!-- 递归调用树菜单组件 -->
      <tree-menu 
        :index="`${props.index}-${item.meta.id}`" 
        :menuData="item.children" />
     </el-sub-menu>
  </template>
</template>
<script setup>
  import { useRouter } from 'vue-router' // 引入路由
  import { useStore } from 'vuex' // 引入vuex

  const props = defineProps(['menuData', 'index']) // 定义props，接收menuData
  
  const router = useRouter() // 实例化路由
  const store = useStore() // 实例化vuex
  // 点击菜单处理函数
  const handleClick = (item, active) => {
    // console.log(item, 'item');
    // 记录选中的菜单
    store.commit('addMenu', item.meta);
    // 更新选中的菜单
    store.commit('updateMenuActive', active)
    // 跳转路由
    router.push(item.meta.path)
  }
</script>

<style lang="less" scoped>
  
</style>