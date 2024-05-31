<template>
    <div>
        <div v-if="config.showComTitle == 1 && list.length > 0" class="com-title">
            {{ config.comTitle }}
        </div>
        <div class="list-box">
            <waterfallList v-if="config.text === '双列商品'" :list="list" @toDetail="toDetail"></waterfallList>

            <three-colun v-else-if="config.text === '三列商品'" :list="list" @toDetail="toDetail"></three-colun>

            <template v-else-if="config.text === '单列商品' && config.layoutStyle === '0'">
                <bigView class="item-box" v-for="item in list" :key="item.id" :item="item" @toDetail="toDetail"></bigView>
            </template>

            <template v-else-if="config.text === '单列商品' && config.layoutStyle === '1'">
                <smallView v-for="val in list" :item="val" :key="val.id" @tap="toDetail(val)"></smallView>
            </template>
        </div>
    </div>
</template>

<script>
    import bigView from './bigView.vue'
    import smallView from '@/components/wsf-goods-list/column-goods.vue'
    import threeColun from './threeColun.vue'
    import waterfallList from './waterfallList.vue'

    import { debounce } from '@/common/utils.js'
    export default {
      options: {
        styleIsolation: 'shared'
      },
      inject: ['scrollTopObj'],
      props: {
        config: {
          type: Object,
          default: () => {
            return {}
          },
        },
        index: {
          type: Number,
          default: 0,
        },

        reachBottom: {
          type: Boolean,
          default: false
        },

        rankingId: {
          type: Number,
          default: null
        },

        goodsParticipateNum: {
          type: Number,
          default: 0,
        },
        renderProductNum: {
          type: Number,
          default: 0,
        }
      },
      components: {
        bigView,
        smallView,

        threeColun,
        waterfallList
      },
      data() {
        return {
          list: [],
          loading: false,
          finished: false,
          pageSize: 10,
          pageNum: 0,
        }
      },

      watch: {
        reachBottom: {
          deep: true,
          immediate: true,
          handler(newVal) {
            if (this.debounceScrollBottom && newVal) {
              this.debounceScrollBottom()
            }
          },
        },
      },

      created() {
        this.debounceScrollBottom = debounce(this.scrollBottom)
        this.getList()
      },

      methods: {
        toDetail(e) {
          console.log(e);
          // 商品跳转
          let skuId = e.id || e.skuId,
          sourceType = e.sourceType || e.goodsSource
          // this.$wsf.go("SkuDetail", { skuId });
          if (e.goodsSource == 4) {
            this.$wsf.go('ToMotor', { skuId, sourceType });
          } else {
            this.$wsf.go('SkuDetail', { skuId });
          }

        },
        async getList() {
          this.loading = true

          let params = {
            orderCode: this.orderCode || '',
            skuId: this.skuId || '',
            pageType: this.config.productConfiguration,
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            subjectId: this.rankingId,
            recommendNum: this.config.productsNum,
          }


          let postMethod = this.$u.api.QueryRecommendCommodity
          if (this.config.productConfiguration === 13) {
            postMethod = this.$u.api.getCustomPageSpuList

            if (this.list.length >= this.config.productsNum || this.renderProductNum >= this.goodsParticipateNum) {
              this.finished = true
              this.$emit('finished', this.index)
              return
            }

            params.pageNum = this.renderProductNum
            let productsNum = Number(this.config.productsNum)
            let endNum = (productsNum - this.list.length)
            params.recommendNum = endNum >= this.pageSize ? this.pageSize : endNum
          }
          try {
            let res = await postMethod(params)
            let data = (res.data || []).map((item) => {
              item.skuLable && (item.skuLable.thematicLabel = null)
              
              // 自定义商品兼容
              if (!item.finalPrice && this.config.productConfiguration === 13) {
                item.finalPrice = item.skuLable && item.skuLable.finalPrice || item.price
              }

              return item
            })

            this.list = this.list.concat(data)
            
            if (this.config.productConfiguration === 13) {
              this.$emit('update:renderProductNum', this.renderProductNum + data.length)
            }

            console.log(this.list);
            if (data.length < this.pageSize) {
              this.finished = true
              this.$emit('finished', this.index)
            }
            this.pageNum++
          } catch (error) {
            this.finished = true
            this.$emit('finished', this.index)
          }
          this.loading = false
        },
        scrollBottom() {
          if (this.loading || this.finished) {
            return
          }

          this.getList()
        },

      },
    }
</script>

<style lang="less" scoped>
    .com-title {
      padding: 24rpx;
      padding-top: 4rpx;
      font-size: 32rpx;
      font-weight: 600;
      color: #191919;
      line-height: 44rpx;
      text-align: center;
    }

    .list-box {
      margin: 0 24rpx;
    }

    .item-box:first-of-type {
      /deep/ .view-content {
        margin-top: 0 !important;
      }
    }
</style>
