<template>
	<view class="cart">
		<coupon-popup ref="coupon" haveActivity disable @callback='setConpunDetail' />
		<!-- 注释 -->
		<view class="applet-cart-wrap">
			<!-- 缺省页面 -->
			<template v-if="!isLink || !carts.length">
				<view class="applet-cart-isEmpty">
					<image class="applet-cart-isEmpty-icon" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/isEmpty-icon/cart.png" mode=""></image>
					<text class="applet-cart-isEmpty-tips">{{ isLink ? '购物车是空的' : '登录后可同步账户购物车中的商品' }}</text>
					<view style="width: 200rpx" class="u-flex u-row-center" v-if="isLink" @click="this.$wsf.go('Index')">
						<view class="space"></view>
						<view class="applet-cart-isEmpty-btn">去逛逛</view>
					</view>
					<view class="applet-cart-isEmpty-btn applet-cart-isEmpty-login-btn" @click="this.$wsf.go('QuickLogin', { cartRoute: 'pages/cart/cart' })" v-else>登录</view>
				</view>
			</template>
			<!-- 编辑按钮 -->
			<!-- <view class="compile" v-if="!(!isLink || !carts.length)">
				<text @click="compileFun">{{ compile }}</text>
			</view> -->
			<div class="top-adress-edit" v-if="!(!isLink || !carts.length)">
				<div class="top-adress" @click="showAddressModal = true,reloadAdress = true">
					<image class="adress-img" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/shopping-car/adress-top.png" alt="">
					<div v-if="selectAddress" class="init-adress">{{ changeAdress(selectAddress) }}</div>
					<div v-else class="no-adress">请添加收货地址</div>
				</div>
				<view class="compile-edit">
					<text @click="compileFun">{{ compile }}</text>
				</view>
			</div>

			<!-- <view v-if="!(!isLink || !carts.length)" style="height: 84rpx"></view> -->
			<view v-if="!(!isLink || !carts.length) || invalidSkus.length" class="list">
				<view class="list_carts">
					<!-- 商品列表 -->
					<view v-for="(item, cartsIndex) in carts" class="u-padding-top-20" :key="cartsIndex">
						<view class="store-card-wrap list-padding-card-32">
							<view class="spu-coupon-column">
								<view class="column-left">
									<view class="coupon-check-btn" :class="{ active: item.checked }" @click="checked(item, cartsIndex)">
											<image style="height: 100%; width: 100%" v-if="item.checked" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAwpJREFUWEfFl11Ik1EYx39HybktDItCCEFKEqyQlFlQQUjUhVBGSBqGklYE2ewmxUpNIrWSBCvygyCoLLqQAu+ioqulGYTYTVJERFJQYc2lpSfO3um+3rl3U9m5POf5+D/fzxEYPJLMpZit+QjyQGSBXAMkedjHQLwH+QbJU1zOPsHb30ZEi3BE0pSdTnx8NZJiBNZw9O53iRNBD1NTLWLi9chcPCEBSNJNmJc3ImQVkGBIcTDRJFK04fpeJxiZ0JOhC0BabSlIeoEtUSoOZHMg2CecA6OBD0EApDVnIzKuD0hdIOUzYj4hpvOFc3DIV64fAI/l/Yug3AcEub6emAXgjrkl+fkCuj2UAx2M/9gxkxNeAObcFoQ8vcBu1xcnxSXh6q9Wj24AnlIbnke26ysSAsr2wvZsOFznSzPJ1NR6VaIaAIutC6hYUOsz0qCjDmwboP0e1LQFiu8W4wNHhKfDjRpuMuFQKqtPFEPDcTAlQP0NaL0dzKWalcuZIqTZdgDB/XByDb2vWAZdDbB7q0ZefRWu9YRmlRQJabF1AEcNKZiLKCsDHlyG1BSNqv46XNGx3F9Gp5CWXAfIzfMCUJCnWW5J1MTox1xHhXipPPAVWKkLYPUqWJsKLwZD41PxbrJDXJxG8+gZlNTAtDRi0zcF4A9gCqJWceyqh+QkaLsDjTfh7z9/snPHoKbcezf0DvLKYVyJNHQmQgO4eBLsJV4pr4ah7Cx8+KzdXaiEU4e87z/HYFup992QftwAQoegtgLO+OTnLyfYm2Fdmr/lUsLBanisOnlER4UgTBKqGDdXgarvUOdWL1Q2RaRZI9aSMHwZlu6B9lqI9ySar6qPX8BWBE5XFADoNN6I9u+E7vOQsMSrSLm+wA5PHNEoV6tbUWStWFXG3WYwe4pGlZyKfTRnphUr3oiGkZpsD1sh0QSbCiPNel+o2jByA9A2X+PjOCcTCnfpTTijvvAfx24QsVxI3ABivZK5QWjreGyW0pngxXQt94KI4cdkFkQsv2a+tRSzz2lgQS/W9/w/mskuOvDweK0AAAAASUVORK5CYII="></image>
									</view>
									<view class="all-select">全选</view>
									<!-- <view class="coupon-mark-box">
										<block v-if="item.couponLabelList && item.couponLabelList.length > 0">
										<view v-for="(ct, ci) in item.couponLabelList" :key="ci" class="coupon-mark">
          					  <block v-if="item.couponsType == 1">满{{ct.amountLimitation}}减¥{{ct.faceValue}}</block>
          					  <block v-else-if="ct.couponsType == 2">{{ct.faceValue ? ct.faceValue : 0}}折</block>
          					  <block v-else>立减¥{{ct.faceValue}}</block>
          					</view>
									</block>
									</view> -->
								</view>
								<view class="column-right" v-if="item.haveCoupon" @click="openCouponModel(item)">
									优惠
          				<image class="expand-image" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/shopping-car/icon-left.png" />
								</view>
							</view>
							<view class="store-cart-body">
								<u-swipe-action
									class="swipe_action"
									:show="item.show"
									v-for="(normalSkusItem, index) in item.validSkus"
									:index="index"
									:key="index"
									@click="swipeActioncFun(index, index1, cartsIndex)"
									@open="open(cartsIndex, index)"
									:options="options"
									btn-width="140"
								>
									<view class="item">
										<view class="wsf-check-btn" @click="checked(normalSkusItem, cartsIndex, index)">
											<view class="wsf-check" :class="{ active: normalSkusItem.checked }">
												<image style="height: 100%; width: 100%" v-if="normalSkusItem.checked" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAwpJREFUWEfFl11Ik1EYx39HybktDItCCEFKEqyQlFlQQUjUhVBGSBqGklYE2ewmxUpNIrWSBCvygyCoLLqQAu+ioqulGYTYTVJERFJQYc2lpSfO3um+3rl3U9m5POf5+D/fzxEYPJLMpZit+QjyQGSBXAMkedjHQLwH+QbJU1zOPsHb30ZEi3BE0pSdTnx8NZJiBNZw9O53iRNBD1NTLWLi9chcPCEBSNJNmJc3ImQVkGBIcTDRJFK04fpeJxiZ0JOhC0BabSlIeoEtUSoOZHMg2CecA6OBD0EApDVnIzKuD0hdIOUzYj4hpvOFc3DIV64fAI/l/Yug3AcEub6emAXgjrkl+fkCuj2UAx2M/9gxkxNeAObcFoQ8vcBu1xcnxSXh6q9Wj24AnlIbnke26ysSAsr2wvZsOFznSzPJ1NR6VaIaAIutC6hYUOsz0qCjDmwboP0e1LQFiu8W4wNHhKfDjRpuMuFQKqtPFEPDcTAlQP0NaL0dzKWalcuZIqTZdgDB/XByDb2vWAZdDbB7q0ZefRWu9YRmlRQJabF1AEcNKZiLKCsDHlyG1BSNqv46XNGx3F9Gp5CWXAfIzfMCUJCnWW5J1MTox1xHhXipPPAVWKkLYPUqWJsKLwZD41PxbrJDXJxG8+gZlNTAtDRi0zcF4A9gCqJWceyqh+QkaLsDjTfh7z9/snPHoKbcezf0DvLKYVyJNHQmQgO4eBLsJV4pr4ah7Cx8+KzdXaiEU4e87z/HYFup992QftwAQoegtgLO+OTnLyfYm2Fdmr/lUsLBanisOnlER4UgTBKqGDdXgarvUOdWL1Q2RaRZI9aSMHwZlu6B9lqI9ySar6qPX8BWBE5XFADoNN6I9u+E7vOQsMSrSLm+wA5PHNEoV6tbUWStWFXG3WYwe4pGlZyKfTRnphUr3oiGkZpsD1sh0QSbCiPNel+o2jByA9A2X+PjOCcTCnfpTTijvvAfx24QsVxI3ABivZK5QWjreGyW0pngxXQt94KI4cdkFkQsv2a+tRSzz2lgQS/W9/w/mskuOvDweK0AAAAASUVORK5CYII="></image>
											</view>
										</view>
										<view
											class="obscuration_img"
											v-if="normalSkusItem.stock == 0 || normalSkusItem.status == 2 || normalSkusItem.status == 3 || normalSkusItem.status == 4"
											@click="detailsPage(normalSkusItem)"
										>
											<view class="txt">
												<text>
													{{
														normalSkusItem.stock == 0 && normalSkusItem.status != 2 && normalSkusItem.status != 3
															? '无货'
															: normalSkusItem.status == 2
															? '下架'
															: normalSkusItem.status == 3
															? '售罄'
															: normalSkusItem.status == 4
															? '失效'
															: '...'
													}}
												</text>
											</view>
											<view class="mask"></view>
											<image mode="aspectFill" :src="normalSkusItem.image" />
										</view>
										<image v-else mode="aspectFill" @click="detailsPage(normalSkusItem)" :src="normalSkusItem.image" />
										<view class="content u-margin-right-16 u-margin-left-16">
											<view class="title-wrap" @click="detailsPage(normalSkusItem)">
												<text
													class="title u-line-2"
													:style="{
														color:
															(normalSkusItem.stock == 0 && normalSkusItem.status != 2 && normalSkusItem.status != 3) ||
															(normalSkusItem.status == 2 && normalSkusItem.stock !== 0) ||
															normalSkusItem.status == 4
																? '#bababa'
																: ''
													}"
												>
													{{ normalSkusItem.name }}
												</text>
											</view>
											<!-- <view class="sign">要选择的内容</view> -->
											<view class="select">
												<view class="select-item" @click="popupShowFun(normalSkusItem, cartsIndex, index)">
													<text
														class="title u-line-1"
														:style="{
															color: normalSkusItem.status == 2 && normalSkusItem.stock !== 0 ? '#bababa' : ''
														}"
													>
														{{ normalSkusItem.spec }}
													</text>
													<u-icon name="arrow-down" :color="normalSkusItem.status == 2 && normalSkusItem.stock !== 0 ? '#bababa' : '#666'" size="20"></u-icon>
												</view>
												<!-- <u-icon name="arrow-up"></u-icon> -->
											</view>
											<!-- 秒杀信息 -->
											<template v-if="normalSkusItem.marketingVos">
												<view v-for="(seckillItem, seckillIndex) in normalSkusItem.marketingVos" :key="seckillIndex">
													<view class="seckill-info" v-if="seckillItem.type == '13' && seckillItem.panicBuy.isShow == '1' && seckillIndex == 0">
														<!--  v-if="parseInt(new Date().getTiem()/1000)<parseInt(new Date(seckillItem.panicBuy.startTime).getTiem()/1000)" -->
														<template v-if="seckillItem.panicBuy.label == '距离结束'">
															<text class="txt-1">秒杀</text>
															<text class="txt-2">距结束还剩</text>
															<u-count-down
																color="#E60113"
																:font-size="20"
																:separator-size="20"
																separator-color="#E60113"
																:show-days="false"
																:timestamp="seckillItem.panicBuy.seconds"
															></u-count-down>
															<text class="txt-3">(限购{{ seckillItem.panicBuy.limitNum }}件)</text>
														</template>
														<template v-if="seckillItem.panicBuy.label == '距离开始'">
															<text class="txt-1">秒杀预告</text>
															<text class="txt-2 seckill-trailer-color">距开始还剩</text>
															<u-count-down color="#000" font-size="20" :separator-size="20" :show-days="false" :timestamp="seckillItem.panicBuy.seconds"></u-count-down>
															<!-- <text class="txt-3">(限购5件)</text> -->
														</template>
														<view><!-- {{new Date()}} --></view>
													</view>
												</view>
											</template>
											<!-- <view class="tag-part" v-if="normalSkusItem.marketingVos">
												<block v-for="(tag, tagIndex) in normalSkusItem.marketingVos" :key="tagIndex">
													<view v-if="tag.type == 12" class="bug-send">{{ tag.name }}</view>
													<view class="activity-type" v-if="tag.type == 16">
														<span>{{ tag.marketingAttr.label }}</span>
													</view>
												</block>
											</view> -->
											<!-- 绩效分 -->
											<view>
												<view class="performate-point" v-if="normalSkusItem.performanceScore && normalSkusItem.performanceScore > 0">
													<span class="performate-point-label">绩效分:</span><span class="performate-point-num">{{ normalSkusItem.performanceScore }}</span>
												</view>
												<!-- <view class="performance-mark" v-if="normalSkusItem.performanceScore && normalSkusItem.performanceScore > 0">绩效分{{ normalSkusItem.performanceScore }}</view> -->
											</view>
											<view class="price_btn">
												<view class="left">
													<text
														class="price_item"
														:style="{
															color: normalSkusItem.stock == 0 || normalSkusItem.status == 2 || normalSkusItem.status == 3 || normalSkusItem.status == 4 ? '#bababa' : ''
														}"
													>
														￥
													</text>
													<text
														class="btn_item"
														:style="{
															color: normalSkusItem.stock == 0 || normalSkusItem.status == 2 || normalSkusItem.status == 3 || normalSkusItem.status == 4 ? '#bababa' : ''
														}"
													>
														{{ priceFilter(normalSkusItem.oldPrice) }}
													</text>
												</view>
												<view class="right">
													<view
														class="minus"
														@click="minusFun(cartsIndex, index, normalSkusItem)"
														:style="{
															color:
																normalSkusItem.stock == 0 || normalSkusItem.status == 2 || normalSkusItem.status == 3 || normalSkusItem.status == 4 || normalSkusItem.num == 1
																	? '#bababa'
																	: ''
														}"
													>
														<u-icon
															name="minus"
															:color="normalSkusItem.stock == 0 || normalSkusItem.status == 2 || normalSkusItem.status == 3 || normalSkusItem.status == 4 ? '#bababa' : ''"
														></u-icon>

													</view>
													<view class="num">
														<input
															v-model.number="normalSkusItem.num"
															type="number"
															:disabled="normalSkusItem.stock == 0 || normalSkusItem.status == 2 || normalSkusItem.status == 3 || normalSkusItem.status == 4 ? true : false"
															@input="minusInput($event, cartsIndex, index, normalSkusItem)"
															@blur="minusBlur($event, cartsIndex, index, normalSkusItem)"
															:style="{
																color: normalSkusItem.stock == 0 || normalSkusItem.status == 2 || normalSkusItem.status == 3 || normalSkusItem.status == 4 ? '#bababa' : ''
															}"
														/>
													</view>
													<view class="plus" @click="plusFun(cartsIndex, index, normalSkusItem)">
														<u-icon
															name="plus"
															:color="
																normalSkusItem.stock == 0 ||
																normalSkusItem.status == 2 ||
																normalSkusItem.status == 3 ||
																normalSkusItem.status == 4 ||
																normalSkusItem.stock == normalSkusItem.num
																	? '#bababa'
																	: ''
															"
														></u-icon>

													</view>
												</view>
											</view>
										</view>
									</view>
									<!-- 添加福气值逻辑 -->
									<view class="estimate-column" v-if="normalSkusItem.integralPoint > 0">
										<text>
											<text class="special">
												{{ normalSkusItem.integralPoint }}
											</text>
											福气值+
											<text>
												{{ normalSkusItem.deductionAfterPrice }}
											</text>
											元
										</text>
									</view>
									<view class="estimate-column" v-else-if="normalSkusItem.afterCouponPrice && normalSkusItem.afterCouponPrice != normalSkusItem.oldPrice">
										预估到手价¥<span class="price-yuan">{{ normalSkusItem.afterCouponPrice.toFixed(2).split('.')[0] }}.</span><span class="price-fen">{{ normalSkusItem.afterCouponPrice.toFixed(2).split('.')[1] }}</span>
									</view>
									<view class="line-down"></view>
								</u-swipe-action>
							</view>
						</view>
					</view>

					<!-- 失效商品 -->
					<view v-if="invalidSkus.length" class="store-card-wrap list-padding-card-32 u-margin-top-24">
								<view class="store-cart-body">

								<view class="spu-coupon-column">
									<view class="column-left">
										<view class="coupon-check-btn coupon-check-btn-disable">
												<!-- <image style="height: 100%; width: 100%" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAwpJREFUWEfFl11Ik1EYx39HybktDItCCEFKEqyQlFlQQUjUhVBGSBqGklYE2ewmxUpNIrWSBCvygyCoLLqQAu+ioqulGYTYTVJERFJQYc2lpSfO3um+3rl3U9m5POf5+D/fzxEYPJLMpZit+QjyQGSBXAMkedjHQLwH+QbJU1zOPsHb30ZEi3BE0pSdTnx8NZJiBNZw9O53iRNBD1NTLWLi9chcPCEBSNJNmJc3ImQVkGBIcTDRJFK04fpeJxiZ0JOhC0BabSlIeoEtUSoOZHMg2CecA6OBD0EApDVnIzKuD0hdIOUzYj4hpvOFc3DIV64fAI/l/Yug3AcEub6emAXgjrkl+fkCuj2UAx2M/9gxkxNeAObcFoQ8vcBu1xcnxSXh6q9Wj24AnlIbnke26ysSAsr2wvZsOFznSzPJ1NR6VaIaAIutC6hYUOsz0qCjDmwboP0e1LQFiu8W4wNHhKfDjRpuMuFQKqtPFEPDcTAlQP0NaL0dzKWalcuZIqTZdgDB/XByDb2vWAZdDbB7q0ZefRWu9YRmlRQJabF1AEcNKZiLKCsDHlyG1BSNqv46XNGx3F9Gp5CWXAfIzfMCUJCnWW5J1MTox1xHhXipPPAVWKkLYPUqWJsKLwZD41PxbrJDXJxG8+gZlNTAtDRi0zcF4A9gCqJWceyqh+QkaLsDjTfh7z9/snPHoKbcezf0DvLKYVyJNHQmQgO4eBLsJV4pr4ah7Cx8+KzdXaiEU4e87z/HYFup992QftwAQoegtgLO+OTnLyfYm2Fdmr/lUsLBanisOnlER4UgTBKqGDdXgarvUOdWL1Q2RaRZI9aSMHwZlu6B9lqI9ySar6qPX8BWBE5XFADoNN6I9u+E7vOQsMSrSLm+wA5PHNEoV6tbUWStWFXG3WYwe4pGlZyKfTRnphUr3oiGkZpsD1sh0QSbCiPNel+o2jByA9A2X+PjOCcTCnfpTTijvvAfx24QsVxI3ABivZK5QWjreGyW0pngxXQt94KI4cdkFkQsv2a+tRSzz2lgQS/W9/w/mskuOvDweK0AAAAASUVORK5CYII="></image> -->
												<!-- <image style="height: 100%; width: 100%" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAoFJREFUWEfNlz2MEkEUx//DAktg8UiICckdcBGKS4yxU0MCcS25ykrt1drK6yzszsrWj97rrI7SNUDIaWeMCQUYvi4hmkvAXS587DLmbViCKPeRIHPTbLI7895v/2/mvTcMZxyapikej2ebc34HwHUAVwBcmiz/BeA7gC+MsQ+j0WhfVVXjLKbZaZM0TUtKkrTDGHsAIEDzZVmG1+uFJEn2csuyMBwOMRgMHHM9zvk7y7J2VVWtnORjIUAul5ODweBzxtgTzrlXURSEQiHQ03E8b5hADMNAp9Oxn4yxIef8pa7rz7LZ7JRudt0/ATRNi7jd7vcAbgUCAUQiEfh8vtPE+uN7v99Hu91Gr9ej9wemad5VVbU9b+QvgFKpdM2yrH0AUXIcDofP5Xh+8tHRkQ0CoClJ0nYqlfq6UIHJn392uVzRaDRqy72MQeFoNpsYj8dN0zRvzCoxVWAS848kezweX5pz5wcIol6v2+HQdf22syemAIVCYRfA02XIvki1mXC8SKfTOzTPBqCj5vF4vvn9fu/m5uYyVF9oo1ar4fj4eDgaja7SEbUB8vn8G8bYw0Qice7dfl5aOh3VahWc87eZTOYRowzndrvbiqIEKParGLQXDMPomaYZYcVi8R7nfG9jYwNra2ur8I9ut4tWq0WJ6j4rFAqvADze2tpamOGWTUUZs1wuk9nXBHAgy/LNZDK5bD8n2qtUKlQ7PhHAj2AweDkWi60UoNFoQNf1nwTQD4VC8vr6+koBDg8PqWgNLgSA8BAI34Rij6HwRCQ8FQsvRheiHBOE0IaEAIS3ZJNQUDsupil1CoHQttyBEHoxcSCEXs1m67Kwy+l8c/C/rue/AUoX2tbv2eSEAAAAAElFTkSuQmCC"></image> -->
										</view>
										<view>失效宝贝 {{invalidSkus.length}} 件</view>
									</view>
									<view class="column-right" @tap="clearFailureGoods(invalidSkus)">清空失效宝贝</view>
								</view>

								<!-- <view class="failure-column">
									<view class="failure-goods-num">失效宝贝 {{invalidSkus.length}} 件</view>
									<view class="failure-goods-clear" @tap="clearFailureGoods(invalidSkus)">清空失效宝贝</view>
								</view> -->

								<u-swipe-action
									class="swipe_action"
									:show="item.show"
									v-for="(invalidSkusItem, index) in invalidSkus"
									:index="index"
									:key="index"
									@click="swipeActioncFun(index)"
									@open="open(cartsIndex, index)"
									:options="options"
									btn-width="140"
								>
									<view class="item">
										<view class="wsf-check-btn" @click="checked(invalidSkusItem, cartsIndex, index)">
											<view class="wsf-check coupon-check-btn-disable" :class="{ active: invalidSkusItem.checked }">
												<image style="height: 100%; width: 100%" v-if="invalidSkusItem.checked" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAwpJREFUWEfFl11Ik1EYx39HybktDItCCEFKEqyQlFlQQUjUhVBGSBqGklYE2ewmxUpNIrWSBCvygyCoLLqQAu+ioqulGYTYTVJERFJQYc2lpSfO3um+3rl3U9m5POf5+D/fzxEYPJLMpZit+QjyQGSBXAMkedjHQLwH+QbJU1zOPsHb30ZEi3BE0pSdTnx8NZJiBNZw9O53iRNBD1NTLWLi9chcPCEBSNJNmJc3ImQVkGBIcTDRJFK04fpeJxiZ0JOhC0BabSlIeoEtUSoOZHMg2CecA6OBD0EApDVnIzKuD0hdIOUzYj4hpvOFc3DIV64fAI/l/Yug3AcEub6emAXgjrkl+fkCuj2UAx2M/9gxkxNeAObcFoQ8vcBu1xcnxSXh6q9Wj24AnlIbnke26ysSAsr2wvZsOFznSzPJ1NR6VaIaAIutC6hYUOsz0qCjDmwboP0e1LQFiu8W4wNHhKfDjRpuMuFQKqtPFEPDcTAlQP0NaL0dzKWalcuZIqTZdgDB/XByDb2vWAZdDbB7q0ZefRWu9YRmlRQJabF1AEcNKZiLKCsDHlyG1BSNqv46XNGx3F9Gp5CWXAfIzfMCUJCnWW5J1MTox1xHhXipPPAVWKkLYPUqWJsKLwZD41PxbrJDXJxG8+gZlNTAtDRi0zcF4A9gCqJWceyqh+QkaLsDjTfh7z9/snPHoKbcezf0DvLKYVyJNHQmQgO4eBLsJV4pr4ah7Cx8+KzdXaiEU4e87z/HYFup992QftwAQoegtgLO+OTnLyfYm2Fdmr/lUsLBanisOnlER4UgTBKqGDdXgarvUOdWL1Q2RaRZI9aSMHwZlu6B9lqI9ySar6qPX8BWBE5XFADoNN6I9u+E7vOQsMSrSLm+wA5PHNEoV6tbUWStWFXG3WYwe4pGlZyKfTRnphUr3oiGkZpsD1sh0QSbCiPNel+o2jByA9A2X+PjOCcTCnfpTTijvvAfx24QsVxI3ABivZK5QWjreGyW0pngxXQt94KI4cdkFkQsv2a+tRSzz2lgQS/W9/w/mskuOvDweK0AAAAASUVORK5CYII="></image>
											</view>
										</view>
										<view
											class="obscuration_img"
											v-if="invalidSkusItem.stock == 0 || invalidSkusItem.status == 2 || invalidSkusItem.status == 3 || invalidSkusItem.status == 4"
											@click="detailsPage(invalidSkusItem)"
										>
											<view class="txt">
												<text>
													{{
														invalidSkusItem.stock == 0 && invalidSkusItem.status != 2 && invalidSkusItem.status != 3
															? '无货'
															: invalidSkusItem.status == 2
															? '下架'
															: invalidSkusItem.status == 3
															? '售罄'
															: invalidSkusItem.status == 4
															? '失效'
															: '...'
													}}
												</text>
											</view>
											<view class="mask"></view>
											<image mode="aspectFill" :src="invalidSkusItem.image" />
										</view>
										<image v-else mode="aspectFill" @click="detailsPage(invalidSkusItem)" :src="invalidSkusItem.image" />
										<view class="content u-margin-right-16 u-margin-left-16">
											<view class="title-wrap" @click="detailsPage(normalSkusItem)">
												<text
													class="title u-line-2"
													:style="{
														color:
															(invalidSkusItem.stock == 0 && invalidSkusItem.status != 2 && invalidSkusItem.status != 3) ||
															(invalidSkusItem.status == 2 && invalidSkusItem.stock !== 0) ||
															invalidSkusItem.status == 4
																? '#bababa'
																: ''
													}"
												>
													{{ invalidSkusItem.name }}
												</text>
											</view>
											<view class="select">
												<view class="select-item" @click="popupShowFun(invalidSkusItem, cartsIndex, index)">
													<text
														class="title u-line-1"
														:style="{
															color: invalidSkusItem.status == 2 && invalidSkusItem.stock !== 0 ? '#bababa' : ''
														}"
													>
														{{ invalidSkusItem.spec }}
													</text>
													<u-icon name="arrow-down" :color="invalidSkusItem.status == 2 && invalidSkusItem.stock !== 0 ? '#bababa' : '#666'" size="20"></u-icon>
												</view>
											</view>
											<!-- <view class="tag-part" v-if="invalidSkusItem.marketingVos">
												<block v-for="(tag, tagIndex) in invalidSkusItem.marketingVos" :key="tagIndex">
													<view v-if="tag.type == 12" class="bug-send">{{ tag.name }}</view>
													<view class="activity-type" v-if="tag.type == 16">
														<span>{{ tag.marketingAttr.label }}</span>
													</view>
												</block>
											</view> -->
											<view class="price_btn">
												<view class="left">
													<text
														class="price_item"
														:style="{
															color: invalidSkusItem.stock == 0 || invalidSkusItem.status == 2 || invalidSkusItem.status == 3 || invalidSkusItem.status == 4 ? '#bababa' : ''
														}"
													>
														￥
													</text>
													<text
														class="btn_item"
														:style="{
															color: invalidSkusItem.stock == 0 || invalidSkusItem.status == 2 || invalidSkusItem.status == 3 || invalidSkusItem.status == 4 ? '#bababa' : ''
														}"
													>
														{{ priceFilter(invalidSkusItem.oldPrice) }}
													</text>
												</view>
												<view class="right">
													<view
														class="minus"
														@click="minusFun(cartsIndex, index, invalidSkusItem)"
														:style="{
															color:
																invalidSkusItem.stock == 0 || invalidSkusItem.status == 2 || invalidSkusItem.status == 3 || invalidSkusItem.status == 4 || invalidSkusItem.num == 1
																	? '#bababa'
																	: ''
														}"
													>
														<u-icon
															name="minus"
															:color="invalidSkusItem.stock == 0 || invalidSkusItem.status == 2 || invalidSkusItem.status == 3 || invalidSkusItem.status == 4 ? '#bababa' : ''"
														></u-icon>
													</view>
													<view class="num">
														<input
															v-model.number="invalidSkusItem.num"
															type="number"
															:disabled="invalidSkusItem.stock == 0 || invalidSkusItem.status == 2 || invalidSkusItem.status == 3 || invalidSkusItem.status == 4 ? true : false"
															@input="minusInput($event, cartsIndex, index, invalidSkusItem)"
															@blur="minusBlur($event, cartsIndex, index, invalidSkusItem)"
															:style="{
																color: invalidSkusItem.stock == 0 || invalidSkusItem.status == 2 || invalidSkusItem.status == 3 || invalidSkusItem.status == 4 ? '#bababa' : ''
															}"
														/>
													</view>
													<view class="plus" @click="plusFun(cartsIndex, index, invalidSkusItem)">
														<u-icon
															name="plus"
															:color="
																invalidSkusItem.stock == 0 ||
																invalidSkusItem.status == 2 ||
																invalidSkusItem.status == 3 ||
																invalidSkusItem.status == 4 ||
																invalidSkusItem.stock == invalidSkusItem.num
																	? '#bababa'
																	: ''
															"
														></u-icon>
													</view>
												</view>
											</view>
											<view v-if="invalidSkusItem.performanceScore">
												<view class="performate-point" v-if="invalidSkusItem.performanceScore && invalidSkusItem.performanceScore > 0">
														<span class="performate-point-label">绩效分</span><span class="performate-point-num">{{ invalidSkusItem.performanceScore }}</span>
												</view>
												<!-- <view class="performance-mark" v-if="invalidSkusItem.performanceScore && invalidSkusItem.performanceScore > 0">绩效分{{ invalidSkusItem.performanceScore }}</view> -->
											</view>
											<view class="gift-list" v-if="invalidSkusItem.marketingVos && invalidSkusItem.marketingVos.length > 0">
												<block v-for="(market, index) in invalidSkusItem.marketingVos" :key="index" v-if="market.type == 2">
                          <view class="gift-product" v-for="(gift, giftIndex) in filterGiftSku(market.fullGiftList, invalidSkusItem.num * invalidSkusItem.price)" :key="giftIndex">
															<span class="u-margin-right-12" style="width:44rpx">赠品</span>
															<span class="gift-product-name u-line-1">{{ gift.name }}</span>
															<span class="gift-product-num u-margin-left-28">x{{ gift.num }}</span>
														</view>
													</block>
											</view>
										</view>
									</view>
									<view class="line-down"></view>
								</u-swipe-action>
							</view>
						</view>
				</view>

				<!-- 吸底的操作栏 -->
				<view class="settlement u-border-top u-border-bottom" :class="{ threeHorizontal:  discountMoney > 0 && totalPerformanceScore > 0 && compileShow}">
					<view class="settlement-wrap">
						<view class="left">
							<view class="up all-flex">
								<view class="wsf-check-btn" :class="{ active: checkAll }" @click="checkAllFun">
									<image style="height: 100%; width: 100%" v-if="checkAll" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAwpJREFUWEfFl11Ik1EYx39HybktDItCCEFKEqyQlFlQQUjUhVBGSBqGklYE2ewmxUpNIrWSBCvygyCoLLqQAu+ioqulGYTYTVJERFJQYc2lpSfO3um+3rl3U9m5POf5+D/fzxEYPJLMpZit+QjyQGSBXAMkedjHQLwH+QbJU1zOPsHb30ZEi3BE0pSdTnx8NZJiBNZw9O53iRNBD1NTLWLi9chcPCEBSNJNmJc3ImQVkGBIcTDRJFK04fpeJxiZ0JOhC0BabSlIeoEtUSoOZHMg2CecA6OBD0EApDVnIzKuD0hdIOUzYj4hpvOFc3DIV64fAI/l/Yug3AcEub6emAXgjrkl+fkCuj2UAx2M/9gxkxNeAObcFoQ8vcBu1xcnxSXh6q9Wj24AnlIbnke26ysSAsr2wvZsOFznSzPJ1NR6VaIaAIutC6hYUOsz0qCjDmwboP0e1LQFiu8W4wNHhKfDjRpuMuFQKqtPFEPDcTAlQP0NaL0dzKWalcuZIqTZdgDB/XByDb2vWAZdDbB7q0ZefRWu9YRmlRQJabF1AEcNKZiLKCsDHlyG1BSNqv46XNGx3F9Gp5CWXAfIzfMCUJCnWW5J1MTox1xHhXipPPAVWKkLYPUqWJsKLwZD41PxbrJDXJxG8+gZlNTAtDRi0zcF4A9gCqJWceyqh+QkaLsDjTfh7z9/snPHoKbcezf0DvLKYVyJNHQmQgO4eBLsJV4pr4ah7Cx8+KzdXaiEU4e87z/HYFup992QftwAQoegtgLO+OTnLyfYm2Fdmr/lUsLBanisOnlER4UgTBKqGDdXgarvUOdWL1Q2RaRZI9aSMHwZlu6B9lqI9ySar6qPX8BWBE5XFADoNN6I9u+E7vOQsMSrSLm+wA5PHNEoV6tbUWStWFXG3WYwe4pGlZyKfTRnphUr3oiGkZpsD1sh0QSbCiPNel+o2jByA9A2X+PjOCcTCnfpTTijvvAfx24QsVxI3ABivZK5QWjreGyW0pngxXQt94KI4cdkFkQsv2a+tRSzz2lgQS/W9/w/mskuOvDweK0AAAAASUVORK5CYII="></image>
								</view>
								<text class="all_txt">全选</text>
							</view>

							<view class="total" :class="{ 'u-flex': !discountMoney && !(totalPerformanceScore > 0) }">
								<view class="up" style="flex:1">
									<view style="flex:1">
										<text class="txt_1" v-if="compileShow">合计</text>
										<!-- <text class="txt_2" v-if="compileShow">￥{{ discountMoney && discountMoney > 0 ? (totalPrice - discountMoney).toFixed(2) : totalPrice }}</text> -->
										<text class="txt_2" v-if="compileShow">￥{{ totalPrice.toFixed(2) }}</text>
									</view>
								</view>
								<view class="down" v-if="compileShow" @tap="openDiscountsInfoModel()">
									<block v-if="discountMoney && discountMoney > 0 && totalPerformanceScore > 0">
										<text style="display: inline-block;">已优惠￥{{ discountMoney | priceFilter }}</text>
										<!-- <text style="display: inline-block;">绩效分{{ totalPerformanceScore | priceFilter }}</text> -->
										<u-icon style="margin-left: 8rpx" name="arrow-right" color="#e60113" size="18"></u-icon>
									</block>
									<block v-if="discountMoney && discountMoney > 0 && !(totalPerformanceScore > 0)">
										<text>已优惠￥{{ discountMoney | priceFilter }}</text>
										<u-icon v-if="discountsInfoShow == false" style="margin-left: 8rpx" name="arrow-down" color="#e60113" size="18"></u-icon>
										<u-icon v-if="discountsInfoShow == true" style="margin-left: 8rpx" name="arrow-up" color="#e60113" size="18"></u-icon>
									</block>
									<block v-if="!discountMoney && totalPerformanceScore > 0">
										<text>绩效分{{ totalPerformanceScore }}</text>
									</block>
								</view>
							</view>
						</view>
						<view class="right">
							<view v-if="compileShow" class="btn" @click="settlement">{{ isNotHave ? '领券' : '去' }}结算({{ sum }})</view>
							<view v-else class="btn2 u-border" @click="settlementDelete">删除({{ sum }})</view>
						</view>
						<view class="discounts-info-model" v-if="discountsInfoShow == true" :class="{ discountsInfoModel:  discountMoney > 0 && totalPerformanceScore > 0 && compileShow}">
								<view class="discounts-info-title">金额明细</view>
								<view class="discounts-info-close-btn" @click="discountsInfoShow = false"></view>


								<view class="goods-list-item">
									<view class="discounts-info-column">
										<view>商品总额</view>
										<view>¥{{ totalOldPrice | priceFilter }}</view>
									</view>
									<view class="discounts-info-column" v-if="totalMarketDiscount > 0">
										<view>活动</view>
										<view class="discounts-info-text-red">-¥{{totalMarketDiscount | priceFilter}}</view>
									</view>
									<view class="discounts-info-column" v-if="totalCouponDiscount > 0">
										<view>优惠券</view>
										<view class="discounts-info-text-red">-¥{{totalCouponDiscount | priceFilter}}</view>
									</view>
								</view>

								<view class="Performance-f" v-if="totalPerformanceScore > 0">
									<view>绩效分</view>
									<view>{{totalPerformanceScore}}</view>
								</view>
						</view>
					</view>
				</view>
			</view>
			<view class="applet-template-recommend u-padding-left-24 u-padding-right-24">
				<wsf-goods-list ref="goodslist" title="hot" :list="flowList" :loadStatus="loadStatus" @goodsClick="goodsClick($event)"></wsf-goods-list>
			</view>
		</view>
		<!-- 地址弹窗 -->
		<u-popup v-model="showAddressModal" mode="bottom" @close="close" @open="openPopup" :safe-area-inset-bottom="true"
			border-radius="20" height="880rpx">
			<view class="addresspop">
				<view class="addresspop-close" @click="close"></view>
				<view class="addresspop-title">
					配送至
				</view>
				<scroll-view scroll-y="true" class="addresspop-content">
					<view v-if="isEmpty" class="addresspop-empty">
						<view class="addresspop-empty__flag">
						</view>
						<view class="addresspop-empty__desc">暂无设置收货地址～</view>
					</view>
					<view v-else class="addresspop-list">
						<view v-for="(item, index) in addressList"
							:key="item.id"
							class="addresspop-list__every"
							@click="itemClick(item)"
							>
							<view :class="
								item.id == addressId
								? 'addresspop-list__checked'
								: 'addresspop-list__check'
							"></view>
							<view class="addresspop-list__content">
								<view class="addresspop-list__address-detail">
									{{ item.detailAddress }}
								</view>
								<view class="addresspop-list__address">
									{{ item.address }}
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="addresspop-add">
					<view class="addresspop-add__btn" @click="showCitySelect">
						添加收货地址
					</view>
				</view>
			</view>
		</u-popup>
		<!-- <popup-address v-if="reloadAdress" v-model="showAddressModal" @showCitySelect="showCitySelect" @selectedCity="selectedCity" @getressList="getressList"></popup-address> -->
		<u-back-top :scroll-top="scrollTop" top="5000" :icon-style="iconStyle" :bottom="300">
			<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/top%402x.png" style="width: 80rpx; height: 80rpx"></image>
		</u-back-top>
		<!-- 确认弹框 -->
		<wsf-confirm v-model="showConfirm" :title="confirmText" @confirm="confirm" @cancel="cancel"></wsf-confirm>
		<!-- 结算时虚拟商品和普通商品不能同时结算的提示框 -->
		<wsf-confirm v-model="showConfirmPrompt">
			<view class="prompt-context" slot="context"><text>虚拟商品和普通商品不能同时结算。</text></view>
			<view class="prompt-button" slot="button"><text @click="showConfirmPrompt = false">我知道了</text></view>
		</wsf-confirm>
		<!-- 弹出层 -->
		<!-- popupShow -->
		<wsf-sku :show.sync="popupShow" :sku-data="skuDetail" :ShopNum="ShopNum" @skuConfirm="skuConfirm" @goodsImgShow="goodsImgShow"></wsf-sku>

		<!-- <wsf-popup v-model="couponShow" mode="bottom" title="优惠" height="800">
			<view class="coupon-container">
				<view class="title">优惠券</view>
				<scroll-view scroll-y="true" class="scroll-Y">
					<view class="coupon-list">
						<block v-for="(item, index) in storeCouponList" :key="index">
							<view class="coupon platform-coupon" v-if="item.couponSource == 0">
								<text class="top-round-corner"></text>
								<text class="bottom-round-corner"></text>
								<view class="main-ticket">
									<view class="main-mark platform-mark">平台券</view>
									<view class="coupon-detail">
										<view class="coupon-price platform-color">
											<text class="text" v-if="item.type != 2">￥</text>
											<text class="price">{{ item.type == 2 ? parseInt(item.discountRate * 100) / 10 : item.price }}</text>
											<text class="text" v-if="item.type == 2">折</text>
										</view>
										<view class="coupon-info">
											<view class="condition" v-if="item.type != 0">满{{ item.fullPrice }}可用</view>
											<view class="indate" v-if="item.validityType == 0">
												{{ $u.timeFormat(new Date(item.validityStartTime).getTime(), 'yyyy.mm.dd') }}-{{ $u.timeFormat(new Date(item.validityEndTime).getTime(), 'yyyy.mm.dd') }}
											</view>
											<view class="indate" v-else>领券起{{ item.validityRelativeDaysNum }}日内</view>
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
									<image class="stub-mark" v-if="item.webFlag == 2 || item.webFlag == 3" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/activity/ylq02%402x.png" alt=""></image>
									<image class="stub-mark" v-else-if="item.webFlag == 1" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/activity/yqw%402x.png" alt=""></image>
									<button class="get-coupon-button platform-btn" v-if="item.webFlag == 0 || item.webFlag == 3" @click="getPlatformCoupon(item.id)">立即领取</button>
								</view>
							</view>

							<view class="coupon store-coupon" v-else>
								<text class="top-round-corner"></text>
								<text class="bottom-round-corner"></text>
								<view class="main-ticket">
									<view class="main-mark store-mark">店铺券</view>
									<view class="coupon-detail">
										<view class="coupon-price store-color">
											<text class="text" v-if="item.type != 2">￥</text>
											<text class="price">{{ item.type == 2 ? parseInt(item.discountRate * 100) / 10 : item.price }}</text>
											<text class="text" v-if="item.type == 2">折</text>
										</view>
										<view class="coupon-info">
											<view class="condition" v-if="item.type != 0">满{{ item.fullPrice }}可用</view>
											<view class="indate">
												{{ $u.timeFormat(new Date(item.validityStartTime).getTime(), 'yyyy.mm.dd') }}-{{ $u.timeFormat(new Date(item.validityEndTime).getTime(), 'yyyy.mm.dd') }}
											</view>
										</view>
									</view>
								</view>
								<view class="stub-ticket">
									<image v-if="item.isReceive == 1" class="stub-mark" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/activity/ylq01%402x.png" alt=""></image>
									<image v-else-if="item.runOut" class="stub-mark" src="@/static/img/activity/yqw@2x.png" alt=""></image>
									<button v-else-if="item.isReceive == 0" class="get-coupon-button store-btn" @click="getcoupon([item.id], 1)">立即领取</button>
								</view>
							</view>
						</block>
						<p class="coupon-hint" @click="navigateTo('UserCoupon')">
							<text>已领取优惠券的详细信息可在“</text>
							<text class="markedness">我的-优惠券</text>
							<text>”中查看</text>
						</p>
					</view>
				</scroll-view>
			</view>
		</wsf-popup> -->
		<wsf-popup v-model="couponShow" mode="bottom" title="优惠" height="800">
			<view class="coupon-container">
				<scroll-view scroll-y="true" class="scroll-Y">
					<view class="title" v-if="usableCouponList && usableCouponList.length > 0">可用</view>
					<view class="coupon-list">
						<block v-for="(item, index) in usableCouponList" :key="index">
							 <view class="coupon product-coupon">
								<view class="main-ticket">
									<view class="main-mark product-mark">商品券</view>
									<view class="coupon-detail">
										<view class="coupon-price product-color">
											<text class="text" v-if="item.couponsType != 2">￥</text>
											<text class="price">{{ item.faceValue }}</text>
											<text class="text" v-if="item.couponsType == 2">折</text>
										</view>
										<view class="coupon-info">
											<view class="condition" v-if="item.couponsType == 1">满{{ item.amountLimitation }}可用</view>
											<view class="condition" v-else-if="item.couponsType == 3">满{{ item.faceValue }}元可用</view>
											<view class="condition" v-else>无门槛</view>
											<view class="indate">
												{{ $u.timeFormat(new Date(item.effectiveStartTime.replace(/-/g,"/")).getTime(), 'yyyy.mm.dd') }}-{{ $u.timeFormat(new Date(item.effectiveEndTime.replace(/-/g,"/")).getTime(), 'yyyy.mm.dd') }}
											</view>
										</view>
									</view>
								</view>
							</view>
						</block>
					</view>
					<view class="title" v-if="disableCouponList && disableCouponList.length > 0">当前不可用</view>
					<view class="coupon-list" v-if="disableCouponList && disableCouponList.length > 0">
						<block v-for="(item, index) in disableCouponList" :key="index">
							 <view class="coupon disabled-coupon">
								<view class="main-ticket">
									<view class="main-mark disabled-mark">商品券</view>
									<view class="coupon-detail">
										<view class="coupon-price disabled-color">
											<text class="text disabled-color" v-if="item.couponsType != 2">￥</text>
											<text class="price disabled-color">{{ item.faceValue }}</text>
											<text class="text disabled-color" v-if="item.couponsType == 2">折</text>
										</view>
										<view class="coupon-info">
											<view class="condition disabled-color" v-if="item.couponsType == 1">满{{ item.amountLimitation }}可用</view>
											<view class="condition disabled-color" v-else-if="item.couponsType == 3">满{{ item.faceValue }}元可用</view>
											<view class="condition disabled-color" v-else>无门槛</view>
											<view class="indate disabled-color">
												{{ $u.timeFormat(new Date(item.effectiveStartTime.replace(/-/g,"/")).getTime(), 'yyyy.mm.dd') }}-{{ $u.timeFormat(new Date(item.effectiveEndTime.replace(/-/g,"/")).getTime(), 'yyyy.mm.dd') }}
											</view>
										</view>
									</view>
								</view>
							</view>
						</block>
					</view>
				</scroll-view>
			</view>
		</wsf-popup>

		<!-- 底部导航栏 -->
		<wsfTabBar :selected="2"></wsfTabBar>
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
								<view
									style="
                    margin-bottom: 20rpx;
                    padding-left: 50rpx;
                    color: #e60113;
                    font-size: 12px;
                  "
									v-if="item.limitKind"
								>
									限购{{ item.limitKind }}款
								</view>
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

		<!-- 规格图片预览 -->
		<u-mask :show="previewImg" @click="previewImg = false" z-index="99999">
			<view style="width: 100%; height: 100%; position: relative">
				<view class="rect" @tap.stop @click="previewImg = false"><u-image :src="previewshowImg" mode="widthFix"></u-image></view>
			</view>
		</u-mask>

		<u-mask :show="discountsInfoShow" @tap="discountsInfoShow = false" z-index="98">
		</u-mask>
	</view>
