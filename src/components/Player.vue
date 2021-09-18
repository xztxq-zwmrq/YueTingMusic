<template>
  <!-- 播放器主体区域 -->
  <div class="play_wrap">
    <SearchBar />
    <div class="content">
      <SongList />
      <PlayerIcon />
      <Lyric />
    </div>
    <PlayerBar />
  </div>
</template>

<script>
import SearchBar from "./SearchBar";
import SongList from "./SongList";
import PlayerIcon from "./PlayerIcon";
import PlayerBar from "./PlayerBar";
import Lyric from "./Lyric";
export default {
  name: "Player",
  data() {
    return {};
  },
  components: {
    SearchBar,
    SongList,
    PlayerIcon,
    PlayerBar,
    Lyric
  },
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.play_wrap {
  position: fixed;
  width: 850px;
  height: 500px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}
</style>
