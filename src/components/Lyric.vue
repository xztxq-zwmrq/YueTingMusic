<template>
  <div class="lyric">
    <ul>
      <li
        v-for="(item, index) in lyric"
        :key="index"
        :class="{ active: index === num2 }"
      >
        {{ item.content }}
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // lyric: this.$store.state.lyric,
      num: 0
    };
  },
  computed: {
    lyric() {
      //歌词更新，说明换了一首歌
      this.num = 0;
      return this.$store.state.lyric;
    },
    num2() {
      // this.num = this.num === undefined ? 0 : this.num;
      let time = this.lyric[this.num + 1].time.split(":");
      // console.log(time);
      time = +(+time[0] * 60 + +time[1]);
      // console.log(time);
      // console.log(this.$store.state.currentTime);
      // console.log(this.$store.state.currentTime === time);
      // return this.$store.state.currentTime === time;
      if (time <= this.$store.state.currentTime) {
        // console.log(time);
        ++this.num;
      }
      //循环模式下歌词没有更新
      // if (this.num === this.lyric.length - 2) {
      //   this.num = 0;
      // }
      return this.num;
    }
  }
};
</script>
<style scoped>
.lyric {
  float: left;
  height: 380px;
  width: 230px;
  overflow-x: hidden;
}
ul {
  height: 380px;
  width: 250px;
  list-style: none;
  overflow-x: hidden;
  overflow-y: auto;
}
li {
  padding: 10px 0 0 10px;
}
.active {
  color: skyblue;
}
</style>
