<template>
  <div class="aside">
    <span :class="[view === 'Film' ? 'active ': ''] + 'zy-svg'" @click="changeView('Film')">
      <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="apertureIconTitle">
        <title id="apertureIconTitle">view</title>
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"></path>
        <g stroke-linecap="round">
          <path d="M3 16H14.3164"></path>
          <path d="M4.03589 6.20575L9.68257 15.9861"></path>
          <path d="M13.0359 2.20575L7.37891 12.004"></path>
          <path d="M10.9641 21.7942L16.6146 12.0074"></path>
          <path d="M19.9641 17.7942L14.3086 7.99866"></path>
          <path d="M21 7.98721H9.71844"></path>
        </g>
      </svg>
    </span>
    <span :class="[view === 'Play' ? 'active ': ''] + 'zy-svg'" @click="changeView('Play')">
      <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="playIconTitle">
        <title id="playIconTitle">play</title>
        <path d="M20 12L5 21V3z"></path>
      </svg>
    </span>
    <span :class="[view === 'Star' ? 'active ': ''] + 'zy-svg'" @click="changeView('Star')">
      <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="favouriteIconTitle">
        <title id="favouriteIconTitle">star</title>
        <path d="M12,21 L10.55,19.7051771 C5.4,15.1242507 2,12.1029973 2,8.39509537 C2,5.37384196 4.42,3 7.5,3 C9.24,3 10.91,3.79455041 12,5.05013624 C13.09,3.79455041 14.76,3 16.5,3 C19.58,3 22,5.37384196 22,8.39509537 C22,12.1029973 18.6,15.1242507 13.45,19.7149864 L12,21 Z"></path>
      </svg>
    </span>
    <span :class="[view === 'Setting' ? 'active ': ''] + 'zy-svg'" @click="changeView('Setting')">
      <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-labelledby="settingsIconTitle">
        <title id="settingsIconTitle">setting</title>
        <path d="M5.03506429,12.7050339 C5.01187484,12.4731696 5,12.2379716 5,12 C5,11.7620284 5.01187484,11.5268304 5.03506429,11.2949661 L3.20577137,9.23205081 L5.20577137,5.76794919 L7.9069713,6.32070904 C8.28729123,6.0461342 8.69629298,5.80882212 9.12862533,5.61412402 L10,3 L14,3 L14.8713747,5.61412402 C15.303707,5.80882212 15.7127088,6.0461342 16.0930287,6.32070904 L18.7942286,5.76794919 L20.7942286,9.23205081 L18.9649357,11.2949661 C18.9881252,11.5268304 19,11.7620284 19,12 C19,12.2379716 18.9881252,12.4731696 18.9649357,12.7050339 L20.7942286,14.7679492 L18.7942286,18.2320508 L16.0930287,17.679291 C15.7127088,17.9538658 15.303707,18.1911779 14.8713747,18.385876 L14,21 L10,21 L9.12862533,18.385876 C8.69629298,18.1911779 8.28729123,17.9538658 7.9069713,17.679291 L5.20577137,18.2320508 L3.20577137,14.7679492 L5.03506429,12.7050339 Z"></path>
        <circle cx="12" cy="12" r="1"></circle>
      </svg>
    </span>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  name: 'Aside',
  computed: {
    view: {
      get () {
        return this.$store.getters.getView
      },
      set (val) {
        this.SET_VIEW(val)
      }
    }
  },
  methods: {
    ...mapMutations(['SET_VIEW']),
    changeView (e) {
      this.view = e
    }
  }
}
</script>
<style lang="scss" scoped>
.aside{
  width: 60px;
  height: 100%;
  display: flex;
  user-select: none;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  -webkit-app-region: drag;
  span{
    width: 60px;
    height: 60px;
    cursor: pointer;
    -webkit-app-region: no-drag;
  }
}
</style>
