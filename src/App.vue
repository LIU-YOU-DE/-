<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default{
  name: 'App',
  reload () {
    this.isRouterAlive = false
    this.$nextTick(function () {
      this.isRouterAlive = true
    })
  }
}
</script>
