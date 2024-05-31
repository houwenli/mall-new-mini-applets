<template>
  <view class="group-panel" :style="[getStyle]">
    <view
      class="title"
      v-if="config.hasBackground === '1'"
      >
	  <block v-if="config.showComTitle === '1'">{{ config.comTitle }}</block>
	  </view
    >   
    <!-- 小程序暂时不支持 动态组件 -->
    <style1 v-if="config.text === '单列图'" :config="configData" />
    <style2 v-if="config.text === '双列图'" :config="configData" />
    <style3 v-if="config.text === '三列图'" :config="configData" />
    <style4 v-if="config.text === '四列图'" :config="configData" />
  </view>
</template>

<script>
// 1-4列图
import style1 from './style-1.vue';
import style2 from './style-2.vue';
import style3 from './style-3.vue';
import style4 from './style-4.vue';

export default {
  name: 'groupImage',
  components: {
    style1,
    style2,
    style3,
    style4,
  },
  props: {
    config: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  computed: {
    // 浅拷贝 几列图截取几
    configData() {
      let style = {
        '单列图': 1,
        '双列图': 2,
        '三列图': 3,
        '四列图': 4        
      }
      let data =  this.config.text === '单列图' ? this.config.list.slice(0, style[this.config.text]) : this.config.list;
      let obj = {
        ...this.config,
        list: data,
      };
      return obj;
    },
    getStyle() {
      let styles = {};
      // 没有背景
      if (this.config.hasBackground === '0') {
        return {
          padding: '0px',
        };
      }

      if (this.config.backgroundType === '0') {
        styles.background = this.config.bgColor || '#FFF';
      }

      if (this.config.backgroundType === '1') {
        if (this.config.bgImage) {
          styles.backgroundImage = `url(${this.config.bgImage})`;
          styles.backgroundRepeat = 'no-repeat';
          styles.backgroundSize = '100% 100%';
        } else {
          styles.background = '#FFF';
        }
      }

      return styles;
    },
  },
};
</script>

<style lang="less" scoped>
.group-panel {
  margin: 0 16rpx;
  border-radius: 24rpx;
  padding: 20rpx 16rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  .title {
	  height: 38rpx;
    font-size: 30rpx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #222222;
    margin-bottom: 16rpx;
  }
}
</style>
