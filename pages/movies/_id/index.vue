<template>
  <div class="container">
    <video :src="movie.movie_url.value" width="100%" controls></video>
    <div class="mb-4">
      <h4 class="font-weight-bold">{{movie.title.value}}</h4>
      <hr>
      <p class="text-muted">{{movie.manuscript.value}}</p>
    </div>
    <h4 class="font-weight-bold">みんなのアフレコ</h4>
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
