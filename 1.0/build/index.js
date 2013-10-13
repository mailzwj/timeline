/*
combined files : 

1.0/index

*/
/**
 * @fileoverview KISSY时间线组件
 * @author Letao<mailzwj@126.com>
 * @module timeline
 **/
KISSY.add('1.0/index',function (S, Node, Base) {
    var EMPTY = '';
    var $ = Node.all;
    /**
     * KISSY时间线组件
     * @class Timeline
     * @constructor
     * @extends Base
     */

    var _default = {
        scale: 2,
        enlarge: ".TL-Enlarge",
        narrow: ".TL-Narrow",
        month: new Date().getMonth() + 1
    };

    function Timeline(cnt, cfg) {
        var self = this;
        if (!(this instanceof Timeline)) {
            return new Timeline(cnt, cfg);
        }
        self.container = S.one(cnt);
        self.cfg = S.merge({}, _default, cfg);
        self.set("enlarge", S.one(self.cfg.enlarge));
        self.set("narrow", S.one(self.cfg.narrow));
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
            if (self.cfg.scale < 0.5) {
                self.cfg.scale = 0.5;
            } else if (self.cfg.scale > 5) {
                self.cfg.scale = 5;
            }
            self.set("space", 100 * self.cfg.scale);
            self.set("rows", [12, 59, 106]);
            // style.overflow = "hidden";
            style.cursor = "move";
            style[us] = "none";
            self.container.css(style);
            if (self.container.css("position") === "static") {
                self.container.css("position", "relative");
            }
            self.container.addClass("TL-Container");
            self.container.append(centerLine);
            self.container.append(eventBox);
            self._createTimeLine();
            self._resizeListBox();
            self._enableDrag();
            self._delegate();
            self._enableZoom();
            self.slideToMonth(self.cfg.month);
            // self.slideToMonth(5);
        },
        render: function(json) {
            var self = this;
            var eb = self.get("eventBox");
            var lb = eb.one(".TL-ListBox");
            var oData = S.clone(json);
            var item = '<div class="TL-Items tl-items" data-date="{{date}}" data-detail="{{detail}}">'
                + '<div class="tl-wrap">'
                + '<img src="{{icon}}" class="tl-icon">'
                + '<div class="tl-content">'
                + '<div class="tl-title" title="{{title}}">{{title}}</div>'
                + '</div>'
                + '<span class="tl-arrow"></span>'
                + '</div>'
                + '</div>';
            var data = [];
            var list = [];
            if (oData && oData.events) {
                data = oData.events;
            }
            S.each(data, function(d, i){
                d.date = (oData.year || new Date().getFullYear()) + "/" + d.date;
                oData.events[i].date = d.date;
                list.push(self._getHtml(S.clone(item), d));
            });
            self.set("data", oData);
            lb.html(list.join(""));
            self.set("items", lb.all(".TL-Items"));
            self.setPosition();
        },
        setPosition: function() {
            var self = this;
            var items = self.get("items");
            var lists = [];
            self.set("itemWidth", S.one(items[0]).one(".tl-wrap").outerWidth());
            self.set("rowRight", [0, 0, 0]);
            items.each(function(n, i){
                lists.push(n);
            });
            lists.sort(function(a, b){
                var aDate = new Date(a.attr("data-date")).getTime();
                var bDate = new Date(b.attr("data-date")).getTime();
                return aDate - bDate;
            });
            // console.log(lists);
            S.each(lists, function(n, i){
                // n.css({"left": Math.round(Math.random() * 1800), "top": 0});
                self._writeStyle(n);
            });
        },
        fillDoub: function(num) {
            return num < 10 ? "0" + num : num;
        },
        slideToMonth: function(mon) {
            var self = this;
            var dest = 0;
            var singleLen = self.get("space");
            // var cl = self.get("centerLine");
            // var cLeft = parseFloat(cl.css("left"));
            var cLeft = self.container.width() / 2;
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
        slideToItem: function(item) {
            var self = this;
            // var cl = self.get("centerLine");
            var eb = self.get("eventBox");
            // var cLeft = parseFloat(cl.css("left"));
            var cLeft = self.container.width() / 2;
            var iLeft = parseFloat(item.css("left"));
            eb.animate({"left": cLeft - iLeft}, 0.2, "easeOut", function(){});
        },
        getMinRight: function(arr) {
            var min = arr[0], l = 0;
            for (var i = 1, len = arr.length; i < len; i++) {
                if (min > arr[i]) {
                    min = arr[i];
                    l = i;
                }
            }
            return l;
        },
        _enableZoom: function() {
            var self = this;
            var en = self.get("enlarge");
            var na = self.get("narrow");
            if (en) {
                en.on("click", function(e){
                    self.cfg.scale += 0.5;
                    if (self.cfg.scale > 5) {
                        self.cfg.scale = 5;
                    }
                    self.set("space", self.cfg.scale * 100);
                    self.get("eventBox").one(".TL-TimeLine").remove();
                    self._createTimeLine();
                    self._resizeListBox();
                    self.setPosition();
                    // self.render(self.get("data"));
                    self.slideToMonth(self.cfg.month);
                });
            }
            if (na) {
                na.on("click", function(e){
                    self.cfg.scale -= 0.5;
                    if (self.cfg.scale < 0.5) {
                        self.cfg.scale = 0.5;
                    }
                    self.set("space", self.cfg.scale * 100);
                    self.get("eventBox").one(".TL-TimeLine").remove();
                    self._createTimeLine();
                    self._resizeListBox();
                    self.setPosition();
                    // self.render(self.get("data"));
                    self.slideToMonth(self.cfg.month);
                });
            }
        },
        _delegate: function() {
            var self = this;
            self.get("eventBox").delegate("click", ".tl-wrap", function(e){
                e.halt();
                var target = S.one(e.target).parent(".TL-Items");
                var cn = self.get("currentNode");
                var body = target.one(".tl-detail");
                if (cn) {
                    cn.removeClass("tl-active");
                }
                if (!body) {
                    body = S.one('<div class="tl-detail">');
                    target.one(".tl-content").append(body);
                }
                body.html(target.attr("data-detail"));
                target.addClass("tl-active");
                self.slideToItem(target);
                self.set("currentNode", target);
            });
            S.one(document).on("click", function(e){
                var cn = self.get("currentNode");
                if (cn) {
                    cn.removeClass("tl-active");
                }
            });
        },
        _getLeft: function(date) {
            var self = this;
            var datePercent = 0, left = 0;
            var year = date.getFullYear();
            var month = date.getMonth();
            var day = date.getDate();
            var space = self.get("space");
            var thisMonth = new Date(year, month, 1);
            if (month === 11) {
                month = 0;
                year = parseInt(year) + 1;
            } else {
                month = parseInt(month) + 1;
            }
            var nextMonth = new Date(year, month, 1);
            var wholeMonth = parseInt((nextMonth - thisMonth) / (24 * 60 * 60 * 1000));
            datePercent = day / wholeMonth;
            left = date.getMonth() * space + space * datePercent;
            return left;
        },
        _getBottom: function(num) {
            var self = this;
            var rows = self.get("rows");
            var rr = self.get("rowRight");
            var iw = self.get("itemWidth");
            var row = -1;
            for (var i = 0, len = rr.length; i < len; i++) {
                if (num - rr[i] > 0) {
                    row = i;
                    break;
                }
            }
            if (row === -1) {
                row = self.getMinRight(rr);
            }
            rr[row] = num + iw;
            self.set("rowRight", rr);
            return rows[row];
        },
        _writeStyle: function(n) {
            var self = this;
            var date = new Date(n.attr("data-date"));
            var left = self._getLeft(date);
            var bottom = self._getBottom(left);
            n.css({left: left, top: 0});
            n.one(".tl-wrap").css("bottom", bottom);
        },
        _getHtml: function(tpl, data) {
            var reg = /\{\{([\w\-_]+)\}\}/;
            while(reg.test(tpl)) {
                var index = RegExp.$1;
                if (!data[index]) {
                    data[index] = "";
                }
                tpl = tpl.replace(reg, data[index]);
                reg.lastIndex = 0;
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
            // var cl = self.get("centerLine");
            // var cLeft = parseFloat(cl.css("left"));
            var cLeft = self.container.width() / 2;
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




