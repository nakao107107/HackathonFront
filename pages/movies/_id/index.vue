<template>
  <div class="container">
    <video :src="movie.movie_url.value" width="100%" controls></video>
    <h3>みんなのアフレコ</h3>
    <a :href="`/movies/${movie.$id.value}/record`" class="btn btn-primary">アフレコしてみる</a>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {

    async fetch({route, store}){
      await store.dispatch("movie/detail/init", route.params.id)
      // await store.dispatch("record/list/init", route.params.id)
    },

    computed: {
      ...mapGetters('movie/detail', ['movie'])
      // ...mapGetters('record/list', ['records'])
    }


  }
</script>

<style scoped>

</style>
