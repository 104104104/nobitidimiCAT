/*
 * シンプルに四角が動く、ゲーム(?)
 */

phina.globalize(); // おまじない(phina.jsをグローバルに展開)


// 定数
const RECTANGLE_DIAMETER = 60; // 正方形の一辺の長さ
const DISPLAY_WIDTH = 640; // ゲーム画面の横幅
const DISPLAY_HEIGHT = 960; // ゲーム画面の縦幅
const ONE_SECOND_FPS = 30; //ゲーム画面を、一秒間に何回更新するか

var SCORE = 0; //スコアはグローバルで管理する(その方が簡単なので…)

var before_p_x = 0;
var before_p_y = 0;


/*
 * 自分の機体(ジョナサン)の定義
 */
phina.define('Jona', {
    superClass: 'TriangleShape',

    //初期化
    init: function(options) {
        this.superInit(); //初期化のおまじない

        this.fill = 'blue'; // 四角の塗りつぶし色
        this.stroke = 'red'; // 四角のふちの色
        this.x = DISPLAY_WIDTH / 2;
        this.y = DISPLAY_HEIGHT * 2 / 3;
        this.width = RECTANGLE_DIAMETER; //四角の縦幅
        this.height = RECTANGLE_DIAMETER; //四角の横幅
    },

    //毎フレームごとに、どうふるまうか
    update: function(app) {
        const p = app.pointer;
        const diffx = p.x - before_p_x;
        const diffy = p.y - before_p_y;
        if (app.frame >= 2) {
            console.log(p.x, p.y);
            if (0 <= this.x + diffx <= DISPLAY_WIDTH) {
                this.x += diffx;
            }
            if (0 <= this.y + diffy <= DISPLAY_HEIGHT) {
                this.y += diffy;
            }
            //var speed = 0;

            //this.x += speed;
        }
        before_p_x = p.x;
        before_p_y = p.y;
    },
});


/*
 * 四角の定義
 */
phina.define('Rec', {
    superClass: 'RectangleShape',

    //初期化
    init: function(options) {
        this.superInit(); //初期化のおまじない

        this.fill = 'red'; // 四角の塗りつぶし色
        this.stroke = 'red'; // 四角のふちの色
        this.width = RECTANGLE_DIAMETER; //四角の縦幅
        this.height = RECTANGLE_DIAMETER; //四角の横幅

        //四角をクリックできるようにする
        this.setInteractive(true); //四角をクリック可能に
        this.onpointstart = () => { //クリックが始まった瞬間の処理
            SCORE += 1; //スコアを1追加
            this.remove(); //自身を削除
        };
    },

    //毎フレームごとに、どうふるまうか
    update: function(app) {
        var speed = 3;

        this.x += speed;
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

        // グループを生成
        this.recGroup = DisplayElement().addChildTo(this);

        this.jona = Jona({}).addChildTo(this);
    },


    //毎フレームごとに、どう振る舞うか
    update: function(app) {
        if (app.frame % ONE_SECOND_FPS == 0) { //1秒に一回、四角を追加する

            var tempRec = Rec({}); //tempRecに四角を一旦代入し、初期値を設定する
            tempRec.x = getRandomInt(DISPLAY_WIDTH); //表示位置(x座標)を画面内でランダムに設定する
            tempRec.y = getRandomInt(DISPLAY_HEIGHT); //表示位置(y座標)を画面内でランダムに設定する

            tempRec.addChildTo(this.recGroup); //グループに追加する
        }
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
    });

    // 実行
    app.run();
});


// ランダムなint型の数を返す関数
// 0~maxの範囲で返す
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}