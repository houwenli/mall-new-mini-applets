<template>
	<view class="settlement-page">
		<coupon-popup ref="coupon" isCheckBox @callback='setConpunDetail' />

		<u-toast ref="uToast" />
		<!-- 地址模块  -->
		<view class="srcoll-container">
			<view class="address-info u-rela">
					<view @click="navigateTo('AddressList', { type: 1, addressId: addressInfo.id })">
						<view class="u-line-1 u-font-26 u-flex u-text-left u-margin-bottom-16">
							<i class="default-icon" v-if="addressInfo.isDefault > 0">默认</i>
							<span>{{ addressInfo.address }}</span>
						</view>
						<view class="u-font-36 u-text-left font-bold u-margin-bottom-20 detailAddress u-line-2">{{ addressInfo.id ? addressInfo.detailAddress : '请添加收货地址' }}</view>
						<view class="u-line-1 u-font-26 u-text-left" v-if="addressInfo.id">
							<span class="u-margin-right-28">{{ addressInfo.name }}</span>
							<span>{{ addressInfo.mobile | phoneNumberHide }}</span>
						</view>
					</view>
				<view class="divide-line"></view>
				<image class="more-icon u-abso" @click="navigateTo('AddressList', { type: 1, addressId: addressInfo.id })" src="@/static/img/icon/more-icon.png"></image>
			</view>
			<!-- 商品卡片模块 -->
			<template v-for="(item, index) in settlement.storeSettlements">
				<view class="store-card u-margin-top-24" :key="item.storeId">
					<view v-if="isShowStore > 0" class="u-line-1 u-font-14 u-text-left u-padding-left-36 u-padding-right-36">
						<i class="store-icon"></i>
						<span>{{ item.storeName }}</span>
					</view>
						<template v-for="subItem in item.shoppingCartResponse.normalSkus">
							<view class="u-margin-bottom-24" :key="subItem.skuId" :border-bottom="false" :arrow="false">
								<view class="product u-text-left u-padding-right-20 u-padding-left-20" >
									<image class="img" :src="subItem.image"></image>
									<view class="detail u-margin-left-20 u-flex-col u-flex-1 ">
										<view class="detail-top u-flex-1">
											<view class="u-font-14 title u-line-2">{{ subItem.name }}</view>
											<view class="u-line-1 wsf-grey spec">
												<block v-for="(n, i) in subItem.skuSpecValues" :key="i">
													<span class="u-font-22">{{ n.spec.name }} : {{ n.valueRemark }}</span>
													<span class="divide-short" v-if="i < subItem.skuSpecValues.length - 1"></span>
												</block>
											</view>
											<view class="tag-part">
												<block v-for="(tag, tagIndex) in subItem.marketingVos" :key="index">
													<!-- <view class="sale-price" v-if="item.type == 1">
														<image :src="reducedPriceImg"></image>
														<text class="price-tag">{{item.fall.price}}元</text>
													</view> -->
													<view v-if="tag.type == 12" class="bug-send">{{ tag.name }}</view>
												</block>
											</view>
											<view class="performance-mark" v-if="subItem.performanceScore && subItem.performanceScore > 0">
											 <image src="https://wsjc-web.wsecar.com/wsf-mall/home/ic_performance_mark.png"></image>绩效分:{{ subItem.performanceScore }}
											</view>
										</view>

										<view class="price u-flex u-row-between" :class="{ 'fqz-price': subItem.integralPoint > 0 && !isOldPriceBuy }">
											<!-- 添加福气值逻辑 -->
											<view v-if="subItem.integralPoint > 0 && !isOldPriceBuy">
												<label class="fqz-num" ><label class="special font-din">{{subItem.integralPoint}}</label>福气值+{{subItem.deductionAfterPrice}}元</label>
											</view>
											<view v-else>
												<span class="u-font-32">
													<i class="u-font-24 price-icon font-din">¥</i>
													<span class="font-din">{{ subItem.oldPrice | getPriceInt }}</span>
													<span class="u-font-26 font-din">{{ subItem.oldPrice | getPricePrecision }}</span>
												</span>
											</view>
											
											<span class="num u-font-26 wsf-grey">
												<template v-if="ids != '' || buyNowRequestList.length > 1">
													X{{ subItem.num }}
												</template>
												<u-number-box v-else :min="buyNowRequestList[0].sourceType == 5 ? subItem.entPurchaseNum : 1" :max="maxNumber" v-model="skuNum" @plus="plusNumber" @change="goodsNumChange(subItem.stock)"></u-number-box>
											</span>
										</view>

									</view>
								</view>
								<template class="gift-list" v-if="subItem.marketingVos && subItem.marketingVos.length > 0">
									<block v-for="(market) in subItem.marketingVos" :key="marketingIndex" v-if="market.type == 2">
										<block v-for="(gift, giftIndex) in filterGiftSku(market.fullGiftList, subItem.num * subItem.price)" :key="giftIndex">
											<view class="gift-product">
												<span class="u-margin-right-12">[赠品]</span>
												<span class="gift-product-name u-line-1">{{ gift.name }}</span>
												<span class="gift-product-num">x{{ gift.num }}</span>
											</view>
										</block>
									</block>
								</template>
							</view>
						</template>
						<view class="detail-item u-flex u-row-between" @click="openPopup(1, { freightPrice: item.freightPrice })">
							<view class="u-font-26 label">配送</view>
							<view class="u-flex">
								<span class="wsf-grey u-font-22" v-if="item.freightPrice <= 0">快递免邮</span>
								<span class="wsf-grey u-font-22" v-else>快递¥{{ item.freightPrice | priceFilter }}</span>
								<image class="more-icon" src="@/static/img/icon/more-icon.png"></image>
							</view>
						</view>
						<view class="detail-item u-flex u-row-between u-padding-right-60">
							<view class="u-font-26 label">留言</view>
							<u-input
								style="flex: 1;"
								inputAlign="right"
								v-model="item.remark"
								:type="text"
								:border="false"
								:maxlength="50"
								placeholder="建议留言前先与商家沟通确认"
								placeholderStyle="color:#999;text-align: right;font-size: 22rpx;line-height:28rpx;"
							/>
						</view>
						<view class="detail-item u-flex u-row-between u-padding-right-60" v-if="item.totalDiscountPrice>0">
							<view class="u-flex" >
								<view class="u-font-26 label">活动</view>
								<!-- <span class="activity-label">满600-100</span> -->
							</view>
							<view class="u-font-26" style="color: #FF0A35">
								-¥{{item.totalDiscountPrice | priceFilter}}
							</view>
						</view>
						<view class="detail-item u-flex u-row-between" v-if="item.usableCouponNum || item.onlineRetailerCouponIds.length" @click="
								openPopup(
									3,
									{
										normalSkus: item.shoppingCartResponse.normalSkus,
										onlineRetailerCouponIds: item.onlineRetailerCouponIds,
										userCouponDiscount: item.userCouponDiscount,
										usableCouponNum: item.usableCouponNum,
										index
									},
									null
								)
							">
							<view class="u-font-26 label">优惠券</view>
							<view class="u-flex u-font-26" >
								<span class="wsf-red" v-if="item.userCouponDiscount > 0">-¥{{item.userCouponDiscount}}</span>
								<span class="wsf-grey" v-else-if="(!item.onlineRetailerCouponIds || item.onlineRetailerCouponIds.length < 1) && item.usableCouponNum">{{item.usableCouponNum}}张可用</span>
								<span class="wsf-grey" v-else-if="item.userCouponDiscount == 0 && !item.usableCouponNum">无可用</span>
								<image class="more-icon" src="@/static/img/icon/more-icon.png"></image>
							</view>
						</view>

					<view class="total u-padding-top-16 u-padding-right-60 u-text-right">
						<span class="u-margin-right-8 wsf-grey u-font-20">共{{ item.skuNum || 0 }}件</span>
						<span class="u-font-30 font-bold">合计¥<span class="font-din">{{ (item.realPrice + item.freightPrice - item.userCouponDiscount) | priceFilter }}</span></span>
					</view>
				</view>
			</template>
			<view class="store-card u-margin-top-12 u-padding-top-0 u-padding-bottom-0" v-if="settlement.platformCouponCodeClassify">
				<u-cell-group>
					<u-cell-item title="平台优惠券" :border-bottom="false" :arrow="true" arrow-direction="right" @click="openPopup(4, {}, null)">
						<span style="color: #e60113" v-if="showPlatformItem">
						<block v-if="showPlatformItem.type == 2 && showPlatformItem.price < showPlatformItem.limitPrice">{{ parseInt(showPlatformItem.discountRate * 100) / 10 }}折</block>
						<block v-else>{{ '-￥' + showPlatformItem.price }}</block>
						</span>
						<span v-else>{{ platformCanUseList && platformCanUseList.length > 0 ? `${platformCanUseList.length}张可用` : '无可用' }}</span>
					</u-cell-item>
				</u-cell-group>
			</view>
			<view class="store-card u-margin-top-12 u-padding-top-0 u-padding-bottom-0" v-if="valueCardCods.length">
				<u-cell-group>
					<u-cell-item title="礼品卡" :border-bottom="false" :arrow="true" arrow-direction="right" @click="openPopupGift(4, {}, null)">
						<span style="color: #e60113" v-if="giftIndex !== null"  @click="showGiftFun()">
						<span>{{ '-￥' + giftDeduction }}</span>
						</span>
						<text v-else @click="showGiftFun()">{{ `${valueCardCods.length}张可用` }}</text>
					</u-cell-item>
				</u-cell-group>
			</view>
			<view class="store-card u-margin-top-20" hover-class="none" hover-stop-propagation="false">
				<view class="detail-item bill-item u-flex u-row-between" @click="openPopup(2, { invoice: invoice })">
					<view class="u-font-26 label">发票</view>
					<view class="u-flex">
						<span class="wsf-grey u-font-22" v-if="invoice.type <= 0">不需要发票</span>
						<span class="wsf-grey u-font-22" v-else-if="invoice.type >= 2">增值税专用发票</span>
						<span class="wsf-grey u-font-22" v-else>电子普通发票</span>
						<image class="more-icon" src="@/static/img/icon/more-icon.png"></image>
					</view>
				</view>
			</view>

			<view class="store-card u-margin-top-24 u-padding-top-0 u-padding-bottom-0 good-fortune-card">
				<view class="detail-item u-flex u-row-between u-padding-right-60">
					<view class="u-font-26 label">商品金额</view>
					<view class="u-font-26 label">
						¥{{settlement.orderTotalPrice | priceFilter}}
					</view>
				</view>
				<view class="detail-item u-flex u-row-between u-padding-right-60">
					<view class="u-font-26 label">运费</view>
					<view class="u-font-26 label">
						¥{{settlement.orderTotalFright | priceFilter}}
					</view>
				</view>

				<!-- <view class="detail-item u-flex u-row-between u-padding-right-60">
					<view class="u-font-26 label">实付金额</view>
					<view class="u-font-26 label">
						¥{{settlement.orderTotalFright | priceFilter}}
					</view>
				</view> -->

				<view class="detail-item u-flex u-row-between u-padding-right-60" v-if="!isOldPriceBuy && settlement.orderTotalIntegralPoint > 0">
					<view class="u-font-26 label">福气值</view>
					<view class="u-font-26 label" style="color: #FF0A35">
						-{{settlement.orderTotalIntegralPoint}}
					</view>
				
				</view>
				<view class="detail-item u-flex u-row-between u-padding-right-60" v-if="isOldPriceBuy && settlement.orderTotalIntegralPoint > 0">
					<view class="u-font-26 label">福气值</view>
					<view class="u-font-26 label">
						无可用
					</view>
				</view>


				<view class="detail-item u-flex u-row-between u-padding-right-60" v-if="settlement.orderDiscountPrice>0">
					<view class="u-font-26 label">活动</view>
					<view class="u-font-26 wsf-red">
						-¥{{settlement.orderDiscountPrice | priceFilter}}
					</view>
				</view>
				<view class="detail-item u-flex u-row-between u-padding-right-60" v-if="sumUserCouponDiscount>0">
					<view class="u-font-26 label">优惠券</view>
					<view class="u-font-26 wsf-red">
						-¥{{sumUserCouponDiscount | priceFilter}}
					</view>
				</view>
				
				<view v-if="configStatus === 1">
					<view class="point-content u-flex u-row-between" :class="{ 'no-right': integral <= 0 }" @tap="openGoodFortuneValue">
                	<view class="u-font-26 label">福气值(共{{ integral }})</view>
                	<view class="u-flex u-font-26">
                	    <span v-show="integralMoney" class="wsf-red">-¥{{ integralMoney.toFixed(2) }}</span>
                	    <span v-show="!integralMoney" class="wsf-grey u-font-22">{{ parseFloat(integral) ? '去使用' : '无可用' }}</span>
                	    <image v-if="integral > 0" class="more-icon" src="@/static/img/icon/more-icon.png"></image>
                	</view>
            		</view>
				</view>

				<view class="total u-padding-top-14 u-padding-bottom-24 u-padding-right-60 u-text-right">
					<view class="u-font-30 font-bold">合计<span class="wsf-red">¥<span class="font-din" v-if="settlement.orderTotalIntegralPoint>0 && !isOldPriceBuy">
						{{ settlement.orderTotalDeductionAfterPrice | priceFilter }}</span>
						<span v-else>{{ (orderLastTotalPrice - sumUserCouponDiscount - integralMoney) | priceFilter }}</span>
					</span></view>
				</view>				
			</view>
		</view>

		<!-- 底部栏模块 -->
		<view
			class="fixed-column u-flex u-row-right u-padding-right-24 u-padding-left-24"
			style="background-color: #fff;"
			:class="{ 'fixed-column-space': isNeedBottomSpace }"
		>
			<view class="u-margin-right-8">
				<view class="u-text-right ">
					<span class="u-font-20 wsf-grey u-margin-right-4">共{{ settlement.totalNum || 0 }}件,</span>
					<span class="u-font-26 all-price">合计</span>
					<span class="u-font-30 all-price" v-if="settlement.orderTotalIntegralPoint>0 && !isOldPriceBuy"
						>¥<span class="font-din">{{ settlement.orderTotalDeductionAfterPrice | priceFilter }}</span></span>
					<span class="u-font-30 all-price" v-else
						>¥<span class="font-din">{{ orderTotalPrice | priceFilter }}</span></span>
				</view>
				<view v-if="sumUserCouponDiscount + settlement.orderDiscountPrice + fqzMoney>0" class="sms-user-conpon-discount">共减¥{{(sumUserCouponDiscount + settlement.orderDiscountPrice + fqzMoney) | priceFilter}}</view>
			</view>
			<view class="order-submit" @click="submitOrder">提交订单</view>
		</view>

		<integral-popup ref="integralPopup" :useIntegral.sync="useIntegral" :configStatus.sync="configStatus" :integral.sync="integral" :integralCfgId.sync="integralCfgId" :integralMoney.sync="integralMoney" :businessType="businessTypeEnum.mall" :orderLastTotalPrice="orderLastTotalPrice" :sumUserCouponDiscount="sumUserCouponDiscount">
			<template><view></view></template>
		</integral-popup>

		<view class="footer-bottom-space" v-if="isNeedBottomSpace"></view>
		<!-- 礼卡弹出层 -->
		<u-popup v-model="giftPopupShow" @open="giftOpen" @close='giftClose' :mask-close-able="true" mode="bottom" border-radius="40" :safe-area-inset-bottom="true" :closeable="true">
			<view class="gift_main">
				<view class="title">礼品卡</view>
				<scroll-view scroll-y="true" style="height: 800rpx; background-color: #f5f5f5;">
					<view class="content">
						<template v-if="true">
						<!-- <view class="min_card" v-for="item in records_0" :key="item.valueCardCodeId"> -->
						<view class="min_card" v-for="(item,index) in valueCardCods" :key="index">
								<view class="up">
									<view class="txt_1">
										<text>{{ item.cardName }}</text>
									</view>
									<view class="txt_2">
										<text>面值: {{ fmoney(item.cardPrice, 2, false) }}元</text>
										<text>{{ item.validityStartTime | dateFilter }} - {{ item.validityEndTime | dateFilter}}</text>
									</view>
									</view>
									<view class="down">
									<view class="left">
										<view>
										余额:
										<text>¥ {{ fmoney(item.balance, 2, false) }}</text>
										</view>
										<view>
											<view style=" color: #999;width: 100%; text-align: left;" v-if="item.permittedType == 0">全平台商品可用</view>
											<template v-if="item.permittedType == 1">
												<view style="width:100%;color: #999; text-align: left;">
												<text style="font-size: 24rpx;color: #999;">{{`仅${item.marketingName}活动商品可用` | thumbnailString}}</text>
												<van-icon
												size="15px"
												color="#999"
												name="info-o"
												@click="explainFun(item)"
												/>
												</view>

											</template>
											<template v-if="item.permittedType == 2">
												<view style="width:100%; text-align: left;">
												<text style="font-size: 24rpx;color: #999;">{{`仅${item.storeNames}店铺的商品可用` | thumbnailString}}</text>
												<u-icon
												size="30rpx"
												color="#999"
												name="info-circle"
												@click="explainFun(item)"
												></u-icon>
												</view>
											</template>
										</view>
									</view>
									<view class="right">
										<view class="stub-ticket">
											<image
											src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/cat_Selected%402x.png"
											v-if="giftIndex === index"
											class="choosebox"
											@click="giftSelectCoupon(null)"
											/>
											<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/cat_ns%402x.png" v-else class="choosebox" @click="giftSelectCoupon(item,index)" />
										</view>
									</view>
								</view>
							</view>
						</template>
					</view>
				</scroll-view>
				<view class="footer">
					<view class="btn" @click="isConfirmFn();giftConfirm()">确定</view>
				</view>
			</view>
		</u-popup>

		<!-- 弹出层模块 -->
		<u-popup v-model="popupShow" mode="bottom" :safe-area-inset-bottom="true" @close="this.popupShowContent = {}">
			<view class="applet-settlement-popup-wrap" v-if="popupShow">
				<view class="applet-settlement-popup-header u-padding-left-36">
					<view v-if="popupShowContent.type == 4"></view>
					<view class="applet-settlement-popup-header-title">
						{{ popupShowContent.title }}
					</view>
					<view class="applet-settlement-popup-header-close" @click="popupShow = false">
						<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/close%402x.png" class="applet-settlement-popup-header-close-icon" mode=""></image>
					</view>
				</view>
				<scroll-view scroll-y="true" style="height: 880rpx">
					<view class="applet-settlement-popup-body">
						<!-- 配送模块 -->
						<template v-if="popupShowContent.type == 1">
							<u-cell-group :border="false">
								<u-cell-item hover-class="none" :arrow="false" :border-bottom="false" :border-top="false">
									<view slot="title" v-if="popupShowContent.freightPrice > 0">普通配送 快递 ¥{{ popupShowContent.freightPrice | priceFilter }}</view>
									<view slot="title" v-else>普通配送 快递 免邮</view>
									<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/cat_Selected%402x.png" style="width: 36rpx; height: 36rpx" mode="" slot="right-icon"></image>
								</u-cell-item>
							</u-cell-group>
						</template>
						<!-- 发票模块 -->
						<template v-else-if="popupShowContent.type == 2">
							<view class="applet-settlement-popup-invoice">
								<view class="applet-settlement-popup-invoice-item u-margin-bottom-36">
									<wsf-radio
										v-model="popupShowContent.invoice.type"
										@change="setRules"
										:options="[{ value: 0, label: '不需要发票' }, { value: 1, label: '电子普通发票' }, { value: 2, label: '增值税专用发票' }]"
									></wsf-radio>
								</view>
								<u-line class="u-line" color="#F2F2F2"></u-line>
								<template v-if="popupShowContent.invoice.type > 0">
									<!-- 当需要开发票时.引入表单 -->
									<u-form
										:model="popupShowContent.invoice"
										ref="uForm"
										:error-type="['toast']"
										:border-bottom="false"
										label-width="176"
										:label-style="{
											fontSize: '24rpx',
											color: '#000000',
											height: '28rpx',
											lineHeight: '28rpx'
										}"
									>
										<!-- 发票抬头模块 -->
										<view class="applet-settlement-popup-invoice-form-group">
											<view class="applet-settlement-popup-invoice-form-group-title">发票抬头</view>

											<!-- 当开具电子普通发票时 -->
											<template v-if="popupShowContent.invoice.type == 1">
												<u-form-item class="u-padding-top-0 u-padding-bottom-0" :border-bottom="false">
													<wsf-radio
														v-model="popupShowContent.invoice.titleType"
														:options="[{ value: 2, label: '个人' }, { value: 1, label: '单位' }]"
														@change="popupShowContent.invoice.title = ''"
													></wsf-radio>
												</u-form-item>
												<template v-if="popupShowContent.invoice.titleType > 1">
													<u-form-item label="个人名称" prop="title" :border-bottom="false" required>
														<u-input
															v-model="popupShowContent.invoice.title"
															height="48"
															placeholder-style="color: #BABABA;font-size: 24rpx"
															placeholder="请填写“个人”或您的姓名"
														/>
													</u-form-item>
												</template>
												<template v-else>
													<u-form-item label="单位名称" prop="title" :border-bottom="false" required>
														<u-input v-model="popupShowContent.invoice.title" height="48" placeholder-style="color: #BABABA;font-size: 24rpx" placeholder="请填写单位名称" />
													</u-form-item>
													<u-form-item label="纳税人识别号" prop="taxId" :border-bottom="false" required>
														<u-input
															v-model="popupShowContent.invoice.taxId"
															height="48"
															placeholder-style="color: #E60113;font-size: 24rpx"
															placeholder="请在此填写纳税人识别号"
														/>
													</u-form-item>
												</template>
											</template>
											<!-- 当开具增值税发票时 -->
											<template v-else-if="popupShowContent.invoice.type == 2">
												<u-form-item label="单位名称" prop="invoiceCompanyName" :border-bottom="false" required>
													<u-input
														v-model="popupShowContent.invoice.invoiceCompanyName"
														height="48"
														placeholder-style="color: #BABABA;font-size: 24rpx"
														placeholder="请填写单位名称"
													/>
												</u-form-item>
												<u-form-item label="发票税号" prop="taxId" :border-bottom="false" required>
													<u-input v-model="popupShowContent.invoice.taxId" height="48" placeholder-style="color: #BABABA;font-size: 24rpx" placeholder="请填写纳税人识别号" />
												</u-form-item>
												<u-form-item label="注册地址" prop="invoiceRegisterAddress" :border-bottom="false" required>
													<u-input
														v-model="popupShowContent.invoice.invoiceRegisterAddress"
														height="48"
														placeholder-style="color: #BABABA;font-size: 24rpx"
														placeholder="请填写注册地址"
													/>
												</u-form-item>
												<u-form-item label="注册电话" prop="invoiceRegisterMobile" :border-bottom="false" required>
													<u-input
														v-model="popupShowContent.invoice.invoiceRegisterMobile"
														height="48"
														type="number"
														placeholder-style="color: #BABABA;font-size: 24rpx"
														placeholder="请填写注册电话"
													/>
												</u-form-item>
												<u-form-item label="开户银行" prop="invoiceOpenBank" :border-bottom="false" required>
													<u-input
														v-model="popupShowContent.invoice.invoiceOpenBank"
														height="48"
														placeholder-style="color: #BABABA;font-size: 24rpx"
														placeholder="请填写开户银行"
													/>
												</u-form-item>
												<u-form-item label="银行账号" prop="invoiceBankAccount" :border-bottom="false" required>
													<u-input
														v-model="popupShowContent.invoice.invoiceBankAccount"
														height="48"
														type="number"
														placeholder-style="color: #BABABA;font-size: 24rpx"
														placeholder="请填写银行账号"
													/>
												</u-form-item>
											</template>
										</view>
										<u-line class="u-line" color="#F2F2F2"></u-line>

										<!-- 收票人信息模块 -->
										<view class="applet-settlement-popup-invoice-form-group">
											<view class="applet-settlement-popup-invoice-form-group-title">收票人信息</view>
											<u-form-item label="收票人手机" prop="invoicePhone" :border-bottom="false" required>
												<u-input v-model="popupShowContent.invoice.invoicePhone" height="48" placeholder-style="color: #BABABA'';font-size: 24rpx" placeholder="请填手机号码" />
											</u-form-item>
											<u-form-item label="收票人邮箱" prop="invoiceMail" :border-bottom="false" required>
												<u-input
													v-model="popupShowContent.invoice.invoiceMail"
													height="48"
													placeholder-style="color: #BABABA'';font-size: 24rpx"
													placeholder="用来接收电子发票邮件"
												/>
											</u-form-item>
											<u-line class="u-line" color="#F2F2F2"></u-line>
										</view>
										<!-- 发票内容模块 -->
										<view class="applet-settlement-popup-invoice-form-group">
											<view class="applet-settlement-popup-invoice-form-group-title">发票内容</view>
											<u-form-item class="u-padding-top-0 u-padding-bottom-0" :border-bottom="false">
												<wsf-radio v-model="popupShowContent.invoice.content" :options="[{ value: 1, label: '商品明细' }, { value: 2, label: '商品类别' }]"></wsf-radio>
											</u-form-item>
											<view class="applet-settlement-popup-invoice-form-group-tips">
												发票内容将显示详细商品名称与价格信息，发票金额为实际支付金额，不含虚资产、 优惠等扣减金额。
											</view>
										</view>
									</u-form>
								</template>
							</view>
						</template>
						<template v-if="popupShowContent.type == 4">
							<view class="header-tabs">
								<block v-for="(item, index) in tabList" :key="index">
									<view class="tabs" :class="{ active: tabIndex == item.id }" @click="changeTab(item)">
										<text>{{ item.name + '(' + item.number + ')' }}</text>
										<i v-if="tabIndex == item.id"></i>
									</view>
								</block>
							</view>

							<view class="coupon-list" v-if="tabIndex == 0">
								<view class="coupon platform-coupon" v-for="(item, index) in platformCanUseList" :key="index">
									<view class="main-ticket">
										<view class="main-mark platform-mark">平台券</view>
										<view class="coupon-detail">
											<view class="coupon-price platform-color">
												<span class="text" v-if="item.type != 2">￥</span>
												<span class="price">{{ item.type == 2 ? parseInt(item.discountRate * 100) / 10 : item.price }}</span>
												<span class="text" v-if="item.type == 2">折</span>
											</view>
											<view class="coupon-info">
												<view class="condition" v-if="item.type != 0">满{{ item.fullPrice }}可用</view>
												<view class="indate">
													{{ $u.timeFormat(new Date(item.validityStartTime).getTime(), 'yyyy.mm.dd') }}-{{ $u.timeFormat(new Date(item.validityEndTime).getTime(), 'yyyy.mm.dd') }}
												</view>
											</view>
										</view>
										<view class="coupon-explain">
											<text v-if="item.permittedType == 0">全</text>
											<text>平台</text>
											<text v-if="item.permittedType == 2">部分</text>
											<text v-if="item.permittedType == 1">部分分类</text>
											<text>商品可用，</text>
											<text v-if="item.exclusionType == 1">不</text>
											<text>可与店铺券叠加使用</text>
										</view>
									</view>
									<view class="stub-ticket">
										<image
											src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/cat_Selected%402x.png"
											alt=""
											class="choosebox"
											v-if="selectPlatformCouponItem && selectPlatformCouponItem.id == item.id"
											@click="selectPlatformCoupon(null)"
										></image>
										<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/activity/cat_ns_platform%402x.png" alt="" class="choosebox" v-else @click="selectPlatformCoupon(item)"></image>
									</view>
								</view>
								<view class="empty-page" v-if="!platformCanUseList || platformCanUseList.length < 1">
									<img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/Discount_bg%402x.png" alt="" />
									<p class="nocoupon-txt">抱歉，您暂无可以使用的优惠券</p>
								</view>
							</view>
							<view class="coupon-list" v-else>
								<view class="coupon disabled-coupon" v-for="(item, index) in platformNoUseList" :key="index">
									<view class="main-ticket">
										<view class="main-mark disabled-mark">平台券</view>
										<view class="coupon-detail">
											<view class="coupon-price disabled-color">
												<span class="text" v-if="item.type != 2">￥</span>
												<span class="price">{{ item.type == 2 ? parseInt(item.discountRate * 100) / 10 : item.price }}</span>
												<span class="text" v-if="item.type == 2">折</span>
											</view>
											<view class="coupon-info">
												<view class="condition disabled-color" v-if="item.type != 0">满{{ item.fullPrice }}可用</view>
												<view class="indate disabled-color">
													{{ $u.timeFormat(new Date(item.validityStartTime).getTime(), 'yyyy.mm.dd') }}-{{ $u.timeFormat(new Date(item.validityEndTime).getTime(), 'yyyy.mm.dd') }}
												</view>
											</view>
										</view>
										<view class="coupon-explain">
											<text v-if="item.permittedType == 0">全</text>
											<text>平台</text>
											<text v-if="item.permittedType == 2">部分</text>
											<text v-if="item.permittedType == 1">部分分类</text>
											<text>商品可用，</text>
											<text v-if="item.exclusionType == 1">不</text>
											<text>可与店铺券叠加使用</text>
										</view>
									</view>
									<view class="stub-ticket"></view>
								</view>
								<view class="empty-page" v-if="!platformNoUseList || platformNoUseList.length < 1">
									<img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/Discount_bg%402x.png" alt="" />
									<p class="nocoupon-txt">抱歉，您暂无不可使用的优惠券</p>
								</view>
							</view>
						</template>
					</view>
				</scroll-view>
				<view class="u-padding-top-12 u-padding-bottom-12">
					<u-button
						shape="circle"
						@click="confirmSelect()"
						hover-class="none"
						:custom-style="{
							width: '680rpx',
							height: '76rpx',
							margin: '0 auto',
							background: '#E60113',
							borderRadius: '38rpx',
							color: '#FFF'
						}"
					>
						{{ popupShowContent.type == 4 ? '完成' : '确定' }}
					</u-button>
				</view>
			</view>
		</u-popup>
		<!-- 赠品已赠完提示 -->
		<wsf-confirm
			v-model="showConfirm"
			:title="confirmInfo.title"
			:activeText="confirmInfo.activeText"
			:cancelText="confirmInfo.cancelText"
			@confirm="activeConfirm"
			@cancel="cancelConfirm"
		>
			<view slot="context" class="gift-product-list">
				<block v-for="(item, index) in noStockGifts" :key="index">
					<view class="gift-product">
						<image :src="item.url"></image>
						<span class="content u-line-2">{{ item.name }}</span>
					</view>
				</block>
			</view>
		</wsf-confirm>
		<!--限购商品列表 -->
		<u-mask :show="showLimit" @click="showLimit = false">
			<view class="warp">
				<view class="rect" @tap.stop>
					<view class="title"><text>您购买的商品已超出限购范围！</text></view>
					<view class="list">
						<scroll-view scroll-y="true" class="scroll-Y">
							<view class="limit-item" v-if="limitSkuList.length">
								<view class="content u-margin-bottom-40" v-for="(item, index) in limitSkuList" :key="index">
									<view class="left u-margin-right-20"><image :src="item.image"></image></view>
									<view class="right">
										<view class="txt-1 u-line-2">{{ item.name }}</view>
										<view class="limit-num">限购{{ item.limitNumFromMarketing }}件</view>
									</view>
								</view>
							</view>
							<view v-for="(item, index) in limitFirstList" :key="index" class="limit-item" v-if="limitFirstList.length">
								<view style="margin-bottom: 20rpx;padding-left:50rpx; color: #e60113; font-size: 12px" v-if="item.limitKind">限购{{ item.limitKind }}款</view>
								<view v-for="(sItem, idx) in item.specialAreaLimitList" :key="idx" class="content u-margin-bottom-40">
									<view class="left u-margin-right-20"><image :src="sItem.image"></image></view>
									<view class="right">
										<view class="txt-1 u-line-2">{{ sItem.name }}</view>
										<view class="limit-num">限购{{ sItem.marketingVos[0].specialArea.limitNum }}件</view>
									</view>
								</view>
							</view>
						</scroll-view>
					</view>
					<view class="btn"><view class="btn-item" @click="showLimit = false">我知道了</view></view>
				</view>
			</view>
		</u-mask>
		<!-- 去使用 -->
		<u-mask :show="explain" z-index="99999999999">
		<view class="popup_text">
			<view class="instructions">
			<view class="my_title">
				<text>说明</text>
				<image
				@click="explain = false"
				class="img"
				src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/e130282932de4df76a8123b597879978.png"
				mode="scaleToFill"
				style="width: 32rpx; height: 32rpx"
				/>
			</view>
			<view class="my_text">
				<text>{{explainText}}</text>
			</view>
			<view class="btn" @click="explain = false">我知道了</view>
			</view>
		</view>
		</u-mask>

	</view>
