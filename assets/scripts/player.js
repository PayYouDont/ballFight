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
        level:0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.setSize();
        this.setMoveAction();
    },
    setSize:function(){
        this.width = this.width + this.level*10;
        this.height = this.height + this.level*10;
    },
    setMoveAction:function(){
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
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
    start () {

    },

    // update (dt) {},
});
