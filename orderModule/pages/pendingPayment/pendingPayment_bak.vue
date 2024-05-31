<template>
  <view class="pending-payment">
    <wsf-nav-bar
      :fixed="true"
      :hasBack="true"
      :status-bar="true"
      :title="showSearchBar ? '订单详情' : ''"
      :shadow="false"
      backIconType="grey"
      :bg-color="showSearchBar ? '#fff' : 'transparent'"
      @onBackBtnClick="onBackBtnClick"
    ></wsf-nav-bar>
    <view class="content">
      <view
        class="header"
        :style="{ paddingTop: `${safePaddingHeight}px` }"
      >
        <view class="title">
          <image class="order-status-icon" :src="orderStatusIconDict[status]" />
          <!-- <u-icon :name="iconName" size="36"></u-icon> -->
          <text :style="{color: status == 1 ? '#E60113' : '#000'}">{{ titleName }}</text>
        </view>
        <!-- 等待付款 -->
        <view class="txt" v-if="status == 1">
          <!-- <countdown :startTime="orderDetailData.createTime" :endTime="enTime" /> -->
          <text>剩</text>
          <u-count-down
            :show-days="false"
            :show-minutes="true"
            :show-seconds="true"
            separator="zh"
            bg-color="transparent"
            separator-size="28"
            separator-color="#333"
            color="#333"
            font-size="28"
            :timestamp="item.expireTimeSeconds"
          ></u-count-down>
          <text>自动关闭</text>
        </view>
        <view class="go-pay-btn" v-if="status == 1" @tap="goToPay()">去支付</view>
        <!-- 等待收货 -->
        <view class="txt" v-else-if="(status == 2 || status == 3) && titleDesc">{{titleDesc}}</view>
        <!-- 已取消 -->
        <view v-else style="height: 8rpx"></view>
        <!-- <view class="txt" v-if="status == 5 || status == 6 || status == 7">取消原因: {{ orderDetailData.cancelReson ? orderDetailData.cancelReson : '' }}</view> -->
      </view>
    </view>
    <div class="inform" v-if="(status == 2 || status == 3) && orderDetailData.signType == 1">
      <u-notice-bar mode="horizontal" :list="barList"></u-notice-bar>
    </div>
    <view class="address-info">
      <view
        class="address-info-item address-info-item-1 u-margin-bottom-24"
        v-if="orderDetailData.backOrderLogVO !== null && orderDetailData.oldRefund == 1"
        @click="goToRefundDetail"
      >
        <view class="left"><image src="@/static/img/icon_ab.png"></image></view>
        <view class="right-1">
          <view class="user-info">
            <view class="name-phone">
              <text class="txt">
                {{
                  orderDetailData.backOrderLogVO
                    ? orderDetailData.backOrderLogVO.backOrderLogDescVOs[0]
                        .message
                    : "取消/退款进度：您的订单已取消。如您使用了优惠券等，请查看取消进度详情。"
                }}
              </text>
            </view>
            <u-icon name="arrow-right"></u-icon>
          </view>
         <!-- <view class="create-time">{{
            orderDetailData.backOrderLogVO
              ? orderDetailData.backOrderLogVO.backOrderLogDescVOs[0].createTime
              : ""
          }}</view> -->
        </view>
      </view>
      <!--start 物流 虚拟商品不显示 orderType为虚拟订单-->
      <view
        class="address-info-item address-info-item-1"
        v-if="
          orderDetailData.orderType != 7 &&
          (status == 2 ||
            status == 3  ||
            status == 4 ||
            status == 6 ||
            status == 7) && orderDetailData.splitLogistics == 0
        "
      >
        <view class="left">
          <image v-if="status == 1" src="@/static/img/icon_ab.png"></image>
          <image
            v-if="status == 2 || status == 3 || status == 4"
            src="@/static/img/lm.png"
          ></image>
        </view>
        <view
          class="right"
          v-if="
            status == 2 ||
            status == 3 ||
            status == 4 ||
            status == 6 ||
            status == 7
          "
          @click="goToTrace(orderDetailData, 1)"
        >
              <block v-if="status == 2">
                <view class="status-2-3">
                  <view class="user-info">
                    <view class="name-phone">
                      <text class="txt">您提交了订单，请等待发货</text>
                    </view>
                  </view>
                </view>
                <!-- <view class="create-time">{{ orderDetailData.createTime }}</view> -->
              </block>
              <block v-if="(status == 3 || status == 6 || status == 7) && orderDetailData.kdniaoTrackVO">
                <view class="status-2-3">
                  <view class="user-info">
                     <view class="name-phone">
                       <text class="txt">{{
                         orderDetailData.kdniaoTrackVO.tracesList
                           ? orderDetailData.kdniaoTrackVO.tracesList[0].acceptStation
                           : "正在等待揽收"
                       }}</text>
                     </view>
                     <u-icon v-if="status == 3" name="arrow-right"></u-icon>
                  </view>
                </view>
                <!-- <view class="create-time">{{ orderDetailData.createTime }}</view> -->
              </block>
              <block v-if="status == 4">
                <view class="status-2-3">
                  <view class="user-info">
                    <view class="name-phone">
                      <text class="txt" v-if="orderDetailData.deliverGoodsMode == 2">您的订单需要自行去门店提货，请尽快前往实体店门店提货，感谢您在万顺福购物，欢迎您再次光临！</text>
                      <text class="txt" v-else>您的订单已签收，感谢您在万顺福购物，欢迎您再次光临!</text>
                    </view>
                  </view>
                </view>
                <!-- <view class="create-time">{{ orderDetailData.createTime }}</view> -->
              </block>
        </view>
      </view>
      <!--end 物流 -->


      <view
        :class="[
          'address-info-item',
          (status == 2 || status == 3 || status == 4) && orderDetailData.splitLogistics == 0  ? 'u-padding-top-40' : '',
        ]"
      >
        <view class="left"><u-icon name="map" size="32"></u-icon></view>
        <view class="right u-flex flex-column u-col-top">
          <view class="user-info">
            <view class="name-phone">
              <text class="name u-padding-right-20">{{
                orderDetailData.orderAttr.receiptName
              }}</text>
              <text class="phone">{{
                orderDetailData.orderAttr&&orderDetailData.orderAttr.receiptMobile | phoneNumberHide
              }}</text>
            </view>
            <!-- 暂时隐藏,后期看需求加上 -->
            <!-- <view class="modification">
									<text class="txt">修改</text>
									<u-icon name="arrow-right" size="25"></u-icon>
								</view> -->
          </view>
          <view class="address u-padding-top-14">地址：{{ site }}</view>
          <!-- <view class="address u-padding-top-14 u-line-1">地址：{{ site }}</view> -->
        </view>
      </view>
    </view>

    <!-- 商品信息 -->
    <view class="merchandise-news">
      <view class="shop-name" v-if="isShowStore > 0" @click="goToStore()">
        <image
          src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/Shop%402x.png"
          style="width: 30rpx; height: 30rpx"
        ></image>
        <text class="name u-line-1">{{ orderDetailData.storeName }}</text>
        <u-icon name="arrow-right" size="25"></u-icon>
      </view>
      <view
        v-for="(item, index) in orderDetailData.orderSkuWithMarketings"
        :key="index"
      >
        <view class="shop-container">
          <view class="shop-info" @click="goToSku(item.skuId)">
          <!--start 虚拟商品标签 -->
          <view v-if="orderDetailData.orderType == 7" class="virtual-tag">虚拟</view>
          <!--end 虚拟商品标签 -->
          <view class="img"
            ><image
              :src="item.skuImage"
              style="width: 160rpx; height: 160rpx; border-radius: 10rpx"
            ></image
          ></view>
          <view class="txt-info">
            <view class="txt-1 u-line-1">{{ item.skuName }}</view>
            <view class="txt-2">
              <text class="num">{{ "数量: " + item.num }}</text>
              <view class="sku-specs u-line-1">
                <text>{{ item.skuSpecs }}</text>
              </view>
            </view>
            <view class="tag-part">
              <block v-for="(tag, index) in item.marketingVos" :key="index">
                <!-- <view class="sale-price" v-if="item.type == 1">
								<image :src="reducedPriceImg"></image>
								<text class="price-tag">{{item.fall.price}}元</text>
							</view> -->
                <view v-if="tag.type == 12" class="buy-send">{{
                  tag.name
                }}</view>
              </block>
            </view>
            <view class="money-shoppingTrolley">
              <view>
                <view class="money">￥{{ item.skuPrice.toFixed(2) }}</view>
                <image class="common_img" v-if="status != 1" @click.stop="handleAddCart(item)" src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/8129da13a13684f4d6ef799f54c72e97.png"></image>
                <view class="unitPrice-valueCardPrice" v-if="!(titleName === '等待付款')">
                  <view class="money" v-if="orderDetailData.valueCardPrice">
                    <text class="txt-1">礼品卡抵扣 </text>
                    <text class="txt-2">￥{{ priceFilter(item.valueCardPrice) }}</text>
                  </view>
                  <text style="color:#999;font-size:24rpx" v-if="orderDetailData.status != 1 && item.skuPrice != item.unitPrice">实付单价</text><text class="reality-price" v-if="orderDetailData.status != 1 && item.skuPrice != item.unitPrice">￥{{ item.unitPrice.toFixed(2) }}</text>
                </view>
                <!-- <view class="performance-part" v-if="item.performanceScore">绩效分{{ item.performanceScore }}</view> -->
                <view class="performance-mark" v-if="item.performanceScore && item.performanceScore > 0">绩效分{{ item.performanceScore }}</view>
              </view>
              <!-- <view class="shopping-trolley" v-if="status != 1" @click.stop="handleAddCart(item)"><u-icon name="shopping-cart" color="#333"></u-icon></view> -->
            </view>
            <!-- 	<view class="gift-mark">
						赠品
					</view> -->
            </view>
          </view>
          <view class="shop-button-column">
           <button class="common-btn" v-if=" item.isDelivery == 1 && orderDetailData.status != 1 && orderDetailData.splitLogistics == 1 && item.orderType != 7" @tap="goToTrace(item, 2)">查看物流</button>
              <button class="common-btn" v-if="item.refundStatus == 1" @tap="goRefundServiceDetail(item)">退款中</button>
              <button class="common-btn" v-if="item.refundStatus == 2 && orderDetailData.oldRefund != 1" @tap="goRefundServiceDetail(item)">退款完成</button>
              <button class="common-btn" v-if="item.refundStatus == 3" @tap="goRefundServiceDetail(item)">退款失败</button>
			  <!-- orderDetailData.orderType==10为开卡礼订单，隐藏退款按钮 -->
              <button class="common-btn light-btn" v-if="orderDetailData.canRefund && (item.refundStatus == 0 || item.refundStatus == 3)&&orderDetailData.orderType!=10" @tap="goToRefund(item)">申请退款</button>
          </view>
          <block
          v-for="(market, marketIndex) in item.marketingVos"
          :key="marketIndex"
          v-if="market.type == 2 && market.fullGiftList.length > 0"
        >
          <block
            v-for="(gift, giftIndex) in market.fullGiftList[0].giftSkuInfos"
            :key="giftIndex"
          >
            <view class="shop-info" :key="index" @click="goToSku(gift.skuId)">
              <view class="img"
                ><image
                  :src="gift.url"
                  style="width: 160rpx; height: 160rpx; border-radius: 10rpx"
                ></image
              ></view>
              <view class="txt-info">
                <view class="txt-1 u-line-1">{{ gift.name }}</view>
                <view class="txt-2">
                  <text class="num">{{ "数量: " + gift.num }}</text>
                  <view class="sku-specs u-line-1"
                    ><!-- <text>{{ filterSkuSpec(gift.skuSpecValues) }}</text> --></view
                  >
                </view>
                <view class="gift-mark">赠品</view>
              </view>
            </view>
          </block>
          </block>
          <!--start 虚拟商品不需要显示-->
          <!-- <view
          v-if="orderDetailData.orderType != 7"
          class="btn-box"
          :class="{
            'u-margin-bottom-30':
              index < orderDetailData.orderSkuWithMarketings.length - 1,
          }"
        >
          <view
            class="common_btn"
            style="margin-right: 10px"
            @click="goToTrace(item, 2)"
            v-if="
              item.isDelivery == 1 &&
              orderDetailData.splitLogistics == 1 &&
              orderDetailData.status != 1
            "
            >查看物流</view>
          </view> -->
          <!--end 虚拟商品不需要显示-->
        </view>
      </view>
      <!-- 联系客服 -->
      <view class="service u-border-top" @click="serviceTel">
        <u-icon name="server-fill" color="#666" size="36"></u-icon>
        <text>联系客服</text>
      </view>
    </view>
    <!-- 订单信息 -->
    <view class="order">
      <view class="item order-no u-padding-bottom-36">
        <text class="txt-1">订单编号:</text>
        <text class="txt-2">{{ orderDetailData.orderCode }}</text>
          <image
            @click="setClipboardData"
            src="@/static/img/copy.png"
            class="img_item"
          />
      </view>
      <view class="item order-no u-padding-bottom-36">
        <text class="txt-1">下单时间:</text>
        <text class="txt-2">{{ orderDetailData.createTime }}</text>
      </view>
      <view class="item order-time" v-if="orderDetailData.remark">
        <text class="txt-1">买家留言:</text>
        <text class="txt-2">{{ orderDetailData.remark }}</text>
      </view>
      <!-- 待付款 1 / 已取消 5 6 7 -->
     <!-- <template v-if="status == 1 || status == 5 || status == 6 || status == 7">
        <view class="price u-border-top">
          <text class="txt-1">商品总额</text>
          <text class="txt-2"
            >￥{{ priceFilter(orderDetailData.totalSalePrice) }}</text
          >
        </view>
				<view class="price" v-if="orderDetailData.couponPrice">
				  <text class="txt-1">店铺优惠券</text>
				  <text class="txt-2" style="color: #e60113"
				    >-￥{{ orderDetailData.couponPrice }}</text
				  >
				</view>
				<view class="price" v-if="orderDetailData.platformCouponPrice">
				  <text class="txt-1">平台优惠券</text>
				  <text class="txt-2" style="color: #e60113"
				    >-￥{{ orderDetailData.platformCouponPrice }}</text
				  >
				</view>
        <view class="price">
          <text class="txt-1">运费</text>
          <text class="txt-2"
            >+￥{{ priceFilter(orderDetailData.freightPrice) }}</text
          >
        </view>
        <view class="freight" v-if="orderDetailData.valueCardPrice">
				  <text class="txt-1">礼品卡抵扣</text>
          <text class="txt-2"
            >-￥{{ priceFilter(orderDetailData.valueCardPrice) }}</text
          >
				</view>
        <view class="payment">
          <text class="txt-1" v-if="performanceScoreTotal > 0"
            >绩效分总计:</text
          >
          <text
            class="txt-1 u-margin-right-20"
            v-if="performanceScoreTotal > 0"
            >{{ performanceScoreTotal }}</text
          >
          <text class="txt-1">应付款:</text>
          <text class="txt-2">￥</text>
          <text class="txt-3">{{ priceFilter(orderDetailData.price) }}</text>
        </view>
      </template> -->
      <!-- 待收货 -->
      <template v-if="status != 1">
		<!-- 取消订单 用户未付款前不显示支付方式 支付时间 配送方式-->
		<template v-if="status != 5">
			<view
			  class="item order-no u-border-top u-padding-top-36 u-margin-bottom-36"
			>
			  <text class="txt-1">支付方式:</text>
			  <text class="txt-2" v-if="orderDetailData.payChannel == null">/</text>
        <text class="txt-2" v-else>{{orderDetailData.payChannel | payChannelDict}}</text>
			</view>
			<view class="item order-no u-margin-bottom-48">
			  <text class="txt-1">支付时间:</text>
			  <text class="txt-2">{{ orderDetailData.payTime }}</text>
			</view>
			<!--start 虚拟商品无需显示-->
			<view v-if="orderDetailData.orderType != 7"
			  class="item order-no u-border-top u-border-bottom u-padding-top-48 u-padding-bottom-48"
			>
			  <text class="txt-1">配送方式:</text>
			  <text class="txt-2">普通快递</text>
			</view>
			<!--end 虚拟商品无需显示-->
		</template>
        <!--start 虚拟商品卡密-->
        <view v-if="orderDetailData.orderType == 7">
          <view
              class="item order-no u-border-top u-padding-top-36 u-margin-bottom-36"
          >
            <text class="txt-1" style="vertical-align: top;">卡密兑换链接:</text>
            <text class="txt-2" style="color: #007AFF; word-wrap: break-word;word-break: break-all;white-space: pre-line;"
						v-if="orderDetailData.webUrlType == 0">
							{{orderDetailData.webUrl == null ? '' : orderDetailData.webUrl}}
						</text>
						<image v-else style="width:180rpx;height:180rpx" :src="orderDetailData.webUrl" mode=""></image>
						<text v-if="orderDetailData.webUrl && orderDetailData.webUrlType == 0" class="txt-btn btn-left" style="width:104rpx" @click="copyCamilo(orderDetailData.webUrl)">复制链接</text>
          </view>
          <view class="item order-no u-margin-bottom-48 camilo-module">
            <text class="txt-1 camilo-name">权益卡卡密:</text>
            <view class="camilo-module-miyao">
              <view v-for="(item, index) in camiloList"
                    v-if="isOpenCamilo ? index < 4 : index < camiloList.length"
                    :key="index"
                    class="camilo_space txt-2">
                <text>{{ item }}</text>
                  <image
                    @click="copyCamilo(item)"
                    src="@/static/img/copy.png"
                    class="img_item"
                  />
              </view>
            </view>
            <!--超过四个现实展开功能 v-if="camiloList.length > 4"-->
            <view class="box-open-close" v-if="camiloList != null && camiloList.length > 4">
                <view @click="openCamilo" class="font" :class="isOpenCamilo ? 'open' :'close'">
                  {{ isOpenCamilo ? '展开全部卡密' : '收起' }}
                  <image src="@/static/img/cat_Unfold_a@2x.png" v-if="!isOpenCamilo" alt="" />
                  <image src="@/static/img/cat_Unfold@2x.png" v-else alt="" />
                </view>
            </view>
          </view>
        </view>
        <!--end 虚拟商品卡密-->

        <view class="price u-border-top">
          <text class="txt-1">商品总额</text>
          <text class="txt-2"
            >￥{{ priceFilter(orderDetailData.totalSalePrice) }}</text
          >
        </view>
        <view class="price" v-if="orderDetailData.couponPrice">
          <text class="txt-1">店铺优惠券</text>
          <text class="txt-2" style="color: #e60113"
            >-￥{{ orderDetailData.couponPrice }}</text
          >
        </view>
				<view class="price" v-if="orderDetailData.platformCouponPrice">
				  <text class="txt-1">平台优惠券</text>
				  <text class="txt-2" style="color: #e60113"
				    >-￥{{ orderDetailData.platformCouponPrice }}</text
				  >
				</view>
        <view class="price" v-if="orderDetailData.valueCardPrice">
				  <text class="txt-1">礼品卡抵扣</text>
          <text class="txt-2"
            >-￥{{ priceFilter(orderDetailData.valueCardPrice) }}</text
          >
				</view>
        <view class="freight">
          <text class="txt-1">运费</text>
          <text class="txt-2"
            >+￥{{ priceFilter(orderDetailData.freightPrice) }}</text
          >
        </view>
        <view class="price" v-if="orderDetailData.retailerCouponPrice">
				  <text class="txt-1">优惠券</text>
				  <text class="txt-2" style="color: #e60113"
				    >-￥{{ priceFilter(orderDetailData.retailerCouponPrice) }}</text
				  >
				</view>
        <view class="payment">
          <text class="txt-1" v-if="performanceScoreTotal > 0"
            >绩效分总计:</text
          >
          <text
            class="txt-1 u-margin-right-20"
            v-if="performanceScoreTotal > 0"
            >{{ performanceScoreTotal }}</text
          >
          <text class="txt-1">实付款:</text>
          <text class="txt-2">￥</text>
          <text class="txt-3">{{ priceFilter(orderDetailData.price) }}</text>
        </view>
      </template>
    </view>
    <!-- 热销商品 -->
    <view
      class="applet-template-recommend u-padding-left-24 u-padding-right-24"
    >
      <wsf-goods-list
        title="hot"
        :list="flowList"
        :loadStatus="loadStatus"
        @goodsClick="goodsClick($event)"
      ></wsf-goods-list>
    </view>
    <!-- 发票服务弹框 -->
    <!-- 发票确认模块 -->
    <wsf-confirm
      v-model="showConfirm"
      :title="confirmInfo.title"
      :activeText="confirmInfo.activeText"
      :cancelText="confirmInfo.cancelText"
      @confirm="activeConfirm"
    ></wsf-confirm>
    <!-- 取消订单模块 -->
    <wsf-popup v-model="popupShow" mode="bottom" title="取消订单" height="800">
      <!-- 弹框组件 -->
      <view class="applet-cancel-order-wrap">
        <view class="applet-cancel-order-tips">
          <view class="applet-cancel-order-tips-title">温馨提示:</view>
          <view class="applet-cancel-order-tips-text"
            >订单一旦取消，无法恢复</view
          >
        </view>
        <view class="applet-cancel-order-radio">
          <view class="applet-cancel-order-radio-title"
            >请选择取消订单的原因（必选）：</view
          >
          <template v-for="(item, index) in informationList">
            <view
              class="applet-cancel-order-radio-item u-flex"
              :key="index"
              @click="selectInformation(item, index)"
            >
              <image
                v-if="cancelInformation !== item.value"
                style="margin-right: 14rpx; height: 36rpx; width: 36rpx"
                src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/cat_ns%402x.png"
                mode=""
              ></image>
              <image
                v-else
                style="margin-right: 14rpx; height: 36rpx; width: 36rpx"
                src="@/static/img/icon/Selected@2x.png"
                mode=""
              ></image>
              <text>{{ item.label }}</text>
            </view>
          </template>
          <view style="height: 370rpx; width: 100%"></view>
        </view>
      </view>
      <view class="applet-cancel-order-footer" slot="footer">
        <!--start 虚拟商品需要屏蔽-->
        <view class="applet-cancel-order-footer-switch u-flex u-row-between">
          <text class="applet-cancel-order-footer-switch-text"
            >提交后，将本单商品放回购物车中</text
          >
          <wsf-switch inactive-color="#DDD" v-model="isAddCart" :isShowCatSwitch="isVirtual"></wsf-switch>
        </view>
        <!--end 虚拟商品需要屏蔽-->

        <view
          class="applet-cancel-order-footer-btn"
          :class="{ disable: cancelInformation <= 0 }"
          @click.stop="cancelOrder"
          >提交</view
        >
      </view>
    </wsf-popup>

    <!-- 回到顶部 -->
    <u-back-top :scroll-top="scrollTop" top="5000" :icon-style="iconStyle" :bottom="140">
    	<image src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/prev-icon-list/top%402x.png" style="width: 80rpx; height: 80rpx"></image>
    </u-back-top>

    <!-- 底部按钮 -->
    <view class="bottom-btn" style="height: 100rpx" :class="{ 'needButtomSpace': isNeedBottomSpace }"></view>
    <view class="bottom-btn bottom-btn-3 u-border-top" v-if="status == 1" :class="{ 'needButtomSpace': isNeedBottomSpace }">
      <view class="right-btn right-btn-1" @click="openConfirm('invoice')"
        >{{invoiceText}}</view
      >
      <view
        class="right-btn right-btn-2 u-margin-left-20 u-margin-right-20"
        @click="openCancelPopup()"
        >取消订单</view
      >
      <view class="right-btn" @click="goToPay()">去支付</view>
    </view>
    <!-- 待出库 -->
    <view class="bottom-btn bottom-btn-3 u-border-top" v-if="status == 2" :class="{ 'needButtomSpace': isNeedBottomSpace }">
      <view class="right-btn right-btn-1" @click="openConfirm('invoice')"
        >{{invoiceText}}</view
      >
      <!-- <view v-if="backStatus == 1" class="right-btn right-btn-2 u-margin-left-20 " style="color:#bababa;border-color:#bababa">退款中</view> -->
      <!-- <view
        v-if="orderDetailData.canRefund"
        class="right-btn right-btn-2 u-margin-left-20"
        @click="goToRefund"
        >申请退款</view
      > -->
      <!-- <view v-if="orderDetailData.backOrderLogVO && orderDetailData.backOrderLogVO.status == 1" class="right-btn right-btn-2 u-margin-left-20" @click="openConfirm('cancel')">取消申请</view> -->
    </view>
    <!-- 等待收货 -->
    <view class="bottom-btn bottom-btn-3 u-border-top" v-if="status == 3" :class="{ 'needButtomSpace': isNeedBottomSpace }">
      <view class="right-btn right-btn-1 u-margin-right-20" @click="openConfirm('invoice')">{{invoiceText}}</view>
      <!-- <view
				v-if="orderDetailData.canRefund"
        class="right-btn right-btn-2 u-margin-right-20"
        @click="goToRefund"
        >申请退款</view> -->
      <view class="right-btn" @click="openConfirm('receipt')">确认收货</view>
    </view>

    <view class="bottom-btn u-border-top" v-if="status == 4" :class="{ 'needButtomSpace': isNeedBottomSpace }">
      <view class="left-btn" @click="openConfirm('delete')">删除订单</view>
      <view style="display: flex;">
        <view class="right-btn right-btn-2  u-margin-right-20" @click="openConfirm('invoice')">{{invoiceText}}</view>
        <view class="right-btn" @click="buyAgain()" v-if="!isVirtual">再次购买</view>
      </view>
    </view>
    <view
      class="bottom-btn u-border-top"
      v-if="status == 5 || status == 6 || status == 7"
			 :class="{ 'needButtomSpace': isNeedBottomSpace }"
    >
      <view class="left-btn" @click="openConfirm('delete')">删除订单</view>
      <view class="right-btn" @click="buyAgain">再次购买</view>
    </view>


		<wsf-confirm
			v-model="discountOrderDialog"
			:isNeedTouchClose="true"
			:title="discountOrderType == 'cancelOrder' ? '以下订单需一起取消' : '以下订单需一起付款'"
			:activeText="discountOrderType == 'cancelOrder' ? '取消订单' : '付款'"
			:cancelText="discountOrderType == 'cancelOrder' ? '直接买了' : '取消'"
			@confirm="discountOrderConfirm"
			@cancel="discountOrderCancel"
			@handleCloseDialog="discountOrderDialog = false"
		>
			<view class="discount-order-container">
				<view class="order-auto-box">
					<view class="discount-order" v-for="(item, index) in discountOrderData.orderList" :key="index">
						<view class="discount-order-info">
							<view class="left-part">{{ item.storeName }}</view>
							<view class="right-part">￥{{ item.price }}</view>
						</view>
						<view class="discount-order-count">(共{{ item.orderSkus && item.orderSkus.length }}件)</view>
					</view>
				</view>
				<view class="order-total-box">
					<span class="text">订单合计金额：</span>
					<span class="symbol">￥</span>
					<span class="price">{{ discountOrderData.totalPrice }}</span>
				</view>
			</view>
		</wsf-confirm>

    <merge-order-popup :show="mergeOrderPopup" :data="mergeOrderData" @close="mergeOrderPopup = false"></merge-order-popup>
    <!-- 福气值抵扣提示弹框 -->
		<wsf-confirm
			v-model="fqzConfirmDialog"
			title="支付确认"
			activeText="确认支付"
			cancelText="再想想"
			@confirm="handleFqzConfirm"
			@cancel="fqzConfirmDialog = false"
		>
			<view class="fqz-confirm-dialog">
				<view class="fqz-column" style="padding-bottom: 20rpx">
					福气值已抵扣 <text class="light">：¥{{mergeOrderData.fqzPrice.toFixed(2)}}</text>
				</view>
				<view class="fqz-column">
					仍需支付 <text class="light">：¥{{mergeOrderData.orderFqzAmount.toFixed(2)}}</text>
				</view>
			</view>
		</wsf-confirm>
  </view>
