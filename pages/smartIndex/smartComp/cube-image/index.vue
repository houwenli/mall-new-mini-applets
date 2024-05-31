<template>
  <view class="group-panel" :style="[getStyle]">
    <view class="title" v-if="config.hasBackground === '1' && config.showComTitle === '1'">{{ config.comTitle }}</view>
    <!-- 小程序暂时不支持 动态组件 -->
    <style1 v-if="Number(config.style) === 1" :config="config" />
    <style2 v-if="Number(config.style) === 2" :config="config" />
    <style3 v-if="Number(config.style) === 3" :config="config" />
    <style4 v-if="Number(config.style) === 4" :config="config" />
    <style5 v-if="Number(config.style) === 5" :config="config" ></style5>
  </view>
</template>

<script>
import style1 from './style-1.vue'
import style2 from './style-2.vue'
import style3 from './style-3.vue'
import style4 from './style-4.vue'
import style5 from './style-5.vue'
// 魔方图片
export default {
  name: 'CubuImage',
  components: {
    style1,
    style2,
    style3,
    style4,
    style5
  },
  props: {
    config: {
      type: Object,
      default: () => { }
    }
  },
  computed: {
      getStyle() {
        let styles = {}
        // 没有背景
        if (this.config.hasBackground === '0') {
          return {
            padding: '0px',
          }
        }
        //图背景高度
        // let height = this.config.style === 4 ? '126px' : '154px'

        if (String(this.config.backgroundType) === '0') {
          styles.background = this.config.bgColor || '#FFF'
          // styles.height = height
        }

        if (String(this.config.backgroundType) === '1') {
          // styles.height = height
          if(this.config.bgImage){
            styles.backgroundImage = `url(${this.config.bgImage})`
            styles.backgroundRepeat = 'no-repeat'
            styles.backgroundSize = '100% 100%'
          }else{
            styles.background = '#FFF'
          }
        }

        return styles
      }
    },

}
</script>

<style lang="less" scoped>
.group-panel {
  margin: 0 16rpx;
  border-radius: 24rpx;
  padding: 16rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  .title {
    font-size: 30rpx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #222222;
    margin-bottom: 16rpx;

  }
}
</style>