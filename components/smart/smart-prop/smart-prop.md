## 智慧生活属性弹窗

统一传递进来的数据

```js
skuData = {
  // 商品列表
  "skuList": [
    {
      "goods_id": 0,
      "id": 0,
      "imgUrl": "",
      "name": "",
      "price": "",
      "skuIds": "",
      "stock_num": ""
    }
  ],
  // 属性列表，规格还有属性值
  "skuitems": [
    {
      "count": 0,
      "k": 0,
      "kId": "",
      "items": [
        {
          "id": 0,
          "imgUrl": "",
          "name": ""
        }
      ]
    }
  ],
  // 初始化的属性，用于回显
  "initialSku": {
    "skuIds": ""
  }
}
```

demo数据

```js
{
	"code": 0,
	"msg": "",
	"desc": "",
	"params": "",
	"data": {
		"skuList": [
			{
				"goods_id": "7876",
				"id": "168627978578760",
				"imgUrl": "https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/a03063b266a1b32012b1f66e9c713045.jpg",
				"name": "测试1/柳小芸2号",
				"price": 0.02,
				"skuIds": "1368,1255",
				"stock_num": 100
			},
			{
				"goods_id": "7876",
				"id": "168627978578760",
				"imgUrl": "https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/a03063b266a1b32012b1f66e9c713045.jpg",
				"name": "测试1/柳小芸2号",
				"price": 0.03,
				"skuIds": "1367,1255",
				"stock_num": 100
			},
			{
				"goods_id": "7876",
				"id": "168627978578760",
				"imgUrl": "https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/a03063b266a1b32012b1f66e9c713045.jpg",
				"name": "测试1/柳小芸2号",
				"price": 0.04,
				"skuIds": "1367,1256",
				"stock_num": 100
			},
			{
				"goods_id": "7876",
				"id": "168627978578760",
				"imgUrl": "https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/a03063b266a1b32012b1f66e9c713045.jpg",
				"name": "测试1/柳小芸2号",
				"price": 0.05,
				"skuIds": "1368,1256",
				"stock_num": 100
			}
		],
		"skuitems": [
			{
				"count": 2,
				"k": "测试属性",
				"kId": "1028",
				"items": [
					{
						"id": "1367",
						"name": "测试1",
						"imgUrl": "https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/a03063b266a1b32012b1f66e9c713045.jpg"
					},
					{
						"id": "1368",
						"name": "测试2",
						"imgUrl": "https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/17ada2c74788192f68e04055627cd15b.jpeg"
					}
				]
			},
			{
				"count": 20,
				"k": "柳小芸属性",
				"kId": "1016",
				"items": [
					{
						"id": "1255",
						"name": "柳小芸2号",
						"imgUrl": "https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/a03063b266a1b32012b1f66e9c713045.jpg"
					},
					{
						"id": "1256",
						"name": "柳小芸3号",
						"imgUrl": "https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/uat/a03063b266a1b32012b1f66e9c713045.jpg"
					}
				]
			}
		],
		"initialSku": {
			"skuIds": "1368,1255"
		}
	}
}
```
