/*
 * ねこのび
 */

phina.globalize(); // おまじない(phina.jsをグローバルに展開)


// 定数
const CAT_HEIGHT = 200;
const CAT_ATARI_HEAD = CAT_HEIGHT - 20;
const CAT_WIDTH = 200;

const CAT_LEFT = 50;

const DISPLAY_WIDTH = 640; // ゲーム画面の横幅
const DISPLAY_HEIGHT = 960; // ゲーム画面の縦幅
const ONE_SECOND_FPS = 30; //ゲーム画面を、一秒間に何回更新するか

const MAX_NEKO_HEIGHT = DISPLAY_HEIGHT / 10;
const GROUND_HEIGHT = DISPLAY_HEIGHT - DISPLAY_HEIGHT / 5;
const MIN_NEKO_HEIGHT = GROUND_HEIGHT - CAT_HEIGHT;

var SPACE_DOWN_FRAG = false;

var EXPAND_SPEED = 0;
var SHRINK_SPEED = 0;

var HEAD_BETWEEN_FOOT = 0;

var SCORE = 0;
var SCORE_MUL = 1;



//画像
var ASSETS = {
    image: {
        'catWalk1': './catWalk.GIF',
        'head': './head2.PNG',
        'body': './body2.PNG',
        'foot': './foot2.PNG',
    },
};


/*
 * ねこの定義
 */

phina.define('CatHit', {
    superClass: 'RectangleShape',

    //初期化
    init: function(options) {
        this.superInit(); //初期化のおまじない

        this.origin.set(0, 1); //左下を原点に

        this.fill = 'red'; // 四角の塗りつぶし色
        this.stroke = 'red'; // 四角のふちの色
        this.alpha = 0;
        this.width = CAT_WIDTH - 150; //四角の縦幅
        this.height = CAT_ATARI_HEAD; //四角の横幅
        this.x = CAT_LEFT + 70;
        this.y = GROUND_HEIGHT;

        this.expandSpeed = 0;
        this.shrinkSpeed = 0;
    },

    //毎フレームごとに、どうふるまうか
    update: function(app) {
        if (SPACE_DOWN_FRAG) {
            if (MAX_NEKO_HEIGHT < this.y - this.height) {
                this.height += EXPAND_SPEED;
            }
            //EXPAND_SPEEDの加算は、ここで行う。
            if (app.frame % Math.floor(ONE_SECOND_FPS / 8) == 0) {
                EXPAND_SPEED += 5;
            }
        } else {
            EXPAND_SPEED = 0;
            if (this.height > CAT_ATARI_HEAD) {
                this.height -= SHRINK_SPEED;
                SHRINK_SPEED += 100;
            } else {
                this.height = CAT_ATARI_HEAD;
                SHRINK_SPEED = 0;
            }
        }
    },
});


//猫の頭
phina.define('CatHead', {
    superClass: 'Sprite',

    //初期化
    init: function(options) {
        this.superInit('head'); //初期化のおまじない

        this.origin.set(0, 1); //左下を原点に
        //this.height = RECTANGLE_DIAMETER; //四角の横幅
        this.height = CAT_HEIGHT / 2;
        this.width = CAT_WIDTH;
        this.x = CAT_LEFT;

        this.catHaedOroginY = GROUND_HEIGHT - CAT_HEIGHT + this.height;

        this.y = this.catHaedOroginY;
    },

    //毎フレームごとに、どうふるまうか
    update: function(app) {
        if (SPACE_DOWN_FRAG) {
            //console.log(MAX_NEKO_HEIGHT, this.y);
            if (MAX_NEKO_HEIGHT < this.y - this.height) {
                this.y -= EXPAND_SPEED;
            }
        } else {
            EXPAND_SPEED = 0;
            if (this.height > CAT_HEIGHT) {
                this.y -= SHRINK_SPEED;
                SHRINK_SPEED += 100;
            } else {
                this.y = this.catHaedOroginY;
                //SHRINK_SPEED = 0;
            }
        }
    },
});

//猫の体
phina.define('CatBody', {
    superClass: 'Sprite',

    //初期化
    init: function(options) {
        this.superInit('body'); //初期化のおまじない

        this.origin.set(0, 0); //左下を原点に
        this.height = HEAD_BETWEEN_FOOT;
        this.width = CAT_WIDTH;
        this.x = CAT_LEFT;
        this.y = GROUND_HEIGHT - CAT_HEIGHT / 2;

        //this.hide();
    },

    //毎フレームごとに、どうふるまうか
    update: function(app) {
        if (SPACE_DOWN_FRAG) {
            this.height = HEAD_BETWEEN_FOOT;
        } else {
            this.height = 0;
        }
    },

});

