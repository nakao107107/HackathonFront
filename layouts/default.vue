<template>
  <div>
    <div class="container d-flex p-3 justify-content-between align-items-center">
      <p class="title p-0 m-0" @click="goTopPage">AteVo!</p>
      <form class="form-inline">
        <div class="input-group mt-1">
          <div class="input-group-prepend">
            <span class="input-group-text"><i class="fas fa-search"></i></span>
          </div>
          <input type="text" class="form-control" placeholder="プロジェクトを検索">
        </div>
      </form>
    </div>
    <nuxt />
  </div>
</template>

<script>
  export  default {
    methods: {
      goTopPage(){
        this.$router.push('/')
      }
    }
  }

</script>

<style>
  .title {
    font-size: 40px;
    font-family: Impact;
  }
</style>
