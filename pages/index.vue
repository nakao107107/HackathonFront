<template>
  <div class="container">
    <div class="row mt-3">
      <movie-card v-for="movie in movies" :key="movie.$id.value" :movie="movie"/>
    </div>
  </div>
</template>

<script>
  import MovieCard from '~/components/MovieCard.vue'
  import {mapGetters} from 'vuex'

  export default {

    async fetch({store}){
      await store.dispatch("movie/list/init")
    },

    components: {
      MovieCard
    },

    computed: {
      ...mapGetters('movie/list', ['movies'])
    }

  }
</script>

<style scoped>

</style>
