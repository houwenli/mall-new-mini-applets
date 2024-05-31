	/**
	 * 文档地址: https://wiki.wsecar.cn/pages/viewpage.action?pageId=8916006
	 * @param {string} routeName 路由名称
	 * @param {Object} properties 属性（值为json格式）此数据前端需要进行编码
	 */
export function visit(that,routeName,properties=undefined){
		let _self = that
		let pages = getCurrentPages();
		let route = pages[pages.length - 1].route;
		let data = {
			route,
			routeName,
		}
		if(properties){
			properties = JSON.stringify(properties)
			properties = encodeURIComponent(properties)
			data.properties = properties
		}
			_self.$u.api.Visit(data)
	}