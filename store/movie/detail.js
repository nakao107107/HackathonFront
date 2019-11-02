
export const state = () => ({

  movie: {}

})

export const getters = {

  movie: (state) => state.movie

}

export const mutations = {

  setMovie(state, payload) {
    state.movie = payload
  }

}

export const actions = {


  async init ({dispatch, commit}, id){

    const {headers, data, error} = await this.$kintone().get('/record.json', {app: 9, id: id})
    commit("setMovie", data.record)

  }

}