</template>

<script>
import wsfRadio from '@/components/wsf-radio/wsf-radio.vue';
import couponPopup from '@/components/coupon-popup/coupon-popup.vue';
import integralPopup from '@/components/wsf-integral-popup/index.vue';
import { visit } from '@/common/visit.js';

import {mapGetters} from 'vuex';

import { BUSINESS_TYPE } from '@/common/constants/order.js'

let cart = null, giftData = null,isConfirm= false, giftIndex_ = null,giftData_ = null
export default {
	components: {
		wsfRadio,
		couponPopup,
		integralPopup
	},
	data() {
		return {
			fqzCfgId: "", //福气值配置id
			fqzCfgRate: 0, //福气值比率 1元=xxx福气值
			goodFortunePopup: false,
			inputFqzPoint: '0',
			fqzPoint: 0,
			fqzMoney: 0,
			showFqzMoney: 0, //弹框展示
			amountNum:0,
			giftDeduction: 0,
			valueCardCodeId:'',
			giftIndex:null,
			giftMoney: 0,
			valueCardCods:[],
			explain: false,
			explainText:'',
			isCallCheckPlatformCouponApi: false, //是否调用接口查询平台优惠券
			platformCanUseList: [],
			platformNoUseList: [],
			usableCouponList: [],
			disableCouponList: [],
			showPlatformItem: null,
			selectCouponItem: null,
			selectPlatformCouponItem: null,
			productCouponItemIndex: null,
			tabIndex: 0,
			tabList: [
				{
					id: 0,
					name: '可用优惠券',
					mark: 'usable',
					number: 0
				},
				{
					id: 1,
					name: '不可用优惠券',
					mark: 'past',
					number: 0
				}
			],
			limitSkuList: [], // 超限秒杀商品数组
			limitFirstList: [], // 超限首单商品数组
			showLimit: false,
			maxNumber: 99999, //步进器最大数
			isNeedBottomSpace: getApp().globalData.isNeedBottomSpace,
			noStockGiftIds: [],
			noStockGifts: [],
			orderSkuFullGiftMap: {},
			showConfirm: false,
			confirmInfo: {
				title: '很遗憾，您本单购买的以下赠品已赠完是否继续提交订单',
				activeText: '是',
				cancelText: '否'
			},
			choseCouponId: '',
			value: '',
			ids: '',
			buyNowRequestList: [],
			skuNum: 0, // 数量
			isGroup: '',
			groupId: '',
			needRefresh: true,
			isLoading: true,
			// 订单提交错误
			orderError: {
				'R-000006': '订单中缺失商品',
				'R-000007': '请选择收货地址',
				'R-000005': '商品库存不足',
				'R-000011': '超出限购数量',
				'R-000015': '商品没参加众筹',
				'R-000016': '实体商品和虚拟商品不能同时结算',
				'R-000017': '存在批发商品实购数量小于最小批发数量',
				'R-000018': '订单中存在已过期的商品',
				'R-000019': '请不要重复提交'
			},
			isIphoneX: getApp().globalData.isIphoneX,
			orderDiscountPrice: 0,
			orderTotalFright: 0,
			orderLastTotalPrice: 0,
			preMarketing: null,
			canUseRedEnvelope: [],
			payType: '在线支付',
			remark: {},
			addressId: 0,
			redEnvelopePrice: 0,
			invoiceType: { 0: '不需要发票', 1: '增值税普票', 2: '增值税专票' },
			agreeToPay: false,
			// 发票信息
			invoice: {
				type: 0,
				title: '',
				content: 1,
				taxId: '',
				titleType: 1,
				invoiceCompanyName: '',
				invoiceRegisterAddress: '',
				invoiceRegisterMobile: '',
				invoiceOpenBank: '',
				invoiceBankAccount: ''
			},
			settlement: {
				isConfirm: false
			}, // 订单信息
			addressInfo: {}, // 用户地址信息
			timeout: null, // 计时器ID,便于防抖
			popupShow: false, // 弹出层
			popupShowContent: {
				type: ''
			}, // 弹出层的内容
			formRules: {
				// 发票抬头
				title: [
					{
						required: true,
						message: '请输入个人名称或单位名称',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change']
					}
				],
				// 纳税人识别号
				taxId: [
					{
						required: true,
						min: 5,
						message: '请输入纳税人识别号',
						trigger: 'change'
					}
				],
				// 收票人联系电话
				invoicePhone: [
					{
						len: 11,
						// validator: (rule, value, callback) => {
						// 	// 上面有说，返回true表示校验通过，返回false表示不通过
						// 	// this.$u.test.mobile()就是返回true或者false的
						// 	return this.$u.test.mobile(value);
						// },
						required: true,
						message: '请输入正确的手机号码',
						trigger: 'change'
					}
				],
				// 收票人邮箱
				invoiceMail: [
					{
						type: 'email',
						required: true,
						message: '请输入正确的邮箱',
						trigger: 'change'
					}
				],
				// 增值税发票
				// 单位名称
				invoiceCompanyName: [
					{
						required: true,
						message: '请输入单位名称',
						trigger: 'change'
					}
				],
				// 单位地址
				invoiceRegisterAddress: [
					{
						required: true,
						message: '请输入单位地址',
						trigger: 'change'
					}
				],
				// 注册电话
				invoiceRegisterMobile: [
					{
						required: true,
						message: '请输入注册电话',
						trigger: 'change'
					}
				],
				// 开户银行
				invoiceOpenBank: [
					{
						required: true,
						message: '请输入开户银行',
						trigger: 'change'
					}
				],
				// 银行账号
				invoiceBankAccount: [
					{
						required: true,
						message: '请输入银行账号',
						trigger: 'change'
					}
				]
			},
			isShowStore: 0,
			skuId: null,
			recommendToken: '',
			giftPopupShow: false, //礼卡弹出层
			fqzFocus: false,
			isSubmitOne: false,//  福气值订单是否提交过一次
			isOldPriceBuy: 0, // 是否是原价购买

			useIntegral: 0,
			businessTypeEnum: Object.freeze(BUSINESS_TYPE),
      		integralMoney: 0,
			integralCfgId: null,
			integral: 0,
			configStatus: 2
		};
	},
	onLoad(option) {
		console.log('确认页option', option);
		this.ids = option.ids ? option.ids.split(',') : [];
		this.buyNowRequestList = option.buyNowRequestList ? JSON.parse(option.buyNowRequestList) : [];
		this.isGroup = option.isGroup ? option.isGroup : 0;
		this.groupId = option.groupId ? option.groupId : null;
		if (option.gotCouponNum && option.gotCouponNum > 0) {
			this.showCouponHint(option.gotCouponNum);
		}
		if (this.buyNowRequestList.length) {
			this.skuId = this.buyNowRequestList[0].skuId;
			this.recommendToken = this.buyNowRequestList[0].recommendToken;
		}
		// 表示从购物车进入到结算页面,用于区别参数的传递
		if (option.cart && option.cart == 1) {
			cart = 1;
		}
	},
	onShow() {
		this.isShowStore = getApp().globalData.wsfBaseInfo.isShowStore; // 判断商城信息
		if (this.addressId) {
			// 选了地址情况福气值

			this.queryAddressForId();
		}
		this.loadSettlement();
		this.amountFun()
		this.$refs.integralPopup && this.$refs.integralPopup.getConfig()
	},
	onHide() {
		this.isLoading = true;
		this.needRefresh = false;
	},
	computed: {
		...mapGetters(['orderLastTotalPriceCopy']),
		sumUserCouponDiscount() {
			let list = this.settlement.storeSettlements,
				price = 0;
			if (list && list.length > 0) {
				list.forEach(item => {
					price += item.userCouponDiscount;
				});
			}
			return price
		},
		orderTotalPrice() {
			let list = this.settlement.storeSettlements,
				price = 0;
			if (list && list.length > 0) {
				list.forEach(item => {
					price += item.realPrice + item.freightPrice;
				});
			}
			if (this.settlement.platformCouponMoney) {
				price = price - this.settlement.platformCouponMoney;
			}
			console.log(this.giftMoney,'this.settlement.giftMoney');
			price = price - this.giftMoney
			price = price - this.sumUserCouponDiscount
			price = parseInt((price * 1000) - (this.fqzMoney * 1000)) / 1000
			price = price - this.integralMoney
			return price;
		}
	},
	watch: {
      /* amountNum: function(newVal){
        console.log(newVal,'newValnewValnewVal');
        this.$store.dispatch('orderLastTotalPriceCopy',newVal)
        if(this.giftIndex !== null){
          this.giftConfirm()
        }
      } */
	  'settlement.storeSettlements': {
		handler(newVal){
			console.log('222',this.settlement.storeSettlements);
			this.amountFun()
        },
        deep: true,
        // immediate: true
	  }
    },
	methods: {
		openGoodFortuneValue() {
			this.$refs.integralPopup.openGoodFortuneValue()
		},

		async amountFun(){
        //  商品价格                 数量                        //店铺优惠券    //平台优惠券
        let goodsNum = 0, price = 0,num = 0, freightPrice = 0, coupon = 0, showPlatformItem=0
        let storeSettlements = this.settlement.storeSettlements || []
		console.log(storeSettlements,'storeSettlements');
          for (let i = 0; i < storeSettlements.length; i++) {
              freightPrice+=(+storeSettlements[i].freightPrice)
              console.log(freightPrice,'freightPrice');
              if(storeSettlements[i].choosedCoupon){
                coupon+=(+storeSettlements[i].choosedCoupon.couponFull.price)
                console.log(coupon,'coupon');
              }
              for(let k = 0; k < storeSettlements[i].shoppingCartResponse.normalSkus.length; k++){
                price = storeSettlements[i].shoppingCartResponse.normalSkus[k].price
                num = storeSettlements[i].shoppingCartResponse.normalSkus[k].num
                goodsNum+=(price*num)
              }
          }
          console.log(goodsNum,freightPrice,coupon);
          if(this.showPlatformItem){
            showPlatformItem = this.showPlatformItem.price
          }else {
            showPlatformItem = 0
          }
          console.log(showPlatformItem,'showPlatformItem');
          goodsNum = +(goodsNum + freightPrice-coupon-showPlatformItem).toFixed(2)
          this.goodsNum = goodsNum
          await this.$store.dispatch('orderLastTotalPriceCopy',goodsNum)
          if(this.giftIndex !== null){
            await this.giftConfirm()
          }else {
			this.valueCardCodeId = ''
			this.giftMoney = 0
		  }
      },
		selectCoupon(item) {
			this.selectCouponItem = item;
			console.log(this.selectCouponItem, 'this.selectCouponItem');
		},
		showGiftFun(){
			this.giftPopupShow = true
		},
		selectPlatformCoupon(item) {
			this.selectPlatformCouponItem = item;
			console.log(this.selectPlatformCouponItem, 'this.selectPlatformCouponItem');
		},

		changeTab(item) {
			if (item.id == 0) {
				this.tabIndex = item.id;
				// this.getusableList();
			} else if (this.tabIndex != item.id && item.id != 0) {
				this.tabIndex = item.id;
				// this.enUsableList = [];
				// this.hasMore = true;
				// (this.queryForm.pageNum = 0), (this.tabIndex = item.id);
				// this.queryEnusableList();
			}
		},
		visitFun(data) {
			let properties = [];
			data.forEach(item => {
				for (let i = 0; i < item.shoppingCartResponse.normalSkus.length; i++) {
					let obj = {
						spuId: item.shoppingCartResponse.normalSkus[i].spuId,
						skuId: item.shoppingCartResponse.normalSkus[i].skuId,
						storeId: item.storeId
					};
					properties.push(obj);
				}
			});
			visit(this, '结算页', properties);
		},
		//计算订单总绩效
		performanceScoreOrderTotal(list) {
			if (!list || list.length < 1) {
				return 0;
			} else {
				let score = 0;
				list.forEach(item => {
					item.shoppingCartResponse.normalSkus.forEach(n => {
						if (n.performanceScore && n.performanceScore > 0) {
							score = n.performanceScore * n.num + score;
						}
					});
				});
				return score;
			}
		},
		//筛选满赠活动列表
		filterGiftSku(giftskus, price, name) {
			let tempArr = giftskus.filter(el => {
				return price >= el.fullPrice;
			});
			return tempArr.length > 0 ? tempArr[0].giftSkuInfos : [];
		},
		// 赠品信息
		getGiftInfo() {
			let skuId, gift;
			this.settlement.storeSettlements.map((item, index) => {
				item.shoppingCartResponse.normalSkus.map((temp, index) => {
					let giftPrict = temp.price * temp.num;
					skuId = temp.skuId;
					if (temp.marketingVos) {
						temp.marketingVos.map((r, index) => {
							if (r.type == 2) {
								gift = r.fullGiftList.filter(el => {
									return giftPrict >= el.fullPrice;
								});
								this.orderSkuFullGiftMap[skuId] = gift[0];
							}
						});
					}
				});
			});
		},
		//赠品已赠完取消提交
		cancelConfirm() {
			this.noStockGifts = [];
			this.noStockGiftIds = [];
		},
		//赠品已赠完继续提交
		activeConfirm() {
			if (this.noStockGifts && this.noStockGifts.length > 0) {
				let arr = [];
				arr = this.noStockGifts.map(item => {
					return item.id;
				});
				this.noStockGiftIds = arr;
			}
			this.submitOrder();
		},
		// //自动领取优惠券提示
		showCouponHint(num) {
			this.$u.toast(`已为你自动领取` + num + `张店铺优惠券，下单更优惠`);
		},
		/* 跳转 */
		navigateTo(sceneName, params, methods) {
			// this.$wsf.go('Login')
			this.$wsf.go(sceneName, params, methods);
		},
		/* 加载订单信息 */
		loadSettlement() {
			let that = this;
			let data = {
				ids: this.ids,
				addressId: this.addressId || 0,
				buyNowRequestList: this.buyNowRequestList,
				isGroup: this.isGroup
			};
			this.$u.api
				.Settlement(data)
				.then(res => {	
					console.log(res,'普通商品=================')									
					that.visitFun(res.data.storeSettlements);
					that.settlement = res.data;
					this.valueCardCods = res.data.valueCardCods || []
					if (that.settlement.limitSkuList && that.settlement.limitSkuList.length) {
						that.limitSkuList = that.settlement.limitSkuList;
					}
					let settlementTotalNum = 0;
					let defaultInvoice = {
						type: 0,
						title: '',
						content: 1,
						taxId: '',
						titleType: 2,
						invoiceCompanyName: '',
						invoiceRegisterAddress: '',
						invoiceRegisterMobile: '',
						invoiceOpenBank: '',
						invoiceBankAccount: '',
						invoicePhone: '',
						invoiceMail: ''
					};
					res.data.storeSettlements.forEach(el => {
						el.invoice = defaultInvoice;
						settlementTotalNum += el.skuNum;
					});
					//没有库存
					if(!settlementTotalNum || settlementTotalNum < 1) {
						// 返回上一页
						uni.navigateBack({
							delta: 1
						});
						setTimeout(() => {
							this.$u.toast('商品已售罄');
						}, 500);
						return
					}
					that.settlement.totalNum = settlementTotalNum;
					if (this.buyNowRequestList.length == 1) {
						this.skuNum = this.buyNowRequestList[0].num;
					}
					if (res.data.customerAddress) {
						this.addressInfo = res.data.customerAddress;
						this.addressId = res.data.customerAddress.id;
					} else {
						this.addressInfo = { id: undefined };
						this.addressId = undefined;
					}

					if (this.settlement.platformCouponCodeClassify) {
						this.platformCanUseList = this.settlement.platformCouponCodeClassify.canUse;
					}
					this.showPlatformItem = null

					//计算优惠价
					let list = that.settlement.storeSettlements;
					list.forEach(item => {
						if (item.choosedCoupon && item.choosedCoupon.type == 1) {
							item['realPrice'] = item.totalPrice - item.choosedCoupon.couponFull.price;
						} else {
							item['realPrice'] = item.totalPrice;
						}
					});
					console.log(list, 'list');
					that.settlement.storeSettlements = list;

					that.setOrderFirstPrice();
					that.setPreMarketing();
					that.calcPrice();
					that.dealCustomerAddress();
					this.getGiftInfo();
					that.isLoading = false;
					this.settlement = Object.assign({}, this.settlement);
				})
				.catch(err => {					
					if(err.data.code == 4107) {						
						setTimeout(() => {
							that.showToastError(err.data.msg);
							setTimeout(() => {
								uni.navigateBack({
									delta: 1
								});
							}, 3000);
						},500)
						return
					} else {
						if(err.data.code == -1 ) {
							that.showToastError(err.data.msg)
						} else {
							that.showToastError('获取结算信息失败');
						}
					}
				});
		},
		// 根据ID获取地址信息
		queryAddressForId() {
			if (this.addressId <= 0) return;
			this.$u.api.QueryCustomerAddressById({ id: this.addressId }).then(res => {
				if (res.data) {
					this.addressInfo = res.data;
				} else {
					this.addressInfo.id = 0;
				}
				this.addressInfo = res.data;
				this.settlement.customerAddress = res.data;
			});
		},
		showToastError(errMsg, duration = 1500) {
			uni.showToast({
				title: errMsg,
				icon: 'none',
				mask: true,
				duration: duration
			});
		},
		choosePayType() {
			let that = this;
			let storeSettlement = this.getStoreSettlement(0, this.settlement);
			wx.showActionSheet({
				itemList: ['在线支付', '货到付款'],
				success(res) {
					if (!res.cancel) {
						if (res.tapIndex === 0) {
							storeSettlement.choosedPayType = 0;
							that.payType = '在线支付';
							that.settlement = that.settlement;
						}
						if (res.tapIndex === 1) {
							storeSettlement.choosedPayType = 1;
							that.payType = '货到付款';
							that.settlement = that.settlement;
						}
					}
				}
			});
		},
		usePoint(e) {
			let storeSettlement = this.getStoreSettlement(e.storeid, this.settlement);
			if (storeSettlement.canUsePoints === 0) {
				storeSettlement.usePoints = -1;
				return;
			}
			// 使用了福气值
			if (e.detail.value) {
				storeSettlement.usePoints = storeSettlement.canUsePoints;
			} else {
				// 没使用福气值
				storeSettlement.usePoints = -1;
			}
			this.calcPrice();
		},
		submitOrder() {
			// 判断有没有收货地址
			if (!this.settlement.customerAddress) {
				this.$u.toast('请选择收货地址');
				return false;
			}
			let that = this;
			let data = this.getSubmitOrderParams();
			console.log('data', data);
			data.hasMarketingSku = that.settlement.hasMarketingSku;
			data.source = this.$store.getters.getIntoSource; // 订单来源
			// 购物车到结算页面：
			if (cart == 1) {
				data.ids = this.ids;
			} else {
				data.ids = this.ids;
				//立即购买到结算页面
				data.buyNowRequestList = [
					{
						num: this.skuNum,
						skuId: this.skuId,
						recommendToken: this.recommendToken,
						sourceType: this.buyNowRequestList[0].sourceType,
						storeId: this.buyNowRequestList[0].storeId,
					}
				];
                if(this.buyNowRequestList[0].sourceType == 5){
                    // 集采订单需传参
                    data.sourceType = 5,
                    data.entPurOrderType = 1
                    data.enterpriseAgencyId = uni.getStorageSync("enterpriseAgencyId");
                }
			}
			data.isOldPriceBuy = this.isOldPriceBuy
			console.log('--------提交订单数据data', data);			
			this.$u.api
				.SubmitOrder(data)
				.then(res => {
					console.log(res, '-----');
					if (res.data.result == 0) {
						if (this.buyNowRequestList && this.buyNowRequestList.length <= 1 && this.buyNowRequestList.length > 0) {
							//移除分销码
							// this.$storage.removeItem(this.settlement.storeSettlements[0].shoppingCartResponse.normalSkus[0].spuId); // 2022.9.22 电商v3.0需求取消购物车分销功能, 不缓存分销码
						}
						// 需要付款跳转到支付页面
						if (res.data.needPay == 0) {
							this.navigateTo(
								'Pay',
								{
									orderMoney: res.data.orderFqzMoney,
									orderCode: res.data.orderCode,
									businessType: 100,
									paySceneType: data.sourceType == 5 ? 102 : 101, //102集采订单 101电商订单
									integralPrice: res.data.integralPrice
								},
								'redirectTo'
							);
						} else {
							// 不需要付款 跳转到付款成功页面
                            uni.requestSubscribeMessage({
                            tmplIds: [
                                "r0q1HXh-tFnkpr6iL1FFc4UsFEHYp7mG1fxAvUBnw-Q", //订单支付成功通知
                                "8KL_v78QDVSy8DVKTrstVadGiOo-_J2HUQFq_S2BBbw", //订单发货通知
                                "rfQ3XaHakX4IkpgafumXFeTWgEDqdMKesyCtJaZKGxE", //订单签收提醒
                            ],
                            success(res) {
                                console.log("成功回调：", res);
                            },
                            fail(res) {
                                console.log("失败回调：", res);
                            },
                            complete: () => {
                                console.log("关闭了消息订阅授权：");
                                this.$u.api.uniformMessageSend({
                                type: 3,
                                orderCode: res.data.orderCode,
                                openId: uni.getStorageSync("openId"),
                                })
                                .then((res) => {})
                                .catch((err) => {});

                                this.$wsf.go('CheckOrderPay', { orderCode: res.data.orderCode, isThirdPay: 0, orderMoney: ~~(res.data.orderFqzMoney * 100).toPrecision(12), payStatus: 'PAID', businessType: BUSINESS_TYPE.mall });
                            },
                        });
							// this.navigateTo('OrderNoPaySuccess', { orderMoney: res.data.orderMoney });
						}
					} else if (res.data.result == 105 || res.data.result == 106 || res.data.result == 4114 || res.data.result == 4103) {
						uni.navigateBack();
					} else if (res.data.result == '-13') {
						//秒杀商品达到限购数
						if (res.data.skuLimitVo) {
							if (res.data.skuLimitVo.panicBuyLimitList && res.data.skuLimitVo.specialAreaLimitList) {
								this.showLimit = true;
								this.limitSkuList = res.data.skuLimitVo.panicBuyLimitList;
								this.limitFirstList = res.data.skuLimitVo.specialAreaLimitList;
								return;
							}
							if (res.data.skuLimitVo.panicBuyLimitList && res.data.skuLimitVo.panicBuyLimitList.length) {
								this.showLimit = true;
								this.limitSkuList = res.data.skuLimitVo.panicBuyLimitList;
								this.limitFirstList = [];
								return;
							}
							if (res.data.skuLimitVo.specialAreaLimitList && res.data.skuLimitVo.specialAreaLimitList.length) {
								this.showLimit = true;
								this.limitFirstList = res.data.skuLimitVo.specialAreaLimitList;
								this.limitSkuList = [];
								return;
							}
						}
					} else {
						if (res.data.needPay == -1) {
							this.showConfirm = true;
							this.noStockGifts = res.data.noStockGifts;
						} else {
							this.$u.toast(that.orderError[res.data.result]);
						}
					}
				})
				.catch(res => {
                    if(res.data.code == 4108){
                        this.$u.toast(res.data.msg)
                        // 库存不足
                        setTimeout(() => {
							uni.navigateBack({
								delta: 1
							});
						}, 2000);
                        return
                    }
                    if (res.data.code == 4109) {
                        this.$u.toast(res.data.msg)
                        // 禁止分销
                        this.buyNowRequestList[0].recommendToken = null
                    }
					if (res.data.code == 4105) {
            			this.$u.toast('商品信息发生改变，为您刷新页面！')
          			}else{
                        this.$u.toast(res.data.msg)
                    }
					
					// 福气值不足时
					if(res.data.code == 80001) {
						this.isOldPriceBuy = 1
						this.$u.toast('福气值不足，按原价购买')
						this.loadSettlement()
						return
					}
					this.giftIndex = null
					this.giftMoney = 0
					this.valueCardCodeId = ''
					// 订单提交失败
					setTimeout(() => {
						this.loadSettlement();
						this.$refs.integralPopup && this.$refs.integralPopup.getConfig()
					}, 1000);
				});
		},
		// 返回需要提交的订单信息
		getSubmitOrderParams() {
			let params = {};
			let settlement = this.settlement;
			params.addressId = settlement.customerAddress.id;
			params.invoiceList = this.settlement.storeSettlements.map(el => {
				let invoice = el.invoice;
				invoice.storeId = el.storeId;
				return invoice;
			});
			params.storeInfos = this.getStoreInfos();
			params.ids = settlement.ids;
			params.buyNowRequestList = this.buyNowRequestList;
			params.redEnvelopeCode = settlement.redEnvelopeCode;
			params.isGroup = this.isGroup;
			params.groupId = this.groupId;
			params.orderToken = settlement.orderToken;
			params['orderSkuFullGiftMap'] = this.orderSkuFullGiftMap;
			params['noStockGiftIds'] = this.noStockGiftIds;
			params.platformCouponCode = settlement.platformCouponCode;
			params.valueCardCodeId = this.valueCardCodeId  //礼卡
			params.integralPoint = this.useIntegral // 福气值
      		params.integralCfgId = this.integralCfgId
			let productCouoponIds = []
			this.settlement.storeSettlements.forEach(item => {
				productCouoponIds = productCouoponIds.concat(item.onlineRetailerCouponIds)
			})
			params.onlineRetailerCouponIds = productCouoponIds
			return params;
		},
		// 返回店铺信息
		getStoreInfos() {
			let storeinfos = [];
			let settlement = this.settlement;
			for (let i = 0; i < settlement.storeSettlements.length; i++) {
				let storeinfo = {};
				storeinfo.storeId = settlement.storeSettlements[i].storeId;
				storeinfo.payType = settlement.storeSettlements[i].choosedPayType;
				storeinfo.remark = settlement.storeSettlements[i].remark;
				if (settlement.storeSettlements[i].choosedCoupon) {
					storeinfo.couponCode = settlement.storeSettlements[i].choosedCoupon.code;
				}
				storeinfo.usePoints = settlement.storeSettlements[i].usePoints;
				storeinfos.push(storeinfo);
			}
			return storeinfos;
		},

		dealCustomerAddress() {
			if (!!this.settlement.customerAddress) this.settlement.customerAddress.address = this.settlement.customerAddress.address.replace(/,/g, '');
		},
		setOrderFirstPrice() {
			// 设置订单的初始价格

			this.orderLastTotalPrice = this.settlement.orderLastTotalPrice;
			this.orderDiscountPrice = this.settlement.orderDiscountPrice;
			this.orderTotalFright = this.settlement.orderTotalFright;
		},
		setPreMarketing() {
			// 设置预售促销
			let preMarketing = null,
				storeSettlements = this.settlement.storeSettlements;
			for (let i = 0; i < storeSettlements.length; i++) {
				if (storeSettlements[i].preMarketing) {
					preMarketing = storeSettlements[i].preMarketing;
				}
			}

			this.preMarketing = preMarketing ? preMarketing : null;
		},
		isDepositPresaleMarketing() {
			return !!this.preMarketing && this.preMarketing.type == '7';
		},
		calcPrice() {
			//  使用福气值的金额  （目前主要是平台的金额）
			let pointMoney = 0;

			// 包邮减去的价格
			let freeShipPrice = 0;

			// 每个店铺的订单
			let storeSettlements = this.settlement.storeSettlements;

			let settlement = this.settlement;

			// 使用优惠券的总价格
			let couponPrice = 0;

			for (let i = 0; i < storeSettlements.length; i++) {
				// 店铺结算信息
				let storeSettlement = storeSettlements[i];
				// 店铺一共优惠的价格
				let discountPrice = storeSettlement.totalDiscountPrice;

				// 如果选择了优惠券则设置优惠券的优惠金额
				if (!!storeSettlement.choosedCoupon) {
					// 优惠券的价格
					let couponLastPrice = storeSettlement.choosedCoupon.lastPrice;

					// 如果优惠券减去的价格比订单的价格大则减去的价格试用订单的价格 防止出现负数
					if (couponLastPrice > storeSettlement.totalPrice) {
						couponLastPrice = storeSettlement.totalPrice;
					}

					discountPrice = discountPrice + couponLastPrice;
					couponPrice = couponPrice + couponLastPrice;
				}

				// 店铺的总金额 ＝ 原始金额－优惠 （优惠券和福气值）
				let storePrice = storeSettlement.originTotalPrice - discountPrice;

				// 店铺最后不算运费的价格
				storeSettlement.storePrice = storePrice;
				// 店铺最后不算运费的价格拷贝,计算红包的时候使用
				storeSettlement.storePriceCopy = storePrice;

				// 如果有包邮促销
				if (!!storeSettlement.freeShip && storeSettlement.freeShip.freeShip.isUse === '1') {
					// 看店铺的促销后的价格 是否满足了包邮的条件
					if (storePrice >= storeSettlement.freeShip.freeShip.fullPrice) {
						freeShipPrice = freeShipPrice + storeSettlement.freightPrice;
					}
				}
			}

			// 所有优惠的金额
			settlement.orderDiscountPrice = this.orderDiscountPrice + couponPrice + pointMoney;
			// 总的运费
			settlement.orderTotalFright = this.orderTotalFright - freeShipPrice;
			// 结算的最后金额＝ 后端返回的最后结算金额 － 前端优惠金额（优惠券和福气值） － 免费的包邮
			settlement.orderLastTotalPrice = this.orderLastTotalPrice - couponPrice - pointMoney - freeShipPrice;

			// 拷贝一份价格 方便后面红包使用
			settlement.orderDiscountPriceCopy = settlement.orderDiscountPrice;
			settlement.orderTotalFrightCopy = settlement.orderTotalFright;
			settlement.orderLastTotalPriceCopy = settlement.orderLastTotalPrice;

			// 只要价格发生变动 就取消红包的使用
			this.settlement.redEnvelopeCode = '';
			// 计算可以使用的红包
			this.calcCanUseRedEnvelope();

			this.settlement = settlement;
			// 检测福气值是否超界
			this.$nextTick(() => {
        		this.integralMoney > this.orderLastTotalPrice && this.$refs.integralPopup.checkIntegralNum(this.useIntegral)
      		})
		},
		calcCanUseRedEnvelope() {
			let canUseRedEnvelope = [];
			let settlement = this.settlement;

			// 判断是否有可以使用的红包
			if (settlement.redEnvelopeCodes && settlement.redEnvelopeCodes.length > 0) {
				// 如果有可以使用的红包 则判断 是否满足使用的条件
				for (let i = 0; i < settlement.redEnvelopeCodes.length; i++) {
					// 店铺总的价格
					let price = 0;
					for (let j = 0; j < settlement.redEnvelopeCodes[i].redEnvelopeStoreId.length; j++) {
						price += this.getStorePrice(settlement.redEnvelopeCodes[i].redEnvelopeStoreId[j]);
					}

					// 判断店铺总的价格是否满足红包的条件
					if (price >= settlement.redEnvelopeCodes[i].redEnvelope.fullPrice) {
						canUseRedEnvelope.push(settlement.redEnvelopeCodes[i]);
					}
				}
			} else {
				canUseRedEnvelope = [];
			}

			this.canUseRedEnvelope = canUseRedEnvelope;
		},
		// 获得店铺不算运费的总价
		getStorePrice(storeId) {
			let price = 0;
			let settlement = this.settlement;
			for (let i = 0; i < settlement.storeSettlements.length; i++) {
				if (settlement.storeSettlements[i].storeId === storeId) {
					return settlement.storeSettlements[i].storePrice;
				}
			}
			return price;
		},
		getStoreSettlement(storeId, settlement) {
			if (settlement.storeSettlements && settlement.storeSettlements.length > 0) {
				for (let i = 0; i < settlement.storeSettlements.length; i++) {
					if (settlement.storeSettlements[i].storeId === storeId) {
						return settlement.storeSettlements[i];
					}
				}
			}
		},
		// 不进器+
		plusNumber(param) {
			// let obj = {
			//   isIgnoreCartNum: true,
			//   buyNowRequestList: [
			//     {
			//       num: this.skuNum,
			//       skuId: this.skuId,
			//     },
			//   ],
			// };
			// this.$u.api.CheckSkuPanicBuyLimitNum(obj).then((res) => {
			//   if (res.data && res.data.limitNum) {
			//     if (res.data.hasBoughtNum) {
			//       this.skuNum = res.data.limitNum-res.data.hasBoughtNum;
			//       this.$u.toast(
			//         `限购${res.data.limitNum}件,你已购买过${res.data.hasBoughtNum}件了`
			//       );
			//     } else {
			//       this.skuNum = res.data.limitNum;
			//       this.$u.toast(`抱歉，该商品限购${res.data.limitNum}件`);
			//     }
			//   } else {
			//     console.log('dadadasdafasfasfafasfs');
			//   }
			// });
		},
		// 商品数量更改
		async goodsNumChange(stock) {
			// if(this.marketingVos.length){
			let verify = true;
			let obj = {
				isIgnoreCartNum: true,
				buyNowRequestList: [
					{
						num: this.skuNum,
						skuId: this.skuId,
						sourceType: this.buyNowRequestList[0].sourceType,
						storeId: this.buyNowRequestList[0].storeId,
					}
				]
			};
			await this.$u.api.CheckSkuPanicBuyLimitNum(obj).then(res => {
				console.log(res, '校验是否超过平台秒杀限制数');				
				if (res.data && res.data.limitNum) {
					if (res.data.hasBoughtNum) {
						this.skuNum = res.data.limitNum - res.data.hasBoughtNum;
						this.$u.toast(`限购${res.data.limitNum}件,你已购买过${res.data.hasBoughtNum}件了`);
					} else {
						this.skuNum = res.data.limitNum;
						// this.$u.toast(`抱歉，该商品限购${this.skuNum}件`)
						this.$refs.uToast.show({ title: `抱歉，该商品限购${this.skuNum}件` });
					}
					verify = false;
				} else {
					// this.maxNumber = 99999
					verify = true;
				}
			});

			if (!verify) {
				console.log('&&&&&&&&&&&&&');
				return false;
			}
			// }
			console.log(this.skuNum, '-----------this.skuNum');
			console.log(stock, 'stock------------');
			if (this.skuNum > stock) {
				this.showToastError('商品加购件数(含已加购件数)已超过库存!');
				if(stock > 0) {
					this.skuNum = stock;
				} else {
					this.skuNum = 1
				}
				// return
			}

			//置空平台优惠券
			this.settlement.platformCouponCode = null;
			this.settlement.platformCouponMoney = null;
			this.showPlatformItem = null;
			this.selectPlatformCouponItem = null;

			let data = this.buyNowRequestList[0];
			data.num = this.skuNum;
			this.buyNowRequestList[0] = data;
			// 节流
			if (this.timeout) {
				clearTimeout(this.timeout);
			}
			this.timeout = setTimeout(this.loadSettlement, 300);
			this.giftConfirm()
		},

		// 注入规则
		setRules(e) {
			if (e <= 0) return;
			this.$nextTick(function() {
				console.log('this.formRules', this.formRules);
				this.$refs.uForm.setRules(this.formRules);
				this.$refs.uForm.resetFields();
			});
		},
		openPopupGift(){
			this.giftPopupShow = true
		},
		// 优惠券弹窗回调
		setConpunDetail(params) {
			let index = this.productCouponItemIndex
			let item = this.settlement.storeSettlements[index]
			item.onlineRetailerCouponIds = params.ids
			item.userCouponDiscount = params.userCouponDiscount
			item.usableCouponNum = params.usableCouponNum
			this.$set(this.settlement.storeSettlements,index,item)
		},
		// 打开弹出层
		async openPopup(type, info, storeId) {
			// 清空数据
			this.popupShowContent = this.$u.deepClone(info);
			this.popupShowContent.type = type;
			// type - 1 运费 2 - 发票
			if (type == 1) {
				this.popupShowContent.title = '配送';
			} else if (type == 2) {
				this.popupShowContent.title = '发票';
				// this.popupShowContent.storeId = storeId;
			} else if (type == 3) {
				// 打开优惠券弹窗
				const skuList = info.normalSkus.map(item => {
					let obj = {
						spuId: item.spuId,
						skuId: item.skuId,
						num: item.num,
						beforeCouponPrice: item.price
					}
					return obj
				})
				const params = {
					skuList,
					ids: info.onlineRetailerCouponIds
				}
				this.productCouponItemIndex = info.index
				this.$refs.coupon.setShowCopun(params)
				return
			} else if (type == 4) {
				this.popupShowContent.title = '优惠券';
				if (!this.showPlatformItem) {
					this.selectPlatformCouponItem = null;
				}
				//刚进入时平台优惠券取settlement接口数据
				if (!this.isCallCheckPlatformCouponApi) {
					this.platformCanUseList = this.settlement.platformCouponCodeClassify.canUse;
					this.platformNoUseList = this.settlement.platformCouponCodeClassify.canNotUse;
					this.tabList[0].number = this.settlement.platformCouponCodeClassify.canUse.length;
					this.tabList[1].number = this.settlement.platformCouponCodeClassify.canNotUse.length;
				}
			}
			this.popupShow = true;
		},
		// 确定选项
		confirmSelect() {
			// popupShowContent.type  1 - 配送 2 - 发票 3 - 优惠券
			if (this.popupShowContent.type == 1) {
				/* Todo 多物流选项,目前暂无 */
				this.popupShow = false;
			} else if (this.popupShowContent.type == 2) {
				// 选择发票
				if (this.popupShowContent.invoice.type > 0) {
					this.$refs.uForm.validate(valid => {
						if (!valid) return;
						// 判断是哪个商店 赋值属性
						this.settlement.storeSettlements.forEach(el => {
							el.invoice = this.popupShowContent.invoice;
						});
						this.invoice = this.popupShowContent.invoice
						this.$u.toast('保存成功');
						this.popupShow = false;
					});
				} else {
					this.$u.toast('保存成功');
					this.popupShow = false;
				}
			} else if (this.popupShowContent.type == 4) {
				if (this.selectPlatformCouponItem) {
					this.settlement.platformCouponCode = this.selectPlatformCouponItem.couponCode;
					this.settlement.platformCouponMoney = this.selectPlatformCouponItem.price;
					this.showPlatformItem = this.selectPlatformCouponItem;
				} else {
					this.settlement.platformCouponCode = null;
					this.settlement.platformCouponMoney = null;
					this.showPlatformItem = null;
				}
				//触发计算总价的computed
				this.settlement = Object.assign({}, this.settlement);
				this.popupShow = false;
			}
			this.amountFun()
		},
		explainFun(item) {
			let txt = "";
			if (item.permittedType == 1) {
				txt = `仅${item.marketingName}活动商品可用`;
			}
			if (item.permittedType == 2) {
				txt = `仅${item.storeNames}店铺的商品可用`;
			}
			this.explainText = txt;
			this.explain = true;
		},
		//格式化金额显示,s为金额数字，n为精确小数位,isAry 是否返回数组形式如: 23.88 ==> [23,88] 默认 false
      fmoney(s, n, isAry = false) {
        n = n > 0 && n <= 20 ? n : 2
        s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + ''
        let l = s
            .split('.')[0]
            .split('')
            .reverse(),
          r = s.split('.')[1],
          t = ''
        for (let i = 0; i < l.length; i++) {
          t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? ',' : '')
        }
        return isAry
          ? [
              t
                .split('')
                .reverse()
                .join(''),
              r,
            ]
          : t
              .split('')
              .reverse()
              .join('') +
              '.' +
              r
      },
	  giftSelectCoupon(item,index=undefined){
        if(!item){
          this.giftIndex = null
		  this.giftMoney = 0
          return
        }
        this.giftIndex = index
		giftIndex_ = index
		giftData_ = item
        giftData = item
       },
	   //   礼卡弹出层打开
	   giftOpen(){
	  },
	  //  礼卡弹出层关闭
	  giftClose(){
		if(isConfirm){
			this.giftSelectCoupon(giftData,this.giftIndex)
		}else if(this.giftDeduction>0){
			this.giftSelectCoupon(giftData_,giftIndex_)
		}else {
			this.giftSelectCoupon(null)
		}
		isConfirm = false
		this.settlement = Object.assign({}, this.settlement);
      },
	  isConfirmFn(){
		  isConfirm = true
	  },
	  giftConfirm(){
		// 是否点击了确定按钮
		// this.giftIndex = this.giftIndex_
        this.giftPopupShow = false
		if(+this.orderLastTotalPriceCopy > (giftData && giftData.balance || 0)) {
			this.giftDeduction = giftData && giftData.balance || 0
		}else {
			this.giftDeduction = this.orderLastTotalPriceCopy
		}
		this.giftMoney = this.giftDeduction
		this.valueCardCodeId = giftData && giftData.valueCardCodeId
      },
	  amount(item){
		let num = item.realPrice + item.freightPrice
        this.amountNum = num
        // this.item.choosedCoupon ? (this.item.totalPrice - this.item.choosedCoupon.couponFull.price + this.item.freightPrice).toFixed(2) : this.item.totalPrice.toFixed(2)
        return num
	  }

	},
	filters: {
      dateFilter(value) {
		let arr = value.split(" ")[0];
		let str = arr.split('-').join('.')
		return str;
	  },
      thumbnailString(value){
        if(value && value.length > 15){
          return value.substring(0,15)+'. . .'
        }
        return value
      }
    },
};
</script>

