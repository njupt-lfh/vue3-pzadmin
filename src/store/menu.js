const localData = localStorage.getItem('pz_v3pz')

const state = localData ? localData.menu : {
  //左侧菜单的收起状态
  iscollapse: false,
  //选中的菜单
  selectMenu: [],
  //完整的路由数据
  routerList: [],
  //默认选中的菜单
  menuActive: '1-1'
}

const mutations = {
  //切换菜单收起状态
  collaapseMenu(state) {
    state.iscollapse = !state.iscollapse
  },
  //记录选中的菜单的数据
  addMenu(state, payload) {
    if (state.selectMenu.findIndex(item => item.path === payload.path) === -1) {
      state.selectMenu.push(payload)
    }
  },
  closeMenu(state, payload) {
    //找到要关闭的菜单的索引
    const index = state.selectMenu.findIndex(val => val.name === payload.name)
    // 通过索引删除数组指定元素
    state.selectMenu.splice(index, 1)
  },
  //动态菜单
  dynamicMenu(state, payload) {
    const modules = import.meta.glob('../views/**/**/*.vue')
    function routerSet(router) {
      router.forEach(route => {
        // 判断没有子菜单，拼接路由数据
        if (!route.children) {
          const url = `../views${route.meta.path}/index.vue`;
          route.component = modules[url]
        } else {
          routerSet(route.children)
        }
      })
    }
    routerSet(payload)
    state.routerList = payload
  },
  //设置默认选中的菜单
  updateMenuActive(state, payload) {
    state.menuActive = payload
  }
}

export default {
  state,
  mutations
}