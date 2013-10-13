## yearline

* 版本：1.0
* 教程：[http://gallery.kissyui.com/yearline/1.0/guide/index.html](http://gallery.kissyui.com/yearline/1.0/guide/index.html)
* demo：[http://gallery.kissyui.com/yearline/1.0/demo/index.html](http://gallery.kissyui.com/yearline/1.0/demo/index.html)

## 组件说明

* 组件以年为单位，组件底部标识从【1月】-【12月】
* 时间线只显示开始和半月刻度
* 组件支持【拖动定位】、【点击定位】、【指定月份定位】、【放大/缩小】等功能
* 组件参考[Tutorialzine](http://tutorialzine.com/2012/04/timeline-portfolio/)的样式，但功能几乎完全改写

    ![Timeline](http://www.seejs.com/wp-content/uploads/2013/10/timeline.png)

## 组件参数

* @param ctn{id|class|node}：组件渲染显示的节点
* @param cfg{object}：组件配置选项
	- @property scale{int|float} 组件横向放大倍数，取值范围[0.5, 5]，基数：每月100px
	- @property enlarge{id|class|node} 组件放大控制器
	- @property narrow{id|class|node} 组件缩小控制器
	- @property month{int} 初始化第month月居中，取值[1, 12]
* **注：**每次放大/缩小的步长为0.5
	
	```
	//参数示例
	var tl = new Timeline("#TL-Main", {
        scale: 1.5,
        enlarge: "#TL-Enlarge",
        narrow: "#TL-Narrow",
        month: 6
    });
	```

## 组件方法

* `render(data)`：将数据渲染至时间线上

	```
	tl.render({
        "pluginTitle": "2013大事记", //暂未使用
        year: "2013", //指定年份，默认为当年
        events: arr //时间线数据数组
    });
	```
	数据格式(即上面代码中的 `arr`)示例：

	```
	[{
		date: "06/18",
		detail: "2013/06/18，wxyz0123456789ABCDEFGwxyz0123456789ABCDEFG",
		icon: "http://lorempixel.com/24/24/nature/6/",
		title: "wxyz0123456789ABCDEFG"
	},{
		date: "07/19",
		detail: "2013/07/19，wxyz0123456789DEFGwxyz0123456789ABCDEFG",
		icon: "http://lorempixel.com/24/24/nature/5/",
		title: "wxyz0123456789DEFG"
	}]
	```
	其中
	- `date`字段，将用以计算该内容在时间线上显示的位置，必选，格式：MM/DD
	- `detail`字段，该记录的详细内容，点击每个小标签的时候显示，字数不宜过多
	- `icon`字段，每个小标签左侧的缩略图
	- `title`字段，小标签的标题，必选（为空太难看）
* `setPosition()`：重设小标签的位置
	
	```
	tl.setPosition();
	```
* `slideToMonth(mon)`：滑动时间线至指定月份

	```
	self.slideToMonth(new Date().getMonth() + 1); //月份默认[0-11]
	```
* `slideToItem(item)`：滑动时间线至指定的小标签，示例用于点击小标签时滑动

	```
	var target = S.one(e.target).parent(".TL-Items");
	self.slideToItem(target);
	```

## 使用示例

HTML结构如下：

```
<input type="button" value="+" id="TL-Enlarge" title="放大" class="tl-btn">
<input type="button" value="-" id="TL-Narrow" title="缩小" class="tl-btn">
<!-- TL-Container会自动追加 -->
<div id="TL-Main" class="TL-Container tl-main"></div>
```
CSS样式：

```
.tl-main {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 200px;
    z-index: 10000;
}
.tl-btn {
    margin: 0 0 0 30px;
    width: 60px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    font-size: 20px;
    font-weight: bold;
}
```
JS脚本：

```
var S = KISSY;
S.use('gallery/yearline/1.0/index,gallery/yearline/1.0/index.css', function (S, Timeline) {
    var tl = new Timeline("#TL-Main", {
        scale: 1.5,
        enlarge: "#TL-Enlarge",
        narrow: "#TL-Narrow"
    });
    tl.render({
        "pluginTitle": "2013大事记",
        year: "2013",
        events: arr
    });
})
```

## changelog

### 2013/10/13

* 调整数据格式，严密逻辑
* 补全设置参数
* 更新文档

### 2013/10/08

* 重写放大/缩小功能
* 补充文档

### 2013/10/07

* 完成组件基础功能