//猫の足
phina.define('CatFoot', {
    superClass: 'Sprite',

    //初期化
    init: function(options) {
        this.superInit('foot'); //初期化のおまじない

        this.origin.set(0, 1); //左上を原点に
        this.height = CAT_HEIGHT / 2;
        this.width = CAT_WIDTH;
        this.x = CAT_LEFT;
        this.y = GROUND_HEIGHT;
    }
});



/*
 * 風船
 */
phina.define('Balloon', {
    superClass: 'RectangleShape',

    //初期化
    init: function(options) {
        this.superInit(); //初期化のおまじない

        this.origin.set(0, 1); //左下を原点に

        this.fill = 'blue'; // 四角の塗りつぶし色
        this.stroke = 'blue'; // 四角のふちの色
        this.x = DISPLAY_WIDTH;
        this.y = MAX_NEKO_HEIGHT + getRandomInt(GROUND_HEIGHT - MAX_NEKO_HEIGHT);
        this.width = 20; //四角の縦幅
        this.height = 20; //四角の横幅

        this.beforNekoFrug = true;
    },

    //毎フレームごとに、どうふるまうか
    update: function(app) {
        var speed = -3;
        this.x += speed;
    },

    removeBalloon: function() {
        SCORE += SCORE_MUL; //スコアを追加
        SCORE_MUL *= 2;
        this.remove(); //自身を削除
    },
});


/*
 * トゲトゲ
 */
phina.define('Togetoge', {
    superClass: 'RectangleShape',

    //初期化
    init: function(options) {
        this.superInit(); //初期化のおまじない

        this.origin.set(0, 1); //左下を原点に

        this.fill = 'black'; // 四角の塗りつぶし色
        this.stroke = 'black'; // 四角のふちの色
        this.x = DISPLAY_WIDTH;
        this.y = MAX_NEKO_HEIGHT + getRandomInt(MIN_NEKO_HEIGHT - MAX_NEKO_HEIGHT);
        this.width = 20; //四角の縦幅
        this.height = 20; //四角の横幅
    },

    //毎フレームごとに、どうふるまうか
    update: function(app) {
        var speed = -3;
        this.x += speed;
    },
});


/*
 * 画面下部の草
 */
phina.define('Grass', {
    superClass: 'RectangleShape',

    //初期化
    init: function(options) {
        this.superInit(); //初期化のおまじない

        this.origin.set(0, 1); //左下を原点に

        this.fill = 'green'; // 四角の塗りつぶし色
        this.stroke = 'green'; // 四角のふちの色
        this.width = 10; //四角の縦幅
        this.height = 20; //四角の横幅
    },

    //毎フレームごとに、どうふるまうか
    update: function(app) {
        var speed = -3;
        this.x += speed;
    },
});


/*
 * スコア表示用Labalの定義
 */
phina.define('ScoreLabel', {
    superClass: 'Label',

    //初期化
    init: function(options) {
        this.superInit(); //初期化のおまじない

        this.text = "0"; //最初のtextは 0
        this.fontsize = 64; //フォントの大きさ
        this.x = DISPLAY_WIDTH / 2; //表示位置(x座標)
        this.y = DISPLAY_HEIGHT / 9; //表示位置(y座標)
        this.fill = '#111'; //文字の色
    },


    //毎フレームごとに、どうふるまうか
    update: function(app) {
        this.text = SCORE; //textに現在のSCOREを代入
    }
});


/*
 * GAMEOVERの文字表示
 */
phina.define('GameoverLabel', {
    superClass: 'Label',

    //初期化
    init: function(options) {
        this.superInit(); //初期化のおまじない

        this.text = "GAME OVER"; //最初のtextは 0
        this.fontsize = 256; //フォントの大きさ
        this.x = DISPLAY_WIDTH / 2; //表示位置(x座標)
        this.y = DISPLAY_HEIGHT / 2; //表示位置(y座標)
        this.fill = '#111'; //文字の色

        this.hide();
    },
});


/*
 * ゲームのメインシーンの定義
 */
