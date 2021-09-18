<template>
  <div class="foot_player">
    <div class="play_icon">
      <audio :src="currentMusic.url" ref="audio"></audio>
      <!-- <audio
      src="http://m7.music.126.net/20210517004655/9ccf5f17a8092bffaa118a27dd484c3e/ymusic/6a84/3618/2255/8c1c11ebe16d7bf5e222c1457dbd4706.mp3"
      controls="controls"
      loop="loop"
      autoplay="autoplay"
    ></audio> -->
      <div class="iconfont icon-shangyishou" @click="previousSong()"></div>
      <div
        class="iconfont"
        :class="{ 'icon-zanting': !play, 'icon-bofang': play }"
        @click="changeAction()"
      ></div>
      <!-- :class="{ 'icon-zanting': !play, 'icon-bofang': play }" 这里因为类名存在-这个特殊字符，所以单引号不能省略-->
      <div class="iconfont icon-xiayishou" @click="nextSong()"></div>
    </div>
    <div class="progress">
      <img :src="this.$store.state.currentUrl" alt="" />
      <div>
        <div class="songMsg">
          <span class="songName">
            {{
              this.currentMusic.name === undefined ? "" : this.currentMusic.name
            }}
          </span>
          {{ this.artists }}
        </div>
        <div class="progress_bar" ref="progress_bar">
          <div class="bar" ref="bar"></div>
          <div class="icon" ref="icon"></div>
        </div>
      </div>
    </div>
    <div class="time">
      {{ currentTime | formatTime }}/{{ duration | formatTime }}
    </div>
    <div
      class="iconfont mode"
      :class="
        mode === 0
          ? 'icon-shunxubofang'
          : mode === 1
          ? 'icon-xunhuanbofang'
          : 'icon-suijibofang'
      "
      @click="changemode()"
    ></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      currentTime: 0,
      duration: 0,
      mode: 0
    };
  },
  mounted() {
    let _this = this;
    const icon = this.$refs.icon;
    const bar = this.$refs.bar;
    let x;
    let value; //存储音乐进度
    // let offsetLeft = icon.offsetLeft; //offsetLeft表示起始时滑块的left值,写在这里下面获取不到值
    // console.log(offsetLeft);
    const progress_bar = this.$refs.progress_bar;
    const W = parseInt(getComputedStyle(progress_bar, null)["width"]); //500px，带单位;表示进度条的总长度
    icon.addEventListener("mousedown", ev => {
      //两种写法都可以
      // icon.onmousedown = function(ev) {
      //导致this的不是指向vue实例,const progress_bar = this.$refs.progress_bar;报错
      //x为初始状态下鼠标与滑块坐标的差值
      x = ev.clientX - icon.offsetLeft;
      // console.log(x, ev.clientX, icon.offsetLeft);
      // console.log("拖动开始");

      // icon.addEventListener("mousemove", ev => {
      //出错,没法取消移动监听，导致一直跟着鼠标移动
      // document.addEventListener("mousemove", ev => {
      document.onmousemove = function(ev) {
        //简洁写法getComputedStyle
        //const progress_bar = this.$refs.progress_bar;
        // const W = parseInt(progress_bar.style.width); //结果为""???,获取行内样式,可以设置行内样式
        // console.log(W);
        if (ev.clientX - x >= 0 && ev.clientX - x <= W) {
          icon.style.left = ev.clientX - x + "px";
          bar.style.width = ev.clientX - x + "px";
        } else if (ev.clientX - x < 0) {
          icon.style.left = "0px";
          //设置进度条颜色
          bar.style.width = "0px";
        } else {
          icon.style.left = W + "px";
          //设置进度条颜色
          // console.log(bar.style);
          bar.style.width = progress_bar.style.width + "px";
        }
        value = parseInt(icon.style.left) / W;
        // console.log(
        //   _this.$refs.audio.currentTime,
        //   parseInt(_this.$refs.audio.duration * value),
        //   value
        // );
        // _this.$refs.audio.currentTime = parseInt(
        //   _this.$refs.audio.duration * value
        // );
      };
      //鼠标按键抬起时，取消绑定的事件
      document.onmouseup = function() {
        /*下面的写法不可行，导致鼠标释放按键之后，在页面任意位置点击都触发当前事件,
        document.onmouseup = null;不能实现取消事件的监听
      */
        // document.addEventListener("mouseup", () => {
        // console.log(icon.style.left);
        //设置进度条颜色
        // bar.style.width = parseInt(icon.style.left) + "px";
        //设置进度
        //报错， Computed property "progress" was assigned to but it has no setter.
        // _this.progress =
        //   parseInt(icon.style.left) / parseInt(progress_bar.style.width);
        //progress_bar.style.width为空'',???
        // console.log(_this.progress, icon.style.left, progress_bar.style.width);
        // console.log(parseInt(icon.style.left) / W);
        // let value = parseInt(icon.style.left) / W;
        // _this.$store.commit({
        //   type: "setProgress",
        //   value
        // });

        _this.$refs.audio.currentTime = parseInt(
          _this.$refs.audio.duration * value
        );
        // this.$refs.audio.currentTime = parseInt(
        //   this.$refs.audio.duration * value
        // );
        // console.log(
        //   _this.$refs.audio.currentTime,
        //   parseInt(_this.$refs.audio.duration * value),
        //   value
        // );
        // console.log(this);//VueComponent

        // icon.onmousedown = null;
        // icon.addEventListener("mousedown", null);
        //icon.removeEventListener("mousedown", null, false);

        document.onmousemove = null;
        // document.addEventListener("mousemove", null);
        //document.removeEventListener("mousemove", null, false);

        document.onmouseup = null;
        document.addEventListener("mouseup", null);
        //将鼠标抬起时取消对事件的捕获
        icon.releaseCapture && icon.releaseCapture();
      };
      //当我们拖拽一个网页中内容时，浏览器会默认去搜素引擎中搜索内容，此时会导致拖拽功能的异常，这是浏览器的默认行为，如果不希望发生这个行为，可以通过return false来取消这种行为
      return false;
    });

    this.$refs.audio.addEventListener("canplay", () => {
      this.duration = this.$refs.audio.duration;
    });

    this.$refs.audio.addEventListener("timeupdate", () => {
      this.currentTime = this.$refs.audio.currentTime;
    });
  },
  // 使用过滤器
  filters: {
    //格式化时间
    formatTime(value) {
      // console.log(150 / 60);//2.5
      //console.log(150 % 60);//30
      let mins = Math.floor(value / 60);
      // console.log(typeof mins);//number
      // let secend = value % 60;//得到的余数时小数
      let secend = Math.floor(value % 60);
      secend = secend >= 10 ? secend : "0" + secend;
      return `${mins}:${secend}`;
    }
  },
  computed: {
    play: {
      get() {
        this.$nextTick(() => {
          if (this.$store.state["play"]) {
            this.$refs.audio.play();
          } else {
            this.$refs.audio.pause();
          }
        });
        return this.$store.state["play"];
      },
      set(value) {
        // this.$store.dispatch("changePlayState",value);
        this.$store.commit({
          type: "changePlayState",
          value
        });
        if (value) {
          this.$refs.audio.play();
        }
      }
    },
    currentMusic: {
      get() {
        //处理正在播放时，直接点击其他歌曲;歌曲改变时触发
        if (this.play) {
          this.$nextTick(() => {
            this.$refs.audio.play();
          });
        }
        return this.$store.state["currentMusic"];
      },
      set(value) {}
    },
    artists() {
      //显示歌手姓名
      //判断仓库中currentMusic是否为空{},不能使用this.currentMusic.artists !== {}
      // if (this.currentMusic.artists !== undefined) {
      let artists = "";
      // if (this.currentMusic.artists !== undefined) {
      //   if (this.currentMusic.artists.length !== 1) {
      //     //歌手不止一位的情况
      //     artists = this.currentMusic.artists.reduce((x, artist) => {
      //       // console.log(artists);
      //       //注意返回的是一个字符串没有artistName属性
      //       // return x.artistName + "/" + artist.artistName;
      //       return x + "/" + artist.artistName;
      //       // x + "/" + artist.artistName;注意return不写会出错，但控制台没有显示
      //     }, "");
      //   } else {
      //     artists = this.currentMusic.artists[0].artistName;
      //   }
      // }
      //第二种方法
      if (this.currentMusic.artists !== undefined) {
        artists = this.currentMusic.artists
          .map(item => item.artistName)
          .join("/");
        // console.log(artists);
      }
      return artists;
    }
    // progress: {
    //   get() {
    //     // console.log(this.currentTime / this.duration);
    //     // bar.style.width =
    //     //   (this.currentTime / this.duration) *
    //     //   parseInt(progress_bar.style.width);
    //     let progress2 = this.currentTime / this.duration;

    //     // computed是惰性求值，即仅仅定义computed的话是没有进行计算属性count的依赖收集（可以类似看成data中的数值，仅仅进行了响应式get,set的定义，并没有触发dep.depend,所以当值发生变化的时候，他并不知道要通知谁，也就不会执行相应的回调函数了；还有就是计算属性的更新，其实就是执行this.get()，就会触发计算属性的function)
    //     // console.log(progress2);

    //     //在这里this.$refs.progress_bar.style.width为''
    //     // console.log(progress2, this.$refs.progress_bar.style.width);
    //     //console.log(W);//W is not defined

    //     //出错
    //     // let w = parseInt(getComputedStyle(progress_bar, null)["width"]);
    //     // this.$refs.icon.style.left = progress * w;
    //     // this.$refs.bar.style.width = progress * w;
    //     return progress2;
    //   },
    //   // 数据更新时，不会执行（计算属性的惰性）
    //   set(value) {
    //     console.log(value);
    //     // this.$store.dispatch("setProgress", value);
    //     // this.$store.commit({
    //     //   type: "setProgress",
    //     //   value
    //     // });
    //   }
    // }
    // progress() {
    //   // this.$refs.audio.currentTime = parseInt(
    //   //   this.$refs.audio.duration * value
    //   // );//报错
    //   return this.$store.state.progress;
    // }
  },
  methods: {
    changeAction() {
      this.play = !this.play;
      // console.log(this.play);
    },
    previousSong() {
      this.$store.commit({
        type: "perviousSong"
      });
    },
    nextSong() {
      this.$store.commit({
        type: "nextSong"
      });
    },
    changemode() {
      let value = (this.mode = (this.mode + 1) % 3);
      this.$store.commit({
        type: "setMode",
        value: value
      });
    }
  },
  watch: {
    //监视progress的变化
    currentTime: {
      handler() {
        let w = parseInt(
          getComputedStyle(this.$refs.progress_bar, null)["width"]
        );
        // console.log(w);
        this.$refs.icon.style.left =
          (this.currentTime / this.duration) * w + "px";
        this.$refs.bar.style.width =
          (this.currentTime / this.duration) * w + "px";

        let value = this.currentTime / this.duration;
        // console.log(this.currentTime / this.duration);
        if (value === 1) {
          if (this.mode === 1) {
            // this.$refs.audio.load();
            this.$refs.audio.play();
          } else {
            this.$store.commit({
              type: "nextSong"
            });
          }
        } else {
          this.$store.commit({
            type: "setProgress",
            value,
            currentTime: this.currentTime
          });
        }
      }
    }
  }
};
</script>
<style scoped>
.foot_player {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px;
  border-radius: 0 0 10px 10px;
  background-color: #f1f3f4;
}
.foot_player > div {
  float: left;
}
.play_icon {
  width: 155px;
  height: 60px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.play_icon div {
  width: 25px;
  height: 25px;
  font-size: 16px;
  border: 2px solid black;
  border-radius: 18px;
  text-align: center;
}
.play_icon div::before {
  line-height: 25px;
}
.play_icon .icon-zanting,
.play_icon .icon-bofang {
  width: 30px;
  height: 30px;
  font-size: 20px;
}
.play_icon .icon-zanting::before {
  line-height: 30px;
  margin-left: 2px;
}
.play_icon .icon-bofang::before {
  line-height: 30px;
  margin-left: -2px;
}
.progress img {
  float: left;
  width: 40px;
  margin: 10px;
}
.progress > div {
  float: left;
}
.progress .songMsg {
  width: 450px;
  margin-top: 10px;
  color: #9b9b9b;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.songMsg .songName {
  margin-right: 10px;
  color: black;
}
.progress_bar {
  position: relative;
  width: 450px;
  height: 7px;
  margin-top: 7px;
  border: 1px solid black;
  border-radius: 5px;
  background: #c4c4c4;
}
.progress_bar .bar {
  width: 0px;
  height: 7px;
  border-radius: 5px;
  background: white;
}
.progress_bar .icon {
  position: absolute;
  left: 0px;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 4px;
  height: 4px;
  border-radius: 8px;
  border: 6px solid black;
  background: white;
}
.time {
  margin: 30px 10px 0;
}
.mode {
  position: absolute;
  right: 55px;
  top: 20px;
  font-size: 30px;
}
.icon-shunxubofang {
  top: 24px;
  font-size: 25px;
}
</style>
