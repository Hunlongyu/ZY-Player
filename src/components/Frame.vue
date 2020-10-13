<template>
  <div class="zy-frame">
    <div class="left"></div>
    <div class="middle">
      <span class="btn lock" @click="frameClickEvent('top')" title="置顶">
        <IconLock v-show="isTop" class="icon" />
        <IconLockOpen v-show="!isTop" class="icon" />
      </span>
      <span class="btn bell" title="消息">
        <IconBell class="icon" />
      </span>
      <div class="search" title="搜索">
        <span class="btn" @click="searchBtnClick()">
          <IconSearch :class="[search ? 'active ' : ''] + 'icon'" />
        </span>
        <transition name="AniSlideRight">
          <input
            v-if="search"
            v-model.trim="searchTxt"
            ref="searchInput"
            autocomplete="off"
            class="search-input"
            @keyup.enter="searchEvent()"
            type="text">
        </transition>
        <transition name="AniRotate">
          <IconClose v-if="searchTxt.length > 0" class="icon icon-search-close" @click="clearSearchTxt()" />
        </transition>
        <transition name="AniSlideUp">
          <div v-if="search" class="search-box zy-scrollbar">
            <ul>
              <li v-for="(i, j) in searchHistoryList" :key="j" @click="searchHistoryClick(i)">{{i}}</li>
              <li class="clear" v-if="searchHistoryList.length >= 1" @click="clearSearchHistory()"><IconBin class="icon icon-bin" />清空搜索记录</li>
            </ul>
          </div>
        </transition>
      </div>
    </div>
    <div class="right">
      <span class="btn min" @click="frameClickEvent('min')">
        <IconMin class="icon" />
      </span>
      <span class="btn max" @click="frameClickEvent('max')">
        <IconMax class="icon" />
      </span>
      <span class="btn close" @click="frameClickEvent('close')">
        <IconClose class="icon" />
      </span>
    </div>
  </div>
</template>
<script>
import IconMin from '../assets/img/ikonate/minus.svg'
import IconMax from '../assets/img/ikonate/plus.svg'
import IconClose from '../assets/img/ikonate/close.svg'
import IconSearch from '../assets/img/ikonate/search.svg'
import IconLock from '../assets/img/ikonate/lock.svg'
import IconLockOpen from '../assets/img/ikonate/lock-open.svg'
import IconBell from '../assets/img/ikonate/bell.svg'
import IconBin from '../assets/img/ikonate/bin.svg'
const remote = require('electron').remote
const win = remote.getCurrentWindow()
export default {
  name: 'frame',
  components: {
    IconMin,
    IconMax,
    IconClose,
    IconSearch,
    IconLock,
    IconLockOpen,
    IconBell,
    IconBin
  },
  data () {
    return {
      isTop: win.isAlwaysOnTop(),
      search: false,
      searchTxt: '',
      searchHistoryList: [
        '钢铁侠钢铁侠钢铁侠钢铁侠',
        '钢铁侠钢铁侠钢铁侠钢铁侠',
        '钢铁侠钢铁侠钢铁侠钢铁侠',
        '钢铁侠钢铁侠钢铁侠钢铁侠',
        '钢铁侠钢铁侠钢铁侠钢铁侠',
        '钢铁侠钢铁侠钢铁侠钢铁侠',
        '钢铁侠钢铁侠钢铁侠钢铁侠',
        '钢铁侠钢铁侠钢铁侠钢铁侠'
      ]
    }
  },
  methods: {
    frameClickEvent (e) {
      if (e === 'top') {
        this.isTop = !this.isTop
        win.setAlwaysOnTop(this.isTop)
      }
      if (e === 'min') {
        win.minimize()
      }
      if (e === 'max') {
        win.isMaximized() ? win.unmaximize() : win.maximize()
      }
      if (e === 'close') {
        win.destroy()
      }
    },
    searchBtnClick () {
      this.search = !this.search
      const timer = setTimeout(() => {
        if (this.search) {
          this.$refs.searchInput.focus()
        }
        clearTimeout(timer)
      }, 600)
    },
    clearSearchTxt () {
      this.searchTxt = ''
      this.search = false
    },
    searchEvent () {},
    searchHistoryClick (e) {},
    clearSearchHistory () {}
  }
}
</script>
<style lang="scss" scoped>
.zy-frame{
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  -webkit-app-region: drag;
  .left{
    height: 100%;
    width: 60px;
  }
  .middle{
    height: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .btn{
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 100%;
      text-align: center;
      cursor: pointer;
      -webkit-app-region: no-drag;
      &:hover{
        .icon{
          width: 20px;
          height: auto;
          stroke-width: 3px;
        }
      }
    }
    .lock{
      &:hover{
        .icon{
          animation: shake-bottom 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
        }
      }
    }
    .bell{
      &:hover{
        .icon{
          animation: shake-top 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
        }
      }
    }
    .search{
      height: 100%;
      display: flex;
      position: relative;
      justify-content: center;
      align-items: center;
      .btn{
        width: 60px;
        &:hover{
          .icon{
            animation: shake-br 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
          }
        }
        .active{
          stroke-width: 3px;
        }
      }
      .search-input{
        position: absolute;
        left: 40px;
        height: 30px;
        outline: none;
        width: 180px;
        padding-left: 4px;
        padding-right: 20px;
        -webkit-app-region: no-drag;
      }
      .icon-search-close{
        position: absolute;
        cursor: pointer;
        -webkit-app-region: no-drag;
        left: 200px;
      }
      .search-box{
        position: absolute;
        left: 40px;
        top: 40px;
        width: 180px;
        height: auto;
        max-height: 172px;
        overflow-y: hidden;
        z-index: 3;
        &:hover{
          overflow-y: auto;
        }
        ul{
          list-style: none;
          margin: 0;
          padding: 0;
          width: 180px;
          li{
            cursor: pointer;
            font-size: 14px;
            padding: 6px 10px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .clear{
            display: flex;
            align-items: center;
            justify-content: center;
            .icon-bin{
              margin-right: 4px;
            }
          }
        }
      }
    }
  }
  .right{
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .btn{
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 100%;
      text-align: center;
      cursor: pointer;
      -webkit-app-region: no-drag;
      &:hover{
        .icon{
          stroke-width: 3px;
        }
      }
    }
  }
  .icon{
    width: 20px;
    height: auto;
  }
}
</style>
