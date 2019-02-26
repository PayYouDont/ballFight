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
        this.enabled = false;
    },
    init: function (game) {
        this.game = game;
        this.enabled = true;
        this.node.opacity = 255;
    },
    reuse (game) {
        this.init(game);
    },
    getPlayerDistance: function () {
        // 根据 player 节点位置判断距离
        var playerPos = this.game.player.getCenterPos();
        // 根据两点位置计算两点之间距离
        var dist = this.node.position.sub(playerPos).mag();
        return dist;
    },
    onPicked: function() {
        if(this.level<this.game.player.level){
            // 调用 Game 脚本的得分方法
            this.game.gainScore(this);
        }else{
           this.game.gameOver();
        }
        // 当circle被收集时，调用 Game 脚本中的接口，销毁当前circle节点，生成一个新的circle
        //this.game.spawnNewCircle();
    },
    update (dt) {
        // 每帧判断和主角之间的距离是否小于收集距离
        var distance = this.node.width/2+this.game.player.node.width/2;
        if (this.getPlayerDistance() < distance) {
            // 调用收集行为
            this.onPicked();
            return;
        }
    },
    setLevel:function(level){
        this.level = level;
    }
});