</template>

<script>
import wsfNavBar from "@/components/wsf-nav-bar/wsf-nav-bar.vue";
import wsfGoodsList from "@/components/wsf-goods-list/wsf-goods-list.vue";
import { priceFilter } from "@/common/wsfFilter.js";
import MergeOrderPopup from '../../components/mergeOrderPopup/mergeOrderPopup.vue';
export default {
  components: {
    wsfNavBar,
    wsfGoodsList,
    MergeOrderPopup
  },
  data() {
    return {
      orderStatusIconDict: {
        1: this.$oss + 'wsf-mall/order/order-time-red.png',
				2: this.$oss + 'wsf-mall/order/order-time.png',
				3: this.$oss + 'wsf-mall/order/order-time.png',
				4: this.$oss + 'wsf-mall/order/order-right.png',
				5: this.$oss + 'wsf-mall/order/order-error.png',
				6: this.$oss + 'wsf-mall/order/order-error.png',
				7: this.$oss + 'wsf-mall/order/order-error.png',
      },
      fqzConfirmDialog: false,
      mergeOrderData: {
        orderFqzAmount: 0,
				fqzPrice: 0,
				wsOrderCode: "",
				totalAmount: "",
				orderInfoVos: [],
			},
			mergeOrderPopup: false,
			isNeedBottomSpace: getApp().globalData.isNeedBottomSpace,	// 机型为iPhoneX以上
			discountOrderData: {},
			discountOrderDialog: false,
			discountOrderType: '',
      backStatus: null,
      sign: "",
      showPackUp: false,
      showConfirm: false,
      iconName: "clock",
      titleName: "等待付款",
      titleDesc: "",
      height: "444rpx",
      status: null, //订单状态 1 待付款/2 待发货/3 待收货/4 已完成/5 取消订单/6 退款通过/7 退货通过
      enTime: null, //结束时间
      orderId: null, //订单Id
      showSearchBar: false, // 是否显示头部导航栏
      safePaddingHeight: 0, // 状态栏高度
      hasMore: true, // 是否拥有更多
      loadStatus: "loadmore", // 加载更多样式效果
      isLink: false, // 是否登录
      isLoading: false, // 是否正在加载
      flowList: [], // 瀑布流商品列表
      orderDetailData: {}, //订单详情数据
      site: "", //地址
      confirmInfo: {
        type: "",
        title: "",
        activeText: "",
        cancelText: "",
      },
      queryForm: {
        // 页码页容量
        pageNum: 0,
        pageSize: 10,
        orderCode: '',
        pageType: 7
      },
      scrollTop: 0,
      priceFilter,
      popupShow: false, // 弹出组件状态
      isAddCart: false, // 是否加入购物车
      cancelInformation: 0, // 取消原因ID
      informationList: [
        {
          label: "地址信息填写错误",
          value: 1,
        },

        {
          label: "不想要了",
          value: 2,
        },

        {
          label: "商品错选/多选",
          value: 3,
        },

        {
          label: "商品无货",
          value: 4,
        },

        {
          label: "商品降价",
          value: 5,
        },
      ],

      isShowStore: 0,
      setTimer: null, // 定时器
      timeInteval: null, // 倒计时函数
      countDown: 1800, // 倒计时
      camiloList:[],
      isOpenCamilo: true, //权益卡密收起功能
      isVirtual: false, // 虚拟商品标识
      barList: []
    };
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
    let showSearchBar = this.showSearchBar;
    if (e.scrollTop > 30 && !showSearchBar) {
      this.showSearchBar = true;
    } else if (e.scrollTop < 30 && showSearchBar) {
      this.showSearchBar = false;
    } else {
      return;
    }
  },
  onReachBottom() {
    this.GetRecommendList();
  },
  onLoad(params) {
    this.sign = params.sign;
    console.log("参数: ", params);
    this.orderId = params.orderId;
    this.backStatus = params.backStatus;
  },
  onShow() {
    this.isLink = getApp().globalData.isLink;
    this.isShowStore = getApp().globalData.wsfBaseInfo.isShowStore; // 判断商城信息
    this.safePaddingHeight = getApp().globalData.statusBarHeight;
    this.OrderDetail();
    this.setTimer = setInterval(this.OrderDetail, 60000);
  },
  computed: {
    performanceScoreTotal() {
      if (
        !this.orderDetailData ||
        !this.orderDetailData.orderSkuWithMarketings
      ) {
        return 0;
      } else {
        let list = this.orderDetailData.orderSkuWithMarketings,
          point = 0;
        list.forEach((item) => {
          if (item.performanceScore && item.performanceScore > 0) {
            let num = item.performanceScore * item.num;
            point += num;
          }
        });
        return point;
      }
    },
	isInvoiced(){
		const {invoiceFlag} = this.orderDetailData
		//已经开票
		return invoiceFlag != 0 && invoiceFlag != null
	},
	invoiceText(){
	 return this.isInvoiced?"查看发票":"发票服务"
	},
  },
  watch: {
    countDown(value) {
      // console.log('秒',value);
      if (value == 0) {
        clearInterval(this.setTimer);
        clearInterval(this.timeInteval);
      }
    },
  },
  beforeDestroy() {
    clearInterval(this.setTimer);
    clearInterval(this.timeInteval);
  },
  methods: {
		//合并支付/取消订单 确认按钮
		discountOrderConfirm() {
			if (this.discountOrderType == 'cancelOrder') {
				//取消订单 走填写取消原因逻辑
				this.discountOrderDialog = false;
				this.popupShow = true;
			} else if (this.discountOrderType == 'goPayOrder') {
				//付款 跳转支付页面
			this.$wsf.go('Pay', { orderMoney: this.discountOrderData.totalPrice, orderCode: this.discountOrderData.masterOrderCode, businessType: 100,
        paySceneType: 101 //电商订单
      });
			}
		},
		//合并支付/取消订单 取消按钮
		discountOrderCancel() {
			if (this.discountOrderType == 'cancelOrder') {
				//直接买了 跳转支付页面
				this.$wsf.go('Pay', { orderMoney: this.discountOrderData.totalPrice, orderCode: this.discountOrderData.masterOrderCode, businessType: 100,
          paySceneType: 101 //电商订单
        });
			} else if (this.discountOrderType == 'goPayOrder') {
				//取消 关闭弹窗
				this.discountOrderDialog = false;
				this.discountOrderType = '';
				this.discountOrderData = {};
			}
		},
		//取消订单弹窗
		openCancelPopup() {
			if (this.orderDetailData.platformCouponCode) {
				this.$u.api.checkOrder(this.orderDetailData.id).then(res => {
					this.discountOrderType = 'cancelOrder';
					if (res.data && res.data.orderList.length > 0) {
						this.discountOrderData = res.data;
						this.discountOrderDialog = true;
					} else {
						this.popupShow = !this.popupShow
					}
				});
			} else {
				this.popupShow = !this.popupShow
			}
		},
    //筛选出商品规格
    filterSkuSpec(data) {
      let list = JSON.parse(data);
      let strList = list.map((item) => {
        return item.name + ":" + item.valueRemark;
      });
      let specName = strList.join(" ");
      return specName;
    },
    //筛选满赠活动列表
    filterGiftSku(giftskus, price, name) {
      let tempArr = giftskus.filter((el) => {
        return price >= el.fullPrice;
      });
      return tempArr.length > 0 ? tempArr[0].giftSkuInfos : [];
    },

		onBackBtnClick() {
			if (this.sign == 'checkOrderPay') {
				this.$wsf.go('CheckOrderPay', { orderCode: this.orderDetailData.orderCode });
			} else {
				uni.navigateBack();
			}
		},
		// 订单详情
		OrderDetail() {
			let that = this;
			this.$u.api.OrderDetail({ id: this.orderId }).then(res => {
				let that = this;
				console.log(res, '订单详情数据');
				this.orderDetailData = res.data;
        this.resetList()
        this.GetRecommendList();
        this.barList = [res.data.signContent||'']
				// 虚拟商品卡密数据赋值
        if(this.orderDetailData.orderType == 7){
          this.camiloList = this.orderDetailData.virtualCardKeyList
        }
        this.isVirtual = this.orderDetailData.orderType == 7;
        let options={}, storeServiceConfig = that.orderDetailData.storeServiceConfig,tagsurl = ''
				Object.keys(storeServiceConfig).forEach(key => {
					 if(storeServiceConfig[key]){
						 if(key == 'staffId'){
							 options.staffid = storeServiceConfig[key]
							}else{
							 options[key] = storeServiceConfig[key]
							}
					 }
				 })
				 if(options.staffid){
					 tagsurl = `https://merchant.wsfmall.com/ordermanagement/mallorder/orderdetail?id=${that.orderDetailData.orderSkuWithMarketings[0].orderId}`
				 }else{
					 tagsurl = `https://platform.wsfmall.com/ordermagamemt/storeorder/storeorderdetail?id=${that.orderDetailData.orderSkuWithMarketings[0].orderId}`
				 }
				let obj = ''
				let ysfData = {
					id:that.orderDetailData.id,
					title:`订单号: ${that.orderDetailData.orderCode}`,
					desc:that.orderDetailData.orderSkuWithMarketings[0].skuName,
					picture: that.orderDetailData.orderSkuWithMarketings[0].skuImage,
					tagsurl,
					note:`￥${that.orderDetailData.price}`,
					navigateToUrl:`/orderModule/pages/pendingPayment/pendingPayment?orderId=${that.orderDetailData.id}&backStatus=${that.backStatus}`,
					...options
				}
				obj = JSON.stringify(ysfData)
				uni.setStorageSync("YSFDATA",obj)
				/**
				 * status === 1 待付款状态
				 * status === 2 待出库状态
				 * status === 3 待收货状态
				 * status === 4 已完成状态
				 * status === 5,6,7 已取消状态
				 */
				this.status = this.orderDetailData.status;
				if (this.status == 2) {
					this.iconName = 'order';
					// this.titleName = res.data.backOrderLogVO&&res.data.backOrderLogVO.status == '1' ? '锁定' : '正在出库';
          let index = this.orderDetailData.orderSkuWithMarketings.findIndex(item => {
            return item.refundStatus == 1
          })
          if(index >= 0) {
            this.titleName = '退款申请中';
            this.titleDesc = ''
          } else {
					  this.titleName = '正在出库';
            this.titleDesc = '您的订单正在快马加鞭出库中'
          }
					this.height = '312rpx';
				}
				if (this.status == 3) {
					this.iconName = 'order';
          let index = this.orderDetailData.orderSkuWithMarketings.findIndex(item => {
            return item.refundStatus == 1
          })
          if(index >= 0) {
            this.titleName = '退款申请中';
            this.titleDesc = ''
          } else {
            this.titleName = '等待收货';
            this.titleDesc = '您的订单正在快马加鞭向您赶来'
          }
					this.height = '312rpx';
				}
				// 已完成
				if (this.status == 4) {
					this.titleName = '完成';
					this.iconName = 'checkmark-circle';
					this.height = '274rpx';
				}
				if (this.status == 5 || this.status == 6 || this.status == 7) {
					this.iconName = 'error-circle';
					this.titleName = '已取消';
					this.height = '222rpx';
				}
				let receiptAddress = this.orderDetailData.orderAttr.receiptAddress.split(',').join('');
				this.site = receiptAddress + this.orderDetailData.orderAttr.receiptDetailAddress;

        let overtime =
          new Date(
            this.orderDetailData.createTime.replace(/-/g, "/")
          ).getTime() + 1800000;
        let time = overtime - new Date().getTime();
        this.countDown = time / 1000;
        if (this.status === 1) {
          setTimeout(
            function () {
              that.$u.api
                .CancelOrder({
                  orderId: that.orderId,
                  reason: "订单超时自动取消",
                  addCart: false,
                })
                .then((res) => {
                  uni.navigateBack();
                });
            },
            time < 1000 ? 1000 : time
          );
        }

        // if (overtime - new Date().getTime() > 0) {
        // 	let h = parseInt((time / 60 / 60) % 24);
        // 	let m = parseInt((time / 60) % 60);
        // 	let s = parseInt(time % 60);
        // 	h = h > 9 ? h : '0' + h;
        // 	m = m > 9 ? m : '0' + m;
        // 	this.timedown = '剩' + h + '小时' + m + '分' + '自动关闭';
        // }
      });
    },
    resetList() {
			this.flowList = []
			this.hasMore = true
			this.loadStatus = 'loadmore'
			this.queryForm = {
				// 页码页容量
				pageType: 7,
				pageNum: 0,
				pageSize: 10,
        orderCode: ''
			}
		},
    /* 获取推荐的商品列表 */
    GetRecommendList() {
      let that = this;
      if (this.isLoading || !this.hasMore) return;
      this.isLoading = true;
      this.loadStatus = "loading";
			this.queryForm.orderCode = this.orderDetailData.orderCode
      this.$u.api.QueryRecommendCommodity(this.queryForm).then((res) => {
        this.isLoading = false;
        this.loadStatus = "loadmore";
        if (res.code === 200) {
          this.flowList = this.flowList.concat(
            res.data.map((item) => {
              item.price = this.priceFilter(item.price);
              return item;
            })
          );
          this.queryForm.pageNum++;
          this.hasMore = res.data.length === 10;
          this.loadStatus = res.data.length === 10 ? "loadmore" : "nomore";
        }
      });
    },
    showToastError(errMsg, duration = 1500) {
      uni.showToast({
        title: errMsg,
        icon: "none",
        mask: true,
        duration: duration,
      });
    },
    // 跳转店铺
    goToStore() {
      if (this.orderDetailData.storeId != 0) {
        this.$wsf.go("StoreIndex", {
          storeName: this.orderDetailData.storeName,
          storeId: this.orderDetailData.storeId,
        });
      } else {
        this.$wsf.go("Index");
      }
    },
    //加购
    handleAddCart(params) {
      console.log(params, "加入购物车");
      let { num, skuId } = params;
      let data = { num, skuId };
      data.sourceType = this.orderDetailData.sourceType
      data.storeId = this.orderDetailData.storeId
      this.$u.api.AddShoppingCart(data).then((res) => {
        if (res.code == 200) {
          this.showToastError("商品已加入购物车");
        }
      });
    },
    // 商品跳转
    goodsClick(e) {
      this.$wsf.go("SkuDetail", { skuId: e.id });
    },
    // 前往商品详情
    goToSku(id) {
      this.$wsf.go("SkuDetail", { skuId: id, sourceType: this.orderDetailData.sourceType, storeIdNumber: this.orderDetailData.storeId  });
    },
    // 联系客服
    // serviceTel() {
    // 	let phoneNumber = '0755-23061865';
    // 	uni.makePhoneCall({
    // 		phoneNumber: phoneNumber
    // 	});
    // },
    // 复制到剪贴板
    setClipboardData() {
      uni.setClipboardData({ data: this.orderDetailData.orderCode });
    },
    // 跳转支付页面
    goToPay() {
			if (this.orderDetailData.platformCouponCode) {
				this.$u.api.checkOrder(this.orderDetailData.id).then(res => {
					console.log(res, 'res');
					this.discountOrderType = 'goPayOrder';
					if (res.data && res.data.orderList.length > 0) {
						this.discountOrderData = res.data;
						this.discountOrderDialog = true;
					} else {
						this.$wsf.go("Pay", {
						  orderMoney: this.orderDetailData.price,
						  orderCode: this.orderDetailData.orderCode,
              businessType: 100,
              paySceneType: 101 //电商订单
						});
					}
				});
			} else {
        let params = {
					orderId: this.orderDetailData.id
				}
				this.$u.api.SelectWsOrderInfoByOrderId(params).then(res => {
					if(res.code == 200) {
						let list = res.data.orderInfoVos
						if(list && list.length < 2) {
              if(res.data.fqzPrice && res.data.fqzPrice > 0) {
								this.mergeOrderData = res.data
							 	this.mergeOrderData.orderCode = this.orderDetailData.orderCode
								this.fqzConfirmDialog = true
							} else {
								this.$wsf.go('Pay', { orderMoney: res.data.totalAmount, orderCode: this.orderDetailData.orderCode, businessType: 100,
                  paySceneType: 101 //电商订单
                });
							}
						} else if(list && list.length >= 2) {
							this.mergeOrderData = res.data
							this.mergeOrderPopup = true
						}
					}
				})
			}
    },

    // 选择取消原因
    selectInformation(item, idx) {
      this.$nextTick(function () {
        this.cancelInformation = this.informationList[idx].value;
      });
    },
    // 申请退款
    goToRefund(item) {
      let {skuImage, skuName, price, num, id, skuPrice} = item
      this.$wsf.go("Refund", {
        orderId: this.orderDetailData.id,
        receiptType: this.orderDetailData.status == 3 ? 1 : 0,
        skuName,
        price,
        num,
        id,
        skuPrice,
        skuImage,
      });
    },
    // 退款详情
    goRefundServiceDetail(item) {
      console.log(item,"item");
      this.$wsf.go("RefundServiceDetail",{ orderId: item.backOrderId });
    },
    // 取消订单
    cancelOrder() {
      if (this.cancelInformation <= 0) {
        this.$u.showToast("请选择取消原因");
        return;
      }
      // 发送请求
      let reason = this.informationList.filter((el) => {
        return el.value == this.cancelInformation;
      })[0].label;

			if (this.discountOrderType == 'cancelOrder' && this.discountOrderData.orderIdList && this.discountOrderData.orderIdList.length > 0) {
				let params = {
					orderIdList: this.discountOrderData.orderIdList,
					addCart: this.isAddCart,
					reason: reason
				};
				this.$u.api.cancelOrderBatch(params).then(res => {
					if (res.code == 200) {
						this.$u.toast('取消成功');
						this.popupShow = false;
						this.discountOrderType = '';
						this.discountOrderData = {};
						uni.navigateBack();
					} else {
						this.$u.toast(res.description);
					}
				});
			} else {
      this.$u.api
        .CancelOrder({ orderId: this.orderId, reason, addCart: this.isAddCart })
        .then((res) => {
          uni.navigateBack();
        });
      // 关闭弹窗
      this.popupShow = false;
			}
    },
    async openConfirm(type) {
      this.confirmInfo.type = type;
      if (type === "invoice") {
        const {id,price} = this.orderDetailData
        //已经开票
        if(this.isInvoiced){
          this.$wsf.go('orderInvoice', { orderId:id, price });
          return;
        }
        // 发票模块
        this.confirmInfo.title =
          "非自营订单的发票由商家开具，具体金额以实际开票为准。如有疑问，请联系商家。";
        this.confirmInfo.activeText = "联系商家";
        this.confirmInfo.cancelText = "取消";
      } else if (type === "delete") {
        // 删除模块
        this.confirmInfo.title = "确认删除此订单？";
        this.confirmInfo.activeText = "删除";
        this.confirmInfo.cancelText = "取消";
      } else if (type === "receipt") {
        // 收货模块
        await this.$u.api.JudgeRefund({orderId: this.orderId}).then(res => {
					if(res.data == 1) {
						this.confirmInfo.title = '您是否收到该订单商品？';
            this.confirmInfo.activeText = "已收货";
            this.confirmInfo.cancelText = "未收货";
					} else {
						this.confirmInfo.title = '订单中存在退款申请中商品，确认收货则默认撤销申请。';
            this.confirmInfo.activeText = "确认";
            this.confirmInfo.cancelText = "取消";
					}
				})

      } else if (type === 'cancel') {
				// 取消申请
				this.confirmInfo.title = '确认取消退款申请？';
				this.confirmInfo.activeText = '确认';
				this.confirmInfo.cancelText = '再想想';
			}
      this.showConfirm = true;
    },
    // 弹窗确认
    activeConfirm() {
      if (this.confirmInfo.type == "invoice") {
        // 发票模块
        this.showConfirm = false;
        this.serviceTel();
        // let phoneNumber = '0755-23061865';
        // uni.makePhoneCall({
        // 	phoneNumber: phoneNumber
        // });
      } else if (this.confirmInfo.type == "delete") {
        this.$u.api
          .DeleteOrder({ orderId: this.orderDetailData.id })
          .then((res) => {
            // this.resetQueryForm();
            // this.orderList = [];
            // this.loadOrderList();
            this.$u.toast("删除成功");
            this.showConfirm = false;
            uni.navigateBack();
          });
      } else if (this.confirmInfo.type == "receipt") {
        this.$u.api
          .ConfirmReceipt({ orderId: this.orderDetailData.id })
          .then((res) => {
            // this.resetQueryForm();
            // this.orderList = [];
            // this.loadOrderList();
            this.$u.toast("确认收货成功");
            this.showConfirm = false;
            uni.navigateBack();
          });
      } else if (this.confirmInfo.type == 'cancel') {
				this.$u.api.cancelReturn({ id: this.orderDetailData.backOrderLogVO.backOrderId }).then(res => {
					this.$u.toast('取消申请成功');
					this.showConfirm = false;
					uni.navigateBack();
				});
			}
      this.showConfirm = false;
    },
    // 再次购买
    buyAgain() {
      let list = this.orderDetailData.orderSkuWithMarketings;
      if (list && list.length) {
        let buyNowRequestList = [];
        list.forEach((n) => {
          let skuObj = {
            skuId: n.skuId,
            recommendToken: null,
            num: n.num,
            sourceType: this.orderDetailData.sourceType,
						storeId: this.orderDetailData.storeId,
          };
          buyNowRequestList.push(skuObj);
        });
        buyNowRequestList = JSON.stringify(buyNowRequestList);
        if(list && list.length > 1) {
          this.$wsf.go("Settlement", { buyNowRequestList, cart: 1 });
        } else {
          this.$wsf.go("Settlement", { buyNowRequestList });
        }
      }
    },
    // 跳转订单追踪页
    goToTrace(data, type) {
      if(this.orderDetailData.deliverGoodsMode == 2) return
      if (type == 1) {
        if (this.status < 3 || this.status > 4) return;
        this.$wsf.go("trackingCells", {
          id: data.id,
					type: 0
        });
      } else if (type == 2) {
        console.log(data, "item");
        this.$wsf.go("trackingCells", {
          id: data.id,
					type: 2
        });
      }
    },
    // 跳转 取消/退款进度查询
    goToRefundDetail() {
      const queryData = {
        orderId: this.orderDetailData.id,
        orderCode: this.orderDetailData.orderCode,
        cancelTime: this.orderDetailData.cancelTime,
      };
      this.$wsf.go("RefundDetail", queryData);
    },
    // 展开收起
    openCamilo() {
      this.isOpenCamilo = !this.isOpenCamilo
    },
    // 复制到剪贴板
    copyCamilo(txt) {
      uni.setClipboardData({
				data: txt,
			});
    },
    handleFqzConfirm() {
			this.fqzConfirmDialog = false
			this.$wsf.go('Pay', { orderMoney: this.mergeOrderData.orderFqzAmount, orderCode: this.mergeOrderData.orderCode, businessType: 100,
        paySceneType: 101 //电商订单
      });
		},
  },
};
</script>

