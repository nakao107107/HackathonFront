

export const state = () => ({

  record: {},
  file: ''

})

export const getters = {

  record: (state) => state.record,
  file:   (state) => state.file

}

export const mutations = {

  setRecord(state, payload) {
    state.record = payload
  },

  setFile(state, payload){
    state.file = payload
  }
}

export const actions = {

  async init({dispatch, commit}, id){

    let   {headers, data, error} = await this.$kintone().get('/record.json', {app: 7, id: id})
    commit('setRecord', data.record)
    let fileKey = data.record.data.value[0].fileKey
    await dispatch('getFile', fileKey)
  },

  async getFile({commit},fileKey){
    const {headers, data, error} = await this.$kintone().get('/file.json', {fileKey: fileKey})
    commit('setFile', data)
  },

  async save ({dispatch, commit}, formData){

    const {headers, data, error} = await this.$resource("https://dstn2.kumoko.club:443/dataspider/trigger/atevo").post('/create_right', formData)
    //
    // if(data && data.error) {
    //   throw new ResourceError(data.error.code, data.error.message, data.error.detail)
    // }
    // else if(error){
    //   throw new ApplicationError()
    // }
    //
    // commit('setMember', data)

  }

}
