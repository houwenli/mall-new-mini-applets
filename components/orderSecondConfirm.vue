<template>
    <view>
        <wsf-confirm
            v-model="showConfirm"
            :context="confirmInfo.title"
            :activeText="confirmInfo.activeText"
            :cancelText="confirmInfo.cancelText"
            contextAlign="center"
            @confirm="activeConfirm"></wsf-confirm>
        <wsf-confirm
            v-model="fqzConfirmDialog"
            title="支付确认"
            activeText="确认支付"
            cancelText="再想想"
            contextAlign="center"
            @confirm="handleFqzConfirm"
            @cancel="fqzConfirmDialog = false">
            <view class="fqz-confirm-dialog">
                <view class="fqz-column" style="padding-bottom: 20rpx">
                    福气值已抵扣
                    <text class="light">：¥{{ mergeOrderData.fqzPrice.toFixed(2) }}</text>
                </view>
                <view class="fqz-column">
                    仍需支付
                    <text class="light">：¥{{ mergeOrderData.totalAmount.toFixed(2) }}</text>
                </view>
            </view>
        </wsf-confirm>
    </view>
</template>
<script>
    export default {
        data() {
            return {
                fqzConfirmDialog: false,
                showConfirm: false, // 发票提示框

                mergeOrderData: {
                    orderFqzAmount: 0,
                    fqzPrice: 0,
                    wsOrderCode: '',
                    totalAmount: '',
                    orderInfoVos: []
                },
                confirmInfo: {
                    type: '',
                    title: '',
                    activeText: '',
                    cancelText: ''
                },
                createTime: '' // 订单创建时间
            };
        },    
        methods: {
            orderOperation(item, type) {
                console.log(item, type);
                switch (type) {
                    case '确认收货':
                        this.openConfirm('receipt', item);
                        break;
                    case '删除订单':
                        this.openConfirm('delete', item);
                        break;
                    case '去支付':
                        this.goToPay(item);
                }
            },

            // 跳转支付页面
            goToPay(item) {
                console.log(item,'itemitem');
                let params = {
                    orderId: item.id
                };
                // this.createTime = item.createTime
                this.$u.api.SelectWsOrderInfoByOrderId(params).then(res => {
                    if (res.code == 200) {
                        if (res.data.fqzPrice && res.data.fqzPrice > 0) {
                            this.mergeOrderData = res.data;
                            this.mergeOrderData.orderCode = item.masterOrderCode;
                            this.fqzConfirmDialog = true;
                        } else {
                            this.$wsf.go('Pay', { orderMoney: res.data.totalAmount, orderCode: item.masterOrderCode, businessType: 100,
                                paySceneType: item.orderType == 14 ? 102 : 101 //102集采订单 101电商订单
                            //  createTime: this.createTime 
                            });
                        }
                    }
                });
            },

            handleFqzConfirm() {
                this.fqzConfirmDialog = false;
                this.$wsf.go('Pay', { orderMoney: this.mergeOrderData.totalAmount, orderCode: this.mergeOrderData.orderCode, businessType: 100,
                    paySceneType: 101 //电商订单
                    // createTime: this.createTime 
                });
            },

            // 打开弹窗
            async openConfirm(type, item) {
                this.selectOrderId = item.id;
                this.confirmInfo.type = type;
                if (type === 'delete') {
                    // 删除模块
                    this.confirmInfo.title = '确认删除此订单？';
                    this.confirmInfo.activeText = '删除';
                    this.confirmInfo.cancelText = '取消';
                } else if (type === 'receipt') {
                    // 收货模块
                    await this.$u.api.JudgeRefund({ orderId: item.id }).then(res => {
                        if (res.data == 1) {
                            this.confirmInfo.title = '您是否收到该订单商品？';
                            this.confirmInfo.activeText = '已收货';
                            this.confirmInfo.cancelText = '未收货';
                        } else {
                            this.confirmInfo.title = '订单中存在退款申请中商品，确认收货则默认撤销申请。';
                            this.confirmInfo.activeText = '确认';
                            this.confirmInfo.cancelText = '取消';
                        }
                    });
                }
                this.showConfirm = true;
            },
            // 弹窗确认
            activeConfirm() {
                if (this.confirmInfo.type == 'delete') {
                    this.$u.api.DeleteOrder({ orderId: this.selectOrderId }).then(res => {
                        this.$emit('confirmResearch');
                        this.$u.toast('删除成功');
                        this.showConfirm = false;
                    });
                } else if (this.confirmInfo.type == 'receipt') {
                    this.$u.api.ConfirmReceipt({ orderId: this.selectOrderId }).then(res => {
                        this.$emit('confirmResearch');
                        this.$u.toast('确认收货成功');
                        this.showConfirm = false;
                    });
                }
            }
        }
    };
</script>
<style lang="less" scoped>
    .fqz-confirm-dialog {
        text-align: center;
        padding-bottom: 40rpx;
        .fqz-column {
            font-size: 28rpx;
            line-height: 32rpx;
            color: #666;
            .light {
                color: #e60113;
            }
        }
    }
</style>
