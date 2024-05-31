<template>
	<u-popup v-model="value" mode="bottom" :popup="false" :mask="true" :closeable="true" :safe-area-inset-bottom="true"
	 close-icon-color="#ffffff" :z-index="uZIndex" :maskCloseAble="maskCloseAble" @close="close">
		<u-tabs v-if="value" :active-color="activeColor" :list="genTabsList" :is-scroll="true" :current="tabsIndex" @change="tabsChange" ref="tabs"></u-tabs>
		<view class="area-box">
			<view class="u-flex" :class="{ 'change':isChange }">
				<view class="area-item">
					<view class="u-padding-10 u-bg-gray" style="height: 100%;">
						<scroll-view :scroll-y="true" style="height: 100%">
							<u-cell-group>
								<u-cell-item v-for="(item,index) in provinces" :title="item.name" :arrow="false" :index="index" :key="index"
								 @click="provinceChange">
									<u-icon v-if="isChooseP&&province===index" slot="right-icon" size="34" name="checkbox-mark"></u-icon>
								</u-cell-item>
							</u-cell-group>
						</scroll-view>
					</view>
				</view>
				<view class="area-item">
					<view class="u-padding-10 u-bg-gray" style="height: 100%;">
						<scroll-view :scroll-y="true" style="height: 100%">
							<u-cell-group v-if="isChooseP">
								<u-cell-item v-for="(item,index) in citys" :title="item.name" :arrow="false" :index="index" :key="index"
								 @click="cityChange">
									<u-icon v-if="isChooseC&&city===index" slot="right-icon" size="34" name="checkbox-mark"></u-icon>
								</u-cell-item>
							</u-cell-group>
						</scroll-view>
					</view>
				</view>

				<view class="area-item">
					<view class="u-padding-10 u-bg-gray" style="height: 100%;">
						<scroll-view :scroll-y="true" style="height: 100%">
							<u-cell-group v-if="isChooseC">
								<u-cell-item v-for="(item,index) in areas" :title="item.name" :arrow="false" :index="index" :key="index"
								 @click="areaChange">
									<u-icon v-if="isChooseA&&area===index" slot="right-icon" size="34" name="checkbox-mark"></u-icon>
								</u-cell-item>
							</u-cell-group>
						</scroll-view>
					</view>
				</view>
			</view>
		</view>
	</u-popup>
</template>

