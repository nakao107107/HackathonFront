<template>
  <div class="container">
    <div>
      {{this.url}}
      <audio :src="this.url" controls></audio>
      <video id="video" :src="movie.movie_url.value" class="w-100" muted></video>
    </div>
    <div>
      <button class="btn btn-outline-primary" @click="play">聞いてみる</button>
    </div>
  </div>
</template>

<script>

  import { mapGetters } from 'vuex'

  export default {

    data(){

      return {
        file: '',
        url: ''
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
      ...mapGetters('movie/detail', ['movie']),
    },

    methods: {

      wavURL(){
        const audioBlob = new Blob([this.file], { type: 'audio/wav' })
        console.log(audioBlob)
        let url = window.URL.createObjectURL(audioBlob)
        this.url = url
      },

      play(){
        this.wavURL()
        document.getElementById("video").play();
        // document.getElementById("audio").play();
      }
    }

  }
</script>

<style scoped>

</style>
