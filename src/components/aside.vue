<template>
  <el-menu
        :style="{ width: isCollapse ? '64px' : '230px' }"
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="aside-container"
        text-color="#fff"
        @open="handleOpen"
        @close="handleClose"
        :collapse="isCollapse"
        :default-active="active"
      >
      <p class="logo-lg">{{ isCollapse ? 'DIDI' : 'DIDI陪诊'}}</p>
      <!-- 引入树菜单组件 -->
      <TreeMenu :index="1" :menuData="menuData" />   
  </el-menu>
</template>

<script setup>
  import TreeMenu from '@/components/treeMenu.vue'
  import { useRouter } from 'vue-router' // 引入路由
  import { reactive, computed } from 'vue' // 引入响应式
  import { useStore } from 'vuex' // 引入vuex
  
  // 监听菜单收起状态变化
  const isCollapse = computed(() => store.state.menu.iscollapse)

  const router = useRouter() // 实例化路由
  const store = useStore() // 实例化vuex
  // const menuData = reactive(router.options.routes[0].children) // 响应式路由
  const menuData = computed(() => store.state.menu.routerList) // 响应式路由

  // 监听选中的菜单
  const active = computed(() => store.state.menu.menuActive)

  const handleOpen = () => {}
  const handleClose = () => {}
</script>

<style lang="less" scoped>
  .aside-container {
    height: 100%;
    .logo-lg {
    font-size: 20px;
    color: #fff;
    text-align: center;
    height: 50px;
    line-height: 50px;
    }
  }
</style>