</template>

<script>
import wsfConfirm from '../../components/wsf-confirm/wsf-confirm.vue';
import wsfGoodsList from '@/components/wsf-goods-list/wsf-goods-list.vue';
import { priceFilter } from '@/common/wsfFilter.js';
import wsfSku from '@/components/wsf-sku/wsf-sku.vue';
import wsfTabBar from '@/components/wsf-tab-bar/wsf-tab-bar.vue';
import { visit } from '@/common/visit.js';
import couponPopup from '@/components/coupon-popup/coupon-popup.vue';
export default {
	components: {
		wsfConfirm,
		wsfGoodsList,
		wsfSku,
		wsfTabBar,
		couponPopup
	},
	data() {
		return {
			addressId: 0,
			isEmpty: true,
			addressList: [],
			showDeleteConfirm: false,
			delAddressId: 0,

			selectAddress: '',
			showAddressModal: false,
			reloadAdress: false,
			ossUrl: this.$oss,
			invalidSkus: [],
			openCouponStoreId: null,
			isNotHave: false,
			discountsInfoShow: false,
			storeSummaryList: [],
			discountMoney: 0,
			storeCouponList: [],
			couponShow: false,
			confirmText: '',
			cartId: '',
			isLink: false, // 是否登录
			isLoading: false, // 是否正在加载
			carts: [], // 购物车列表
			checkAll: false, //全选
			sum: 0, //要结算的商品数
			totalOldPrice: 0, //总金额
			totalPrice: 0, //商品优惠后总价
			flowList: [], // 瀑布流商品列表
			hasMore: true, // 是否拥有更多
			loadStatus: 'loadmore', // 加载更多样式效果
			ids: [], //选中商品id
			compile: '编辑',
			compileShow: true,
			isVirtual_y: 0,
			isVirtual_n: 0,
			limitCartNum: false,
			skuDetail: {}, //sku相关数据
			cartsIndexs: {
				cartsIndex: null,
				index: null
			},
			queryForm: {
				// 页码页容量
				pageType: 3,
				pageNum: 0,
				pageSize: 10
			},
			cartsSubscript: {}, //carts的下标值,用于删除
			scrollTop: 0,
			priceFilter,
			isChecked: false,
			storeData: {},
			disabled: false,
			btnWidth: 180,
			show: false,
			popupShow: false, //popup弹出框
			showConfirm: false, //弹框显示/隐藏
			showConfirmPrompt: false,
			options: [
				{
					text: '删除',
					style: {
						color: '#fff',
						backgroundColor: '#e60113',
						margin: '30rpx 0 0 0'
					}
				}
			],

			// sku属性名称
			v_name: [],
			// sku筛选条件
			isShowStore: 0,
			limitSkuList: [], // 超限秒杀商品数组
			limitFirstList: [], // 超限首单商品数组
			showLimit: false, // 超限活动商品弹窗状态
			showSpecialAreaLimit: false, // 超限活动商品弹窗状态
			previewImg: false,
			previewshowImg: '',
			usableCouponList: [],
			disableCouponList: [],
			totalMarketDiscount: 0, // 活动总优惠
      totalPerformanceScore: 0, // 总绩效分
			totalOldPrice: 0, // 商品总原价
			totalCouponDiscount: 0, // 卡券总优惠
			ShopNum: 1 , // 选中的商品数量
			cartSkuId: '', // 商品详情页进去购物车页面需要选中
		};
	},
	filters: {
		formatDate(date) {
			let newDate = new Date(date.replace(/-/g, '/'));
			let time = newDate.getFullYear() + '.' + (newDate.getMonth() + 1) + '.' + newDate.getDate();
			return time;
		}
	},
	computed: {
		performanceScoreTotal() {
			let list = this.carts;
			if (!list || list.length < 1) {
				return 0;
			} else {
				let score = 0;
				list.forEach(item => {
					item.validSkus.forEach(n => {
						if (n.checked == true && n.performanceScore && n.performanceScore > 0) {
							score += n.performanceScore * n.num;
						}
					});
				});
				return score;
			}
		}
	},
	watch: {
		carts: {
			handler(newVal, oldvalue) {
				// newVal.forEach((item) => {
				//   item.validSkus.forEach((sItem) => {
				//     if (sItem.marketingVos) {
				//       sItem.marketingVos.forEach((cItem) => {
				//         if (cItem.type == 16) {
				//           sItem["avtivityLabel"] = cItem.marketingAttr.label || "";
				//         }
				//       });
				//     }
				//   });
				// });
				let allArr = [];
				let numbers = 0;
				// let totalPrice = 0;
				let ids = [];
				let isVirtual_y = 0;
				let isVirtual_n = 0;
				let limitCartNum = false;
				this.carts.some(item => {
					return item.checked === false;
				});
				if (
					this.carts.some(item => {
						return item.checked === false;
					})
				) {
					this.checkAll = false;
				} else {
					this.checkAll = true;
				}
				for (let i = 0; i < this.carts.length; i++) {
					allArr.push(...this.carts[i].validSkus);
				}
				for (let i = 0; i < allArr.length; i++) {
					if (allArr[i].checked) {
						numbers += 1;
						// totalPrice = totalPrice + allArr[i].num * allArr[i].oldPrice;
						ids.push(allArr[i].cartId);
						if (allArr[i].isVirtual == 1) {
							isVirtual_y += 1;
						} else {
							isVirtual_n += 1;
						}
						if (allArr[i].num < allArr[i].limitCartNum) {
							limitCartNum = true;
						}
					}
				}

				this.sum = numbers;
				// this.totalPrice = this.priceFilter(totalPrice);
				this.ids = ids;
				this.isVirtual_y = isVirtual_y;
				this.isVirtual_n = isVirtual_n;
				this.limitCartNum = limitCartNum;
			},
			// immediate: true,
			deep: true
		}
	},
	// onLoad(){	
	// 	this.getAddressList()			
	// },	
	onShow() {
		this.getAddressList()	
		let that = this			
		uni.getStorage({
			key: "cartSkuId",
			success: function (res) {				
				that.cartSkuId = res.data
			},
			fail: function () {
				that.cartSkuId = ''
			},
		});
		uni.removeStorageSync("cartSkuId");
	
		// 初始化
		this.initData()
		visit(this, '购物车');
		this.isShowStore = getApp().globalData.wsfBaseInfo.isShowStore; // 判断商城信息
		this.discountMoney = 0;		
		this.GetRecommendList();
		this.isLink = !!uni.getStorageSync('newToken')
		if (this.isLink) {
			this.getCartList();
		}
		// if (!this.isLink || !this.carts.length) {
		// this.resetList();
		// this.GetRecommendList();
		// }
	},
	onReachBottom() {
		this.GetRecommendList();
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	methods: {
		openPopup() {
			// console.log('open');
		},
		close() {
			this.showAddressModal = false
			// this.$emit("input", false);
			// console.log('close');
		},
		// 获取所有地址列表
		getAddressList() {
			let userInfo = uni.getStorageSync('userInfo');
			if (userInfo) {
				this.$u.api.QueryCustomerAddress().then((res) => {
					console.log("address", res);
					this.isEmpty = !res.data.length;
					// if (this.isEmpty) {
					// 	this.showConfirm = true;
					// }
					this.addressList = res.data;
					res.data.map((item)=> {
						if(item.isDefault == 1) {
							this.addressId = item.id
							this.selectAddress = item.address
						}
					})
					// this.$emit("getressList",{list: res.data});
				});
			}
		},

		itemClick(item) {
			this.addressId = item.id;
			this.selectAddress = item.address
			this.close()
		},
		initData() {
			this.totalPrice = 0
			this.discountMoney = 0
			this.totalPerformanceScore = 0
			this.discountsInfoShow = false
		},
		// 输出符合条件的地址格式
		changeAdress(adress) {
			if(adress.includes(',')){
				let adressArr = adress.split(',')
				return adressArr.splice(1,adressArr.length).join('')
			} else {
				return adress && adress.includes('省') ? adress.split('省')[1] : adress
			}
		},
		setConpunDetail(params) {
			console.log(params, '优惠券弹框返回的数据')
		},
		showCitySelect(){
			this.showAddressModal = false;
			this.reloadAdress = false
			this.$wsf.go('EditAddress',{addressType: 'goods'})
		},

		getressList(e){
			console.log(e,'------------')
		},

		getPlatformCoupon(id) {
			if (this.loading) {
				return;
			}
			this.loading = true;
			this.$u.api
				.receiveCoupon(id)
				.then(res => {
					if (res.code == 200) {
						if (res.data == 1) {
							this.showToastError('领取成功');
						} else {
							this.showToastError('该优惠券已被领完');
						}
						this.getCouponList({ storeId: this.openCouponStoreId });
					} else {
						this.$u.toast(res.description);
					}
				})
				.finally(() => {
					this.loading = false;
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
		navigateTo(sceneName, params) {
			// this.$wsf.go('Login')
			this.$wsf.go(sceneName, params);
		},
		goodsImgShow(data) {
			console.log(data, 'data+++++');
			this.previewImg = true;
			// activeImg?activeImg:(skuDetail.sku.tree[0].v[0].imgUrl?skuDetail.sku.tree[0].v[0].imgUrl:skuDetail.images[0])
			this.previewshowImg = data;
		},
		resetList() {
			this.flowList = [];
			this.hasMore = true;
			this.loadStatus = 'loadmore';
			this.queryForm = {
				// 页码页容量
				pageType: 3,
				pageNum: 0,
				pageSize: 10
			};
			this.$refs.goodslist.clearList();
		},
		//筛选满赠活动列表
		filterGiftSku(giftskus, price, name) {
			let tempArr = giftskus.filter(el => {
				return price >= el.fullPrice;
			});
			return tempArr.length > 0 ? tempArr[0].giftSkuInfos : [];
		},
		//计算优惠券
		getDiscountPrice() {
			// let list = this.carts,
			// 	filterList = [];
			// console.log(this.carts, 'this.carts');
			// for (let i in list) {
			// 	for (let j in list[i].validSkus) {
			// 		if (list[i].validSkus[j].checked == true) {
			// 			let obj = {
			// 				skuId: list[i].validSkus[j].skuId,
			// 				num: list[i].validSkus[j].num,
			// 				sourceType: list[i].validSkus[j].sourceType,
			// 				storeId: list[i].validSkus[j].storeId,
			// 			};
			// 			filterList.push(obj);
			// 		}
			// 	}
			// }
			// console.log(filterList, 'filterList');
			// if (filterList && filterList.length > 0) {
			// 	this.$u.api.cartSummary({ shoppingCartList: filterList }).then(res => {
			// 		console.log(res, 'res');
			// 		this.discountMoney = res.data.fullReductionMoney;
			// 		this.storeSummaryList = res.data.storeSummaryList;
			// 		for (let i in this.storeSummaryList) {
			// 			if (this.storeSummaryList[i].isReceive == 0) {
			// 				this.isNotHave = true;
			// 				return;
			// 			}
			// 		}
			// 		this.isNotHave = false;
			// 	});
			// }
			let carts = this.carts, params = []
			for(let i in carts) {
				for(let j in carts[i].validSkus) {
					// if(carts[i].validSkus[j].checked == true) {
						let obj = {
							checked: carts[i].validSkus[j].checked,
							spuId: carts[i].validSkus[j].spuId,
							skuId: carts[i].validSkus[j].skuId,
							num: carts[i].validSkus[j].num,
							oldPrice: carts[i].validSkus[j].oldPrice,
							thirdCateId: carts[i].validSkus[j].thirdCateId,
							sourceType: carts[i].validSkus[j].sourceType,
							storeId: carts[i].validSkus[j].storeId,
						}
						params.push(obj)
					// }
				}
			}
			if(params && params.length > 0) {
				this.$u.api.cartDiscountSummary(params).then(res => {
					let { totalMarketDiscount, totalPerformanceScore, totalOldPrice, totalPrice, totalCouponDiscount } = res.data
					this.totalMarketDiscount = totalMarketDiscount
          this.totalPerformanceScore = totalPerformanceScore
					this.totalOldPrice = totalOldPrice
					this.totalPrice = totalPrice
					this.totalCouponDiscount = totalCouponDiscount
					this.discountMoney = totalMarketDiscount + totalCouponDiscount; // 已优惠 = 商品优惠券 + 活动减免综合
					let list = res.data.spuSummaryList
					for(let i in list) {
						let index = carts.findIndex(item => item.spuId == list[i].spuId)
						let spuItem = carts[index]
						spuItem.couponLabelList = list[i].couponLabelList
						// spuItem.haveCoupon = list[i].haveCoupon // 优惠券不随选择变动
						let skuList = spuItem.validSkus, skuDiscountList = list[i].discountInfoList
						for(let j in skuDiscountList) {
							for(let k in skuList) {
                                // 因相同商品可以有多个不同的商家，因此需要加上storeId判断
								if(skuDiscountList[j].storeId == skuList[k].storeId && skuDiscountList[j].skuId == skuList[k].skuId && (skuDiscountList[j].sourceType == skuList[k].sourceType)) {
									skuList[k].afterCouponPrice = skuDiscountList[j].afterCouponPrice
								}
							}
						}
						spuItem.validSkus = skuList
						this.$set(this.carts,index,spuItem)
					}
				})
			} else {
				this.discountMoney = 0
			}

		},
		//领券
		getcoupon(ids, type) {
			let data = {
				couponIdList: ids
			};
			this.$u.api.ReceiveCoupons(data).then(res => {
				if (type == 1) {
					uni.showToast({
						title: '领取成功',
						icon: 'none',
						duration: 2500
					});
					//领券后重新获取最优的优惠券
					this.getDiscountPrice();
				}
			});
		},
		// 打开优惠券弹窗
		openCouponModel(item) {
			// if (!item.couponVoList || item.couponVoList.length < 1) {
			// 	uni.showToast({
			// 		title: '此商品暂无优惠券',
			// 		icon: 'none',
			// 		duration: 2500
			// 	});
			// } else {
			// 	this.openCouponStoreId = item.storeId;
			// 	this.getCouponList({ storeId: this.openCouponStoreId });
			// 	this.couponShow = true;
			// }

			const checked = item.validSkus.filter(val=>{
				return val.checked
			})
			// 有选中 checked
      const finalyParams = checked.length > 0 ? checked : item.validSkus
			let skuList = finalyParams.map(skuItem => {
				let obj = {
					spuId: skuItem.spuId,
					skuId: skuItem.skuId,
					num: skuItem.checked ? skuItem.num : 1,
					beforeCouponPrice: skuItem.price,
				}
				return obj
			})
			const params = {
				skuList,
				sourceType: finalyParams[0].sourceType || 1 // sourceType 来源 1.商城 2.实体店 3.电动车
			}
			this.$refs.coupon.setShowCopun(params)

		},
		getCouponList(data) {
			this.$u.api.QueryCouponList(data).then(res => {
				if (res.data && res.data.length > 0) {
					this.storeCouponList = res.data;
				}
			});
		},

		// 获取地址
			// getAddressList() {
			// 	let userInfo = uni.getStorageSync('userInfo');
			// 	this.reloadAdress = true
			// 	if (userInfo) {
			// 		this.$u.api.QueryCustomerAddress().then((res) => {
			// 			res.data.map((item)=> {
			// 				if(item.isDefault) {
			// 					this.selectAddress = item.address
			// 				}
			// 			})
			// 		});
			// 	}
			// },
		/* 获取推荐的商品列表 */
		GetRecommendList() {
			let that = this;
			if (this.isLoading || !this.hasMore) return;
			this.isLoading = true;
			this.loadStatus = 'loading';
			this.$u.api.QueryRecommendCommodity(this.queryForm).then(res => {
				this.isLoading = false;
				this.loadStatus = 'loadmore';
				console.log('res', res);
				if (res.code === 200) {
					// this.flowList = this.flowList.concat(
						res.data.map((item,index) => {
							item = JSON.parse(JSON.stringify(item))
							item.price = this.priceFilter(item.price);
							this.flowList.push(item)
							return item;
						})
					// );
					this.queryForm.pageNum++;
					this.hasMore = res.data.length === 10;
					this.loadStatus = res.data.length === 10 ? 'loadmore' : 'nomore';
				}
			});
		},
		/* sku相关数据 */
		querySpuDetail(skuId, sourceType, storeId) {
			this.$u.api.QuerySpuDetail({ skuId, sourceType, storeId }).then(res => {
				console.log(res, '商品详情数据');
				if (res.code == 200) {
					this.skuDetail = res.data;

					/**
					 * 第一层for添加v_name数据用于判断是否为当前点击选中的属性
					 */
					let tree = this.skuDetail.sku.tree;
					let list = this.skuDetail.list;
					this.v_name = [];
					let list_name = [];
					let initialSku = this.skuDetail.sku.initialSku;
					list_name = list.map(item => item.name);
					console.log(list_name, 'list_name');
					// if (tree.length === 1) {
					for (let i = 0; i < tree.length; i++) {
						// 添加v_name数据用于判断是否为当前点击选中的属性
						this.v_name.push({ name: '' });
						for (let j = 0; j < tree[i].v.length; j++) {
							for (let k = 0; k < list.length; k++) {
								// 判断某一属性库存是否充足,stock_num = 0 时则禁止选中
								if (tree[i].v[j].name == list[k].name && list[k].stock_num == 0) {
									tree[i].v[j].disabled = true;
								}
							}
						}
					}
					// 默认选中一个属性
					for (let key in initialSku) {
						console.log(initialSku[key], 'initialSuk');
						if (initialSku[key]) {
							for (let i = 0; i < tree.length; i++) {
								for (let j = 0; j < tree[i].v.length; j++) {
									if (tree[i].v[j].id == initialSku[key]) {
										this.v_name[i].name = tree[i].v[j].name;
									}
								}
							}
						}
					}
					this.popupShow = true;
				} else {
					this.navigateTo('404');
				}
			}).catch(error=>{
                if(error.data.code === 220){
                    this.$u.toast(`商品信息已失效`)
                    this.getCartList()
                }
            });
		},
		// 跳转店铺
		goToStore(item) {
			console.log('跳转店铺或首页', item);
			if (item.storeId != 0) {
				this.$wsf.go('StoreIndex', {
					storeName: item.storeName,
					storeId: item.storeId
				});
			} else {
				this.$wsf.go('Index');
			}
		},
		// 属性选择弹出框
		popupShowFun(normalSkusItem, cartsIndex, index) {
			console.log(normalSkusItem, 'normalSkusItem');
			let { stock, status, num } = normalSkusItem;
			this.ShopNum = num
			this.cartId = normalSkusItem.cartId;
			// this.querySpuDetail(normalSkusItem.skuId);
			// 下架状态时禁止打开属性选择
			normalSkusItem.stock == 0 && normalSkusItem.status != 2 && normalSkusItem.status != 3
				? this.querySpuDetail(normalSkusItem.skuId, normalSkusItem.sourceType, normalSkusItem.storeId)
				: normalSkusItem.status == 2
				? '下架'
				: normalSkusItem.status == 3
				? '售罄'
				: normalSkusItem.status == 4
				? '失效'
				: this.querySpuDetail(normalSkusItem.skuId, normalSkusItem.sourceType, normalSkusItem.storeId);
			// if ((normalSkusItem.stock == 0 && (normalSkusItem.status != 2 && normalSkusItem.status != 3))||(normalSkusItem.status == 2 && normalSkusItem.stock !== 0)) return;
		},
		// 编辑
		compileFun() {
			if (this.compile === '完成') {
				this.compile = '编辑';
				this.compileShow = true;
				for (let i = 0; i < this.carts.length; i++) {
					for (let j = 0; j < this.carts[i].validSkus.length; j++) {
						// if (this.carts[i].checked) {
						// 	this.carts[i].checked = false
						// }
						if (this.carts[i].validSkus[j].checked) {
							if (this.carts[i].validSkus[j].stock == 0 || this.carts[i].validSkus[j].status == 2 || this.carts[i].validSkus[j].status == 3) {
								this.carts[i].validSkus[j].checked = false;
							}
						}
					}
				}
			} else {
				this.compile = '完成';
				this.compileShow = false;
			}
		},
		// 删除
		settlementDelete() {
			if (!this.ids.length) {
				uni.showToast({
					title: '你还没选择商品哦',
					icon: 'none',
					duration: 2500
				});
				return;
			}
			this.confirmText = `确认要删除已选中的${this.sum}件商品？`;
			this.showConfirm = true;
		},
		// 商品跳转
		goodsClick(e) {
			console.log('e', e);
			if(e.goodsSource == 4){
				this.$wsf.go('ToMotor',{skuId: e.id});
			} else {
				this.$wsf.go('SkuDetail', { skuId: e.id });
			}
		},

		// 跳转到闲情页
		detailsPage(param) {
			let { skuId, status, stock, sourceType, storeId } = param;
			console.log(param, '跳转到详情页');
			// if ((param.stock == 0 && (param.status != 2 && param.status != 3))||(param.status == 2 && param.stock !== 0)) return;
			/* if(param.stock == 0 && (param.status != 2 && normalSkusItem.status != 3)){
				this.$wsf.go('SkuDetail', { skuId });
			} */
			if (param.status == 4) return false;
			this.$wsf.go('SkuDetail', { skuId,sourceType,storeIdNumber: storeId });
		},
		getCartList(oldCarts) {
			this.$u.api.QueryShoppingCarts().then(res => {
				if(!res.data || !res.data.length) {
					this.carts = []
					return
				}
				let realData = this.$u.deepClone(res.data).splice(0,1);
				this.carts = realData[0].validSpus
				this.carts.forEach(item => {
					item.checked = false
				})

				// 从商品详情页面过来的点击购物车的商品被选中
				if(this.cartSkuId && this.carts && this.carts.length>0){										      
					let arr = [] 				
					this.carts.forEach(item=>{    
						item.validSkus.forEach((cart) => {
							if (cart.skuId == this.cartSkuId) {                
								arr = item.validSkus
								item.checked = true  								
							}
						})  
						arr.forEach(cart=>{
							cart.checked = true
						})                             
					}) 
					//领券后重新获取最优的优惠券
					this.getDiscountPrice();       					
				}


				this.invalidSkus = realData[0].invalidSkus
                // 切换sku后保持选中状态
                if(oldCarts){
                    const spuIds = this.getChoosedStore(oldCarts)
                    const skuIds = this.getChoosedSku(oldCarts)
                    this.carts.forEach(spu=>{
                        if (spuIds && spuIds.indexOf(spu.spuId) != -1) {
                            spu.checked = true
                        }
                        spu.validSkus.forEach((sku) => {
                            if (skuIds && skuIds.indexOf(sku.skuId) != -1 || spu.checked) {
                                sku.checked = true
                            }
                        }) 
                    })
                }

				let currentTime = parseInt(new Date().getTime() / 1000); //当前秒级时间戳
				let seckillTime = 0;
				for (let i = 0; i < this.carts.length; i++) {
					for (let j = 0; j < this.carts[i].validSkus.length; j++) {
						if (!this.carts[i].validSkus[j].marketingVos) continue;
						for (let k = 0; k < this.carts[i].validSkus[j].marketingVos.length; k++) {
							if (this.carts[i].validSkus[j].marketingVos[k].type == 13 && this.carts[i].validSkus[j].marketingVos[k].panicBuy.isShow == 1) {
								let iosTime = this.carts[i].validSkus[j].marketingVos[k].panicBuy.startTime.replace(/\-/g, '/');
								seckillTime = parseInt(new Date(iosTime).getTime() / 1000);
								if (currentTime < seckillTime) {
									this.carts[i].validSkus[j].marketingVos[k].panicBuy.seconds = seckillTime - currentTime;
									console.log(seckillTime - currentTime, 'seckillTime');
									this.carts[i].validSkus[j].marketingVos[k].panicBuy.label = '距离开始';
								} else {
									//开始了
									this.carts[i].validSkus[j].marketingVos[k].panicBuy.seconds = 3600 - parseInt(currentTime - seckillTime);
									this.carts[i].validSkus[j].marketingVos[k].panicBuy.label = '距离结束';
								}
							}
							if (this.carts[i].validSkus[j].marketingVos[k].type == 16) {
							}
						}
					}
				}
				// this.carts.forEach((item) => {
				//   item.validSkus.forEach((sItem) => {
				//     if (sItem.marketingVos) {
				//       sItem.marketingVos.forEach((cItem) => {
				//         if (cItem.type == 16) {
				//           sItem["avtivityLabel"] = cItem.marketingAttr.label || "";
				//         }
				//       });
				//     }
				//   });
				// });
			});
		},
		async settlement() {
			if (!this.ids.length) {
				uni.showToast({
					title: '你还没选择商品哦',
					icon: 'none',
					duration: 2500
				});
				return;
			}
			// 判断是否虚拟和普通商品混合的如果混合提示普通商品和虚拟商品不能同时结算
			if (this.isVirtual_y > 0 && this.isVirtual_n > 0) {
				this.showConfirmPrompt = true;
				return;
			}
			let gotCouponNum = -1;
			//判断是否都领过店铺满减券
			if (this.isNotHave == true) {
				let ids = [];
				for (let i in this.storeSummaryList) {
					if (this.storeSummaryList[i].isReceive == 0) {
						ids.push(this.storeSummaryList[i].couponId);
					}
				}
				gotCouponNum = ids.length;
				this.getcoupon(ids, 2);
			}
			let reqData = {
				ids: this.ids
			};
			let hasLimit = await this.checkLimitSettlement(reqData);
			if (hasLimit.data.panicBuyLimitList && hasLimit.data.specialAreaLimitList) {
				this.showLimit = true;
				this.showSpecialAreaLimit = true;
				this.limitSkuList = hasLimit.data.panicBuyLimitList;
				this.limitFirstList = hasLimit.data.specialAreaLimitList;
				return;
			}
			if (hasLimit.data.panicBuyLimitList && hasLimit.data.panicBuyLimitList.length) {
				this.showLimit = true;
				this.limitSkuList = hasLimit.data.panicBuyLimitList;
				this.limitFirstList = [];
				return;
			}
			if (hasLimit.data.specialAreaLimitList && hasLimit.data.specialAreaLimitList.length) {
				this.showLimit = true;
				this.showSpecialAreaLimit = true;
				this.limitFirstList = hasLimit.data.specialAreaLimitList;
				this.limitSkuList = [];
				return;
			}
			this.$wsf.go('Settlement', { ids: this.ids, gotCouponNum, cart: 1 });
			// Todo 后期需求做
			// 存在批发商品实购数量小于最小批发数量
			/* if (this.limitCartNum) {
				uni.showToast({
					title: '存在批发商品实购数量小于最小批发数量',
					icon: 'none',
					duration:2500
				})
				return
			} */
		},
		// 结算校验数据
		checkLimitSettlement(reqData) {
			return this.$u.api.CheckLimitNumBeforeSettlement(reqData).then(res => {
				return res;
			});
		},
		// 子组件传递的数据
		cartItemData(data, cartsIndex) {
			this.carts[cartsIndex] = data;
		},

		storeChecked(cartsIndex = null, index = null) {
			if (cartsIndex !== null && index !== null) {
				console.log(cartsIndex, index);
			} else {
				this.carts[cartsIndex].validSkus.map((item, index) => {
					item.checked = true;
				});
			}
		},
		swipeActioncFun(index, index1, cartsIndex) {
			// cartsIndex 第一层循环的index; index 第一层循环的index
			// this.carts[cartsIndex].validSkus.splice(index,1)
			this.cartsIndexs = {
				cartsIndex,
				index
			};
			console.log(this.cartsIndexs);
			this.confirmText = `确认要删除已选中的1件商品？`;
			this.showConfirm = true;
		},
		// 向右滑动时记住当前的下标
		open(cartsIndex, index) {
			// this.cartsSubscript = {cartsIndex,index}
		},
		// 步进器 -
		async minusFun(cartsIndex, index, normalSkusItem) {
			console.log('normalSkusItem--------', normalSkusItem);
			if (normalSkusItem.stock == 0 || normalSkusItem.status == 2 || normalSkusItem.status == 3 || normalSkusItem.status == 4) {
				return false;
			}
			let num = this.carts[cartsIndex].validSkus[index].num;
			if (num > 1) {
				this.carts[cartsIndex].validSkus[index].num = parseInt(this.carts[cartsIndex].validSkus[index].num) - 1;
				let verify = true;
				let obj = {
					isIgnoreCartNum: true,
					buyNowRequestList: [
						{
							num: this.carts[cartsIndex].validSkus[index].num,
							skuId: this.carts[cartsIndex].validSkus[index].skuId,
							sourceType: this.carts[cartsIndex].validSkus[index].sourceType,
							storeId: this.carts[cartsIndex].validSkus[index].storeId,
						}
					]
				};
				console.log(this.carts[cartsIndex].validSkus[index], 'this.carts[cartsIndex].validSkus[index]');
				await this.$u.api.CheckSkuPanicBuyLimitNum(obj).then(res => {
					console.log(res, '校验是否超过平台秒杀限制数');
					if (res.data && res.data.limitNum) {
						if (res.data.hasBoughtNum) {
							normalSkusItem.num = res.data.limitNum - res.data.hasBoughtNum;
							this.$u.toast(`限购${res.data.limitNum}件,你已购买过${res.data.hasBoughtNum}件了`);
						} else {
							normalSkusItem.num = res.data.limitNum;
							this.$u.toast(`抱歉，该商品限购${res.data.limitNum}件`);
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
				this.plusCartNum(cartsIndex, index);
			}
		},
		// 步进器 +
		async plusFun(cartsIndex, index, normalSkusItem) {
			console.log('normalSkusItem--------', normalSkusItem);
			if (normalSkusItem.stock == 0 || normalSkusItem.status == 2 || normalSkusItem.status == 3 || normalSkusItem.status == 4) {
				return false;
			}
			let { num, stock } = this.carts[cartsIndex].validSkus[index];
			// 库存是否足够
			if (num <= stock && num != stock) {
				this.carts[cartsIndex].validSkus[index].num = parseInt(this.carts[cartsIndex].validSkus[index].num) + 1;
				let verify = true;
				let obj = {
					isIgnoreCartNum: true,
					buyNowRequestList: [
						{
							num: this.carts[cartsIndex].validSkus[index].num,
							skuId: this.carts[cartsIndex].validSkus[index].skuId,
							sourceType: this.carts[cartsIndex].validSkus[index].sourceType,
							storeId: this.carts[cartsIndex].validSkus[index].storeId,
						}
					]
				};
				await this.$u.api.CheckSkuPanicBuyLimitNum(obj).then(res => {
					console.log(res, '校验是否超过平台秒杀限制数1111111111');
					if (res.data && res.data.limitNum) {
						if (res.data.hasBoughtNum) {
							normalSkusItem.num = res.data.limitNum - res.data.hasBoughtNum;
							this.$u.toast(`限购${res.data.limitNum}件,你已购买过${res.data.hasBoughtNum}件了`);
						} else {
							normalSkusItem.num = res.data.limitNum;
							this.$u.toast(`抱歉，该商品限购${res.data.limitNum}件`);
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
				this.plusCartNum(cartsIndex, index);
			}
		},
		// 步进器输入框输入时执行
		minusInput(e, cartsIndex, index, param) {
			// console.log("输入框输入: ", e, cartsIndex, index);
			// return false;
			// 输入的值不为空时在赋值
			let val = parseInt(e.detail.value);
			if (e.detail.value !== '' && val !== 0) {
				if (val < this.carts[cartsIndex].validSkus[index].stock) {
					let obj = {
						isIgnoreCartNum: true,
						buyNowRequestList: [
							{
								num: this.carts[cartsIndex].validSkus[index].num,
								skuId: this.carts[cartsIndex].validSkus[index].skuId,
								sourceType: this.carts[cartsIndex].validSkus[index].sourceType,
								storeId: this.carts[cartsIndex].validSkus[index].storeId,
							}
						]
					};
					this.$u.api.CheckSkuPanicBuyLimitNum(obj).then(res => {
						if (res.data && res.data.limitNum) {
							if (res.data.hasBoughtNum) {
								this.carts[cartsIndex].validSkus[index].num = res.data.limitNum - res.data.hasBoughtNum;
								this.$u.toast(`限购${res.data.limitNum}件,你已购买过${res.data.hasBoughtNum}件了`);
							} else {
								this.carts[cartsIndex].validSkus[index].num = res.data.limitNum;
								this.$u.toast(`抱歉，该商品限购${res.data.limitNum}件`);
							}
						} else {
							this.carts[cartsIndex].validSkus[index].num = val;
						}
					});
				} else {
					this.$nextTick(() => {
						this.carts[cartsIndex].validSkus[index].num = this.carts[cartsIndex].validSkus[index].stock;
					})
					this.$u.toast(`购买数量不能超过库存数量`);
					return false;
				}
			} else {
				return;
				// console.log("值为空或无值", e);
				// e.detail.value = 1;
				// this.carts[cartsIndex].validSkus[index].num = 1;
			}
		},
		// 失焦时执行
		minusBlur(e, cartsIndex, index, param) {
			if (e.detail.value !== '' && e.detail.value != 0) {
				console.log('失焦', e, cartsIndex, index, param);
				if (e.detail.value <= this.carts[cartsIndex].validSkus[index].stock) {
					this.carts[cartsIndex].validSkus[index].num = e.detail.value;
				} else {
					this.$nextTick(() => {
						this.carts[cartsIndex].validSkus[index].num = this.carts[cartsIndex].validSkus[index].stock;
					})
					this.$u.toast(`购买数量不能超过库存数量`);
					return false;
				}
			} else {
				this.carts[cartsIndex].validSkus[index].num = 1;
			}
			this.plusCartNum(cartsIndex, index);
		},
		async plusCartNum(cartsIndex, index) {
			let sku = this.carts[cartsIndex].validSkus[index];
			console.log('商品sku-------', sku);
			let inputvalue = sku.num;
			let cartId = sku.cartId;
			// if (inputvalue > 99) {
			// 	inputvalue = 99;
			// }
			/* // inputvalue++
				// 判断是否有达到了限购
				if (sku.limitStock !== -2 && sku.limitStock < inputvalue) {
					uni.showToast({
						title: '商品达到了限购!',
						icon: 'none',
						duration:2500
					})
					// app.showToastError('商品达到了限购!')
					inputvalue = sku.limitStock
				} */
			// 库存不足
			if (sku.stock < inputvalue) {
				this.$u.toast(`商品加购件数(含已加购件数)已超过库存!`);

				inputvalue = sku.stock;
			}
			// 限购
			// let obj = {
			// 	isIgnoreCartNum: true,
			// 	buyNowRequestList: [
			// 		{
			// 			num: this.carts[cartsIndex].validSkus[index].num,
			// 			skuId: this.carts[cartsIndex].validSkus[index].skuId,
			// 			sourceType: this.carts[cartsIndex].validSkus[index].sourceType,
			// 			storeId: this.carts[cartsIndex].validSkus[index].storeId,
			// 		}
			// 	]
			// };
			// await this.$u.api.CheckSkuPanicBuyLimitNum(obj).then(res => {
			// 	if (res.data && res.data.limitNum) {
			// 		if (res.data.hasBoughtNum) {
			// 			inputvalue = res.data.limitNum - res.data.hasBoughtNum;
			// 			this.$u.toast(`限购${res.data.limitNum}件,你已购买过${res.data.hasBoughtNum}件了`);
			// 			return;
			// 		} else {
			// 			inputvalue = res.data.limitNum;
			// 			this.$u.toast(`抱歉，该商品限购${res.data.limitNum}件`);
			// 			return;
			// 		}
			// 	}
			// });
			this.carts[cartsIndex].validSkus[index].num = inputvalue;
			this.changeCartNum(cartId, inputvalue, sku, cartsIndex, index);
		},
		changeCartNum(cartId, num, sku, cartsIndex, index) {
			console.log('sku : ', sku);
			let that = this;
			let param = {
				id: cartId,
				num: num,
				// recommendToken: this.$storage.getItem(sku.spuId)  // 2022.9.22 电商v3.0需求取消购物车分销功能, 不缓存分销码
			};
			// console.log('改变购车数量提交数据data------------',param)
			this.$u.api.UpdateCartNum(param).then(res => {
				if (num > this.carts[cartsIndex].validSkus[index].stock) {
					this.carts[cartsIndex].validSkus[index].num = this.carts[cartsIndex].validSkus[index].stock;
				}
				//去计算优惠券优惠金额
				this.getDiscountPrice();

				//清除分销码
				// this.$storage.removeItem(this.carts[cartsIndex].validSkus[index].spuId); // 2022.9.22 电商v3.0需求取消购物车分销功能, 不缓存分销码

				console.log('库存相关数据:', res);
			});
		},
		// 某个店铺下商品全选
		checked(cartsItem, cartsIndex, normalSkusIndex = null) {
			this.discountMoney = 0;
			// 根据第二层循环的index来判断是否为单个商品的选择
			if (normalSkusIndex !== null) {
				console.log('单选');
				if (this.compile == '完成') {
					this.carts[cartsIndex].validSkus.map((item, index) => {
						if (normalSkusIndex === index) {
							item.checked = !item.checked;
						}
					});
				} else {
					this.carts[cartsIndex].validSkus.map((item, index) => {
						if (normalSkusIndex === index && item.status !== 2) {
							if (!(item.stock == 0) && (item.status != 2 || item.status != 3)) {
								item.checked = !item.checked;
							}
						}
					});
				}

				// 在选择单个商品时,当依次选中该店铺下的全部商品,则把该店铺的全选设置为true,否则为false
				let sign = this.carts[cartsIndex].validSkus.some(item => {
					return item.checked == false;
				});
				if (sign) {
					this.carts[cartsIndex].checked = false;
				} else {
					this.carts[cartsIndex].checked = true;
				}
				this.getDiscountPrice();
			} else {
				//选择全部商品
				console.log('全选');
				this.carts[cartsIndex].checked = !cartsItem.checked;

				// 要全选时
				if (this.carts[cartsIndex].checked) {
					// 全部选中
					if (this.compile == '完成') {
						this.carts[cartsIndex].validSkus.map((item, index) => {
							// 选中全部时要判断,跳过选中的,把没有选中的设置为true
							item.checked = true;
						});
					} else {
						this.carts[cartsIndex].validSkus.map((item, index) => {
							// 选中全部时要判断,跳过选中的,把没有选中的设置为true
							if (!item.checked && item.status !== 2 && item.status !== 3 && item.stock !== 0) {
								item.checked = true;
							}
						});
					}
				} else {
					//取消全选
					this.carts[cartsIndex].validSkus.map((item, index) => {
						item.checked = false;
					});
				}
				// if (this.compile != '完成') {
				// 	// 查找店铺所属是否有无货,售罄,下架的商品,如果有,则无法全选
				// 	this.carts[cartsIndex].validSkus.map((item, index) => {   /* 遍历该店铺底下的所有商品 */
				// 		if ((item.stock == 0) || item.status == 2 || item.status == 3) {
				// 			this.carts[cartsIndex].checked = false;   /* 这一段代码主要用来显示购物车的店铺是否全选 */
				// 		}
				// 	});
				// }
				// this.carts[cartsIndex].checked = !this.carts[cartsIndex].checked
				this.getDiscountPrice();
			}
		},
		// 所有店铺下的商品全选
		checkAllFun() {
			this.checkAll = !this.checkAll;
			let sign = null;
			if (this.checkAll) {
				//全选
				this.carts.map(item => {
					item.checked = true;
					for (let i = 0; i < item.validSkus.length; i++) {
						if (this.compile == '完成') {
							item.validSkus[i].checked = true;
						} else {
							if (item.validSkus[i].stock > 0 && item.validSkus[i].status !== 2 && item.validSkus[i].status !== 3) {
								item.validSkus[i].checked = true;
							}
						}
					}
				});
			} else {
				//取消全选
				this.carts.map(item => {
					item.checked = false;
					for (let i = 0; i < item.validSkus.length; i++) {
						item.validSkus[i].checked = false;
					}
				});
			}
			this.getDiscountPrice();
		},
		// 弹框确认
		confirm() {
			let that = this;
			console.log('确认');
			let options = this.$u.deepMerge(that.options);
			that.options = {};
			this.$nextTick(function() {
				let t1 = setTimeout(function() {
					that.options = options;
					console.log('执行一次', that.options);
					clearTimeout(t1);
				}, 300);
			});
			this.showConfirm = false;
			let ids = null;
			let { cartsIndex, index } = this.cartsIndexs;
			if (this.cartsIndexs.index !== null) {
				ids = cartsIndex != null ? this.carts[cartsIndex].validSkus[index].cartId.toString() : this.invalidSkus[index].cartId.toString()
			} else {
				ids = this.ids.toString();
			}
			this.$u.api.DeleteCart({ ids }).then(res => {
				console.log(res);
				this.compile = '编辑';
				this.compileShow = true;
				this.getCartList();
			});
		},
		// 弹框取消
		cancel() {
			let that = this;
			let options = this.$u.deepMerge(that.options);
			that.options = {};
			this.$nextTick(function() {
				let t1 = setTimeout(function() {
					that.options = options;
					console.log('执行一次', that.options);
					// that.getCartList()
					this.carts = this.carts;
					clearTimeout(t1);
				}, 300);
			});
			console.log('取消');
		},
		/* sku相关 */
		// 选中属性
		pitchOnFun(v, index, index_v) {
			console.log(v, index, index_v);
			// 选中当前点击sku属性
			if (!this.skuDetail.sku.tree[index].v[index_v].disabled) {
				this.v_name[index].name = this.skuDetail.sku.tree[index].v[index_v].name;
			}

			// sku相关规格属性大于等于2组时
			if (this.skuDetail.sku.tree >= 2) {
			}
			console.log(this.v_name, 'v-name');
			// this.v_name[index].name = this.skuDetail.sku.tree[index].v[index_v].name
		},
		skuConfirm(params) {
			this.popupShow = false;
			let data = {
				id: this.cartId,
				skuId: params.skuId
			};
			this.$u.api.ShoppingcartSpec(data).then(res => {
				this.getCartList(this.$u.deepClone(this.carts));
			});
		},
		clearFailureGoods(list) {
			let ids = []
			list.forEach(item => {
				ids.push(item.cartId)
			})
			this.ids = ids
			this.confirmText = `确定要一键清空失效商品？`;
			this.showConfirm = true;
		},
		openNewCouponModel(item) {
			let arr = []
			for(let i in item.validSkus) {
				let obj = {
					spuId: item.spuId,
					num: 1,
					beforeCouponPrice: this.skuData.price
				}
			}
			let params = arr
			this.$u.api.GetUserCoupons(params).then(res => {
				let list = res.data, usableCouponList = [], disableCouponList = []
				list.forEach(item => {
					if(item.usable == true) {
						usableCouponList.push(item)
					} else {
						disableCouponList.push(item)
					}
					if(!this.selectCouponItem && this.skuData.afterCouponPrice && item.checked == true) {
						this.selectCouponItem = item
					}
				})
				this.usableCouponList = usableCouponList
				this.disableCouponList = disableCouponList
				this.couponShow = true;
			})
		},
		openDiscountsInfoModel() {
			this.discountsInfoShow = true
		},
        // 获得spu的选中状态
        getChoosedStore(oldCarts) {
            const ids = new Array()
            oldCarts.forEach((spu) => {
              if (spu.checked) {
                ids.push(spu.spuId)
              }
            })
            return ids
        },
        // 获得商品的选中状态
        getChoosedSku(oldCarts) {
            const ids = new Array()
            oldCarts.forEach((spu) => {
                spu.validSkus.forEach((sku) => {
                if (sku.checked) {
                  ids.push(sku.skuId)
                }
              })
            })
            return ids
        },
	}
};
</script>

<style lang="scss" scoped>
.rect {
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	width: 100%;
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
.cart {
	height: 100%;
	.applet-cart-wrap {
		height: 100%;
		.compile {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 84rpx;
			background: #ffffff;
			padding-right: 36rpx;
			line-height: 84rpx;
			text-align: right;
			font-size: 28rpx;
			color: #000000;
			font-weight: 400;
			border-radius: 0px 0px 20rpx 20rpx;
			z-index: 97;
		}
		.space {
			width: 1rpx;
			height: 100%;
			float: left;
		}
		.applet-cart-isEmpty {
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			align-items: center;
			background-color: #fff;
			box-sizing: border-box;
			// margin-bottom: 120rpx;
			height: 416rpx;
			padding-top: 40rpx;
			border-radius: 0px 0px 10px 10px;
			&-icon {
				height: 180rpx;
				width: 180rpx;
				margin-bottom: 4rpx;
			}
			&-tips {
				color: #999999;
				font-size: 28rpx;
				line-height: 40rpx;
				margin-bottom: 30rpx;
			}
			&-btn {
				width: 180rpx;
				height: 60rpx;
				line-height: 60rpx;
				border: 1rpx solid #666666;
				text-align: center;
				border-radius: 30rpx;
				color: #000;
				background: #fff;
			}
			&-login-btn {
				background-color: $wsf-color-red;
				color: #fff;
				border: none;
			}
		}
		.applet-template-recommend {
			padding-bottom: calc(env(safe-area-inset-bottom) + 200rpx);
			.applet-template-recommend-title {
				margin: 40rpx 0 20rpx;
				text-align: center;
			}
		}
		.list {
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.list_carts {
				padding: 0 16rpx;
				width: 100%;
				// flex: 1;
				// overflow: auto;
				// overflow-x: hidden;
			}
			.settlement {
				width: 100%;
				height: 120rpx;
				box-sizing: content-box;
				background: #ffffff;
				position: fixed;
				padding-bottom: 100rpx;
				bottom: env(safe-area-inset-bottom);
				right: 0;
				z-index: 9998;
				.settlement-wrap {
					background: #fff;
					padding: 16rpx 32rpx;
					display: flex;
					justify-content: space-between;
					position: relative;
					.discounts-info-model {
						padding: 24rpx;
						z-index: 99;
						position: absolute;
						// top: -332rpx;
						bottom: 104rpx;
						left: 0;
						width: 100vw;
						// height: 332rpx;
						height: auto;
						background: #F6F6F6;
						border-radius: 24rpx 24rpx 0rpx 0rpx;
						box-sizing: border-box;
						.discounts-info-title {
							text-align: center;
							height: 44rpx;
							font-size: 32rpx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #000D1D;
							line-height: 44rpx;
							margin-bottom: 24rpx;
						}
						.discounts-info-close-btn {
							height: 90rpx;
							width: 104rpx;
							position: absolute;
							right: 0;
							top: 0;
							background: url(@/static/img/icon/close-icon.png) center no-repeat;
							background-size: 54rpx 40rpx;
						}


						.Performance-f{
							background: #FFFFFF;
							border-radius: 24rpx;
							display: flex;
							align-items: center;
							justify-content: space-between;
							padding: 20rpx 24rpx;
							font-size: 26rpx;
							color: #191919;
							line-height: 34rpx;
						}
						.goods-list-item{
							padding: 24rpx;
							background: #FFFFFF;
							margin-bottom: 20rpx;
							border-radius: 24rpx;
							.discounts-info-column {
								display: flex;
								align-items: center;
								justify-content: space-between;
								font-size: 26rpx;
								color: #191919;
								line-height: 34rpx;
								margin-bottom: 38rpx;
								.discounts-info-text-red {
									color: #e60113;
								}
							}
							.discounts-info-column:last-child{
								margin-bottom: 0;
							}
						}
					}
				}
				.left {
					display: flex;
					flex: 1;

					.total {
						display: flex;
						flex-direction: column;
						align-items: flex-end;
						flex: 1;
						text-align: right;
						padding-right: 8rpx;
						.up {
							display: flex;
							align-items: center;
						}
						.down {
							padding-left: 40rpx;
						}
					}
					.wsf-check-btn {
						height: 36rpx;
						width: 36rpx;
						box-sizing: border-box;
						border: 2rpx solid #C3C3C3 ;
						border-radius: 18rpx;
						image {
							margin-left: 0;
							margin-right: 20rpx;
						}
					}
					.active {
						border: none;
					}
					.all_txt {
						padding: 0 20rpx;
					}
					.txt_1{
						font-size: 26rpx;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: bold;
						color: #191919;
						line-height: 34rpx;
					}
					.txt_2 {
						font-size: 30rpx;
						font-family: DINAlternate-Bold, DINAlternate;
						font-weight: bold;
						color: #191919;
						line-height: 34rpx;
					}
					.down {
						text {
							font-size: 24rpx;
							font-weight: 400;
							color: $wsf-color-red;
						}
					}
				}
				.right {
					.btn,
					.btn2 {
						width: 216rpx;
						height: 76rpx;
						// background: #e60113;
						background: linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%);
						border-radius: 38rpx;
						text-align: center;
						line-height: 76rpx;
						font-size: 28rpx;
						font-weight: 500;
						color: #FFF9E9;
					}
					.btn2 {
						// border: 1rpx solid #000000;
						background: #ffffff;
						color: #000;
					}
					/deep/ .u-border:after {
						border-radius: 100rpx;
						border-color: #000;
					}
				}
			}
			.threeHorizontal{
				// height: 150rpx;
				.right {
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}
		}
		.store-card-wrap {
			background-color: #fff;
			border-radius: 20rpx;

			.store-card-coupon {
				margin-right: 36rpx;
				width: 64rpx;
				height: 32rpx;
				display: inline-flex;
				justify-content: center;
				align-items: center;
				background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/activity/coupon01%402x.png');
				background-repeat: no-repeat;
				background-size: 100% 100%;
				color: #e60113;
				font-size: 20rpx;
			}

			.spu-coupon-column {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 24rpx;
				margin-bottom: 8rpx;
				.column-left {
					font-size: 24rpx;
					color: #000;
					line-height: 38rpx;
					display: inline-flex;
					align-items: center;
					.all-select {
						width: 26px;
						font-size: 13px;
						font-family: PingFangSC-Regular, PingFang SC;
						color: #191919;
					}
					.coupon-check-btn {
						height: 36rpx;
						width: 36rpx;
						box-sizing: border-box;
						border: 2rpx solid #C3C3C3;
						border-radius: 18rpx;
						margin-right: 16rpx;
					}
					.coupon-check-btn-disable {
						background-color: #eee;
					}
					.active {
						border: none;
					}
					.coupon-mark-box {
						width: 420rpx;
						height: 44rpx;
						overflow: hidden;
						.coupon-mark {
							margin-bottom: 10rpx;
  					  height: 40rpx;
  					  border-radius: 4rpx;
  					  border: 2rpx solid #E60113;
  					  padding: 0 8rpx;
  					  font-size: 24rpx;
  					  font-weight: 500;
  					  display: inline-flex;
  					  margin-left: 16rpx;
  					  align-items: center;
  					  color: #E60113;
  					}
					}
				}
				.column-right {
					font-size: 26rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #FF450C;
    			display: inline-flex;
    			align-items: center;
    			.expand-image {
    			  width: 32rpx;
    			  height: 32rpx;
    			}
				}
			}

			.store-cart-body {
				width: 100%;
				.failure-column {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 0 32rpx 32rpx;
					font-size: 28rpx;
					line-height: 30rpx;
					.failure-goods-num {
						color: #000;
					}
					.failure-goods-clear {
						color: #E60113;
					}
				}
				.swipe_action {

					&:last-child {
						/deep/ .u-swipe-content {
							margin-bottom: 0;
						}
					}

					/deep/ .u-swipe-content {
						margin-bottom: 26rpx;
					}

					/deep/ .u-btn-text {
						color: #ffffff;
					}
				}

				.estimate-column {
					// padding: 18rpx 0 0 312rpx;
					padding: 0 0 0 298rpx;
					font-size: 22rpx;
					color: #FF0A35;
					font-family: PingFangSC-Semibold, PingFang SC;
					line-height: 30rpx;
					font-weight: 600;
					.bold {
						// font-weight: 500;
						// color: #E60113;
						// font-size: 28rpx;
						// line-height: 36rpx;
						font-size: 26rpx;
						font-family: DINAlternate-Bold, DINAlternate;
						font-weight: bold;
						color: #FF0A35;
						line-height: 34rpx;
					}
				}
				.estimate-column {
					.price-yuan {
						font-size: 26rpx;
						font-weight: bold;
						line-height: 34rpx;
					}
					.price-fen {
						font-size: 26rpx;
						font-weight: bold;
						line-height: 30rpx;
					}
				}
				.line-down{
					position: relative;
					top: 26rpx;
					left: 84rpx;
					width: 100%;
					height: 2rpx;
					background: #EEEEEE;
				}

				.item {
					padding-top: 24rpx;
					display: flex;
					.wsf-check-btn {
						display: flex;
						align-items: center;
						padding-left: 24rpx;
						padding-right: 16rpx;
						.wsf-check {
							height: 36rpx;
							width: 36rpx;
							box-sizing: border-box;
							border: 2rpx solid #C3C3C3;
							border-radius: 18rpx;
							image {
								margin-left: 0;
								margin-right: 20rpx;
							}
						}
						.coupon-check-btn-disable {
							background-color: #eee;
						}
						.active {
							border: none;
						}
					}
				}
				.obscuration_img {
					position: relative;
					width: 200rpx;
					height: 200rpx;
					flex: 0 0 200rpx;
					border-radius: 12rpx;
					.txt {
						width: 110rpx;
						height: 110rpx;
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
						background: rgba(0, 0, 0, 0.7);
						border-radius: 50%;
						text-align: center;
						line-height: 110rpx;
						color: #ffffff;
						z-index: 1000;
						text {
							opacity: 1;
							color: #ffffff;
							font-size: 24rpx;
							font-weight: 400;
						}
					}
					.mask {
						position: absolute;
						top: 0;
						left: 0;
						width: 200rpx;
						height: 200rpx;
						border-radius: 12rpx;
						z-index: 999;
						opacity: 0.7;
						background: #ffffff;
					}
					image {
						position: absolute;
						width: 200rpx;
						height: 200rpx;
						flex: 0 0 200rpx;
						border-radius: 12rpx;
					}
				}
				image {
					width: 200rpx;
					height: 200rpx;
					flex: 0 0 200rpx;
					border-radius: 12rpx;
				}
				.content {
					width: 100%;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					.title {
						text-align: left;
						// font-size: 28rpx;
						// color: $u-content-color;

						font-size: 26rpx;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #191919;
						line-height: 34rpx;
					}
					.select {
						// margin: 16rpx 0;
						display: flex;
						// justify-content: center;
						align-items: center;
						.select-item {
							display: flex;
							// justify-content: center;
							align-items: center;
							// min-width: 156rpx;
							// max-width: 156rpx;
							border-radius: 20rpx;
							background: #f6f6f6;
							padding: 0 20rpx;
							.title {
								display: inline-block;
								max-width: 156rpx;
								height: 40rpx;
								line-height: 40rpx;
								color: #888;
								font-size: 22rpx;
								font-weight: 400;
								margin-right: 20rpx;
							}
						}
					}
					.seckill-info {
						text {
							font-size: 20rpx;
							font-weight: 400;
							color: #e60113;
						}
						.txt-1 {
							border: 1rpx solid #e60113;
							padding: 0rpx 5rpx;
							border-radius: 6rpx;
						}
						.txt-2 {
							margin: 0 10rpx;
						}
						.seckill-trailer-color {
							color: #000;
						}
						.txt-3 {
							margin-left: 10rpx;
						}
					}
					.tag-part {
						margin-bottom: 16rpx;
						.bug-send {
							margin-right: 16rpx;
							display: inline-block;
							padding: 0 6rpx;
							line-height: 28rpx;
							height: 28rpx;
							border-radius: 4rpx;
							border: 2rpx solid $wsf-color-red;
							font-size: 20rpx;
							color: $wsf-color-red;
						}
						.activity-type {
							display: inline-block;
							margin-right: 16rpx;
							margin-top: 18rpx;
							color: #ffffff;
							font-size: 20rpx;
							text-align: center;
							padding: 0rpx 6rpx;
							border-radius: 4rpx;
							background: -webkit-linear-gradient(left, #fe5229, #ff8b40);
						}
					}
					.price_btn {
						display: flex;
						justify-content: space-between;
						align-items: flex-end;
						.left {
							.price_item {
								// color: #e60113;
								font-size: 28rpx;
								line-height: 28rpx;
								font-weight: 500;
							}
							.btn_item {
								// color: #e60113;
								font-size: 32rpx;
								font-family: DINAlternate-Bold, DINAlternate;
								font-weight: bold;
								color: #191919;
								line-height: 32rpx;
								vertical-align: bottom;
							}
						}
						.right {
							display: flex;
							align-items: center;
							.minus {
								display: flex;
								// justify-content: left;
								align-items: center;
								// width: 50rpx;
								// height: 50rpx;
							}
							.num {
								width: 54rpx;
								height: 40rpx;
								line-height: 40rpx;
								text-align: center;
								font-size: 24rpx;
								font-weight: 500;
								color: #333333;
								background: #f5f5f5;
								border-radius: 8rpx;
								margin: 0 12rpx;
								padding: 0 8rpx;
								input {
									min-height: 40rpx;
									height: 40rpx;
								}
							}
							.plus {
								display: flex;
								justify-content: flex-end;
								align-items: center;
								// width: 50rpx;
								// height: 50rpx;
							}
						}
					}
					.performance-part {
						margin-right: 10rpx;
						span {
							display: inline-block;
							margin-top: 18rpx;
							height: 44rpx;
							background: #fcf0f2;
							border-radius: 22rpx;
							line-height: 44rpx;
							padding: 0 20rpx;
							font-size: 26rpx;
							color: #e60113;
						}
					}
					.performance-mark {
        	  margin-top: 10rpx;
	      		padding: 0 8rpx;
	      		display: inline-flex;
	      		align-items: center;
	      		height: 32rpx;
	      		border-radius: 4rpx;
	      		border: 1rpx solid #FD302C;
	      		color: #FD302C;
	      		font-size: 20rpx;
	      	}
					.performate-point {
						// margin-top: 20rpx;
						display: inline-block;
						border-radius: 8rpx;
						background: linear-gradient(90deg, #ECFFFC 0%, #F4FAFF 100%);
						font-size: 22rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						color: #008864;
						line-height: 28rpx;
						.performate-point-label {
							background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/jixiao.png') left center no-repeat;
							padding-left: 28rpx;
							background-size: 28rpx;
						}
						.performate-point-num {
							font-size: 20rpx;
							font-family: ArialMT;
						}
					}
					.gift-list {
						padding: 16rpx 0;
						.gift-product {
							padding: 8rpx 0;
							font-size: 22rpx;
							display: inline-flex;
							align-items: center;
							.gift-product-name {
								display: inline-block;
								color: #999;
								width: 286rpx;
							}
							.gift-product-num {
								color: #999;
							}
						}
					}
				}
			}
		}
	}
	.prompt-context {
		text {
			text-align: center;
			font-size: 32rpx;
			font-weight: 500;
			color: #000000;
		}
	}
	.prompt-button {
		width: 100%;
		text-align: center;
		text {
			display: inline-block;
			width: 208rpx;
			height: 60rpx;
			line-height: 60rpx;
			border-radius: 30rpx;
			border: 1px solid $wsf-color-red;
			font-size: 24rpx;
			font-weight: 500;
			color: $wsf-color-red;
		}
	}
	.popup {
		.sku-info {
			box-sizing: border-box;
			width: 100%;
			display: flex;
			padding: 36rpx 36rpx 0rpx 36rpx;
			.img {
				width: 200rpx;
				height: 200rpx;
				margin-right: 20rpx;
				image {
					width: 200rpx;
					height: 200rpx;
					border-radius: 16rpx;
				}
			}
			.info {
				width: 100%;
				display: flex;
				align-items: flex-end;
				.price {
					.txt_item {
						.txt_1,
						.txt_2 {
							color: #e60113;
						}
						.txt_1 {
							font-size: 32rpx;
							font-weight: 500;
						}
						.txt_2 {
							font-size: 50rpx;
							font-weight: 600;
						}
					}
					.no {
						text {
							font-size: 22rpx;
							font-weight: 400;
							color: #999999;
						}
					}
				}
			}
		}
		.sku {
			box-sizing: border-box;
			// padding: 48rpx 36rpx 0 36rpx;
			padding: 0 36rpx 0 36rpx;
			.scroll-Y {
				height: 474rpx;
				.sku-item {
					.sku-name {
						padding-top: 48rpx;
						padding-bottom: 36rpx;
					}
					.sku-val {
						display: flex;
						flex-wrap: wrap;
						&-item {
							min-width: 80rpx;
							box-sizing: border-box;
							text-align: center;
							padding: 0 20rpx;
							margin-right: 20rpx;
							height: 56rpx;
							line-height: 56rpx;
							background: #f2f2f2;
							border-radius: 26px;
							margin-bottom: 24rpx;
							border: 1px solid #f2f2f2;
							text {
								font-weight: 400;
								font-size: 28rpx;
								color: #000000;
							}
						}
						.disable {
							background-color: #f2f2f2;
							border: 1px solid #f2f2f2;
							color: #bababa;
						}
					}
				}
			}
		}
		.btn {
			padding: 0 36rpx;
			width: 100%;
			height: 80rpx;
			.btn-item {
				width: 100%;
				height: 80rpx;
				background-color: $wsf-color-red;
				border-radius: 40rpx;

				text-align: center;
				font-size: 28rpx;
				font-weight: 500;
				color: #ffffff;
				line-height: 80rpx;
			}
		}
	}
}
.coupon-container {
	padding: 0 36rpx;
	.title {
		padding-bottom: 24rpx;
		line-height: 36rpx;
		color: #000;
		font-size: 32rpx;
	}
	.scroll-Y {
		height: 560rpx;
		::-webkit-scrollbar {
		  width: 0;
		  height: 0;
		  color: transparent;
		}
		.coupon {
			margin-bottom: 20rpx;
			width: 678rpx;
			height: 172rpx;
			background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/coupon_bg%402x.png');
			background-repeat: no-repeat;
			background-size: 100% 100%;
			.left {
				display: inline-block;
				width: 488rpx;
				padding: 32rpx 0 32rpx 24rpx;
				height: 100%;
				.content {
					color: $wsf-color-red;
					padding-bottom: 24rpx;
					.bold {
						font-weight: bold;
					}
					.number {
						font-size: 72rpx;
						line-height: 56rpx;
					}
				}
				.date {
					font-size: 26rpx;
					color: $wsf-color-red;
					line-height: 24rpx;
				}
			}
			.right {
				vertical-align: top;
				display: inline-flex;
				width: 188rpx;
				height: 100%;
				justify-content: center;
				align-items: center;
				position: relative;
				.btn {
					width: 120rpx;
					height: 48rpx;
					background: $wsf-color-red;
					border-radius: 28rpx;
					line-height: 48rpx;
					color: #fff;
					text-align: center;
					font-size: 20rpx;
				}
				.text {
					color: #fe8993;
					font-size: 26rpx;
				}
				.is_have {
					width: 72rpx;
					height: 58rpx;
					position: absolute;
					right: 0;
					bottom: 0;
				}
			}
		}

		.coupon-list {
			.coupon-hint {
				line-height: 38rpx;
				margin-top: 40rpx;
				text-align: center;
				color: #999;
				font-size: 26rpx;
				.markedness {
					color: #e71021;
				}
			}
			.product-coupon {
				background: #fef4f4;
			}
			.store-coupon {
				background: #fff7ee;
			}
			.disabled-coupon {
				background: #f2f2f2;
			}
			.coupon {
				margin-bottom: 20rpx;
				height: 196rpx;
				border-radius: 16rpx;
				overflow: hidden;
				display: flex;
				position: relative;
				&:last-child {
					margin-bottom: 48rpx;
				}
				.top-round-corner {
					background-color: #fff;
					position: absolute;
					top: -16rpx;
					right: 192rpx;
					transform: translate(50%, 0);
					height: 28rpx;
					width: 28rpx;
					border-radius: 0 0 50% 50%;
					z-index: 2;
				}
				.bottom-round-corner {
					background-color: #fff;
					position: absolute;
					bottom: -16rpx;
					right: 192rpx;
					transform: translate(50%, 0);
					height: 28rpx;
					width: 28rpx;
					border-radius: 50% 50% 0 0;
					z-index: 2;
				}
				.main-ticket {
					position: relative;
					padding: 60rpx 0 60rpx 12rpx;
					.coupon-detail {
						display: inline-flex;
						align-items: center;
						height: 76rpx;
						.store-color {
							color: #fe8c02;
						}
						.product-color {
							color: #e60113;
						}
						.disabled-color {
							color: #999 !important;
						}
						.coupon-price {
							min-width: 180rpx;
							font-weight: 600;
							display: inline-flex;
							align-items: baseline;
							justify-content: center;
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
						.coupon-info {
							margin-left: 24rpx;
							display: inline-flex;
							flex-direction: column;
							justify-content: space-between;
							.condition {
								color: #000;
								font-size: 28rpx;
								line-height: 40rpx;
								font-weight: 500;
							}
							.indate {
								color: #666;
								font-size: 22rpx;
								line-height: 32rpx;
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

					.store-mark {
						background: #ffb760;
					}
					.product-mark {
						background: #fe8993;
					}
					.disabled-mark {
						background: #999;
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
					justify-content: center;
					position: relative;
					.stub-mark {
						width: 104rpx;
						height: 100rpx;
						position: absolute;
						right: 0;
						top: 0;
						z-index: 1;
					}
					.platform-btn {
						background: #e60113;
					}
					.store-btn {
						background: #fe8c02;
					}
					.get-coupon-button {
						width: 152rpx;
						height: 60rpx;
						border-radius: 30rpx;
						line-height: 60rpx;
						text-align: center;
						font-size: 24rpx;
						color: #fff;
						z-index: 2;
					}
				}
			}
		}
	}
}


.u-padding-top-24 {
	.swipe_action:last-child  {
		.line-down{
			display: none;
		}
	}
}
.list-padding-card-32{
	padding: 32rpx 0;
}
.all-flex{
	display: flex;
	justify-content: center;
	align-items: center;
}
.top-adress-edit {
	display: flex;
	justify-content: space-between;
	background-color: #f5f5f5;
	padding: 20rpx 16rpx 0 16rpx;
	font-size: 26rpx;
	font-weight: 400;
	color: #444444;
	line-height: 44rpx;
	.top-adress{
		display: flex;
		justify-content: center;
		align-items: center;
		height: 50rpx;
		background: #FFFFFF;
		border-radius: 28rpx;
		padding: 0 16rpx;
		.adress-img{
			margin-right: 4rpx;
			width: 32rpx;
			height: 32rpx;
		}
		.no-adress{
			color: #999999;
		}
		.init-adress{
			color: #444444;
		}
	}
}


.addresspop {
		background-color: #F6F6F6;
		height: 100%;
		overflow: hidden;
		position: relative;
		&-close {
			width: 54rpx;
			height: 40rpx;
			background-size: 100% 100%;
			background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/address/address-close-2x.png);
			position: absolute;
			right: 24rpx;
			top: 24rpx;
		}
		&-title {
			text-align: center;
			font-size: 32rpx;
			line-height: 92rpx;
		}
		&-content {
			position: absolute;
			top: 92rpx;
			bottom: 96rpx;
			left: 0;
			right: 0;
			overflow: scroll;
		}
		&-location {
			width: 702rpx;
			background-color: #FFFFFF;
			margin: 0 auto;
			display: flex;
			align-items: center;
			border-radius: 24rpx;
			padding: 24rpx 0;
			&__icon {
				width: 32rpx;
				height: 32rpx;
				background-size: 100% 100%;
				background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/address/address-location-2x.png);
				margin: 20rpx;
			}
			&__content {
				width: 514rpx;
			}
			&__content-top {
				display: flex;
				align-items: center;
			}
			&__desc {
				width: 96rpx;
				height: 28rpx;
				line-height: 28rpx;
				text-align: center;
				border-radius: 4rpx;
				background-color: rgba(255, 231, 235, 0.5);
				font-size: 20rpx;
				color: #FF0A35;
			}
			&__address-detail {
				width: 410rpx;
				line-height: 40rpx;
				color: #191919;
				font-size: 32rpx;
				font-weight: bold;
				margin: 0 0 0 8rpx;
			}
			&__address {
				width: 514rpx;
				line-height: 34rpx;
				font-size: 26rpx;
				color: #999;
				margin: 8rpx 0 0 0;
			}
			&__retry {
				font-size: 20rpx;
				color: #FF0A35;
				margin: 0 0 0 20rpx;
			}
		}
		&-list {
			width: 702rpx;
			background-color: #FFFFFF;
			// margin: 20rpx auto 0;
			margin: 0 auto 0;
			display: flex;
			align-items: center;
			flex-direction: column;
			border-radius: 24rpx;
			padding: 24rpx 0;
			&__every {
				width: 100%;
				display: flex;
				align-items: center;
				margin: 40rpx 0 0;
				&:first-child {
					margin-top: 0;
				}
			}
			&__every-first {
				margin-top: 0;
			}
			&__check {
				width: 32rpx;
				height: 32rpx;
				border-radius: 50%;
				border: 2rpx solid #c3c3c3;
				margin: 20rpx;
			}
			&__checked {
				width: 32rpx;
				height: 32rpx;
				background-size: 100% 100%;
				background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/address/address-selected-2x.png);
				margin: 20rpx;
			}
			&__content {
				width: 614rpx;
			}
			&__address-detail {
				width: 100%;
				line-height: 40rpx;
				font-size: 32rpx;
				font-weight: bold;
				color: #191919;
			}
			&__address {
				width: 100%;
				font-size: 26rpx;
				color: #999999;
				margin-top: 8rpx;
			}
		}
		&-add {
			width: 100%;
			padding: 8rpx 0;
			background-color: #fff;
			position: absolute;
			left: 0;
			bottom: 0;
			&__btn {
				width: 702rpx;
				height: 80rpx;
				line-height: 80rpx;
				background-image: linear-gradient(
					90deg,
					rgba(255, 95, 46, 1) 0,
					rgba(255, 10, 53, 1) 100%
				);
				border-radius: 40rpx;
				margin: 0 auto;
				text-align: center;
				color: #FFF9E9;
				font-size: 32rpx;
			}
		}
		&-empty {
			&__flag {
				width: 320rpx;
				height: 320rpx;
				margin: 144rpx auto 0;
				background-size: 100% 100%;
				background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/address/address-blank-2x.png);
			}
			&__desc {
				line-height: 34rpx;
				font-size: 26rpx;
				text-align: center;
				color: #444444;
				margin-top: 16rpx;
			}
		}
	}
	.discounts-info-close-btn {
		height: 90rpx;
		width: 104rpx;
		position: absolute;
		right: 0;
		top: 0;
		background: url(@/static/img/icon/close-icon.png) center no-repeat;
		background-size: 54rpx 40rpx;
	}

	.u-drawer-bottom{
    background-color: none;
	}
</style>