<style lang="scss" scoped>
.settlement-page {
	padding: 0;
	display: flex;
	flex-direction: column;
	height: 100%;
	.srcoll-container {
		flex: 1;
		overflow-y: auto;
		padding: 24rpx;
	}
}
.coupon-text {
	line-height: 28rpx;
}
.more-icon {
	width: 32rpx;
	height: 32rpx;
	margin-left: 4rpx;
}
.warp {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	padding: 100rpx;
	.rect {
		width: 100%;
		background-color: #fff;
		border-radius: 20rpx;
		box-sizing: border-box;
		padding: 60rpx 0rpx 40rpx 0rpx;
		.title {
			width: 100%;
			text-align: center;
			font-size: 32rpx;
			font-weight: 500;
			color: #000000;
		}
		.list {
			width: 100%;
			margin-top: 60rpx;
			margin-bottom: 65rpx;
			.scroll-Y {
				max-height: 600rpx;
			}
			.limit-item::after {
				content: '';
				height: 0.4rem;
				background-color: #f2f2f2;
				width: 100%;
				display: inline-block;
				margin-bottom: 18px;
			}
			.limit-item:last-child::after {
				display: none;
			}
			.content {
				width: 100%;
				display: flex;
				padding: 0 50rpx;
				.left {
					width: 120rpx;
					height: 120rpx;
					image {
						width: 120rpx;
						height: 120rpx;
					}
				}
				.right {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					width: 100%;
					.txt-2 {
						color: #e60113;
					}
					.limit-num {
						font-size: 24rpx;
						color: #e60113;
					}
				}
			}
		}
		.btn {
			width: 100%;
			display: flex;
			justify-content: center;
			.btn-item {
				width: 320rpx;
				height: 60rpx;
				border: 1rpx solid #e60113;
				font-size: 24rpx;
				font-weight: 500;
				color: #e60113;
				text-align: center;
				line-height: 60rpx;
				border-radius: 60rpx;
			}
		}
	}
}

