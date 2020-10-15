<template>
  <div class="zy-film">
    <div class="header">
      <div class="zy-select film-site" @mouseleave="show.site = false">
        <div class="select-placeholder" @click="show.site = !show.site">OK资源网</div>
        <transition name="AniSlideUp">
          <div class="select-list zy-scrollbar" v-show="show.site">
            <ul>
              <li class="active" @click="filmSiteClick()">OK资源网</li>
              <li>最大资源网</li>
              <li>卧龙资源网</li>
            </ul>
          </div>
        </transition>
      </div>
      <div class="zy-select film-class" @mouseleave="show.class = false">
        <div class="select-placeholder" @click="show.class = !show.class">最新</div>
        <transition name="AniSlideUp">
          <div class="select-list zy-scrollbar" v-show="show.class">
            <ul>
              <li class="active" @click="filmClassClick()">最新</li>
              <li>动作片</li>
              <li>卧龙资源网</li>
            </ul>
          </div>
        </transition>
      </div>
    </div>
    <div class="body zy-scrollbar">
      <div class="wrapper">
        <div v-for="i in 50" :key="i">laaldfa</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Film',
  data () {
    return {
      show: {
        site: false,
        class: false
      }
    }
  },
  methods: {
    filmSiteClick () {},
    filmClassClick () {}
  }
}
</script>
<style lang="scss" scoped>
.zy-film{
  flex: 1;
  margin: 0 10px 20px 0;
  border-radius: 6px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  .header{
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .film-class{
      margin-left: 20px;
    }
  }
  .body{
    flex: 1;
    position: relative;
    overflow: hidden;
    margin: 10px 10px 0;
    &:hover{
      overflow: auto;
    }
    .wrapper{
      position: absolute;
    }
  }
}
</style>
