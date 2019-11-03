
export const state = () => ({

  genres: {}

})

export const getters = {

  genres: (state) => state.genres

}

export const mutations = {

  setGenres(state, payload) {
    state.genres = payload
  }

}

export const actions = {


  async init ({dispatch, commit}){

    const {headers, data, error} = await this.$kintone().get('/records.json', {app: 10})
    commit("setGenres", data.records)

  }

}