page,
view,
text {
	color: #000000;
}

.wsf-red {
	color: #FF0A35;
}
.wsf-grey {
	color: #999;
}

.address-info {
	color: #000000;
	border-radius: 16rpx;
	overflow: hidden;
	padding: 24rpx 20rpx 26rpx;
	background: #fff;
	.detailAddress {
		padding-right: 52rpx;
		word-break: break-all;
	}
	.default-icon {
		width: 56rpx;
		height: 28rpx;
		background: #FF0A35;
		border-radius: 4rpx;
		display: inline-block;
		text-align: center;
		line-height: 28rpx;
		font-size: 20rpx;
		color: #fff;
		vertical-align: middle;
		margin-right: 12rpx;
		font-weight: normal;
		>span {
			color: #191919;
			line-height: 34rpx;
		}
	}
	.font-bold {
		font-weight: bold;
	}
	.divide-line {
		position: absolute;
		background: repeating-linear-gradient(135deg, #fa7f6a, #fa7f6a 5%, white 2.5%, white 7.5%, #739cfa 7.5%, #739cfa 12.5%, white 12.5%, white 15%);
		height: 6rpx;
		width: 100%;
		bottom: 0rpx;
		left: 0;
	}
	.more-icon {
		width: 32rpx;
		height: 32rpx;
		right: 20rpx;
		top: 50%;
		transform: translateY(-50%);
	}

}
.store-card {
	color: #000000;
	background-color: #fff;
	border-radius: 20rpx;
	overflow: hidden;
	padding: 24rpx 0;
	.store-icon {
		margin-right: 8rpx;
		display: inline-block;
		vertical-align: middle;
		width: 28rpx;
		height: 28rpx;
		background-image: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/shopcart_icon.png') no-repeat;
		background-repeat: no-repeat;
		background-size: cover;
	}
	.product {
		height: 204rpx;
		display: flex;
		&.product-bottom {
			margin-bottom: 36rpx;
		}
		.img {
			width: 204rpx;
			height: 204rpx;
			border-radius: 10rpx;
			overflow: hidden;
		}
		.detail {
			height: 100%;
			vertical-align: top;
			overflow: hidden;
			.detail-top {
				overflow: hidden;
			}
			.title {
				max-height: 68rpx;
				line-height: 34rpx;
			}
			.spec {
				line-height: 28rpx;
				padding-top: 12rpx;
				.divide-short {
					vertical-align: middle;
					display: inline-block;
					height: 14rpx;
					margin: 8rpx;
					width: 2rpx;
					background-color: #999;
				}
			}
			.tag-part {
				margin-top: 8rpx;
				display: flex;
				align-items: center;

				.sale-price {
					display: inline-block;
					margin-right: 12rpx;
					width: 116rpx;
					height: 28rpx;
					position: relative;
					.price-tag {
						height: 100%;
						width: 60rpx;
						text-align: center;
						line-height: 28rpx;
						color: #fff;
						font-size: 18rpx;
						position: absolute;
						right: 0;
						top: 0;
					}
					image {
						width: 100%;
						height: 100%;
					}
				}
				.bug-send {
					margin-right: 12rpx;
					display: inline-block;
					padding: 0 6rpx;
					line-height: 28rpx;
					height: 28rpx;
					border-radius: 4rpx;
					border: 2rpx solid $wsf-color-red;
					font-size: 20rpx;
					color: $wsf-color-red;
				}
			}
			.price {
				line-height: 52rpx;
				font-weight: bold;
				color: #191919;
				.price-icon {
					display: inline;
					color: #191919;
				}
				.num {
					color: #000;
					&.wsf-grey {
						color: #999;
						font-weight: normal;
					}
					.num-icon {
						display: inline;
					}
					/deep/.u-numberbox {
						background: transparent;
						border-radius: 22rpx;
						.u-icon-minus, .u-icon-plus {
							background: transparent!important;
							height: 44rpx !important;
							width: 44rpx !important;
							.u-icon__icon {
								font-size: 20rpx !important;
								font-weight: bold !important;
							}
						}
						.u-number-input {
							margin: 0;
							background: #F6F6F6!important;
							height: 44rpx !important;
							width: 44rpx !important;
							font-size: 20rpx !important;
							border-radius: 8rpx;
						}
					}
				}
			}

			.fqz-price {
				.fqz-num {
					font-size: 22rpx;
					font-weight: 600;
					color: #191919;
					.special {
						font-size: 32rpx;
						font-weight: bold;
					}
				}
			}
			.performance-part {
				vertical-align: text-bottom;
				display: inline-block;
				height: 44rpx;
				background: #fcf0f2;
				border-radius: 22rpx;
				line-height: 44rpx;
				padding: 0 20rpx;
				font-size: 26rpx;
				color: #e60113;
			}
			.performance-mark {
				padding: 0 8rpx;
				display: flex;
            	align-items: center;
				height: 28rpx;
				line-height: 30rpx;
				border-radius: 8rpx;
				color: #008864;
				font-size: 22rpx;
				margin-bottom: 8rpx;
				width: fit-content;
				padding: 2rpx 8rpx;
				background: linear-gradient(90deg, #ECFFFC 0%, #F4FAFF 100%);
				>image {
					width: 28rpx;
					height: 28rpx;
				}
			}
		}
	}
	.total {
		position: relative;
		&::after {
			content:'';
			position: absolute;
			width: auto;
			height: 2rpx;
			background: #f2f2f2;
			left: 20rpx;
			right: 20rpx;
			top: 0;
		}
	}
	.detail-item {
		padding: 20rpx 24rpx 18rpx;
		&.no-right {
			padding-right: 60rpx;
		}
		&.bill-item {
			padding: 0 24rpx;
		}
		.label {
			color: #191919;
		}
		.activity-label {
			color: #FF0A35;
			border: 1rpx solid #FF0A35;
			height: 28rpx;
			font-size: 20rpx;
			line-height: 28rpx;
			padding: 0 12rpx;
			border-radius: 8rpx;
			margin-left: 8rpx;
		}
		/deep/ .u-input__input {
			height: 28rpx;
			min-height: 28rpx !important;
			line-height: 28rpx;
			font-size: 22rpx;
		}
		/deep/ .u-input__right-icon {
			height: 28rpx;
		}
	}
	.gift-list {
		padding: 16rpx 0;
		.gift-product {
			padding: 10rpx 0;
			color: #999;
			font-size: 22rpx;
			display: flex;
			align-items: center;
			line-height: 22rpx;
			.gift-product-name {
				text-align: left;
				width: 508rpx;
			}
			.gift-product-num {
				margin-left: auto;
			}
		}
	}
}
.footer-bottom-space {
	position: fixed;
	bottom: 0;
	height: 68rpx;
	width: 100%;
	background-color: #fff;
	z-index: 999;
}
.fixed-column-space {
	bottom: 68rpx !important;
	margin-bottom: 20rpx;
}
.fixed-column {
	color: #000000;
	background-color: #fff;
	width: 100%;
	height: 150rpx;
	padding-bottom: 30rpx;
	.all-price {
		font-weight: bold;
		color: #191919;
	}
	.order-submit {
		width: 260rpx;
		height: 80rpx;
		background: linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%);
		border-radius: 40rpx;
		line-height: 80rpx;
		color: #FFF9E9;
		font-size: 32rpx;
		text-align: center;
	}
	.sms-user-conpon-discount {
		color: #FF0A35;
		font-size: 22rpx;
		text-align: right;
	}
}
// 弹出层内容
.applet-settlement-popup-wrap {
	color: #000000;
	position: relative;
	border-radius: 20rpx 20rpx 0 0;
	background-color: #fff;
	.applet-settlement-popup-header {
		height: 100rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: relative;
		&-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #000000;
		}
		&-title-center {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
		}
		&-close {
			height: 100rpx;
			width: 104rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			&-icon {
				height: 32rpx;
				width: 32rpx;
			}
		}
	}
	.applet-settlement-popup-body {
		color: #000000;
		// 运费模块
		.applet-settlement-popup-distribution {
			&-item {
				font-size: 14px;
				color: #000000;
				line-height: 14px;
			}
		}
		// 发票模块
		.applet-settlement-popup-invoice {
			padding-left: 36rpx;
			.applet-settlement-popup-invoice-form-group {
				padding: 20rpx 0;
				&-title {
					color: #000000;
					font-weight: 500;
					font-size: 26rpx;
					line-height: 64rpx;
					height: 64rpx;
				}
				&-tips {
					padding-top: 12rpx;
					font-size: 24rpx;
					color: #999999;
				}
				// 修复表单的间隔
				& /deep/ .u-form-item {
					padding: 8rpx 0;
				}
				// 修复输入框右侧的清除按钮样式
				& /deep/ .u-input__right-icon {
					height: 48rpx;
				}
			}
		}
	}
}
.gift-product-list {
	.gift-product {
		display: flex;
		align-items: center;
		margin-top: 36rpx;
		&:first-child {
			margin-top: 0;
		}
		image {
			width: 100rpx;
			height: 100rpx;
			border-radius: 6rpx;
		}
		.content {
			margin: 12rpx 20rpx;
			color: #666;
			font-size: 26rpx;
			width: 388rpx;
		}
	}
}

