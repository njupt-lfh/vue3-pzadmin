const state = {
  //左侧菜单的收起状态
  iscollapse: false,
  //选中的菜单
  selectMenu: []
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
  }
}

export default {
  state,
  mutations
}