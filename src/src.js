c = c.getContext('2d');
c.font = '40px Tahoma';


// const 状态_左_ = -1;
// const 状态_上_ = -2;
// const 状态_右_ = -3;

// const 状态_开始_ = 1;
// const 状态_正常_ = 2;

// const 状态_开始下落_ = 3;
// const 状态_下落中_ = 4;

// const 状态_结束下落_ = 14;//--> top 爆炸 end

// const 状态_爆炸_ = 15;
// const 状态_爆炸中_ = 16;

// const 状态_爆炸结束_ = 26;//--> 开始下落
// const 状态_游戏结束_ = 27;


现在时间 = 0;
出现方块x坐标 = 状态 = 1;
地图 = new Array(54 + 1).fill(0);


//时光倒流
时光 = [];
倒流 = false;
ffff = 0;//!!!!!
//时光倒流

填充颜色设置 = (v, n, y, A) => { c.fillStyle = 'hsl(' + v * 35 + ',40%,' + n + '%)' };

动画到 = (v, n, y, A) => {
    v.动画开始位置 = { x: v.x, y: v.y };
    v.动画结束位置 = { x: n, y };
    v.动画开始时间 = 现在时间;
};

结束 = (v, n, y, A) => {
    if (!v.是结束) {
        v.是结束 = 1;
        v.到xy = { y: ~~(n / 6), x: n % 6 };
    }
};


onkeydown = (v, n, y, A) => {//事件
    v = v.keyCode;
    if (v == 32) 倒流 = true;
    if (倒流 == false) {
        状态 == 状态_正常_ &&
            (
                状态 = v == 65 && 出现方块x坐标 != 0 ? 状态_左_ :
                    v == 87 ? 状态_上_ :
                        v == 68 && 出现方块x坐标 != 3 ? 状态_右_ :
                            v == 83 ? 状态_开始下落_ : 状态_正常_
            )
    }

};

onkeyup = (v, n, y, A) => {
    v = v.keyCode;
    if (v == 32) 倒流 = false
};


开始X = 0;
开始Y = 0;
移动 = false;
ontouchstart = (v, n, y, A) => {
    v = v.touches[0];
    开始X = v.pageX;
    开始Y = v.pageY;
    移动 = false;
    onkeydown({ keyCode: n });
};

ontouchmove = (v, n, y, A) => {
    移动 = true;
    v.preventDefault();
    n = v.touches[0];
    x = n.pageX;
    y = n.pageY;
    if (x - 开始X < -50) ontouchstart(v, 65);
    if (x - 开始X > 50) ontouchstart(v, 68);
    // if (y - 开始Y < -50) ontouchstart(v, 87);
    if (y - 开始Y > 50) ontouchstart(v, 83);
};

ontouchend = (v, n, y, A) => {
    if (移动 == false) ontouchstart(v, 87);
};

渲染 = (v, n, y, A) => { //时间
    requestAnimationFrame(渲染);

    c.fillStyle = 'rgba(0,0,0,0.2)';
    c.fillRect(0, 0, 300, 500);


    if (倒流 && 时光.length > 0) {
        ffff = 0;
        obj = 时光.pop();
        现在时间 = obj.现在时间;
        出现方块x坐标 = obj.出现方块x坐标;
        状态 = obj.状态;
        地图 = obj.地图;
    } else {
        现在时间++;
        if (状态 == 状态_正常_ || 状态 == 状态_游戏结束_) {
            ffff++;
        } else {
            ffff = 0;
        }
        if (ffff < 10) {
            时光.push({
                现在时间,
                出现方块x坐标,
                状态,
                地图: JSON.parse(JSON.stringify(地图))
            });
        }
    }



    数组 = new Array(6).fill(0);
    结束下落标记 = 状态_开始_;//
    标记 = 1;



    地图.forEach(A = (v, n, y, A) => {
        x = n % 6;


        //左右上
        if (n > 47 && 状态 < 0) {
            数组[x] = 地图[n];
            数组[x + 1] = 地图[n + 1];

            //左右
            A = 状态 == 状态_左_ ? 1 : 状态 == 状态_右_ ? -1 : 0;

            //上
            if (状态 == 状态_上_) {
                if (标记 && v) {
                    标记 = 0;
                    地图[n + 3] = 地图[n];
                }
                if (v) 数组[x] = 数组[x + 1];
            }

            地图[n] = v = 数组[x + A];


            if (标记 && v) { 标记 = 0; 出现方块x坐标 = x; }
            v && 动画到(v, x, 8);
        }

        //开始
        if (状态 == 状态_开始_ &&
            n > 47 + 出现方块x坐标 &&
            n < 51 + 出现方块x坐标)
            动画到(地图[n] = { x, y: 10, i: Math.random() > 0.5 ? 1 : 2, 是结束: 0, 到xy: 0 }, x, 8);


        if (v) {

            //开始下落
            if (状态 == 状态_开始下落_) {
                地图[n] = 0;
                if (!v.是结束) {
                    地图[数组[x] * 6 + x] = v;
                    动画到(v, x, 数组[x]++)
                }
            }

            //爆炸
            if (状态 == 状态_爆炸_ && v.是结束 && v.到xy) 动画到(v, v.到xy.x, v.到xy.y);

            //爆炸结束
            if (状态 == 状态_爆炸结束_ && v.是结束 && !v.到xy) { v.是结束 = 0; v.i++ }

            //结束下落
            if (状态 == 状态_结束下落_) {
                for (i = 0; i < (x == 0 || x == 5 ? 1 : 4); i++) {
                    A = [6, 1, 7, - 5];
                    a = 地图[n + A[i]];
                    b = 地图[n - A[i]];
                    if (a && b && a.i == v.i && b.i == v.i) {
                        v.是结束 = 1;
                        v.到xy = 0;
                        结束(a, n);
                        结束(b, n);
                        结束下落标记 = 状态_爆炸_;
                    }
                }
                if (n > 47 && 结束下落标记 != 状态_爆炸_) {
                    结束下落标记 = 状态_游戏结束_
                }
            }


            //动画步
            百分比 = (现在时间 - v.动画开始时间) / 10;
            if (百分比 > 1) 百分比 = 1;
            v.x = v.动画开始位置.x + (v.动画结束位置.x - v.动画开始位置.x) * 百分比;
            v.y = v.动画开始位置.y + (v.动画结束位置.y - v.动画开始位置.y) * 百分比;


            //draw
            if (!(n > 47 && 状态 == 状态_游戏结束_ && 现在时间 % 40 > 20)) {
                x = 50 * v.x;
                y = 450 - 50 * v.y;
                i = v.i;

                填充颜色设置(i, 65);
                c.fillRect(x, y, 50, 50);

                填充颜色设置(i, 20);
                c.fillText(v.i, x + 12, y + 40)
            }

        }
    });

    状态 = 状态 < 0 ? 状态_正常_ :
        状态 == 状态_正常_ || 状态 == 状态_游戏结束_ ? 状态 :
            状态 == 状态_结束下落_ ? 结束下落标记 :
                状态 == 状态_爆炸结束_ ? 状态_开始下落_ : 状态 + 1
};
渲染()