.header-tabs {
	z-index: 999;
	width: 100%;
	height: 80rpx;
	display: flex;
	align-items: center;
	background-color: #fff;
	border-bottom: 1rpx solid #f2f2f2;
	.tabs {
		font-weight: bold;
		text-align: center;
		height: 100%;
		flex: 1;
		position: relative;
		font-size: 28rpx;
		color: #000;
		display: inline-block;
		line-height: 80rpx;
		i {
			position: absolute;
			bottom: 0;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 56rpx;
			height: 6rpx;
			background: #e60113;
			border-radius: 4rpx;
			overflow: hidden;
			&.active {
				font-weight: bold;
			}
		}
	}
}
.empty-page {
	text-align: center;

	height: 100%;
	image {
		margin-top: 120rpx;
		width: 180rpx;
		height: 180rpx;
	}
	.nocoupon-txt {
		font-size: 28rpx;
		color: #999;
		margin-top: -6rpx;
		height: 40rpx;
		line-height: 40rpx;
	}
}
.coupon-list {
	padding: 40rpx 0;
	.coupon-discount-sum {
		padding: 0 24rpx 40rpx;
		font-size: 28rpx;
		color: #000;
		line-height: 36rpx;
	}
	.disabled-coupon {
		background: #f2f2f2;
		.main-ticket {
			width: auto !important;
		}
	}
	.product-coupon {
		background: #fef4f4;
	}
	.store-coupon {
		background: #fff7ee;
	}
	.coupon {
		margin: 0 24rpx 20rpx;
		height: 196rpx;
		border-radius: 16rpx;
		overflow: hidden;
		display: flex;
		position: relative;
		.usable-mark {
			position: absolute;
			right: 16rpx;
			top: 16rpx;
			color: #FE8993;
			line-height: 28rpx;
			font-size: 20rpx;
		}
		.main-ticket {
			width: 502rpx;
			position: relative;
			padding: 52rpx 0 20rpx 56rpx;
			.coupon-detail {
				display: inline-flex;
				align-items: center;
				height: 76rpx;
				.disabled-color {
					color: #999 !important;
				}
				.store-color {
					color: #fe8c02 !important;
				}
				.product-color {
					color: #e60113 !important;
				}
				.coupon-price {
					font-weight: 600;
					display: inline-flex;
					align-items: baseline;
					.text {
						font-size: 28rpx;
						line-height: 40rpx;
					}
					.price {
						margin: 0 8rpx;
						font-size: 64rpx;
						line-height: 76rpx;
					}
				}
				.full-discount {
					font-size: 28rpx;
				}
				.coupon-info {
					padding-top: 16rpx;
					margin-left: 56rpx;
					display: inline-flex;
					flex-direction: column;
					justify-content: space-between;
					align-items: flex-start;
					.condition {
						width: 340rpx;
						color: #000;
						font-size: 28rpx;
						line-height: 40rpx;
						font-weight: 500;
						overflow:hidden;
						text-overflow:ellipsis;
						white-space:nowrap;
						margin-bottom: 16rpx;
					}
					.indate {
						color: #666;
						font-size: 22rpx;
						line-height: 32rpx;
					}
					.explain {
						margin-top: 16rpx;
					}
				}
			}
			.coupon-explain {
				white-space: nowrap;
				padding-top: 16rpx;
				font-size: 0;
				color: #666;
				line-height: 32rpx;
				text {
					font-size: 22rpx;
				}
			}

			.disabled-mark {
				background: #999;
			}
			.store-mark {
				background: #ffb760;
			}
			.product-mark {
				background: #fe8993;
			}

			.main-mark {
				width: 100rpx;
				height: 36rpx;
				border-radius: 0 0 16rpx 0px;
				position: absolute;
				left: 0;
				top: 0;
				text-align: center;
				line-height: 36rpx;
				font-size: 20rpx;
				color: #fff;
			}
		}
		.stub-ticket {
			width: 200rpx;
			display: inline-flex;
			align-items: center;
			justify-content: flex-end;
			.choosebox {
				width: 36rpx;
				height: 36rpx;
				margin-right: 36rpx;
			}
		}
	}
}
.gift_main {
	.title {
		height: 100rpx;
		text-align: center;
		line-height: 100rpx;
		font-size: 32rpx;
		color: #000;
		font-weight: 800;
		background-color: #F5F5F5;
	}
	.content{
		background-color: #F5F5F5;
		padding: 0 24rpx 24rpx 24rpx;
		height: 100%;
		.min_card {
        margin-bottom: 24rpx;
        overflow: hidden;
        width: 100%;
        border-radius: 20rpx;
        .up {
          color: #fff;
          background-color: #7689df;
          box-sizing: border-box;
          padding: 24rpx;
          .txt_1 {
            display: flex;
            justify-content: space-between;
            font-size: 30rpx;
			text {
				color: #fff;
			}
            .sp {
              font-size: 24rpx;
              display: flex;
              align-items: center;
            }
          }
          .txt_2 {
			text {
				color: #fff;
			}
            margin-top: 20rpx;
            display: flex;
            justify-content: space-between;
            text:nth-child(1) {
              font-size: 26rpx;
            }
            text:nth-child(2) {
              font-size: 22rpx;
            }
          }
        }
        .down {
          background-color: #fff;
          box-sizing: border-box;
          padding: 40rpx 24rpx;
          display: flex;
          .left {
            flex: 0.7;
            view:nth-child(1) {
              font-size: 24rpx;
              text {
                font-size: 36rpx;
              }
            }
            view:nth-child(2) {
              display: flex;
              justify-content: center;
              align-items: center;
              margin-top: 20rpx;
              font-size: 24rpx;
              color: #999;
            }
          }
          .right {
            flex: 0.3;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            .stub-ticket {
              width: 200rpx;
              display: inline-flex;
              align-items: center;
              justify-content: flex-end;
              .choosebox {
                width: 36rpx;
                height: 36rpx;
                margin-right: 36rpx;
              }
            }
          }
        }
      }
	}
	.footer {
		background-color: #fff;
		width: 100%;
		height: 100rpx;
		padding: 10rpx 36rpx;
		box-sizing: border-box;
		.btn {
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			background-color: #E60113;
			color: #fff;
			text-align: center;
			border-radius: 40rpx;
		}
	}
}
.popup_text {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 95%;
    .instructions {
      border-radius: 20rpx;
      padding: 60rpx;
      background-color: #fff;
      width: 632rpx;
      min-height: 700rpx;
	  position: relative;
      .my_title {
        position: relative;
        text-align: center;
        margin-bottom: 44rpx;
        .img {
          position: absolute;
          top: -28rpx;
          right: -28rpx;
        }
      }
      .my_text {
        flex: 1;
        overflow-y: scroll;
        .usage_record {
          font-size: 28rpx;
          color: #333;
          margin-bottom: 74rpx;
          box-sizing: border-box;
          .item {
            padding: 0 60rpx;
            .date {
              font-size: 26rpx;
              color: #000;
              margin-top: 30rpx;
            }
            .order {
              margin: 24rpx 0;
              text:nth-child(1) {
                font-size: 26rpx;
                color: #666;
              }
              text:nth-child(2) {
                padding: 6rpx 12rpx;
                border-radius: 22rpx;
                display: inline-block;
                font-size: 22rpx;
                color: #000;
                background-color: #f5f5f5;
              }
            }
            .money {
              padding-bottom: 30rpx;
            }
          }
        }
        .image {
          text-align: center;
          padding: 150rpx 0;
          image {
            width: 180rpx;
            height: 180rpx;
          }
        }
      }
	  .btn {
		position: absolute;
		bottom: 80rpx;
		left: 158rpx;
		width: 280rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		border-radius: 60rpx;
		background-color: #E60113;
		color: #fff;
		font-size: 24rpx;
	}
    }

  }

