<template>
    <div class="list-content">
        <div>
            <div class="waterfall-item" v-for="item in leftList" :key="item.id" @click="toDetail(item)">
                <waterfall-goods :item="item"></waterfall-goods>
            </div>
        </div>
        <div>
            <div class="waterfall-item" v-for="item in rightList" :key="item.id" @click="toDetail(item)">
                <waterfall-goods :item="item"></waterfall-goods>
            </div>
        </div>
    </div>
</template>

<script>
import WaterfallGoods from '@/components/wsf-goods-list/waterfall-goods.vue'

export default {

    // 开启样式穿透
    options: {
        styleIsolation: 'shared'
    },

    props: {
        list: {
            type: Array,
            default: () => {
                return []
            }
        }
    },

    components: { WaterfallGoods },

    computed: {
        leftList({ list }) {
            return list.filter((item, index) => {
                return index % 2 === 0
            })
        },
        rightList({ list }) {
            return list.filter((item, index) => {
                return index % 2 !== 0
            })
        }
    },

    methods: {
        toDetail(item) {
            this.$emit('toDetail', item)
        }
    },
}
</script>

<style lang="less" scoped>
.list-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    /deep/ .waterfall-goods {
        margin-bottom: 0;
        margin-top: 20rpx;
    }

    .waterfall-item:first-of-type {
        /deep/ .waterfall-goods {
            margin-top: 0;
        }
    }
}
</style>
