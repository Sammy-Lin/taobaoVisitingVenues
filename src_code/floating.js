auto.waitFor();
let waysOfShopping = 0;

let window = floaty.window(
    <vertical>
        <horizontal>
            <button id="start" text="开始" w="30" h="35" bg="#77ffffff" textSize="10sp"/>
            <button id="stop" text="停止" w="30" h="35" bg="#77ffffff" textSize="10sp"/>
            <button id="move" text="移动" w="30" h="35" bg="#77ffffff" textSize="10sp"/>
        </horizontal>

            <button id="setting" text="选择功能" w="90" h="35" bg="#77ffffff" textSize="10sp"/>
            <button id="exit" text="退出悬浮窗" w="90" h="35" bg="#77ffffff" textSize="10sp"/>
    </vertical>
);

let deviceWidth = device.width;
let deviceHeight = device.height;
window.setPosition(parseInt(deviceWidth * 0.1), parseInt(deviceHeight * 0.1));
setInterval(() => {
}, 1000);


let wx, wy, downTime, windowX, windowY;
//这个函数是对应悬浮窗的移动
window.move.setOnTouchListener(function (view, event) {
    switch (event.getAction()) {
        case event.ACTION_DOWN:
            wx = event.getRawX();
            wy = event.getRawY();
            windowX = window.getX();
            windowY = window.getY();
            downTime = new Date().getTime();
            return true;
        case event.ACTION_MOVE:
            //如果按下的时间超过xx秒判断为长按，调整悬浮窗位置
            if (new Date().getTime() - downTime > 300) {
                window.setPosition(windowX + (event.getRawX() - wx), windowY + (event.getRawY() - wy));
            }
            return true;
        case event.ACTION_UP:
            //手指弹起时如果偏移很小则判断为点击
            if (Math.abs(event.getRawY() - wy) < 30 && Math.abs(event.getRawX() - wx) < 30) {
                toastLog("长按调整位置")
            }
            return true;
    }
    return true;
});
//这个函数是对应悬浮窗的退出
window.exit.setOnTouchListener(function (view, event) {
    switch (event.getAction()) {
        case event.ACTION_DOWN:
            wx = event.getRawX();
            wy = event.getRawY();
            windowX = window.getX();
            windowY = window.getY();
            downTime = new Date().getTime();
            return true;
        case event.ACTION_MOVE:
            //如果按下的时间超过xx秒判断为长按，调整悬浮窗位置
            if (new Date().getTime() - downTime > 1000) {
                toastLog("退出！");
                exit();
            }
            return true;
        case event.ACTION_UP:
            //手指弹起时如果偏移很小则判断为点击
            if (Math.abs(event.getRawY() - wy) < 30 && Math.abs(event.getRawX() - wx) < 30) {
                toastLog("长按退出脚本")
            }
            return true;
    }
    return true;
});


window.setting.click(() => {
    let items = ["仅“去逛店”", "“去浏览”+“去逛店”"];
    dialogs.select("攒喵币方式", items, function (index) {

        if (index >= 0) {
            toastLog("已选择第 " + (index + 1) + " 个：" + items[index]);

            if (index === 0) {
                waysOfShopping = 0;
            } else if (index === 1) {
                waysOfShopping = 1;
            }
        } else {
            toastLog("取消选择");
        }
    });
});

let th = null;
window.start.click(() => {
    let oldScript = "./script.js";
    let newScript = "/sdcard/脚本/淘宝喵币/script.js";
    let ss = oldScript;
    if (files.exists(newScript)) {
        ss = newScript;
        console.log("加载本地脚本");
    }

    if (th == null) {
        th = threads.start(function () {
            let runChoose = require(ss);
            runChoose(waysOfShopping);
        });
    } else {
        if (th.isAlive()) {
            toastLog("你是不是傻，脚本都在运行了你还点！？");
        } else {
            th = threads.start(function () {
                let runChoose = require(ss);
                runChoose(waysOfShopping);
            });
        }
    }
});

window.stop.click(() => {
    if (th == null) {
        toastLog("没有进行中的脚本");
    } else {
        if (th.isAlive()) {
            threads.shutDownAll();
            toastLog("停止！");
        } else {
            toastLog("没有进行中的脚本");
        }
    }
});