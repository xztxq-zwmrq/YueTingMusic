<template>
  <div class="search_bar">
    <img src="../assets/imgs/player_title.png" alt="" />
    <input
      type="text"
      placeholder="输入歌曲、歌手或MV"
      v-model="searchKey"
      @keyup.13="searchSong(searchKey)"
    />
    <!-- <input
      type="text"
      placeholder="输入歌曲、歌手或MV"
      v-model="searchKey"
      @keyup.13="searchSong(this.searchKey)"//这里不能加this
    /> -->
    <!-- 这里不能加this -->
    <!-- <div class="iconfont icon-sousuo" @click="searchSong(this.searchKey)"></div> -->
    <div class="iconfont icon-sousuo" @click="searchSong(searchKey)"></div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      searchKey: "",
      songList: []
    };
  },
  // beforeCreate() {
  //在组件实例创建之后获取歌手（张杰）对应的歌曲
  // created() {
  //   console.log("hello");
  //   this.searchSong("张杰");
  // },
  async created() {
    //获取推荐歌单
    let result = await axios.get("http://localhost:3000/personalized/newsong");
    let recommendList = result.data.result.map(item => ({
      id: item.id,
      name: item.name,
      artists: item.song.artists.map(artist => ({
        artistId: artist.id,
        artistName: artist.name
      })),
      album: {
        albumId: item.song.album.id,
        albumName: item.song.album.name,
        picId: item.song.album.picId
      },
      mvId: item.song.mvid,
      url: ""
    }));
    this.songList = recommendList;
    // console.log(recommendList);
    this.songList.forEach(function(item) {
      axios.get(`http://localhost:3000/song/url?id=${item.id}`).then(
        value => {
          item.url = value.data.data[0].url;
        },
        reason => {
          console.log(reason);
        }
      );
    });
    // console.log(this.songList);
  },
  methods: {
    // searchUrl(id) {
    //   let url = "";
    //   axios.get(`https://autumnfish.cn/song/url?id=${id}`).then(
    //     value => {
    //       url = value.data.data[0].url;
    //       // console.log(url);
    //       return url;
    //     },
    //     reason => {
    //       console.log(reason);
    //       return url;
    //     }
    //   );
    // },
    searchSong(searchKey) {
      // console.log(this.searchKey);
      ///comment/album?id=32311  /comment/playlist?id=705123491
      axios.get(`http://localhost:3000/search?keywords=${searchKey}`).then(
        value => {
          this.songList = value.data.result.songs.map(item => ({
            id: item.id,
            name: item.name,
            artists: item.artists.map(artist => ({
              artistId: artist.id,
              artistName: artist.name
            })),
            album: {
              albumId: item.album.id,
              albumName: item.album.name,
              picId: item.album.picId
            },
            mvId: item.mvid,
            url: ""
          }));
          // console.log(this.songList);
          this.songList.forEach(function(item) {
            // console.log(item);
            // item.url = axios
            axios.get(`http://localhost:3000/song/url?id=${item.id}`).then(
              value => {
                // let url = value.data.data[0].url;
                item.url = value.data.data[0].url;
                // console.log(item.url);
              },
              reason => {
                console.log(reason);
              }
            );
          });
          // this.$store.dispatch("setSongList", this.songList);//先于axios执行，导致url没有获取到
        },
        reason => {
          console.log(reason);
        }
      );
      // this.$store.dispatch("setSongList", this.songList);//这里会先于axios执行导致将空的数据存入了仓库
    }
  },
  // updated() {
  //   //没有办法监听到对象类型的数据更新
  //   console.log("he");
  //   this.$store.dispatch("setSongList", this.songList);
  // },
  watch: {
    songList: {
      deep: true,
      handler(newValue) {
        this.$store.dispatch("setSongList", newValue);
      }
    }
  }
};
</script>
<style scoped>
.search_bar {
  height: 60px;
  background-color: #1eacda;
  border-radius: 10px;
}
.search_bar img {
  margin: 20px;
}
.search_bar input {
  position: absolute;
  width: 300px;
  height: 36px;
  padding-left: 10px;
  top: 10px;
  right: 10px;
  border-radius: 10px;
  outline: none;
  background-color: rgba(255, 255, 255, 0.7);
}
.search_bar div {
  position: absolute;
  top: 18px;
  right: 20px;
  font-size: 20px;
  color: #a4a4a4;
}
</style>
