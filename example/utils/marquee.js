/**
 *  Created by John on 2018/1/17
 */
const queuedObservers = new Map();
class Marquee {
    constructor(opt) {
        Object.assign(this, opt);
        this.run = this.run.bind(this);
        this.on = this.on.bind(this);
        this._int();
    }
    _int() {
        let lengthArr = [],
            Type = Object.prototype.toString.call(this.text),
            windowWidth = wx.getSystemInfoSync().windowWidth,
            pageContext = getCurrentPages()[getCurrentPages().length - 1];
        if (Type === '[object Array]') {
            lengthArr = this.text.map((value) => value.length * this.size)
        } else if (Type === '[object String]') {
            lengthArr[0] = this.text.length * this.size; //文字长度
            this.text = [this.text];
        } else {
            console.error('type: ' + Type.slice(7, -1) + ' is invalid');
            return;
        }
        this.pageContext = pageContext;// 绑定外部环境
        this.windowWidth = windowWidth;
        this.lengthArr = lengthArr;
    }
    _getEventType() {
        return ['ready', 'run', 'change'];
    }
    _firstLetterUpper(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    run() {
        if (!(this.pageContext && this.windowWidth && this.lengthArr)) return;
        let count = 0;
        let timeout = (currentLength) => {setTimeout(() => {
            if (-this.marqueeDistance < currentLength) {
                this.marqueeDistance = this.marqueeDistance - this.marqueePace;
            } else {
                if (this.lengthArr[count + 1]) {
                    count++;
                } else {
                    count = 0;
                }
                typeof queuedObservers.get('onChange') === 'function' && queuedObservers.get('onChange')(count);
                this.marqueeDistance = this.windowWidth;
            }
            let { marqueeDistance, text, size, orientation} = this;
            this.pageContext.setData({ marqueeDistance, text: text[count], size, orientation });
            timeout(this.lengthArr[count]);
        }, this.interval)};
        typeof queuedObservers.get('onRun') === 'function' && queuedObservers.get('onRun')(count);
        timeout(this.lengthArr[count]);
    }
    on(event, fn) {
        if (this._getEventType().indexOf(event) > -1) {
            if (typeof fn === 'function') {
                event === 'ready' ? fn() : queuedObservers.set('on' + this._firstLetterUpper(event), fn);
            }
        } else {
            console.error('event: ' + event + ' is invalid');
        }
        return this;
    }
}

module.exports.marquee = Marquee;