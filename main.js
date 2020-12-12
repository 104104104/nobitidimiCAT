/*
 * ねこのび
 */

phina.globalize(); // おまじない(phina.jsをグローバルに展開)


// 定数
const RECTANGLE_DIAMETER = 60; // 正方形の一辺の長さ
const DISPLAY_WIDTH = 640; // ゲーム画面の横幅
const DISPLAY_HEIGHT = 960; // ゲーム画面の縦幅
const ONE_SECOND_FPS = 30; //ゲーム画面を、一秒間に何回更新するか

const MAX_NEKO_HEIGHT = DISPLAY_HEIGHT / 10;
const GROUND_HEIGHT = DISPLAY_HEIGHT - DISPLAY_HEIGHT / 5;
const MIN_NEKO_HEIGHT = GROUND_HEIGHT - RECTANGLE_DIAMETER;

var SPACE_DOWN_FRAG = false;

var SCORE = 0;
var SCORE_MUL = 1;


/*
 * ねこの定義
 */
phina.define('Cat', {
    superClass: 'RectangleShape',

    //初期化
    init: function(options) {
        this.superInit(); //初期化のおまじない

        this.origin.set(0, 1); //左下を原点に

        this.fill = 'red'; // 四角の塗りつぶし色
        this.stroke = 'red'; // 四角のふちの色
        this.width = RECTANGLE_DIAMETER; //四角の縦幅
        this.height = RECTANGLE_DIAMETER; //四角の横幅
        this.x = 100;
        this.y = GROUND_HEIGHT;

        this.expandSpeed = 0;
        this.shrinkSpeed = 0;
    },

    //毎フレームごとに、どうふるまうか
    update: function(app) {
        if (SPACE_DOWN_FRAG) {
            if (MAX_NEKO_HEIGHT < this.y - this.height) {
                this.height += this.expandSpeed;
            }
            if (app.frame % Math.floor(ONE_SECOND_FPS / 8) == 0) {
                this.expandSpeed += 5;
            }
        } else {
            this.expandSpeed = 0;
            if (this.height > RECTANGLE_DIAMETER) {
                this.height -= this.shrinkSpeed;
                this.shrinkSpeed += 100;
            } else {
                this.height = RECTANGLE_DIAMETER;
                this.shrinkSpeed = 0;
            }
        }
    },
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
        console.log(this.gameoverLavel);

        //Catの生成
        this.cat = Cat({}).addChildTo(this);

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
            if (oneBalloon.hitTestElement(this.cat)) {
                //console.log('hit!')
                oneBalloon.removeBalloon();
            }
        }

        //トゲトゲと猫と当たり判定
        for (let oneTogetoge of this.togetogeGroup.children) {
            if (oneTogetoge.hitTestElement(this.cat)) {
                console.log('GAME OVER!');
                this.gameoverLavel.show();
                this.cat.hide();
            }
        }

        //風船をとり逃した判定
        for (let oneBalloon of this.balloonGroup.children) {
            if (oneBalloon.x < this.cat.x && oneBalloon.beforNekoFrug) {
                console.log('torinogashi');
                SCORE_MUL = 1;
                oneBalloon.beforNekoFrug = false;
            }

        }
    },

    onkeydown: function(e) {
        //Qが押されると、強制終了
        if (e.keyCode === 81) { //81はQ
            console.log('STOP THIS APP!');
            this.app.stop();
        }
        //スペースキーが押されると、伸びる
        if (e.keyCode === 32) { //32はスペース
            //console.log('PRESS SPACE');
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