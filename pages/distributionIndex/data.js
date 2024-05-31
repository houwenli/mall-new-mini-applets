export const fillLink = url => {
    if(!url) return url
    if (url && url.indexOf('cateId=') > -1) {
        url= (url.split('~')[1] || url) + '&fromPage=distributionIndex'
    }

    return url
};

export const genNewLink = list => {
    let fillListLink = picList => {
        picList.forEach(p => {
            p.link = fillLink(p.link);
            return p;
        });
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
