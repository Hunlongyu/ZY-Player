<template>
  <div class="frame">
    <div class="left"></div>
    <div class="middle">
      <span class="btn lock" @click="lockBtnClick()">
        <IconLock v-show="lock" class="icon" />
        <IconLockOpen v-show="!lock" class="icon" />
      </span>
      <span class="btn bell">
        <IconBell class="icon" />
      </span>
      <div class="search">
        <span class="btn" @click="searchBtnClick()">
          <IconSearch :class="[search ? 'active ' : ''] + 'icon'" />
        </span>
        <transition name="slide">
          <input v-if="search" v-model.trim="searchTxt" ref="searchInput" autocomplete="off" class="search-input" type="text">
        </transition>
        <transition name="rotate">
          <IconClose v-if="searchTxt.length > 0" class="icon icon-search-close" @click="clearSearchTxt()" />
        </transition>
        <transition name="fade">
          <div class="search-box">
            <ul>
              <li>lala</li>
              <li>蝙蝠侠</li>
              <li>蜘蛛侠</li>
              <li>钢铁侠钢铁侠钢铁侠钢铁侠</li>
              <li class="clear"><IconBin class="icon icon-bin" />清空搜索记录</li>
            </ul>
          </div>
        </transition>
      </div>
    </div>
    <div class="right">
      <span class="btn min">
        <IconMin class="icon" />
      </span>
      <span class="btn max">
        <IconMax class="icon" />
      </span>
      <span class="btn close">
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
      lock: false,
      search: false,
      searchTxt: ''
    }
  },
  methods: {
    lockBtnClick () {
      this.lock = !this.lock
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
    }
  }
}
</script>
<style lang="scss" scoped>
.frame{
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  -webkit-app-region: drag;
  .left{
    height: 100%;
    width: 80px;
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
        // background-color: #f2f6f9;
        .icon{
          width: 20px;
          height: auto;
          stroke-width: 3px;
          stroke: #808695;
        }
      }
    }
    .lock{
      &:hover{
        .icon{
          animation: shake-bottom 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
          @keyframes shake-bottom {
            0%,
            100% {
              transform: rotate(0deg);
              transform-origin: 50% 100%;
            }
            10% {
              transform: rotate(2deg);
            }
            20%,
            40%,
            60% {
              transform: rotate(-4deg);
            }
            30%,
            50%,
            70% {
              transform: rotate(4deg);
            }
            80% {
              transform: rotate(-2deg);
            }
            90% {
              transform: rotate(2deg);
            }
          }
        }
      }
    }
    .bell{
      &:hover{
        .icon{
          animation: shake-top 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
          @keyframes shake-top {
            0%,
            100% {
              transform: rotate(0deg);
              transform-origin: 50% 0;
            }
            10% {
              transform: rotate(2deg);
            }
            20%,
            40%,
            60% {
              transform: rotate(-4deg);
            }
            30%,
            50%,
            70% {
              transform: rotate(4deg);
            }
            80% {
              transform: rotate(-2deg);
            }
            90% {
              transform: rotate(2deg);
            }
          }
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
            @keyframes shake-br {
              0%,
              100% {
                transform: rotate(0deg);
                transform-origin: 100% 100%;
              }
              10% {
                transform: rotate(2deg);
              }
              20%,
              40%,
              60% {
                transform: rotate(-4deg);
              }
              30%,
              50%,
              70% {
                transform: rotate(4deg);
              }
              80% {
                transform: rotate(-2deg);
              }
              90% {
                transform: rotate(2deg);
              }
            }
          }
        }
        .active{
          stroke-width: 3px;
          stroke: #808695;
        }
      }
      .search-input{
        position: absolute;
        left: 40px;
        -webkit-app-region: no-drag;
        height: 30px;
        border: none;
        outline: none;
        width: 180px;
        padding-left: 4px;
        padding-right: 20px;
        color: #808695;
        border-bottom: 1px solid #823aa0;
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
        top: 50px;
        width: 180px;
        height: 140px;
        overflow: auto;
        border: 1px solid #e661eb;
        ul{
          list-style: none;
          margin: 0;
          padding: 0;
          li{
            cursor: pointer;
            font-size: 14px;
            padding: 6px 10px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            &:hover{
              background-color: #f2f6f9;
            }
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
      .slide-enter-active, .slide-leave-active{
        transition: all 0.5s ease-in-out;
      }
      .slide-enter, .slide-leave-to{
        transform: translateX(50%);
        opacity: 0;
      }
      .rotate-enter-active, .rotate-leave-active{
        transition: all 0.5s ease-in-out;
      }
      .rotate-enter, .rotate-leave-to{
        transform: rotate(-180deg);
        opacity: 0;
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
        background-color: #f2f6f9;
        .icon{
          stroke-width: 3px;
          stroke: #808695;
        }
      }
      &.close{
        &:hover{
          .icon{
            stroke: red;
          }
        }
      }
    }
  }
  .icon{
    width: 20px;
    height: auto;
    stroke: #823aa0;
  }
}
</style>
