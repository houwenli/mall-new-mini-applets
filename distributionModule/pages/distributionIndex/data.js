
export function genNewLink(list) {
    let fillListLink = picList => {
        picList.forEach(p => {
            p.link = fillLink(p.link);
            return p;
        });
    };

    const fillLink = url => {
        if(!url) return url
        let formateLink = url.split('~')[1] || url
        if (formateLink && formateLink.indexOf('cateId=') > -1) {
            formateLink = formateLink + '&fromPage=distributionUserPage'
        }

        if(formateLink.indexOf('distributionSkuDetail/distributionSkuDetail') != -1) {
            let id = formateLink.split('skuId=')[1]
            formateLink = `productModule/pages/skuDetail/skuDetail?skuId=${id}`
        }
    
        if(this.promoteId) {
            formateLink = formateLink + `&promoteId=${this.promoteId}`
        }
        
        return formateLink
    };

    list.forEach(item => {
        // 特殊判断
        if (item.text === '图片魔方') {
            // 左边的
            if (Array.isArray(item.list)) {
                fillListLink(item.list);
            }
            // 右边的
            if (Array.isArray(item.slideshowImageList)) {
                fillListLink(item.slideshowImageList);
            }
        } else if (Array.isArray(item.list)) {
                fillListLink(item.list);
        } else {
            // 其他类型的
            if (['浮动按钮', '公告'].includes(item.text)) {
                item.link = fillLink(item.link);
            }
        }

        return item;
    });
};
