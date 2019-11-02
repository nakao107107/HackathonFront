
export const state = () => ({

  movies: {}

})

export const getters = {

  movies: (state) => state.movies

}

export const mutations = {

  setMovies(state, payload) {
    state.movies = payload
  }

}

export const actions = {


  async init ({dispatch, commit}){

    const {headers, data, error} = await this.$kintone().get('/records.json', {app: 9})
    commit("setMovies", data.records)

  }

}
