// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        color:cc.color(100,100,100,255),
        level:1
    },

    onLoad () {
        this.setSize();
        this.node.color = this.color;
        this.setStartPos();
        this.setEndPos();
        this.node.x = this.startPos.x;
        this.node.y = this.startPos.y;
        this.setMoveAction();
    },
    setMoveAction:function(){
        //let distance = cc.pDistance(startPos,endPos);
        //计算移动需要花费的时间，时间 = 距离 / 速度
        //let moveTime = distance / 400;
        //变速移动
        let moveTo = cc.moveTo(5, this.endPos).easing(cc.easeInOut(1));
//回调函数
        let callfunc = cc.callFunc(function () {
            this.node.removeFromParent();
        }, this);

        //让sprite移动
        this.node.runAction(cc.sequence(moveTo, callfunc));
    },
    setStartPos:function(){
        var minX = -this.node.parent.width/2;
        var maxX = this.node.parent.width/2;
        var minY = -this.node.parent.height/2;
        var maxY = this.node.parent.height/2;
        var x = parseInt(Math.random()*(maxX-minX+1)+minX,10);
        var y = parseInt(Math.random()*(maxY-minY+1)+minY,10);
        var flag = parseInt(Math.random()*4);
        var startX,startY;
        //0:X轴左边,1:Y轴下边,2:X轴右边,3:Y轴上边,
        if(flag == 0){
            startX = minX;
            startY = y;
        }else if(flag == 1){
            startY = minY;
            startX = x;
        }else if(flag == 2){
            startX = maxX;
            startY = y;
        }else{
            startY = maxY;
            startX = x;
        }
        this.startPos = cc.p(startX,startY);
    },
    setEndPos:function(){
        var minX = -this.node.parent.width/2;
        var maxX = this.node.parent.width/2;
        var minY = -this.node.parent.height/2;
        var maxY = this.node.parent.height/2;
        var x = parseInt(Math.random()*(maxX-minX+1)+minX,10);
        var y = parseInt(Math.random()*(maxY-minY+1)+minY,10);
        var startX = this.startPos.x;
        var startY = this.startPos.y
        var flag = parseInt(Math.random()*2);
        var endX,endY;
        if(startX==minX){
            endX = parseInt(Math.random()*(maxX+1),10);
            endY = endX == maxX?y:flag==0?maxY:minY;
        }else if(startX==maxX){
            endX = parseInt(Math.random()*(minX-1),10);
            endY = endX == minX?y:flag==0?maxY:minY;
        }else if(startY == minY){
            endY = parseInt(Math.random()*(maxY+1),10);
            endX = endY == maxY?x:flag==0?maxX:minX;
        }else{
            endY = parseInt(Math.random()*(minY-1),10);
            endX = endY == minY?x:flag==0?maxX:minX;
        }
        this.endPos = cc.p(endX,endY);
    },
    setSize:function(){
        this.width = this.width + this.level*10;
        this.height = this.height + this.level*10;
    },
    start () {

    },

    // update (dt) {},
});