<script>
	// import provinces from "uview-ui/libs/util/province.js";
	// import citys from "uview-ui/libs/util/city.js";
	// import areas from "uview-ui/libs/util/area.js";
	/**
	 * city-select 省市区级联选择器
	 * @property {String Number} z-index 弹出时的z-index值（默认1075）
	 * @property {Boolean} mask-close-able 是否允许通过点击遮罩关闭Picker（默认true）
	 * @property {String} default-region 默认选中的地区，中文形式
	 * @property {String} default-code 默认选中的地区，编号形式
	 */
	export default {
		name: 'u-city-select',
		props: {
			// 通过双向绑定控制组件的弹出与收起
			value: {
				type: Boolean,
				default: false
			},
			// 默认显示的地区，可传类似["河北省", "秦皇岛市", "北戴河区"]
			defaultRegion: {
				type: Array,
				default () {
					return [];
				}
			},
			// 默认显示地区的编码，defaultRegion和areaCode同时存在，areaCode优先，可传类似["13", "1303", "130304"]
			areaCode: {
				type: Array,
				default () {
					return [];
				}
			},
			// 是否允许通过点击遮罩关闭Picker
			maskCloseAble: {
				type: Boolean,
				default: true
			},
			// 弹出的z-index值
			zIndex: {
				type: [String, Number],
				default: 0
			},
			// 选中的颜色
			activeColor: {
				type: String,
				default: '#E60113'
			}
		},
		data() {
			return {
				cityValue: "",
				isChooseP: false, //是否已经选择了省
				province: 0, //省级下标
				// provinces: provinces,
				isChooseC: false, //是否已经选择了市
				city: 0, //市级下标
				// citys: citys[0],
				isChooseA: false, //是否已经选择了区
				area: 0, //区级下标
				tabsIndex: 0,
				provinces: [], // 省份信息
				citys: [], // 城市信息
				areas: [], // 地区信息
				proviceId: '',
				cityId: '',
				areaId: ''
			}
		},
		mounted() {
			this.init();
		},
		computed: {
			isChange() {
				return this.tabsIndex > 1;
			},
			genTabsList() {
				let tabsList = [{
					name: "请选择"
				}];
				if (this.isChooseP) {
					tabsList[0]['name'] = this.provinces[this.province]['name'];
					tabsList[1] = {
						name: "请选择"
					};
				}
				if (this.isChooseC) {
					tabsList[1]['name'] = this.citys[this.city]['name'];
					tabsList[2] = {
						name: "请选择"
					};
				}
				if (this.isChooseA) {
					tabsList[2]['name'] = this.areas[this.area]['name'];
				}
				return tabsList;
			},
			uZIndex() {
				// 如果用户有传递z-index值，优先使用
				return this.zIndex ? this.zIndex : this.$u.zIndex.popup;
			}
		},
		methods: {
			init() {
				if (this.areaCode.length == 3) {
					this.setProvince("", this.areaCode[0]);
					// this.setCity("", this.areaCode[1]);
					// this.setArea("", this.areaCode[2]);
				} else if (this.defaultRegion.length == 3) {
					this.setProvince(this.defaultRegion[0], "");
					// this.setCity(this.defaultRegion[1], "");
					// this.setArea(this.defaultRegion[2], "");
				}else {
					this.setProvince()
				}
			},
			async setProvince(name = "", id = "") {
				if (this.provinces.length<=0) {
					this.provinces = await this.getAreas('Province')
				}
				this.provinces.map((v, k) => {
					if (id ? v.id == id : v.name == name) {
						this.provinceChange(k,true);
					}
				})
			},
			async setCity(name = "", id = "") {
				if (this.provinceId) {
					this.citys = await this.getAreas('City',this.provinceId)
				}
				this.citys.map((v, k) => {
					if (id ? v.id == id : v.name == name) {
						this.cityChange(k, true);
					}
				})
			},
			async setArea(name = "", id = "") {
				if (this.cityId) {
					this.areas = await this.getAreas('Area',this.cityId)
				}
				this.areas.map((v, k) => {
					if (id ? v.id == id : v.name == name) {
						this.isChooseA = true;
						this.area = k;
					}
				})
			},
			close() {
				this.$emit('input', false);
			},
			tabsChange(index) {
				this.tabsIndex = index;
			},
			provinceChange(index,isDefaultRegion=false) {
				this.isChooseP = true;
				this.isChooseC = false;
				this.isChooseA = false;
				this.province = index;
				this.provinceId = this.provinces[index].id
				this.tabsIndex = 1;
				// 同步更新城市信息
				if (isDefaultRegion) {
					this.setCity(this.defaultRegion[1],"")
				}else {
					this.setCity()
				}

			},
			cityChange(index, isDefaultRegion=false) {
				this.isChooseC = true;
				this.isChooseA = false;
				this.city = index;
				this.cityId = this.citys[index].id
				this.tabsIndex = 2;

				// 同步更新地区信息
				if (isDefaultRegion) {
					this.setArea(this.defaultRegion[2],"")
				}else {
					this.setArea()
				}
			},
			areaChange(index) {
				this.isChooseA = true;
				this.area = index;
				let result = {};
				result.province = this.provinces[this.province];
				result.city = this.citys[this.city];
				result.area = this.areas[this.area];
				this.$emit('city-change', result);
				this.close();
			},
			getAreas(type,id) {

				let req = {}
				let apiName = ''
				switch (type) {
					case 'Province':
						apiName = 'QueryAllProvinces'
						break;
					case 'City':
						apiName = 'QueryCityByProvinceId'
							req.provinceId = id
						break;
					case 'Area':
						apiName = 'QueryDistrictByCityId'
							req.cityId = id
						break;
					default:
						break;
				}
				return this.$u.api[apiName](req).then(res => {
					return res.data
				})

			}
		}

	}
</script>
<style lang="scss">
	.area-box {
		width: 100%;
		overflow: hidden;
		height: 800rpx;

		>view {
			width: 150%;
			transition: transform 0.3s ease-in-out 0s;
			transform: translateX(0);

			&.change {
				transform: translateX(-33.3333333%);
			}
		}

		.area-item {
			width: 33.3333333%;
			height: 800rpx;
		}
	}
</style>
