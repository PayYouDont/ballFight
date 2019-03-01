
cc.Class({
    extends: cc.Component,

    properties: {
        level:0,
        sizeRate:5,
        lvelveUpAnimation:{
          default:null,
          type:cc.Animation
        },
    },
    onLoad () {
        this.updateSize();
        this.lvelveUpAnimation.node.active = false;
    },
    getCenterPos: function () {
        var centerPos = cc.v2(this.node.x, this.node.y + this.node.height/2);
        return centerPos;
    },
    startMoveAt: function (pos) {
        this.enabled = true;
        this.node.setPosition(pos);
        this.setMoveAction();
    },
    updateSize:function(){
        this.node.setContentSize(20+this.level*this.sizeRate,20+this.level*this.sizeRate);
    },
    setMoveAction:function(){
        this.node.parent.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.opacity = 255;
            var delta = event.touch.getDelta();
            this.x += delta.x;
            this.y += delta.y;
            if ( this.x > this.parent.width/2-this.width/2) {
                this.x = this.parent.width/2-this.width/2;
            } else if (this.x < -this.parent.width/2+this.width/2) {
                this.x = -this.parent.width/2+this.width/2;
            }
            if(this.y > this.parent.height/2-this.height/2){
                this.y = this.parent.height/2-this.height/2;
            }else if (this.y < -this.parent.height/2+this.height/2) {
                this.y = -this.parent.height/2+this.height/2;
            }
        }, this.node);
    },
    stopMove:function () {
        this.node.parent.off(this.node);
    },
    playLvelveUpAnimation:function(){
        this.lvelveUpAnimation.node.active = true;
        this.lvelveUpAnimation.play();
    }
});
