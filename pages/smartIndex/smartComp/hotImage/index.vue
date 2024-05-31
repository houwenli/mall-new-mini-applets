<template>

  <view class="group-panel" :style="[getStyle]">
    <view
      class="title"
      v-if="config.hasBackground === '1'">       
    </view >
   
    <!-- 小程序暂时不支持 动态组件 -->
    <style1 v-if="Number(config.style) === 1" :config="configData" />
    <style2 v-if="Number(config.style) === 2" :config="configData" />
    <style3 v-if="Number(config.style) === 3" :config="configData" />     
  </view>
   
  <!-- <hotStyle  :config="configData" /> -->
   

</template>

<script>

// import hotStyle from './hotStyle.vue';
// 1-4列图
import style1 from './style-1.vue';
import style2 from './style-2.vue';
import style3 from './style-3.vue';

export default {
  name: 'hotStyle',  
  components: {
    // hotStyle,
    style1,
    style2,
    style3
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
      let data = this.config.list;
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
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;  
}
</style>
