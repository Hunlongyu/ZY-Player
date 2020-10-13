<template>
  <div class="zy-film">
    <div class="header">
      <div class="btn-select" @mouseleave="show.site = false">
        <div class="btn-placeholder" @click="show.site = true">OK资源网</div>
        <transition name="AniSlideUp">
          <div class="btn-list zy-scrollbar" v-show="show.site">
            <ul>
              <li>OK资源网</li>
              <li>最大资源网</li>
              <li>卧龙资源网</li>
            </ul>
          </div>
        </transition>
      </div>
    </div>
    <div class="body"></div>
  </div>
</template>
<script>
export default {
  name: 'Film',
  data () {
    return {
      show: {
        site: false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.zy-film{
  flex: 1;
  margin: 0 10px 10px 0;
  border-radius: 6px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  .header{
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .btn-select{
      width: 180px;
      height: 34px;
      cursor: pointer;
      position: relative;
      font-size: 14px;
      margin-left: 10px;
      .btn-placeholder{
        width: 180px;
        height: 34px;
        line-height: 34px;
        padding-left: 10px;
      }
      .btn-list{
        width: 180px;
        position: absolute;
        top: 34px;
        left: 0;
        z-index: 2;
        max-height: 340px;
        overflow: hidden;
        &:hover{
          overflow: auto;
        }
        ul{
          margin: 0;
          padding: 0;
          list-style: none;
          li{
            height: 34px;
            line-height: 34px;
            padding-left: 10px;
            &.active{}
          }
        }
      }
    }
  }
  .body{
    flex: 1;
    // border: 1px solid #000;
  }
}
</style>
