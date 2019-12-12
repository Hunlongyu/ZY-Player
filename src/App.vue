<template>
  <div id="app" :class="getTheme.color">
    <Layout class="box">
        <Sider class="sider" width="70"><ZYSider /></Sider>
        <Layout>
            <Header class="header"><ZYHeader /></Header>
            <Content class="content">
              <router-view />
            </Content>
        </Layout>
    </Layout>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import ZYSider from '@/components/zy_sider.vue'
import ZYHeader from '@/components/zy_header.vue'
import setting from './plugin/nedb/setting'
export default {
  name: 'app',
  data () {
    return {}
  },
  computed: {
    ...mapGetters([
      'getTheme'
    ])
  },
  components: {
    ZYSider,
    ZYHeader
  },
  methods: {
    ...mapActions([
      'changeTheme'
    ])
  },
  beforeCreate () {},
  created () {
    setting.find({ $or: [{ theme: 'light' }, { theme: 'dark' }] }).then(e => {
      if (e.length <= 0) {
        setting.add({ theme: 'light' }).then(res => {
          this.changeTheme({ id: res._id, color: res.theme })
        })
      } else {
        this.changeTheme({ id: e[0]._id, color: e[0].theme })
      }
    })
  }
}
</script>

<style lang="scss">
@import './assets/global/global.scss';
@import './assets/theme/dark.scss';
@import './assets/theme/light.scss';
html, body, #app, .box{
  height: 100%;
}
.box{
  .header{
    width: 100%;
    height: 50px;
    padding: 0;
  }
}
</style>
