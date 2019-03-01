const Player = require('player');
cc.Class({
    extends: cc.Component,
    properties: {
        ground: {
            default: null,
            type: cc.Node
        },
        // 引用circle预制资源
        circlePrefab: {
            default: null,
            type: cc.Prefab
        },
        // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
        player: {
            default: null,
            type: Player
        },
        startBtn: {
            default: null,
            type: cc.Button
        },
        // score label 的引用
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        levelLabel: {
            default: null,
            type: cc.Label
        },
        ballsLabel: {
            default: null,
            type: cc.Label
        },
        gameOverNode: {
            default: null,
            type: cc.Node
        },
        gameMsgNode: {
            default: null,
            type: cc.Node
        },
        // 得分音效资源
        levelUpAudio: {
            default: null,
            type: cc.AudioClip
        },
        // gameOver资源
        gameOverAudio: {
            default: null,
            type: cc.AudioClip
        },
        seed:-1,
        circleCount:20
    },
    onLoad () {
        this.colorArr = [];
        this.setColorArr();
        let size = cc.director.getWinSizeInPixels();
        this.ground.width = size.width;
        this.ground.height = size.height;
        this.enabled = false;
        this.gameOverNode.active = false;
        this.gameMsgNode.active = false;
        this.resetScore();
        this.circlePool = new cc.NodePool('circle');
        this.currentCirclePool = new Array();
        var scoreLabelX = this.node.width/2-this.scoreDisplay.node.width-20;
        var scoreLabelY = this.node.height/2-this.scoreDisplay.node.height-20;
        this.scoreDisplay.node.setPosition(scoreLabelX,scoreLabelY);
        this.levelLabel.node.setPosition(this.scoreDisplay.node.x - this.scoreDisplay.node.width - 20, this.scoreDisplay.node.y);
        this.ballsLabel.node.setPosition(this.levelLabel.node.x - this.levelLabel.node.width - 30,this.scoreDisplay.node.y);
        this.baseSped = this.node.width/3;
    },
    onStartGame: function () {
        this.resetScore();
        this.bgMusic = new Audio();
        this.startBtn.node.active = false; //隐藏
        this.enabled = true;
        this.gameOverNode.active = false;
        this.gameMsgNode.active = true;
        this.player.startMoveAt(cc.v2(0, 0));
        this.schedule(function() {
            this.gameMsgNode.active = false;
            this.spawnNewCircle();
        },1, 0);
        this.stopAudio(this.gameOverAudioId);
        this.playBGMusic('http://118.24.126.134:3000/audio/backgroundMusic.m4a');
    },
    setColorArr:function(){
        var golden_ratio = 0.618033988749895;
        var s = 0.5;
        var v = 0.999;
        for(var i=0;i<this.circleCount;i++){
            var h = golden_ratio + this.seededRandom(-0.5,0.3);
            var color = this.hsvtorgb(h,s,v);
            this.colorArr.push(color)
        }
    },
    seededRandom:function(max, min) {//伪随机数（关于伪随机数的运用可以百度下，挺有意思的）
        max = max || 1;
        min = min || 0;
        this.seed = (this.seed * 9301 + 49297) % 233280;
        var rnd = this.seed / 233280.0;
        return min + rnd * (max - min);
    },
    playBGMusic(url){
        this.bgMusic.src = url;
        this.bgMusic.play();
    },
    stopBGMusic:function(){
        this.bgMusic.pause();
    },
    playAudio:function(audio,loop){
        return cc.audioEngine.playEffect(audio, loop);
    },
    stopAudio:function(audioId){
        cc.audioEngine.stopEffect(audioId);
    },
    spawnNewCircle:function() {
        // 使用给定的模板在场景中生成一个新节点
        var newCircle = null;
        if(this.circlePool.size() > 0){
            newCircle = this.circlePool.get();
        }else{
            var newCircle  = cc.instantiate(this.circlePrefab);
            this.currentCirclePool.push(newCircle);
        }
        // 设置Circl级别
        //var randLeve = parseInt(Math.random()*(this.player.level+2))
        var randLeve;
        if(this.player.level>2){
            randLeve = this.player.level+ Math.round(Math.random() * 4) - 2; //四舍五入
        }else{
            randLeve = parseInt(Math.random()*(this.player.level+2));
        }
        newCircle.getComponent('circle').setLevel(randLeve);
        // 设置Circl大小
        newCircle.getComponent('circle').initSize();
        var randIndex = parseInt(Math.random()*this.colorArr.length);
        newCircle.color = cc.color(this.colorArr[randIndex]);
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newCircle);
        // 为Circle设置一个随机位置
        this.setCircleStartPos(newCircle);
        newCircle.setPosition(newCircle.startPos);
        //设置circle结束位置
        this.settCircleEndPos(newCircle);
        //设置circle运动
        this.setNewCircleMove(newCircle);
        newCircle.getComponent('circle').init(this);
        if(this.currentCirclePool.length<this.circleCount){
            this.spawnNewCircle();
        }
    },
    setNewCircleMove:function(newCircle){
        let time = this.getDistance(newCircle)/this.baseSped;
        let moveTo = cc.moveTo(time, newCircle.endPos).easing(cc.easeInOut(1));
        //回调函数
        let callfunc = cc.callFunc(function () {
            this.circlePool.put(newCircle);
            this.spawnNewCircle();
        }, this);

        //让circle移动
        newCircle.runAction(cc.sequence(moveTo, callfunc));
    },
    getDistance:function(newCircle){
        var startPos = newCircle.startPos;
        var endPos = newCircle.endPos;
        var distance = startPos.sub(endPos).mag();
        return parseInt(distance);
    },
    setCircleStartPos:function(newCircle){
        var minX = -this.node.width/2;
        var maxX = this.node.width/2;
        var minY = -this.node.height/2;
        var maxY = this.node.height/2;
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
        newCircle.startPos = cc.v2(startX,startY);
    },
    settCircleEndPos:function(newCircle){
        var minX = -this.node.width/2;
        var maxX = this.node.width/2;
        var minY = -this.node.height/2;
        var maxY = this.node.height/2;
        var x = parseInt(Math.random()*(maxX-minX+1)+minX,10);
        var y = parseInt(Math.random()*(maxY-minY+1)+minY,10);
        var startX = newCircle.startPos.x;
        var startY = newCircle.startPos.y
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
        newCircle.endPos = cc.v2(endX,endY);
    },
    resetScore: function () {
        this.score = 0;
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
        this.levelLabel.string = 'level: ' + this.player.level.toString();
        this.ballsLabel.string = 'balls: ' + this.circleCount.toString();
        this.player.level = 2;
        this.player.updateSize();
    },
    gainScore: function (circle) {
        this.score += 1;
        // 更新 scoreDisplay Label 的文字
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
        circle.node.removeFromParent();
        this.spawnNewCircle();
        if(this.score % 10 == 0){
            this.player.level = this.score/10+1;
            this.playAudio(this.levelUpAudio,false);
            if(this.player.level<=10){
                this.levelLabel.string = 'level: ' + this.player.level.toString();
                this.player.updateSize();
                this.player.playLvelveUpAnimation();
            }else{
                this.circleCount++;
                this.ballsLabel.string = 'balls: ' + this.circleCount.toString();
            }
        }
    },
    gameOver: function () {
        this.gameOverNode.active = true;
        this.player.enabled = false;
        this.player.stopMove();
        this.destroyCurrentCircles();
        this.startBtn.node.active = true;
        this.stopBGMusic();
        this.gameOverAudioId = this.playAudio(this.gameOverAudio,false);
    },
    destroyCurrentCircles:function(){
        for (var i in this.currentCirclePool){
            this.currentCirclePool[i].stopAllActions();
            this.currentCirclePool[i].removeFromParent();
        }
        this.currentCirclePool = new Array();
    },
    hsvtorgb:function (h, s, v) {
        var h_i = parseInt(h * 6);
        var f = h * 6 - h_i;
        var p = v * (1 - s);
        var q = v * (1 - f * s);
        var t = v * (1 - (1 - f) * s);
        var r, g, b;
        switch (h_i) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = v;
                b = p;
                break;
            case 2:
                r = p;
                g = v;
                b = t;
                break;
            case 3 :
                r = p;
                g = q;
                b = v;
                break;
            case 4:
                r = t;
                g = p;
                b = v;
                break;
            case 5:
                r = v;
                g = p;
                b = q;
                break;
            default:
                r = 1;
                g = 1;
                b = 1;
        }
        r = r * 255;
        g = g * 255;
        b = b * 255;
        return new cc.color(r , g, b);
    }
});
