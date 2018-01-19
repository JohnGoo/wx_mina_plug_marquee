const Marquee = require('../../utils/marquee.js').marquee;

Page({
    data: {
    },
    onLoad: function () {
        // 跑马灯插件
        new Marquee({
            text: ['我是一条长长的通知我是一条长长的通知我是一条长长的通知', 'hahhahahhahahhahahhahahhaha'],
            marqueePace: 1,         // 滚动速度
            marqueeDistance: 0,     // 初始滚动距离
            size: 14,
            orientation: 'left',    // 滚动方向
            interval: 20            // 时间间隔
        }).on('ready', () => {
            console.log('初始化完成');
        }).on('run', (count) => {
            console.log('开始运行第' + (count + 1) + '条');
        }).on('change', (count) => {
            console.log('切换到第' + (count + 1) + '条');
        }).run();
    },
})
