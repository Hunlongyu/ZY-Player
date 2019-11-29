<template>
  <div id="app" :class="theme">
    <Layout class="box">
        <Sider class="sider" width="70"><ZYSider /></Sider>
        <Layout>
            <Header class="header"><ZYHeader /></Header>
            <Content class="content">
              <ZYContent />
              <Row>
                <Button type="primary" @click="switchTheme('light')">light</Button>
                <Button type="primary" @click="switchTheme('dark')">Dark</Button>
              </Row>
            </Content>
        </Layout>
    </Layout>
  </div>
</template>
<script>
import ZYSider from '@/components/zy_sider.vue'
import ZYHeader from '@/components/zy_header.vue'
import ZYContent from '@/components/zy_content.vue'
export default {
  name: 'app',
  data () {
    return {
      theme: 'light'
    }
  },
  components: {
    ZYSider,
    ZYHeader,
    ZYContent
  },
  methods: {
    switchTheme (e) {
      this.theme = e
    }
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
