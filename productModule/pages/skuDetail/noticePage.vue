<template>
    <view class="notice-page">
        <back-top :topSearch="true" :isShowSearch="false"></back-top>
        <view>
            <image class="top-img" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/skuDetail/img_blank_information.png" ></image>
            <view class="tip-text">
                商品在两个月内一旦有货，<br />可通过小程序服务通知接收到货提醒
            </view>
            <view class="tip-btn" @click="setNotice">到货提醒我</view>
        </view>
        <wsf-confirm
            v-model="showConfirm"
            title="设置到货提醒"
            context="设置完成后，万顺福商城小程序将通过服务通知提醒您，请保持服务通知为打开状态"
            activeText="我知道了"
            @confirm="activeConfirm"
            :hideCancel='true'
            contextAlign="center"
		></wsf-confirm>
    </view>
</template>

<script>
import WsfBtn from '../../../components/wsf-btn/wsf-btn'
import backTop from "@/components/backTop.vue";
export default {
  components: { WsfBtn, backTop },
    data() {
        return {
            showConfirm: false,
            spuId: '',
            isLoading: false
        }
    },
    onLoad({spuId}) {
        console.log(spuId)
        this.spuId = spuId
    },
    methods: {
        setNotice() {
            if(this.isLoading) return
            this.showConfirm = true
        },
        activeConfirm() {
            this.showConfirm = false
            this.isLoading = true
            this.$u.api.QueryNoticeRecord({
                spuId: this.spuId
            }).then(res=>{
                if(res.data == 101) {
                    uni.showToast({
                        title: '设置提醒成功',
                        duration: 3000,
                        icon: 'none'
                    });
                    setTimeout(()=>{
                        this.isLoading = false
                        uni.navigateBack({
                            delta: 1,
                        });
                    }, 3000)
                } else {
                    this.getTemplate()
                }
            }).catch(err=>{
                this.isLoading = false
            })
            
        },
        getTemplate() {
            uni.requestSubscribeMessage({
                tmplIds: [
                    "5w1VMymwmVr2N-NmrHGG22XmJcwFp3AxTZj6QdDVDyk",//到货通知
                ],
                success(res) {
                    console.log("成功回调：", res);
                },
                fail(res) {
                    console.log("失败回调：", res);
                },
                complete: (res) => {
                    console.log(res, '订阅回调')
                    if(res['5w1VMymwmVr2N-NmrHGG22XmJcwFp3AxTZj6QdDVDyk'] == 'accept') {
                        this.$u.api.NoticeAllow({spuId: this.spuId,openId: uni.getStorageSync('openId')}).then(res=>{
                            uni.showToast({
                                title: '设置提醒成功',
                                duration: 3000,
                                icon: 'none'
                            });
                            setTimeout(()=>{
                                uni.navigateBack({
                                    delta: 1,
                                });
                                this.isLoading = false
                            }, 3000)
                        })
                    }
                },
            });
        }
    },
}
</script>
<style lang="scss" scoped>
.notice-page {
    min-height: 100%;
    background: #fff;
    padding-top: 48rpx;
    text-align: center;
    /deep/ .back-top {
        position: static;
    }
    .top-img {
        width: 320rpx;
        height: 320rpx;
        margin-bottom: 16rpx;
        line-height: 34rpx;
        color: #444444;
        font-size: 26rpx;
    }
    .tip-btn {
        margin: 20rpx auto 0;
        width: 320rpx;
        height: 80rpx;
        text-align: center;
        border-radius: 40rpx;
        background: linear-gradient(90deg, #0A75D9 0%, #00BB8A 100%);
        color: #FFF9E9;
        line-height: 80rpx;
        font-size: 32rpx;
    }
    /deep/ .wsf-confirm-modal {
        width: 592rpx;
        padding: 34rpx 36rpx 40rpx;
        .wsf-confirm-modal-btn-item {
            width: 260rpx;
        }
    }
}
</style>
