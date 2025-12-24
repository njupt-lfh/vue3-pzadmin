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
       <el-dropdown @command="handleClick">
        <div class="el-dropdown-link flex-box">
          <el-avatar
           :src="userInfo.avatar"
         />
         <p class="user-name">{{ userInfo.name }}</p>
        </div>
        <template #dropdown>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
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

  // 解析路由数据
  const userInfo = JSON.parse(localStorage.getItem('pz_userInfo'))

  // 关闭选中的菜单
  const closeTab = (item, index) => {
    store.commit('closeMenu', item)
    // 如果关闭的菜单是不是当前激活的菜单
    if (route.path !== item.path) {
      return
    } 
    const selctMenuData = selectMenu.value
    // 如果关闭的菜单是最后一个菜单，激活上一个菜单
    if (index === selctMenuData.length) {
      //如果只有一个元素
      if(!selctMenuData.length){
        router.push('/')
      }else {
        router.push({path: selctMenuData[index - 1].path
        })
      }
    }else { // 如果关闭的菜单不是最后一个菜单，激活下一个菜单
      router.push({path: selctMenuData[index].path
      })
    }
  }

  // 点击事件
  const handleClick = (command) => {
    if (command === 'logout') {
      localStorage.removeItem('pz_token')
      localStorage.removeItem('pz_userInfo')    
      localStorage.removeItem('pz_v3pz')
      window.location.href = window.location.origin
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