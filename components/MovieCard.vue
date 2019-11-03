<template>
  <div class="col-3 m-0">
    <div class="card">
      <img :src="movie.thumb_url.value" alt="" class="crop">
      <div class="card-body">
        <h5 class="card-title font-weight-bold">{{movie.title.value}}</h5>
        <p class="card-text ellipsis text-muted">{{movie.manuscript.value}}</p>
        <div class="text-center">
          <a :href="`/movies/${movie.$id.value}`" class="btn btn-outline-primary">みんなのアフレコを聞く</a>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  export default {
    props: [
      'movie'
    ],

    methods: {
      goNextPage(id){
        this.$router.push(`/movies/${id}`)
      }
    }
  }

</script>

<style scoped>

.crop {
  width: 100%;
  object-fit: contain;
}

  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

</style>