phina.define("MainScene", {
    superClass: 'DisplayScene',

    // 初期化
    init: function() {
        this.superInit(); //初期化のおまじない

        this.backgroundColor = '#1ee'; // 背景色

        //score表示用Labelを、シーンに追加
        ScoreLabel({}).addChildTo(this);

        //GAMEOVER表示用Labelを、シーンに追加
        this.gameoverLavel = GameoverLabel({}).addChildTo(this);

        //Catの生成

        this.catHit = CatHit({}).addChildTo(this); //当たり判定部分

        this.catGroup = DisplayElement().addChildTo(this);
        CatBody({}).addChildTo(this.catGroup);
        CatHead({}).addChildTo(this.catGroup);
        CatFoot({}).addChildTo(this.catGroup);


        // グループを生成
        this.balloonGroup = DisplayElement().addChildTo(this);
        this.togetogeGroup = DisplayElement().addChildTo(this);
        this.grassGroup = DisplayElement().addChildTo(this);
    },


    //毎フレームごとに、どう振る舞うか
    update: function(app) {
        if (app.frame % (ONE_SECOND_FPS) == 0) {
            var rand = getRandomInt(2);
            if (rand <= 0) { // 1/2で、風船の追加
                var tampBalloon = Balloon({});
                tampBalloon.addChildTo(this.balloonGroup); //グループに追加する
            } else { // 1/2でトゲトゲの追加
                var rand2 = getRandomInt(2);
                if (rand2 <= 0) { // 1/2でトゲトゲだけ追加
                    var tampTogetoge = Togetoge({});
                    tampTogetoge.addChildTo(this.togetogeGroup); //グループに追加する
                } else { // 1/2で、トゲトゲと風船を追加
                    var tempTogetoge = Togetoge({});
                    tempTogetoge.addChildTo(this.togetogeGroup); //グループに追加する

                    var tempBalloon = Balloon({});
                    var balloonY = getRandomIntMinMax(MIN_NEKO_HEIGHT, tempTogetoge.y);
                    tempBalloon.y = balloonY;
                    tempBalloon.addChildTo(this.balloonGroup); //グループに追加する
                }
            }

            //草の追加
            var tempGrass = Grass({});
            tempGrass.x = DISPLAY_WIDTH;
            tempGrass.y = GROUND_HEIGHT;
            tempGrass.addChildTo(this.grassGroup); //グループに追加する
        }

        //当たり判定

        //風船と猫の当たり判定
        for (let oneBalloon of this.balloonGroup.children) {
            if (oneBalloon.hitTestElement(this.catHit)) {
                //console.log('hit!')
                oneBalloon.removeBalloon();
            }
        }

        //トゲトゲと猫と当たり判定
        for (let oneTogetoge of this.togetogeGroup.children) {
            if (oneTogetoge.hitTestElement(this.catHit)) {
                console.log('GAME OVER!');
                this.gameoverLavel.show();
                for (let tempCat of this.catGroup.children) {
                    tempCat.hide();
                }
            }
        }

        //風船をとり逃した判定
        for (let oneBalloon of this.balloonGroup.children) {
            if (oneBalloon.x < this.catGroup.children[0].x && oneBalloon.beforNekoFrug) {
                console.log('torinogashi');
                SCORE_MUL = 1;
                oneBalloon.beforNekoFrug = false;
            }
        }

        //猫の頭と体の間の距離を計算
        console.log(HEAD_BETWEEN_FOOT);
        HEAD_BETWEEN_FOOT = this.catGroup.children[1].y - (this.catGroup.children[2].y + this.catGroup.children[2].height) + 150;
    },

    onkeydown: function(e) {
        //Qが押されると、強制終了
        if (e.keyCode === 81) { //81はQ
            console.log('STOP THIS APP!');
            this.app.stop();
        }
        //スペースキーが押されると、伸びる
        if (e.keyCode === 32) { //32はスペース
            SPACE_DOWN_FRAG = true;
        }
    },

    onkeyup: function(e) { //スペースキーが話されると、縮む
        if (e.keyCode === 32) { //32はスペース
            //console.log('ESC SPACE');
            SPACE_DOWN_FRAG = false;
        }
    },
});


/*
 * メイン処理
 */
phina.main(function() {
    // アプリケーションを生成
    var app = GameApp({
        startLabel: 'main', // MainScene から開始
        width: DISPLAY_WIDTH, //画面の横幅
        height: DISPLAY_HEIGHT, //画面の縦幅
        fps: ONE_SECOND_FPS, //毎秒何回画面を更新するかの設定。
        assets: ASSETS,
    });

    // 実行
    app.run();
});


// ランダムなint型の数を返す関数
// 0~maxの範囲で返す
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}


function getRandomIntMinMax(min, max) {
    var temp = max - min;
    var tempRand = Math.floor(Math.random() * Math.floor(temp));
    return min + tempRand;
}