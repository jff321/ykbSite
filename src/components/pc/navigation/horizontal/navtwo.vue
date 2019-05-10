<template>
  <div>
ssss
  </div>
</template>
<script>
  export default {
    name: 'nav',
    props: ['skin'],
    data () {
      return {
        navskin: this.skin ? this.skin : 'light'
      };
    },
    created() {
      console.info(this.skin);
    }
  };
</script>
<style scoped>
  .my-logo img{
    height: 100%;
  }
  .my-logo{
    border: 0;
    float: left;
    height: 100%;
    cursor: pointer;
  }
  .my-logo:hover{
    border:0 !important;
  }
</style>
