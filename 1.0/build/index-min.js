/*! yearline - v1.0 - 2013-10-13 9:38:27 AM
* Copyright (c) 2013 Letao; Licensed  */
KISSY.add("1.0/index",function(a,b,c){function d(b,c){var f=this;return this instanceof d?(f.container=a.one(b),f.cfg=a.merge({},e,c),f.set("enlarge",a.one(f.cfg.enlarge)),f.set("narrow",a.one(f.cfg.narrow)),f.set("totalMonth",12),f.init(),d.superclass.constructor.call(f,c),void 0):new d(b,c)}b.all;var e={scale:2,enlarge:".TL-Enlarge",narrow:".TL-Narrow",month:(new Date).getMonth()+1};return a.extend(d,c,{init:function(){var b=this,c=/webkit/i.test(navigator.appVersion)?"webkit":/firefox/i.test(navigator.userAgent)?"moz":"opera"in window?"o":"",d=c?"-"+c+"-user-select":"user-select",e={},f=a.one('<div class="TL-CenterLine tl-centerline"></div>'),g=a.one('<div class="TL-EventBox tl-eventbox"></div>');b.set("centerLine",f),b.set("eventBox",g),b.cfg.scale<.5?b.cfg.scale=.5:b.cfg.scale>5&&(b.cfg.scale=5),b.set("space",100*b.cfg.scale),b.set("rows",[12,59,106]),e.cursor="move",e[d]="none",b.container.css(e),"static"===b.container.css("position")&&b.container.css("position","relative"),b.container.addClass("TL-Container"),b.container.append(f),b.container.append(g),b._createTimeLine(),b._resizeListBox(),b._enableDrag(),b._delegate(),b._enableZoom(),b.slideToMonth(b.cfg.month)},render:function(b){var c=this,d=c.get("eventBox"),e=d.one(".TL-ListBox"),f=a.clone(b),g='<div class="TL-Items tl-items" data-date="{{date}}" data-detail="{{detail}}"><div class="tl-wrap"><img src="{{icon}}" class="tl-icon"><div class="tl-content"><div class="tl-title" title="{{title}}">{{title}}</div></div><span class="tl-arrow"></span></div></div>',h=[],i=[];f&&f.events&&(h=f.events),a.each(h,function(b,d){b.date=(f.year||(new Date).getFullYear())+"/"+b.date,f.events[d].date=b.date,i.push(c._getHtml(a.clone(g),b))}),c.set("data",f),e.html(i.join("")),c.set("items",e.all(".TL-Items")),c.setPosition()},setPosition:function(){var b=this,c=b.get("items"),d=[];b.set("itemWidth",a.one(c[0]).one(".tl-wrap").outerWidth()),b.set("rowRight",[0,0,0]),c.each(function(a){d.push(a)}),d.sort(function(a,b){var c=new Date(a.attr("data-date")).getTime(),d=new Date(b.attr("data-date")).getTime();return c-d}),a.each(d,function(a){b._writeStyle(a)})},fillDoub:function(a){return 10>a?"0"+a:a},slideToMonth:function(b){var c=this,d=0,e=c.get("space"),f=c.container.width()/2,g=c.get("eventBox");b=parseInt(b)-1,isNaN(b)?a.log("\u4f20\u5165\u975e\u6cd5\u53c2\u6570"):1>b||b>12?a.log("\u53c2\u6570\u8d8a\u754c\uff0c\u8bf7\u4f20\u5165[1-12]\u4e4b\u95f4\u7684\u6574\u6570"):(d=f-b*e,g.animate({left:d},.2,"easeOut",function(){}))},slideToItem:function(a){var b=this,c=b.get("eventBox"),d=b.container.width()/2,e=parseFloat(a.css("left"));c.animate({left:d-e},.2,"easeOut",function(){})},getMinRight:function(a){for(var b=a[0],c=0,d=1,e=a.length;e>d;d++)b>a[d]&&(b=a[d],c=d);return c},_enableZoom:function(){var a=this,b=a.get("enlarge"),c=a.get("narrow");b&&b.on("click",function(){a.cfg.scale+=.5,a.cfg.scale>5&&(a.cfg.scale=5),a.set("space",100*a.cfg.scale),a.get("eventBox").one(".TL-TimeLine").remove(),a._createTimeLine(),a._resizeListBox(),a.setPosition(),a.slideToMonth(a.cfg.month)}),c&&c.on("click",function(){a.cfg.scale-=.5,a.cfg.scale<.5&&(a.cfg.scale=.5),a.set("space",100*a.cfg.scale),a.get("eventBox").one(".TL-TimeLine").remove(),a._createTimeLine(),a._resizeListBox(),a.setPosition(),a.slideToMonth(a.cfg.month)})},_delegate:function(){var b=this;b.get("eventBox").delegate("click",".tl-wrap",function(c){c.halt();var d=a.one(c.target).parent(".TL-Items"),e=b.get("currentNode"),f=d.one(".tl-detail");e&&e.removeClass("tl-active"),f||(f=a.one('<div class="tl-detail">'),d.one(".tl-content").append(f)),f.html(d.attr("data-detail")),d.addClass("tl-active"),b.slideToItem(d),b.set("currentNode",d)}),a.one(document).on("click",function(){var a=b.get("currentNode");a&&a.removeClass("tl-active")})},_getLeft:function(a){var b=this,c=0,d=0,e=a.getFullYear(),f=a.getMonth(),g=a.getDate(),h=b.get("space"),i=new Date(e,f,1);11===f?(f=0,e=parseInt(e)+1):f=parseInt(f)+1;var j=new Date(e,f,1),k=parseInt((j-i)/864e5);return c=g/k,d=a.getMonth()*h+h*c},_getBottom:function(a){for(var b=this,c=b.get("rows"),d=b.get("rowRight"),e=b.get("itemWidth"),f=-1,g=0,h=d.length;h>g;g++)if(a-d[g]>0){f=g;break}return-1===f&&(f=b.getMinRight(d)),d[f]=a+e,b.set("rowRight",d),c[f]},_writeStyle:function(a){var b=this,c=new Date(a.attr("data-date")),d=b._getLeft(c),e=b._getBottom(d);a.css({left:d,top:0}),a.one(".tl-wrap").css("bottom",e)},_getHtml:function(a,b){for(var c=/\{\{([\w\-_]+)\}\}/;c.test(a);){var d=RegExp.$1;b[d]||(b[d]=""),a=a.replace(c,b[d]),c.lastIndex=0}return a},_resizeListBox:function(){var b=this,c=b.get("eventBox"),d=c.one(".TL-ListBox"),e=c.one(".TL-TimeLine");d||(d=a.one('<div class="TL-ListBox tl-listbox">'),c.append(d)),d.css({left:0,top:0,width:e.width(),height:c.height()-e.height()})},_createTimeLine:function(){var b=this,c=a.one('<div class="TL-TimeLine tl-timeline">'),d=a.one('<div class="TL-MonthLine month-line">'),e=a.one('<span class="TL-MonthNumber month-number">'),f=b.get("eventBox");f.append(c);for(var g=0,h=2*b.get("totalMonth");h>=g;g++){var i=d.clone(),j=b.get("space")/2*g;if(i.css("left",j),1===g%2)i.addClass("month-half");else{i.addClass("month-start");var k=e.clone();k.html(b.fillDoub(g/2+1)+"\u6708"),g===h&&(k.html("NewYear"),i.css("left",j-2)),c.append(k),k.css("left",j+(i.outerWidth()-k.outerWidth()/2))}c.append(i)}f.css("width",b.get("totalMonth")*b.get("space"))},_enableDrag:function(){var a=this,b=a.get("eventBox"),c=0,d=0,e=0;a.container.on("mousedown",function(f){c=f.clientX,e=parseFloat(b.css("left")),a.container.on("mousemove",function(a){d=a.clientX,e+=d-c,b.css("left",e),c=d}),a.container.on("mouseup",function(){a.container.detach("mousemove"),a.container.detach("mouseup"),a._rebound(b,e)})}).on("select",function(){return!1})},_rebound:function(a,b){var c=this,d=c.container.width()/2,e=a.width();b>d&&a.animate({left:d},.2,"easeOut",function(){}),d>b+e&&a.animate({left:d-e},.2,"easeOut",function(){})}},{ATTRS:{}}),d},{requires:["node","base"]});