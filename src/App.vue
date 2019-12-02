<template>
  <div id="app" :class="theme">
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
import ZYSider from '@/components/zy_sider.vue'
import ZYHeader from '@/components/zy_header.vue'
export default {
  name: 'app',
  data () {
    return {}
  },
  computed: {
    theme () {
      return this.$store.getters.getTheme
    }
  },
  components: {
    ZYSider,
    ZYHeader
  },
  methods: {}
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
