<template>
  <div>
    {{record}}
    {{movie}}
    <audio :src="wavURL" controls></audio>
    <video id="video" :src="movie.movie_url.value"></video>
    <button class="聞いてみる"></button>
  </div>
</template>

<script>

  import { mapGetters } from 'vuex'

  export default {

    data(){

      return {
        file: ''
      }
    },

    async fetch({route, store}){
      await store.dispatch("record/detail/init", route.params.record_id)
      await store.dispatch("movie/detail/init", route.params.id)
    },

    created(){
      this.file = this.$store.state.record.detail.file
    },

    computed: {
      ...mapGetters('record/detail', ['record']),
      ...mapGetters('movie/detail', ['movie'])
    },

    methods: {
      wavURL(){
        const audioBlob = new Blob([this.file], { type: 'audio/wav' })
        let url = window.URL.createObjectURL(audioBlob)
        return url
      }
    }

  }
</script>

<style scoped>

</style>
