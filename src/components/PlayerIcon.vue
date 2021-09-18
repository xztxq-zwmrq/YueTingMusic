<template>
  <div class="player_con">
    <div class="disc" :class="{ pause: !play }">
      <!-- <img src="../assets/imgs/cover.png" alt="" /> -->
      <img :src="picUrl" alt="" />
    </div>
    <img
      src="../assets/imgs/player_bar.png"
      alt=""
      class="player_bar"
      :class="{ player_bar_action: play }"
    />
    <img src="../assets/imgs/line.png" alt="" />
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  computed: {
    play() {
      return this.$store.state["play"];
    },
    picUrl() {
      return this.$store.state["currentUrl"];
    }
  }
};
</script>
<style scoped>
@keyframes icon_rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.player_con {
  position: relative;
  float: left;
  width: 400px;
  height: 380px;
}
.player_con .disc {
  margin: 60px auto;
  position: relative;
  width: 255px;
  height: 255px;
  background: url("../assets/imgs/disc.png");
  animation: icon_rotate 20s linear infinite;
}
.player_con .pause {
  animation-play-state: paused;
}
.disc img {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 142px;
  height: 142px;
  border-radius: 50%;
}
.player_con > img {
  position: absolute;
  right: 0px;
  top: 0px;
  height: 380px;
}
.player_con > .player_bar {
  width: 92px;
  height: 128px;
  top: -10px;
  left: 190px;
  transition: all 0.5s linear 0s;
  transform: rotate(-30deg);
  transform-origin: 10px 10px;
}
.player_con > .player_bar_action {
  transform: rotate(0deg);
}
</style>
