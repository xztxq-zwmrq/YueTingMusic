import Vuex from 'vuex';
import Vue from 'vue';
import axios from "axios";

Vue.use(Vuex);
const state = {
  songList: [],
  play: false,
  // currentMusic: null,//出错
  currentMusic: {},
  //图片src为变量，如果使用本地图片，则需要将图片文件放在static文件夹下
  currentUrl: "../../static/cover.png",
  currentIndex: -1,
  progress: 0,
  //播放模式,0表示顺序播放；1表示循环播放；2表示随机播放
  mode: 0,
  playList: [],
  lyric: [],
  currentTime: 0,
};
const getters = {

};
const actions = {
  setSongList ({ commit }, songList) {
    commit("SET_SONG_LIST", songList);
  },
  // setProgress ({ commit }, value) {
  //   commit("SET_PROGRESS", value);
  // }
};
const mutations = {
  SET_SONG_LIST (state, songList) {
    state.songList = state.playList = songList;
  },
  changePlayState (state, payload) {
    state.play = payload.value;
  },
  setCurrentMusic (state, payload) {
    state.currentMusic = payload.value;
    // const _state = state;
    // https://autumnfish.cn/album?id=${state.currentMusic.album.albumId}
    axios
      .get(
        `http://localhost:3000/album?id=${state.currentMusic.album.albumId}`
      )
      .then(
        value => {
          state.currentUrl = value.data.songs[0].al.picUrl;
        },
        reason => {
          console.log(reason);
        }
      );
    //设置当前音乐下标index
    // state.currentIndex = payload.index;
    state.playList.forEach((element, index) => {
      if (element.id === state.currentMusic.id) {
        state.currentIndex = index;
      }
    });
    //设置歌词
    (async function () {
      let result = await axios.get(
        `http://localhost:3000/lyric?id=${state.currentMusic.id}`
      );
      // console.log(result.data.lrc.lyric, result);
      state.lyric = state.lyric === [] ? state.lyric : [];
      let str = result.data.lrc.lyric;
      const reg = /\[(.*?)\](.*)/g;
      while ((result = reg.exec(str))) {
        // console.log(result);
        state.lyric.push({ time: result[1], content: result[2] });
      }
      // console.log(state.lyric);
    })();
  },
  // SET_PROGRESS (state, value) {
  //   state.progress = value;
  // }
  setProgress (state, payload) {
    state.progress = payload.value;
    state.currentTime = payload.currentTime;
  },
  async nextSong (state) {
    if (state.currentIndex === state.playList.length - 1) {
      //避免点击下一首,而恰好当前歌曲为最后一首时出现停止
      if (state.progress >= 0.999)
        state.play = false;
    } else {
      state.currentIndex += 1;
      state.currentMusic = state.playList[state.currentIndex];
      let result = await axios
        .get(
          `http://localhost:3000/album?id=${state.currentMusic.album.albumId}`
        );
      // console.log(result);
      state.currentUrl = result.data.songs[0].al.picUrl;
      // state.progress = 0;
      //设置歌词
      (async function () {
        let result = await axios.get(
          `http://localhost:3000/lyric?id=${state.currentMusic.id}`
        );
        // console.log(result.data.lrc.lyric, result);
        state.lyric = state.lyric === [] ? state.lyric : [];
        let str = result.data.lrc.lyric;
        const reg = /\[(.*?)\](.*)/g;
        while ((result = reg.exec(str))) {
          // console.log(result);
          state.lyric.push({ time: result[1], content: result[2] });
        }
        // console.log(state.lyric);
      })();
    }
  },
  async perviousSong (state) {
    if (state.currentIndex === 0) {
      // state.play = false;
    } else {
      state.currentIndex -= 1;
      state.currentMusic = state.playList[state.currentIndex];
      let result = await axios
        .get(
          `http://localhost:3000/album?id=${state.currentMusic.album.albumId}`
        );
      // console.log(result);
      state.currentUrl = result.data.songs[0].al.picUrl;
      // state.progress = 0;
    }
  },
  setMode (state, payload) {
    state.mode = payload.value;
    if (state.mode === 2) {
      //生成随机音乐列表
      state.playList = [];
      state.songList.forEach((item, index) => {
        let val = Math.floor(Math.random() * (index + 1));
        if (val !== index) {
          state.playList[index] = state.playList[val];
          state.playList[val] = item;
        } else {
          state.playList[index] = item;
        }
      });
      // console.log(state.playList);
    } else {
      state.playList = state.songList;
    }
    state.playList.forEach((element, index) => {
      if (element.id === state.currentMusic.id) {
        state.currentIndex = index;
      }
    });
  }
};
export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
})