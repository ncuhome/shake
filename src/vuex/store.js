import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: '',
        currentId: 0,
        currentFood: {},
        isActive: true,
        positionY: 0
    },
    mutations: {
        getdetail(state, payload) {
            this.state.currentId = payload.currentId
        },
        setToken(state, payload) {
            this.state.token = payload.token
        },
        setCurFood(state, payload) {
            this.state.currentFood = payload.currentFood
        },
        setActive(state, payload) {
            this.state.isActive = payload.isActive
        },
        change_positon(state, payload) {
            this.state.positionY = payload.pos
        }
    },
    actions: {
        setToken({ commit, state }, data) {
            commit('setToken', data)
        },
        setCurFood({ commit, state }, data) {
            commit('setCurFood', data)
        },
        setActive({ commit, state }, data) {
            commit('setActive', data)
        }
    }
})