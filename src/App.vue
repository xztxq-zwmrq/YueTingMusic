<template>
  <div id="app">
    <Player />
  </div>
</template>

<script>
import Player from "./components/Player";

export default {
  name: "App",
  components: {
    Player
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
#app {
  position: fixed;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background: url("./assets/imgs/bg.jpg") no-repeat;
  background-size: 100% 100%;
}
</style>
