/**
 * @fileoverview KISSY时间线组件
 * @author Letao<mailzwj@126.com>
 * @module timeline
 **/
KISSY.add(function (S, Node, Base) {
    var EMPTY = '';
    var $ = Node.all;
    /**
     * KISSY时间线组件
     * @class Timeline
     * @constructor
     * @extends Base
     */

    var _default = {
        scale: 2
    };

    function Timeline(cnt, cfg) {
        var self = this;
        if (!(this instanceof Timeline)) {
            return new Timeline(cnt, cfg);
        }
        self.container = S.one(cnt);
        self.cfg = S.merge({}, _default, cfg);
        self.set("totalMonth", 12);
        self.init();
        //调用父类构造函数
        Timeline.superclass.constructor.call(self, cfg);
    }
    S.extend(Timeline, Base, /** @lends Timeline.prototype*/{
        init: function() {
            var self = this;
            var ua = (/webkit/i).test(navigator.appVersion) ? 'webkit' : (/firefox/i).test(navigator.userAgent) ? 'moz' : 'opera' in window ? 'o' : '';
            var us = ua ? "-" + ua + "-user-select" : "user-select";
            var style = {};
            var centerLine = S.one('<div class="TL-CenterLine tl-centerline"></div>');
            var eventBox = S.one('<div class="TL-EventBox tl-eventbox"></div>');
            self.set("centerLine", centerLine);
            self.set("eventBox", eventBox);
            self.set("space", 100 * self.cfg.scale);
            style.overflow = "hidden";
            style.cursor = "move";
            style[us] = "none";
            self.container.css(style);
            if (self.container.css("position") === "static") {
                self.container.css("position", "relative");
            }
            self.container.append(centerLine);
            self.container.append(eventBox);
            self._createTimeLine();
            self._resizeListBox();
            self._enableDrag();
            // self.slideToMonth(new Date().getMonth() + 1);
            self.slideToMonth(5);
        },
        render: function(json) {
            var self = this;
            var eb = self.get("eventBox");
            var lb = eb.one(".TL-ListBox");
            var item = '<div class="TL-Items tl-items" data-date="{{date}}">'
                + '<div class="tl-wrap">'
                + '<img src="{{icon}}" class="tl-icon">'
                + '<div class="tl-content">'
                + '<div class="tl-title">{{title}}</div>'
                + '</div>'
                + '<span class="tl-arrow"></span>'
                + '</div>'
                + '</div>';
            var data = [];
            var list = [];
            if (json && json.events) {
                data = json.events;
            }
            S.each(data, function(d, i){
                list.push(self._getHtml(S.clone(item), d));
            });
            lb.html(list.join(""));
            self.set("items", lb.all(".TL-Items"));
            self.setPosition();
        },
        setPosition: function() {
            var self = this;
            var items = self.get("items");
            items.each(function(n, i){
                n.css({"left": Math.round(Math.random() * 1800), "top": 0});
            });
        },
        fillDoub: function(num) {
            return num < 10 ? "0" + num : num;
        },
        slideToMonth: function(mon) {
            var self = this;
            var dest = 0;
            var singleLen = self.get("space");
            var cl = self.get("centerLine");
            var cLeft = parseFloat(cl.css("left"));
            var eb = self.get("eventBox");
            mon = parseInt(mon) - 1;
            if (isNaN(mon)) {
                S.log("传入非法参数");
            } else if (mon < 1 || mon > 12) {
                S.log("参数越界，请传入[1-12]之间的整数");
            } else {
                dest = cLeft - mon * singleLen;
                eb.animate({"left": dest}, 0.2, "easeOut", function(){});
            }
        },
        _getHtml: function(tpl, data) {
            for (var n in data) {
                tpl = tpl.replace(new RegExp("\{\{" + n + "\}\}", "g"), data[n]);
            }
            return tpl;
        },
        _resizeListBox: function() {
            var self = this;
            var eb = self.get("eventBox");
            var lb = eb.one('.TL-ListBox');
            var tl = eb.one(".TL-TimeLine");
            if (!lb) {
                lb = S.one('<div class="TL-ListBox tl-listbox">');
                eb.append(lb);
            }
            lb.css({
                "left": 0,
                "top": 0,
                "width": tl.width(),
                "height": eb.height() - tl.height()
            });
        },
        _createTimeLine: function() {
            var self = this;
            var ctl = S.one('<div class="TL-TimeLine tl-timeline">');
            var ml = S.one('<div class="TL-MonthLine month-line">');
            var month = S.one('<span class="TL-MonthNumber month-number">');
            var eb = self.get("eventBox");
            eb.append(ctl);
            for (var i = 0, hm = self.get("totalMonth") * 2; i <= hm; i++) {
                var line = ml.clone();
                var left = (self.get("space") / 2) * i;
                line.css("left", left);
                if (i % 2 === 1) {
                    line.addClass("month-half");
                } else {
                    line.addClass("month-start");
                    var mb = month.clone();
                    mb.html(self.fillDoub((i / 2) + 1) + "月");
                    if (i === hm) {
                        mb.html("NewYear");
                        line.css("left", left - 2);
                    }
                    ctl.append(mb);
                    mb.css("left", left + (line.outerWidth() - mb.outerWidth() / 2));
                }
                ctl.append(line);
            }
            eb.css("width", self.get("totalMonth") * self.get("space"));
        },
        _enableDrag: function() {
            var self = this;
            var drager = self.get("eventBox");
            var origin = 0;
            var move = 0;
            var oLeft = 0;
            self.container.on("mousedown", function(e){
                origin = e.clientX;
                oLeft = parseFloat(drager.css("left"));
                self.container.on("mousemove", function(e){
                    move = e.clientX;
                    oLeft += (move - origin);
                    drager.css("left", oLeft);
                    origin = move;
                });
                self.container.on("mouseup", function(e){
                    self.container.detach("mousemove");
                    self.container.detach("mouseup");
                    self._rebound(drager, oLeft);
                });
            }).on("select", function(e){
                return false;
            });
        },
        _rebound: function(node, num) {
            var self = this;
            var cl = self.get("centerLine");
            var cLeft = parseFloat(cl.css("left"));
            var dw = node.width();
            if (num > cLeft) {
                node.animate({"left": cLeft}, 0.2, "easeOut", function(){});
            }
            if (num + dw < cLeft) {
                node.animate({"left": cLeft - dw}, 0.2, "easeOut", function(){});
            }
        }
    }, {ATTRS : /** @lends Timeline*/{

    }});
    return Timeline;
}, {requires:['node', 'base']});