.cell-item-title {
	color: #000;
	font-size: 26rpx;
}

.good-fortune-popup {
	background: #F6F6F6;
	.title {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 24rpx 0;
		text-align: center;
		font-size: 30rpx;
		line-height: 36rpx;
		position: relative;
		background: #fff;
		.fqz-title {
			color: #000D1D;
			font-size: 32rpx;
			.fqz {
				color: #444;
				font-size: 22rpx;
			}
		}
		.close {
			position: absolute;
			right: 24rpx;
			top: 26rpx;
			width: 54rpx;
			height: 40rpx;
		}
	}
	.container-fqz {
		background: #fff;
		border-radius: 24rpx 24rpx 0 0;
		padding: 72rpx 40rpx 48rpx 48rpx;
		.input-wrapper {
			height: 72rpx;
			margin-bottom: 16rpx;
			border-bottom: 2rpx solid #eee;
			.good-fortune-input {
				height: 100%;
				background: #fff;
				border-radius: 20rpx;
				font-size: 64rpx;
				text-align: left;
				flex: 1;
				display: block;
			}
		}
	}
	.fqz-use-title {

	}
	.discount-amount {
		color: #444;
		font-size: 26rpx;
		margin-bottom: 36rpx;
		.yuan {
			margin-left: 8rpx;
			font-size: 26rpx;
			color: #FF0A35;
		}
		.money {
			font-size: 26rpx;
			color: #FF0A35;
		}
	}
	.confirm-btn-wrapper {
		background: #fff;
		padding: 0 24rpx 24rpx;
		.confirm-btn {
			margin: 0 32rpx;
			height: 80rpx;
			background: #E60113;
			border-radius: 38rpx;
			line-height: 80rpx;
			text-align: center;
			font-size: 28rpx;
			color: #fff;
		}
	}

}

.good-fortune-card {
	/deep/ .u-cell-box {
		border-radius: 20rpx;
	}
}
.font-din {
    font-family: DINAlternate-Bold, DINAlternate;
}

.point-content {
    padding: 20rpx 24rpx 18rpx;
    &.no-right {
    	padding-right: 60rpx;
    }
    &.bill-item {
    	padding: 0 24rpx;
    }
    .label {
    	color: #191919;
    }
    .more-icon {
        width: 32rpx;
        height: 32rpx;
        margin-left: 4rpx;
    }
    .activity-label {
        color: #FF0A35;
        border: 1rpx solid #FF0A35;
        height: 28rpx;
        font-size: 20rpx;
        line-height: 28rpx;
        padding: 0 12rpx;
        border-radius: 8rpx;
        margin-left: 8rpx;
    }
    /deep/ .u-input__input {
    	height: 28rpx;
    	min-height: 28rpx !important;
    	line-height: 28rpx;
    	font-size: 22rpx;
    }
    /deep/ .u-input__right-icon {
    	height: 28rpx;
    }
}
</style>