<style lang="scss">
.img_item {
	width: 32rpx;
	height: 32rpx;
  margin-left: -4px;
  vertical-align: middle;
}
.pending-payment {
  width: 100%;
  .content {
    width: 100%;
    .header {
      width: 100%;
      padding-bottom: 20rpx;
      // background-image: url("@/static/img/bg.png");
      // background-repeat: no-repeat;
      // background-size: 100% 100%;
      background: #F5F5F5;
      text-align: center;
      .title {
        width: 100%;
        height: 88rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        .order-status-icon {
          width: 38rpx;
          height: 38rpx;
          margin-right: 16rpx;
        }
        text {
          font-size: 40rpx;
          font-weight: bold;
          color: #000;
        }
      }
      .txt {
        font-size: 28rpx;
        color: #333;
        height: 72rpx;
        text {
          color: #333;
          font-size: 28rpx;
          padding-bottom: 0;
          line-height: 40rpx;
        }
      }
      .go-pay-btn {
        margin: 0 auto 32rpx;
        width: 216rpx;
        height: 56rpx;
        background: #E60113;
        border-radius: 38rpx;
        line-height: 56rpx;
        color: #fff;
        font-size: 28rpx;
        text-align: center;
      }
    }
  }
  .address-info {
    padding: 48rpx 36rpx;
    margin-top: -20rpx;
    margin-bottom: 24rpx;
    display: flex;
    flex-wrap: wrap;
    background: #ffffff;
    border-radius: 20rpx 20rpx 0 0;
    .address-info-item {
      width: 100%;
      display: flex;
      .left {
        padding-top: 1px;
      }
      .right-1 {
        width: 100%;
        margin-left: 2px;
        // display: flex;
        .user-info {
          width: 100%;
          display: flex;
          justify-content: space-between;
          padding-bottom: 14rpx;
          .name-phone {
            .name {
              padding-right: 20rpx;
            }
          }
          text {
            font-size: 28rpx;
            font-weight: 500;
            color: #000000;
          }
          .modification {
            .txt {
              margin-right: 14rpx;
            }
          }
        }
        .create-time {
          font-size: 26rpx;
          font-weight: 400;
          color: #666666;
        }
      }
      .right {
        width: 100%;
        margin-left: 2px;
        display: flex;
        flex-wrap: wrap;
        .status-2-3 {
          width: 100%;
          display: flex;
          .user-info {
            width: 100%;
            display: flex;
            justify-content: space-between;
            padding-bottom: 14rpx;
            .name-phone {
              width: 100%;
              .name {
                padding-right: 20rpx;
              }
            }
            text {
              font-size: 28rpx;
              font-weight: 500;
              color: #000000;
            }
            .modification {
              .txt {
                margin-right: 14rpx;
              }
            }
          }
        }
        .address {
          font-size: 26rpx;
          font-weight: 400;
          color: #666666;
          width: 95%;
        }
      }
    }
    .address-info-item-1 {
      image {
        width: 32rpx;
        height: 32rpx;
      }
      .right {
        display: flex;
        align-items: center;
        .user-info {
          padding: 0;
          margin-right: 52rpx;
        }
      }
    }
  }
  .merchandise-news {
    background: #ffffff;
    border-radius: 20rpx;
    // display: flex;
    .shop-name {
      display: flex;
      align-items: center;
      padding-bottom: 42rpx;
      image {
        margin-right: 8rpx;
      }
			.name{
				display: inline-block;
				font-weight: bold;
				max-width: 420rpx;
			}
    }
    .shop-container {
      border-bottom: 1rpx solid #f2f2f2;
      padding: 48rpx 36rpx;
      &:last-child {
        border: 0;
      }
    }
    .shop-button-column {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-top: 48rpx;

      .common-btn {
        background-color: #fff;
        padding: 0 28rpx;
        height: 60rpx;
        border-radius: 30px;
        border: 1rpx solid #666666;
        display: inline-flex;
        align-items: center;
        margin: 0 0 0 24rpx;
        color: #000;
        font-size: 24rpx;
      }
      .light-btn {
        border: 1px solid #e60113;
        color: #e60113;
      }
    }
    .shop-info {
      width: 100%;
      display: flex;
      position: relative;

      .virtual-tag {
        width: 60rpx;
        height: 32rpx;
        line-height: 32rpx;
        background: #E95762;
        border-radius: 10rpx 20rpx 20rpx 0rpx;
        opacity: 0.8;
        color: #FFFFFF;
        font-size: 20rpx;
        text-align: center;
        position: absolute;
        top: 0;
      }
      .img {
        width: 160rpx;
        height: 160rpx;
        border-radius: 10rpx;
        // margin-right: 24rpx;
      }
      .txt-info {
        width: 520rpx;
        padding-left: 24rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
        .common_img {
          width: 48rpx;
          height: 48rpx;
          position: absolute;
          right: 0;
          bottom: 0;
        }
        text {
          font-size: 22rpx;
          font-weight: 400;
          color: #999999;
        }
        .txt-1 {
          font-size: 26rpx;
          font-weight: 400;
          color: #000000;
        }
        .txt-2 {
          display: flex;
          align-items: center;
          .num {
            width: 100rpx;
            margin-right: 24rpx;
          }
          .sku-specs {
            width: 100%;
          }
        }
        .tag-part {
          // margin-top: 16rpx;
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
          .buy-send {
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
        .money-shoppingTrolley {
          width: 100%;
          display: flex;
          justify-content: space-between;
          .performance-part {
            margin-top: 16rpx;
            display: inline-flex;
            height: 44rpx;
            background: #fcf0f2;
            border-radius: 22rpx;
            line-height: 44rpx;
            padding: 0 20rpx;
            font-size: 26rpx;
            color: #e60113;
          }
          .performance-mark {
            margin-top: 8rpx;
	        	padding: 0 8rpx;
	        	display: inline-flex;
	        	align-items: center;
	        	height: 32rpx;
	        	border-radius: 4rpx;
	        	border: 1rpx solid #FD302C;
	        	color: #FD302C;
	        	font-size: 20rpx;
	        }
          .money {
            display: inline-flex;
            font-size: 28rpx;
            font-weight: 600;
            color: #000000;
            margin-right:10rpx
          }
          .unitPrice-valueCardPrice {
            display: flex;
            .reality-price {
              // font-weight: normal;
              display: inline-flex;
              font-size: 24rpx;
              color: #000;
              line-height: 36rpx;
            }
            .money {
              display: flex;
              .txt-1 {
                color: #999;
                font-size: 24rpx;
              }
              .txt-2 {
                color: #000;
                font-size: 24rpx;
              }
            }
          }
          .shopping-trolley {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 48rpx;
            height: 48rpx;
            background: #f2f3f3;
            border-radius: 48rpx;
          }
        }
        .gift-mark {
          font-size: 28rpx;
          font-weight: bold;
        }
      }
    }
    .btn-box {
      padding-top: 40rpx;
      text-align: right;
      .common_btn {
        display: inline-block;
        height: 60rpx;
        border-radius: 30rpx;
        border: 2rpx solid #666666;
        line-height: 56rpx;
        font-size: 26rpx;
        color: #000;
        padding: 0 24rpx;
      }
    }
    .service {
      padding: 34rpx 0 44rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      line-height: 38rpx;
      text {
        margin-left: 16rpx;
        font-size: 26rpx;
        font-weight: 400;
        color: #000;
      }
    }
  }
  .order {
    border-radius: 20rpx;
    margin-top: 24rpx;
    background: #ffffff;
    padding: 48rpx 36rpx 46rpx 36rpx;
    .camilo-module{
      min-height: 32rpx;
      .camilo-name{
        float: left;
      }
      .camilo-module-miyao{
        min-height: 32rpx;
        width: 520rpx;
        float: left;
        .btn-left{
          margin-left: 10rpx;
        }
      }
      .camilo_space{
        margin-bottom: 36rpx;
        display: block;
        float: left;
        height: 34rpx;
        line-height: 34rpx;
        padding-top: 3rpx !important;
      }
      .box-open-close{
        width: 100%;
        text-align: center;
        .open{
          width: 220rpx;
        }
        .close{
          width: 106rpx;
        }
        .font {
          display: inline-block;
          height: 48rpx;
          line-height: 48rpx;
          border-radius: 30rpx;
          border: 1px solid #666;
          text-align: center;
          font-size: 24rpx;
          image {
            width: 14rpx;
            height: 8rpx;
            margin-top: -2rpx;
            margin-left: 11rpx;
            vertical-align: middle;
          }
        }
      }
    }
    .order-no {
      .txt-1 {
        font-size: 26rpx;
        font-weight: 400;
        color: #666666;
      }
      .txt-2 {
        padding: 0 24rpx;
        font-size: 26rpx;
        font-weight: 500;
        color: #000000;
      }
      .txt-btn {
        display: inline-block;
        text-align: center;
        width: 70rpx;
        height: 34rpx;
        background: #f5f5f5;
        border-radius: 18rpx;

        font-size: 22rpx;
        font-weight: 400;
        color: #000000;
        line-height: 34rpx;
      }
    }
    .order-time {
      padding-bottom: 48rpx;
      .txt-1 {
        font-size: 26rpx;
        font-weight: 400;
        color: #666666;
        padding-right: 24rpx;
      }
    }
    .price,
    .freight {
      padding-top: 36rpx;
      display: flex;
      justify-content: space-between;
      font-size: 26rpx;
      font-weight: 400;
      color: #000000;
    }
    .price {
      .txt-2 {
        font-weight: 500;
      }
    }
    .freight {
      .txt-2 {
        font-weight: 500;
      }
    }
    .payment {
      padding-top: 50rpx;
      text-align: right;
      .txt-1 {
        padding-right: 20rpx;
      }
      .txt-2 {
        font-size: 22rpx;
        font-weight: 500;
        color: #e60113;
      }
      .txt-3 {
        font-size: 36rpx;
        font-weight: 600;
        color: #e60113;
      }
    }
    .show-pack-up {
      margin: 0 auto;
      border: 1rpx solid;
      margin-top: 36rpx;
      width: 126rpx;
      height: 48rpx;
      border-radius: 48rpx;
      border: 1rpx solid #666666;
      display: flex;
      justify-content: center;
      align-items: center;
      text {
        margin-right: 12rpx;
        font-size: 24rpx;
        font-weight: 400;
        color: #000000;
      }
      /deep/ .u-icon {
        width: 24rpx;
        height: 24rpx;
      }
    }
  }
  .bottom-btn {
    z-index: 999;
    width: 100%;
    padding: 20rpx 36rpx;
    position: fixed;
    background: #ffffff;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left-btn {
      font-size: 26rpx;
      font-weight: 500;
      color: #000000;
    }
    .right-btn {
      width: 152rpx;
      height: 60rpx;
      background: #e60113;
      border-radius: 30rpx;
      line-height: 60rpx;
      text-align: center;
      font-size: 26rpx;
      font-weight: 400;
      color: #ffffff;
    }
    // .right-btn
    .right-btn-1,
    .right-btn-2 {
      width: 152rpx;
      height: 60rpx;
      background: #ffffff;
      line-height: 60rpx;
      text-align: center;
      font-size: 26rpx;
      font-weight: 400;
      color: #000;
      border: 1rpx solid #666;
      border-radius: 30rpx;
    }
  }
  .bottom-btn-3 {
    justify-content: flex-end;
  }

  // 取消订单模块
  .applet-cancel-order-wrap {
    padding: 0 36rpx 0rpx;
    .applet-cancel-order-tips {
      width: 100%;
      height: 160rpx;
      background: #f5f5f5;
      border-radius: 4px;
      padding-left: 20rpx;
      padding-top: 36rpx;
      margin-bottom: 60rpx;
      &-title {
        font-size: 26rpx;
        font-weight: 400;
        color: #000000;
        line-height: 30rpx;
        margin-bottom: 24rpx;
      }
      &-text {
        font-size: 26rpx;
        font-weight: 400;
        color: #666666;
        line-height: 36rpx;
      }
    }
    .applet-cancel-order-radio {
      &-title {
        font-size: 28rpx;
        font-weight: 500;
        color: #000000;
        line-height: 36rpx;
        margin-bottom: 26rpx;
      }
      &-item {
        height: 84rpx;
        line-height: 84rpx;
        font-size: 26rpx;
        font-weight: 400;
        color: #000000;
      }
    }
  }
  .applet-cancel-order-footer {
    &-switch {
      height: 100rpx;
      &-text {
        font-size: 26rpx;
        color: #000000;
        font-weight: 500;
      }
    }
    &-btn {
      width: 678rpx;
      height: 76rpx;
      line-height: 76rpx;
      border-radius: 38rpx;
      background-color: #e60113;
      color: #fff;
      font-size: 28rpx;
      font-weight: 500;
      text-align: center;
    }
    .disable {
      background-color: #fbd2d5;
    }
  }
	.needButtomSpace{
		padding-bottom: 18px;
	}
}
.discount-order-container {
	padding: 0 36rpx;
	.order-auto-box {
		overflow-y: auto;
		height: 520rpx;
		.discount-order {
			padding-top: 40rpx;
			.discount-order-info {
				display: flex;
				justify-content: space-between;
				align-items: center;
				line-height: 48rpx;
				color: #000;
				font-size: 28rpx;
				.left-part {
					max-width: 406rpx;
				}
				.right-part {
					font-weight: 500;
				}
			}
			.discount-order-count {
				color: #666;
				line-height: 48rpx;
				font-size: 28rpx;
			}
		}
	}
	.order-total-box {
		display: flex;
		justify-content: flex-end;
		align-items: flex-end;
		padding-top: 40rpx;
		.text {
			color: #000;
			font-size: 28rpx;
			line-height: 32rpx;
		}
		.symbol {
			font-size: 22rpx;
			color: #e60113;
			font-weight: 500;
		}
		.price {
			color: #e60113;
			font-size: 36rpx;
			font-weight: 600;
			line-height: 36rpx;
		}
	}
}
.inform {
  height: 96rpx;
  background: #FFE7C0;
  color: #FFA000;
  border-radius: 20rpx 20rpx 0rpx 0rpx;
}
/deep/ .u-type-warning-light-bg {
  background-color: #FFE7C0;
  padding: 18rpx 32rpx !important;
  border-radius: 20rpx 20rpx 0rpx 0rpx;
}
.applet-template-recommend {
  padding-bottom: calc(env(safe-area-inset-bottom) + 40rpx);
}
</style>
