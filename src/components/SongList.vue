<template>
  <div class="songList">
    <ul>
      <li
        v-for="(item, index) in this.songList"
        :key="index"
        @click="changeAction(item, index)"
      >
        <div class="iconfont icon-zanting"></div>
        <div class="songName">{{ item.name }}</div>
        <div class="iconfont icon-MV" v-show="item.mvId !== 0"></div>
      </li>
    </ul>
    <img src="../assets/imgs/line.png" alt="" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      currentMusic: {}
    };
  },
  computed: {
    songList() {
      return this.$store.state["songList"];
    },
    play: {
      get() {
        return this.$store.state["play"];
      },
      set(value) {
        this.$store.commit({
          type: "changePlayState",
          value
        });
      }
    }
  },
  methods: {
    changeAction(item, index) {
      if (index === this.$store.state["currentIndex"]) {
        //点击的歌曲为当前歌曲，歌曲暂停
        this.play = !this.play;
      } else {
        this.play = true;
        this.$store.commit({
          type: "setCurrentMusic",
          value: item
          //在随机模式中这里的index与playList中的index不存在一一对应关系
          // index: index
        });
      }
      // console.log(this.$refs);//{}
    }
  }
};
</script>
<style scoped>
.songList {
  float: left;
  position: relative;
  width: 200px;
  height: 380px;
  box-sizing: border-box;
  overflow: hidden;
}

.songList ul {
  float: left;
  width: calc(100% + 100px);
  /* width: calc(100%+15px); 错误写法*/
  height: 100%;
  list-style: none;
  overflow-y: auto;
  overflow-x: hidden;
}
.songList img {
  position: absolute;
  top: 0px;
  right: 0px;
  height: 100%;
}
.songList li {
  position: relative;
  padding: 10px 0;
  list-style: none;
}
.songList li:nth-child(2n) {
  background-color: rgba(240, 240, 240, 0.3);
}
.songList li .iconfont {
  width: 20px;
  height: 20px;
  display: inline-block;
  color: red;
  margin: 0 10px;
  border: 1px solid red;
  border-radius: 12px;
  font-size: 10px;
}
.songList li .icon-zanting:before {
  line-height: 20px;
  text-align: center;
  margin: 5px;
}
.songList li .icon-bofang:before {
  line-height: 20px;
  text-align: center;
  margin-left: 4px;
}
.songList li .songName {
  position: absolute;
  right: 115px;
  top: 10px;
  width: 120px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.songList li .icon-MV {
  position: absolute;
  right: 80px;
  top: 10px;
  border: 0px;
  font-size: 20px;
}
</style>
