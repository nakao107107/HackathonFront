export const actions = {


  async init ({dispatch, commit}){

    const {headers, data, error} = await this.$kintone("https://dstn2.kumoko.club:443/dataspider/trigger/atevo").post('/create', formData)

  }

}
