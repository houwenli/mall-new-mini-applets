<template>
	<view>
		<rankList :recoSkuList="recoSkuList" :config="config"></rankList>
		<view class="special-goods" :style="{
			backgroundImage: 'url(' + bgImg + ')',
			backgroundColor: bgColor
		}">	
			<scroll-view
				v-if="configList.length > 0"
				:scroll-x="true"
				class="special-goods-hearer"
				scroll-with-animation
				:scroll-into-view="scrollFCateId"
			>		
				<block v-for="(item, index) in configList" :key="index">
					<view
						:class="['special-goods-hearer-box', active == index ? 'special-goods-hearer-activeFCIndex' : '']"
						:id="'fCate' + index"
						@click="tabClick(item, index)">
						<text :class="[active == index ? 'special-goods-text-activeFCIndex' : '', 'special-goods-text-span']"  >{{ item.name }}</text>							
					</view>
				</block>	
			</scroll-view>
			<specialShopList @altRecoSkuList="altRecoSkuList" :tabInfo="tabInfo" :moduleData="moduleData" :config="config"></specialShopList>
		</view>
	</view>
</template>

<script>
import specialShopList from './specialShopList.vue'
// import shopList from '@/components/commons/shopList'
import rankList from './rankList.vue'
export default {
    components: { 
		specialShopList, 
		// shopList
		rankList,
	},
	props: {
		moduleData: {
			type: Object,
			default: {},
		},
		config: {
			type: Object,
			default: {},
		},
	},
    data() {
		return {
			pageData: null,
			// 分类tab数据
			active: 0,
			tabInfo: {}, // 当前分类数据，传递给商品列表组件
			configList: [],

			// 头部主推商品
			recoSkuList: [],
		}
    },
	computed: {		
		scrollFCateId() {
			if (this.active <= 1) {
				return 'fCate0';
			} else {
				return 'fCate' + (this.active - 1);
			}
		},

		// 取背景样式
		bgImg() {
			return this.config.backImgUrl ? `url(${this.config.backImgUrl})` : '';
		},
		bgColor() {
			return this.config.backColorValue || '';
		}
    },
   
    created() {
		console.log(4444, this.config, this.moduleData)
		this.init();
    },
    methods: {
		init() {
			this.getTabList().then(ret => {
				// tabInfo要设置初始值
				this.tabInfo = this.configList[0] || {}
			})
		},
		// 获取分类tab
		getTabList() {
			return new Promise((resolve, reject) => {
				let param = {
					id: this.moduleData.id
				}
				this.$u.api.selectRankingSecondCate(param).then(res => {
					const {
						code,
						data = {}
					} = res || {}
					if (code === 200) {
						if (data.length > 1) {
							this.configList = data || [];
							// 第一个是总榜，添加上去
							this.configList.unshift({
								name: '总榜',
								id: ''
							})
						}
						resolve(true);
					} else {
						reject(false);
					}
				}).catch(err => {
					reject(false);
				})
			})
			
		},

		altRecoSkuList(recoSkuList) {
			this.recoSkuList = recoSkuList;
		},

		tabClick(item, index){
			this.active = index;
			this.tabInfo = item || {}
			// this.rollEffect(this.active)
		}, 
		rollEffect(index) {
			this.$nextTick(() => {
				// 获取父盒子元素
				let levelMenusBox = document.getElementsByClassName('special-goods-hearer')[0]
				// 获取一级菜单dom列表
				let levelMenus = document.getElementsByClassName('special-goods-hearer-box') || []
				// 动态获取元素的margin-right距离
				let marginRight = window.getComputedStyle(levelMenus[0]).marginRight.split('px')[0]

				let levelWidths = []
				// 遍历获取每个一级菜单的宽度
				for(let item of levelMenus) {
					let elWidth = window.getComputedStyle(item).width.split('px')[0]
					levelWidths.push((elWidth * 1 + marginRight * 1).toFixed(4) * 1)
				}

				// 获取第一个元素到当前点击元素的宽度list
				let elWidths = levelWidths.splice(0, index)
				// 计算所有元素的宽度
				let deviation = index > 0 && elWidths.reduce((preValue,curValue) => preValue + curValue)
				// 计算父盒子滚动距离
				let scrollLeft = index === 0 ? 0 : deviation - elWidths[elWidths.length - 1]

				levelMenusBox.scroll({
					top: 0,
					left: scrollLeft,
					behavior: "smooth", //滚动条平滑滚动
				});
			})
		},   
    },
}
</script>

<style scoped lang="less">
.special-goods{	
	height: 100%;
	padding: 30rpx 12rpx;	
	.special-goods-hearer{		
		width: 100%;		
		height: 80rpx;
		background: rgba(252, 232, 217, .3);		
		border-radius: 40rpx;			
		padding: 14rpx 8rpx;			
		box-sizing: border-box;
		white-space: nowrap;					
	}		
	.special-goods-hearer-box{			
		height: 52rpx;			
		border-radius: 26rpx;		
		margin-right: 28rpx;
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 300;
		color: #F2E1CE;	
		vertical-align: top;
		display: inline-flex;
		align-items: center;
		justify-content: center;		
	}
	.special-goods-hearer-activeFCIndex{
		border: 1rpx solid #FFFFFF;
		background: linear-gradient(0deg, #F7D4B5 0%, #FDF6EE 100%);
		border-radius: 26rpx;		
		text-shadow: 0px 1rpx 0px #FFFFFF;		
				
	}
	.special-goods-text-activeFCIndex{
		font-size: 30rpx;
		font-weight: 500;
		color: #532900;			
		min-width: 118rpx;
		text-align: center;
		padding: 0 30rpx;
	}
	.special-goods-text-span{		
		white-space: nowrap;
		text-align: center;	
		padding: 0;
	}
	.special-goods-text-span:first-of-type{
		padding: 0 30rpx;
	}
	.special-goods-hearer::-webkit-scrollbar {display:none}
	
}
</style>
