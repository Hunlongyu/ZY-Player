<template>
  <div id="app" :class="getTheme">
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
    // db.find('theme').then(e => {
    //   if (!e) {
    //     this.changeTheme('light')
    //   } else {
    //     this.changeTheme(e)
    //   }
    // })
  }
}
</script>

<style lang="scss">
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
