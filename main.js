/*
 * シンプルに四角が動く、ゲーム(?)
 */

phina.globalize(); // おまじない(phina.jsをグローバルに展開)


// 定数
const JONATHAN_DIAMETER = 150; // ジョナサンの大きさ
const JONATHAN_BURRET_DIAMETER = 5; //ジョナサンの弾の大きさ

const SUZUME_DIAMETER = 120; // スクラップ雀の大きさ

const DISPLAY_WIDTH = 640; // ゲーム画面の横幅
const DISPLAY_HEIGHT = 960; // ゲーム画面の縦幅
const ONE_SECOND_FPS = 30; //ゲーム画面を、一秒間に何回更新するか

var SCORE = 0; //スコアはグローバルで管理する(その方が簡単なので…)

//jonathanで使う、グローバル変数
var before_p_x = 0;
var before_p_y = 0;
var touchFlug = false;

//jonathanの弾で使うグローバル変数
var JONA_BURRET_PER_SECOND = 3;


//画像
var ASSETS = {
    image: {
        'scrapSuzume': './scrapSuzume.png',
        'jonathan': './janathan.png',
    },
};


/*
 * 自分の機体(ジョナサン)の定義
 */
phina.define('Jona', {
    superClass: 'Sprite',

    //初期化
    init: function(options) {
        this.superInit('jonathan'); //初期化のおまじない

        this.fill = 'blue'; // 四角の塗りつぶし色
        this.stroke = 'yello'; // 四角のふちの色
        this.x = DISPLAY_WIDTH / 2;
        this.y = DISPLAY_HEIGHT * 2 / 3;
        this.width = JONATHAN_DIAMETER; //四角の縦幅
        this.height = JONATHAN_DIAMETER; //四角の横幅
    },

    //ジョナサンは、タッチしている指の相対位置で動く。画面外には出ない。
    update: function(app) {
        const p = app.pointer;
        const diffx = p.x - before_p_x;
        const diffy = p.y - before_p_y;
        if (p.getPointing()) {
            if (touchFlug) {
                this.x += diffx;
                if (this.x <= 0) {
                    this.x = 0;
                }
                if (DISPLAY_WIDTH <= this.x) {
                    this.x = DISPLAY_WIDTH;
                }
                this.y += diffy;
                if (this.y <= 0) {
                    this.y = 0;
                }
                if (DISPLAY_HEIGHT <= this.y) {
                    this.y = DISPLAY_HEIGHT;
                }
            }
            touchFlug = true;
        } else {
            touchFlug = false;
        }
        before_p_x = p.x;
        before_p_y = p.y;
    },
});



/*
 * ジョナサンの弾の定義
 */
phina.define('JonaBurret', {
    superClass: 'CircleShape',

    //初期化
    init: function(options) {
        this.superInit();

        this.radius = JONATHAN_BURRET_DIAMETER;
        this.damage = 1;
    },

    //毎フレームごとに、どうふるまうか
    update: function(app) {
        var speed = 30;

        this.y -= speed;

        if (this.y <= 0 - 100) { //画面外に出たら、自分を削除
            this.remove();
        }
    },
});



/*
 * 敵の定義
 */
phina.define('Suzume', {
    superClass: 'Sprite',

    //初期化
    init: function(options) {
        this.superInit('scrapSuzume');

        this.height = SUZUME_DIAMETER;
        this.width = SUZUME_DIAMETER * 1.3;

        this.hitpoint = 30;
    },

    //毎フレームごとに、どうふるまうか
    update: function(app) {
        var speed = 3;

        this.y += speed;

        if (this.y >= DISPLAY_HEIGHT + 100) { //画面外に出たら、自分を削除
            this.remove();
        }
    },

    removeMyself() {
        this.remove();
        SCORE += 1;
    },

});



/*
 * スコア表示用Labalの定義
 */
phina.define('scoreLabel', {
    superClass: 'Label',

    //初期化
    init: function(options) {
        this.superInit(); //初期化のおまじない

        this.text = "0"; //最初のtextは 0
        this.fontsize = 64; //フォントの大きさ
        this.x = DISPLAY_WIDTH / 2; //表示位置(x座標)
        this.y = DISPLAY_HEIGHT - (DISPLAY_HEIGHT / 9); //表示位置(y座標)
        this.fill = '#111'; //文字の色
    },


    //毎フレームごとに、どうふるまうか
    update: function(app) {
        this.text = SCORE; //textに現在のSCOREを代入
    }
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
        scoreLabel({}).addChildTo(this);

        // スズメグループを生成
        this.suzumeGroup = DisplayElement().addChildTo(this);


        // jonathanの弾のグループを生成
        this.jonaBurretGroup = DisplayElement().addChildTo(this);

        //Jonathanを生成
        this.jona = Jona({}).addChildTo(this);
    },


    //毎フレームごとに、どう振る舞うか
    update: function(app) {


        //jonathanの弾を追加する部分
        if (app.frame % JONA_BURRET_PER_SECOND == 0) {

            var tempJonaBurret1 = JonaBurret({});
            tempJonaBurret1.x = this.jona.x;
            tempJonaBurret1.y = this.jona.y;

            var tempJonaBurret2 = JonaBurret({});
            tempJonaBurret2.x = this.jona.x + JONATHAN_DIAMETER / 2;
            tempJonaBurret2.y = this.jona.y;

            var tempJonaBurret3 = JonaBurret({});
            tempJonaBurret3.x = this.jona.x - JONATHAN_DIAMETER / 2;
            tempJonaBurret3.y = this.jona.y;


            tempJonaBurret1.addChildTo(this.jonaBurretGroup); //グループに追加する
            tempJonaBurret2.addChildTo(this.jonaBurretGroup); //グループに追加する
            tempJonaBurret3.addChildTo(this.jonaBurretGroup); //グループに追加する
        }


        if (app.frame % ONE_SECOND_FPS == 0) {

            var tempSuzume = Suzume({}); //tempRecに四角を一旦代入し、初期値を設定する
            tempSuzume.x = getRandomInt(DISPLAY_WIDTH); //表示位置(x座標)を画面内でランダムに設定する
            tempSuzume.y = 0;

            tempSuzume.addChildTo(this.suzumeGroup); //グループに追加する
        }


        //当たり判定を書く部分
        //console.log(this.suzumeGroup.children[0]);
        //test = this.suzumeGroup.children[0];
        //if (test) { console.log(test.position.x) }
        for (let suzume of this.suzumeGroup.children) {
            for (let jonaBurret of this.jonaBurretGroup.children) {
                //console.log("aaa");
                //console.log(suzume);
                const c1 = Circle(suzume.x, suzume.y, suzume.radius);
                const c2 = Circle(jonaBurret.x, jonaBurret.y, jonaBurret.radius);
                //console.log(c1, c2);
                if (Collision.testCircleCircle(c1, c2)) {
                    suzume.hitpoint -= 1;
                    if (suzume.hitpoint <= 0) {
                        suzume.removeMyself();
                    }

                }
            }
        }
        /*
        if (Collision.testCircleCircle(c, circle)) {
            circle.fill = 'red';
        } else {
            circle.fill = 'blue';
        }
        */

    },

    onkeydown: function(e) { //スペースキーが押されると、強制終了
        if (e.keyCode === 32) { //32がスペースキー
            this.app.stop();
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