
export const actions = {

  /*
  init
  */
  async nuxtServerInit({ dispatch, commit }, { app, req, route, redirect, error }) {

    //初回データの読み込み
    await dispatch('genre/init');

  }
}
