export default {
	filters: {
    priceInt(price) {
      let int;
      if (price) {
        int = Number(price).toFixed(2).split(".")[0];
      } else {
        int = "0";
      }
      return int;
    },
    priceFloat(price) {
      let float;
      if (price) {
        float = Number(price).toFixed(2).split(".")[1];
      } else {
        float = "00";
      }
      return float;
    },
  },
	methods: {
		// 联系客服
		serviceTel(params={}) {
			this.$wsf.go('ToService',params)
		},
	}
}
