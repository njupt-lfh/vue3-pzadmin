<template>
 <el-menu
        :style="{ width: isCollapse ? '64px' : '230px' }"
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="aside-container"
        default-active="2"
        text-color="#fff"
        @open="handleOpen"
        @close="handleClose"
        :collapse="isCollapse"
      >
      <p class="logo-lg">{{ isCollapse ? 'DIDI' : 'DIDI陪诊'}}</p>
      <!-- 引入树菜单组件 -->
      <tree-menu :index="1" :menuData="menuData" />   
      </el-menu>
</template>
<script setup>
  import TreeMenu from '@/components/treeMenu.vue'
  import { useRouter } from 'vue-router' // 引入路由
  import { reactive, computed } from 'vue' // 引入响应式
  import { useStore } from 'vuex' // 引入vuex
  const store = useStore() // 实例化vuex
  // 监听菜单收起状态变化
  const isCollapse = computed(() => store.state.menu.iscollapse)

  const router = useRouter() // 实例化路由
  const menuData = reactive(router.options.routes[0].children) // 响应式路由

  const handleOpen = (key) => {
    console.log(key);
  };
  const handleClose = (key) => {
    console.log(key);
  };
</script>
<style lang="less" scoped>
  .aside-container {
    height: 100%;
  };
  .logo-lg {
    font-size: 20px;
    color: #fff;
    text-align: center;
    height: 50px;
    line-height: 50px;
  }
</style>
