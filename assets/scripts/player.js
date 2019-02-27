
cc.Class({
    extends: cc.Component,

    properties: {
        level:0
    },
    onLoad () {
        this.updateSize();
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
        this.node.setContentSize(this.level*10,this.level*10);
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
    }
});
