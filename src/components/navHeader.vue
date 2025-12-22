<template>
  <div class="header-container">
    <div class="header-left flex-box">
      <el-icon class="icon" @click="store.commit('collaapseMenu')" size="20">
        <Fold />
      </el-icon>
      <!-- 选中的菜单 -->
      <ul class="flex-box">
        <li 
          v-for="(item, index) in selectMenu" 
          :key="item.path"
          :class="{selected: item.path === route.path}"
          class="tab flex-box">
          <el-icon size="12">
            <component :is="item.icon" />
          </el-icon>
          <router-link :to="{ path: item.path }" class="text flex-box">
          {{ item.name }}
          </router-link>
          <!-- 关闭按钮 -->
          <el-icon class="close" size="12" @click="closeTab(item, index)">
            <Close />
          </el-icon>
        </li>
      </ul>
    </div>
    <div class="header-right">
       <el-dropdown>
        <div class="el-dropdown-link flex-box">
          <el-avatar
           src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
         />
         <p class="user-name">admin</p>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>Action 1</el-dropdown-item>
            <el-dropdown-item>Action 2</el-dropdown-item>
            <el-dropdown-item>Action 3</el-dropdown-item>
            <el-dropdown-item disabled>Action 4</el-dropdown-item>
            <el-dropdown-item divided>Action 5</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script setup>
  import { useStore } from 'vuex' // 引入vuex
  import { computed } from 'vue' // 引入响应式
  import { useRoute, useRouter } from 'vue-router' 

  const route = useRoute() // 当前的路由对象
  const router = useRouter() // 实例化vue-router  
  const store = useStore() // 实例化vuex
  // 监听菜单收起状态变化
  const selectMenu = computed(() => store.state.menu.selectMenu)
  // 关闭选中的菜单
  const closeTab = (item, index) => {
    store.commit('closeMenu', item)
    // 如果关闭的菜单不是当前激活的菜单
    if (route.path !== item.path) {
      return
    } 
    const selectMenuData = selectMenu.value
    //数组长度大于0
    if (index === selectMenuData.length) {
    //添加一个对象到数组中
    selectMenuData.push({
      name: '新页面',
      path: item.path,
      meta: item.meta
    })
    }
    //数组长度大于0
    if(!selectMenuData.length){
      router.push({path: item.path})
    } else if (index !== selectMenuData.length) {
      //在数组中存在
      //移除重复的
      // 直接使用closeMenu mutation而不是自定义过滤
      //跳转路由
      router.push({path: selectMenuData[index - 1]?.path || '/'})
    } else {
      //在数组中不存在
      router.push({path: selectMenuData[index]?.path || '/'})
    }
  }
</script>

<style lang="less" scoped>
  .flex-box {
    display: flex;
    align-items: center;
    height: 100%;
  }

  .header-container {
    display: flex; // 水平居中
    justify-content: space-between; // 左右分布
    align-items: center; // 垂直居中
    height: 100%;
    background-color: #fff;
    padding-right: 25px;
    .header-left {
      height: 100%;
      .icon {
        width: 45px;
        height: 100%;
      }
      .icon:hover {
        background-color: #f5f5f5;
        cursor: pointer;
      }
      // 选中的菜单
      .tab {
        height: 100%;
        padding: 0 10px;
        .text {
          margin: 0 5px;
        }
        .close {
          visibility: hidden;
        }
        &.selected {
          background-color: #f5f5f5;
          a {
            color: #409eff;
          }
          i {
            color: #409eff;
          }
        }
      }
      .tab:hover {
        background-color: #f5f5f5;
        .close {
          visibility: visible;
          cursor: pointer;
          color: #333;
        }
      }
    }
    .header-right {
      .user-name {
          margin-left: 10px;
      }
    }
    a{
      height: 100%;
      color: #333;
      font-size: 15px;
    }
  }
</style>