<template>
	<div class="page-swiper-box">
		<swiper class="my-swipe" @change="onChange" :autoplay="autoplay" interval="3000" circular>
			<swiper-item v-for="(img, index) in carouselPics" :key="index" class="page-swiper-box">
				<img src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/2c523a830be84b6436fa80fffc125a16.png"
					v-if="current == 0 && video && isPlayer" @click="playVideo()" alt="" class="iconPlay" />

				<video v-if="index === 0 && video" id="bannerVideo" style="width: 100%;height:100%" :poster="videoPic"
					:src="video" :show-center-play-btn="false" enable-play-gesture auto-pause-if-open-native
					:enable-progress-gesture="false" :show-loading="false" object-fit="fill" :controls="controlsShow"
					:seeked="true" class="bannerVideo" @tap="endVideo" @ended="endVideo()">
				</video>
				<image :src="img" mode="aspectFill" class="swiper-img" @tap="openImg(index)"></image>
			</swiper-item>
		</swiper>

		<div class="custom-indicator" v-if="carouselPics.length > 1">
			<span class="indicator-num">{{ current + 1 }}/{{ carouselPics.length }}</span>
		</div>
	</div>
</template>
<script>

export default {
	props: {
		carouselPics: {
			type: Array,
			default: () => {
				return [];
			},
		},
		video: {
			type: String,
			default: "",
		},
		videoPic: {
			type: String,
			default: "",
		},
	},
	data() {
		return {
			isPlayer: true,
			controlsShow: false, // 视频控制器
			current: 0,
			autoplay: true
		};
	},
	methods: {
		onChange(e) {
			let index = e.detail.current
			this.current = index
			!this.isPlayer && this.endVideo()
		},

		// 开始播放
		playVideo() {
			let video = uni.createVideoContext('bannerVideo', this)
			video.play()
			this.controlsShow = true
			this.autoplay = false
			this.isPlayer = false
		},

		endVideo() {
			let video = uni.createVideoContext('bannerVideo', this)
			video.pause()
			this.isPlayer = true
		},

		openImg(index) {
			uni.previewImage({
				current: index,
				urls: this.carouselPics,
				indicator: "default"
			})

		},
	},
};
</script>

<style lang="less" scoped>
.page-swiper-box {
	height: 100%;
	width: 100%;
	position: relative;
}

.my-swipe {
	height: 100%;
	width: 100%;
}

.swiper-img {
	height: 100%;
	width: 100%;
}

.iconPlay {
	position: absolute;
	width: 120rpx;
	height: 120rpx;
	z-index: 2;
	top: 50%;
	left: 50%;
	margin-left: -60rpx;
	margin-top: -60rpx;
}

.custom-indicator {
	position: absolute;
	width: 33px;
	height: 20px;
	right: 12px;
	top: 12px;
	text-align: center;

	background: rgba(25, 25, 25, 0.8);
	border-radius: 12px;

	.indicator-num {
		display: block;
		font-size: 12px;
		height: 12px;
		line-height: 12px;
		margin-top: 4px;
		color: #fff;
	}
}

.bannerVideo {
	position: absolute;
	width: 100%;
	height: 375px;
	z-index: 1;
}
</style>
