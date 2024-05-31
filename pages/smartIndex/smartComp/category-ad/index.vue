<template>
  <view data-desc="分类广告">
    <view class="applet-template-wrap" v-if="showAdPanel">
      <view
        class="list-group-item"
        v-for="element in componentList"
        :key="element.id"
      >
        <template v-if="element.text == '金刚区'">
          <SecondCategory :config="secondCategoryConfig"></SecondCategory>
        </template>

        <!-- 轮播图组件 -->
        <template v-if="element.text === '轮播图'">
          <swipe :config="element"></swipe>
        </template>
        <!-- 半屏双列图 -->
        <template v-if="element.text == '半屏双列图'">
          <doubleColumn :config="element"></doubleColumn>
        </template>
        <!-- 1-4列图 -->
        <template
          v-if="['单列图', '双列图', '三列图', '四列图'].includes(element.text)"
        >
          <groupImage :config="element"></groupImage>
        </template>

        <!-- 滑块区块 -->
        <template v-if="element.text == '滑动区块'">
          <slideModule :config="element"></slideModule>
        </template>
        <!-- 图片魔方 -->
        <template v-if="element.text == '图片魔方'">
          <cubeImage :config="element"></cubeImage>
        </template>
      </view>
    </view>
    <!-- 间隔分类广告和精选好物商品列表的占位符 -->
    <view class='category-ad-distance-palceholder' v-if="showAdPanel"></view>

    <!-- 分类广告Loading -->
    <categoryAdLoading v-if="showLoading"></categoryAdLoading>
  </view>
</template>

<script>
// 轮播图
import swipe from '../swipe/index.vue';
// 金刚区
import PageNav from '../page-nav/index.vue';
// 1-4列图
import groupImage from '../groupImage/index.vue';

// 滑动区块
import slideModule from '../slide-module/index.vue';
// 魔方组件
import cubeImage from '../cube-image/index.vue';
// 半屏双列图
import doubleColumn from '../double-column/index.vue';
// 二级分类-和金刚区是一样的效果-只是数据不一样
import SecondCategory from '../second-category/index.vue';

// 分类广告的loading
import categoryAdLoading from '../category-ad-loading/index.vue';

// 分类广告
export default {
  name: 'category-ad',

  props: {
    firstCateId: {
      type: [String, Number],
    },
  },

  components: {
    swipe,
    // 首页-金刚区
    PageNav,
    groupImage,

    slideModule,
    cubeImage,
    doubleColumn,
    SecondCategory,
    categoryAdLoading,
  },

  data() {
    return {
      // 首页-金刚区的配置
      pageNavConfig: {},

      componentList: [],

      // 二级分类数据
      secondCategoryList: [],
      // 是否展示分类广告的面板
      showAdPanel: false,

      showLoading: false
    };
  },

  computed: {
    // 二级分类 + 金刚区的背景颜色等配置信息
    secondCategoryConfig() {
      return {
        list: this.secondCategoryList,
        ...this.pageNavConfig,
      };
    },
  },

  async created() {
    this.$bus.$emit('openFixedMask', true);

  },
  async mounted() {
    this.showLoading = true;

    await this.queryCate();
    await this.getHomeTemplate();

    this.getCateTemplate();
  },

  watch: {
    /**
     * 切换一级分类-需要重新查询二级分类和一级分类对应的分类广告模版
     */
    async firstCateId() {
      // 固定背景不要滚动 - 其实只在3G网络下，才固定，避免后面的内容在滑动，网络快，不固定没啥问题，很快loading就消失了
      this.$bus.$emit('openFixedMask', true);

      this.showLoading = true;

      this.secondCategoryList = [];
      this.componentList = [];

      await this.queryCate();

      this.getCateTemplate();
    },
  },

  methods: {
    /**
     * 查询分类广告模版
     */
    async getCateTemplate() {
      try {
        let res = await this.$u.api.HomeTemplateById({ id: this.firstCateId });

        // 有模版数据
        if (res.data) {
          let indexJson = JSON.parse(res.data.indexJson);
          this.componentList = indexJson.contentList || [];
        } else {
          // 没有配置分类广告模版的情况-看是否有商品类别
          if (this.secondCategoryList.length) {
            // 有商品类型，构造一个 组件的数据结构即可
            this.componentList.push(this.secondCategoryConfig);
          } else {
            this.componentList = [];
          }
        }

        // 没有配置分类广告和没有二级分类-就整个不展示
        if (this.componentList.length === 0 && this.secondCategoryList) {
          this.showAdPanel = false;
        } else {
          this.showAdPanel = true;
        }
      } catch (error) {
      } finally {
        this.showLoading = false;
        this.$bus.$emit('openFixedMask', false);
      }
    },

    /**
     * 查询首页模版 - 取金刚区的背景颜色等配置信息
     */
    async getHomeTemplate() {
      try {
        let res = await this.$u.api.AppletIndex({ storeId: 0 });

        if (res.code === 200 && res.data && res.data.contentJson) {
          let contentJson = JSON.parse(res.data.contentJson) || {};

          let contentList = contentJson.contentList || [];

          // 拿到首页的配置信息
          let pageNavConfig = contentList.find(
            (item) => item.text === '金刚区'
          );

          if (pageNavConfig) {
            delete pageNavConfig.list;

            this.pageNavConfig = pageNavConfig || {};
          }
        }
      } catch (error) {
        console.log(
          '查询首页模版失败, pages/index/components/second-category/index.vue'
        );
      }
    },

    /**
     * 根据一级分类id查询二级分类
     */
    async queryCate() {
      let params = {
        parentId: this.firstCateId,
      };

      try {
        let res = await this.$u.api.Categorybyparentid(params);

        if (res.code == 200) {
          let list = res.data || [];

          // 只取二级分类中有分类icon的数据
          list = list.filter((item) => item.url);

          // 二级分类
          list.forEach((item) => {
            item.text = item.name;

            return item;
          });

          this.secondCategoryList = list;
        } else {
          this.secondCategoryList = [];
        }
      } catch (error) {
        console.log('查询二级分类报错', error);
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.applet-template-wrap {
  position: relative;
  border-radius: 32rpx 32rpx 0 0;
  background-color: #f5f5f5;
  overflow: hidden;
  padding: 24rpx 0;

  &::after {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background-image: var(--bgi);
    opacity: var(--opacity);
    background-repeat: no-repeat;
    background-size: 100% auto;
    background-position-y: 166rpx;
    z-index: -99;
  }
  .u-indicator-item-round-active {
    background-color: '#E60113' !important;
  }
}
::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
  color: transparent;
}

.list-group-item {
  margin-bottom: 24rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.category-ad-distance-palceholder {
  width: 100%;
  background: transparent;
  height: 24rpx;
}
</style>
