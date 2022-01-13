//戦闘機のスプライト
var fighter; 
//戦闘機の画像
var fighterImage;
//ブロックのスプライト
var block0;
// ブロックの画像
var blickImage;
// ブロックのアニメーション
var breakAnimation;
var blockgroup;
var fireAnimation;
// ミサイルの画像
var misileImage;
//ミサイルのクールタイム
var counter = 0;
//ミサイルのスプライト
var misile;
//判定
var count = 0;
var check = 0;
var attackcount = 0;
var clearcheck = 0;
//score
var text, x, y;
var score = 0;
var scorenum = -1;
//clear
const clear0 = "";
var clear;
//花火関連
var firecheck = 1;
var fireN = 1;
var firecount = 0;


function preload(){
    //画像の読み込み
    fighterImage = loadImage('../img/sentouki.png');

    // アニメーションの読み込み
    blockImage = loadImage('../img/block.png');
    breakAnimation = loadAnimation('../img/block01.png', '../img/block09.png');
    fireAnimation = loadAnimation('../img/fire01.png', '../img/fire04.png');
    fireAnimation.frameDelay = 5;
    //　breakAmimationはループしない
    breakAnimation.looping = false;
    fireAnimation.looping = false;

    misileImage = loadImage('../img/missile.png');
}

function setup(){
    //横600縦500のキャンバスを作る
    createCanvas(600, 500);

    //スプライトを作る
    fighter = createSprite(300, 400);
    //画像をスプライトに張り付ける
    fighter.addImage(fighterImage);
    fighter.scale = 0.15;

    blockgroup = new Group();
    //キャンバスの上に８個のブロックをx座標が10~650の間、y座標が10~600の間にランダムで置く
    var n1 = 50;
    var n2 = 100;
    for(var i = 0; i < 11; i++){
        if(i < 6){
            var x = n1;
            n1 += 100;
            var y = 50;
        } else {
            var x = n2;
            n2 += 100;
            var y = 150;
        }
        var block = createSprite(x, y);
        // 画像をスプライトに付ける
        block.addImage(blockImage);
        // 画像の大きさを変える
        block.scale = 0.1;
        // グループにスプライトを追加
        blockgroup.add(block);
    }
    block0 = createSprite(10, 100);
    // 画像をスプライトに付ける
    block0.addImage(blockImage);
    // 画像の大きさを変える
    block0.scale = 0.1;

    // #game1があるページのみ処理を実行
    if($('#game1').length) {
        
    }
    // #game2があるページのみ処理を実行
    if($('#game2').length) {
        clearcheck = localStorage.getItem('game1_1');
        if(clearcheck == 1){
            clear = localStorage.getItem('game1_2');
            document.getElementById('edit_area1').innerHTML = clear;
        }
    }
    // #game3があるページのみ処理を実行
    if($('#game3').length) {
        clearcheck = localStorage.getItem('game1_1');
        if(clearcheck == 1){
            clear = localStorage.getItem('game1_2');
            document.getElementById('edit_area1').innerHTML = clear;
        }

        scorenum = Number(localStorage.getItem('game2'));
        document.getElementById('edit_area2').innerHTML = scorenum;
    }
    // #game4があるページのみ処理を実行
    if($('#game4').length) {
        clearcheck = localStorage.getItem('game1_1');
        if(clearcheck == 1){
            clear = localStorage.getItem('game1_2');
            document.getElementById('edit_area1').innerHTML = clear;
        }

        scorenum = Number(localStorage.getItem('game2'));
        document.getElementById('edit_area2').innerHTML = scorenum;

        firecount = localStorage.getItem('game3');
        if(firecount == 1){
            firecheck = 0;
            document.getElementById('edit_area3').innerHTML = firecheck;
        } else {
            document.getElementById('edit_area3').innerHTML = '<kbd>未実装</kbd>';
        }
    }
}
 
function draw(){
    //キャンバスを塗りつぶす
    background(0);
    //スプライトを表示させる
    drawSprites();
    //戦闘機の操作
    fighterControl();
    //ブロックの操作
    if(check == 0) block0Control();
    //score
    dispText("score:"+score, 5, 25);
    if(attackcount == 12){
        if(clearcheck == 0){
            dispText(clear0, 5, 100);
        } else {
            dispText(clear, 5, 100);
        }
    }
    //花火
    if(attackcount == 12){
        if(firecheck == 0){
            for(var i = 0; i < fireN; i++){
                window.setTimeout(fireworks, i * 100);
            }
            firecheck = 1;
        }
    }
}

// 戦闘機のコントロール
function fighterControl(){
    if(keyDown('RIGHT')){ //右矢印を押したとき
        //速度を10にする
        fighter.position.x += 10;
    }
    if(keyDown('LEFT')){　//左矢印を押したとき
        //速度を-10にする
        fighter.position.x += -10;
    }
    if(fighter.position.x > width - 30){ //右からはみ出ないように
        fighter.position.x = width - 30 ; 
    } else if(fighter.position.x < 30){  //左からはみ出ないように
        fighter.position.x = 30;
    }

    if(keyDown('SPACE')){ //スペースキーを押したとき
        //カウンターが０なら打つ
        if(counter == 0){
            misile = createSprite(fighter.position.x, fighter.position.y-50);
            misile.addImage(misileImage);
            misile.scale = 2.0;
            misile.velocity.y = fighter.velocity.y - 30;
            //カウンターを20にする
            counter = 20;
        }
    }
    if(counter > 0){
        counter--;
    }
    // 1発でも打てばnullじゃなくなる
    if(misile != null){
        misile.overlap(blockgroup, misileAttack);
        if(check == 0){
            if(misile.overlap(block0, misileAttack)) check = 1;
        }
    }
}

function block0Control(){
    if(count == 0){
        block0.position.x += 1;
    } else if(count == 1){
        block0.position.x -= 1;
    }
    if(block0.position.x > width - 10){ //右からはみ出ないように
        count = 1; 
    } else if(block0.position.x < 10){  //左からはみ出ないように
        count = 0; 
    }
}

// ブロックとの衝突処理
function blockBreak(block){
    //壊れるブロックのスプライトをつくる
    var breakblock = createSprite(block.position.x, block.position.y);
    //アニメーションを読み込む
    breakblock.addAnimation('break', breakAnimation);
    breakblock.scale = 0.5;
    //blockスプライトを消す
    block.remove();
}

// ミサイルとブロックの衝突処理
function misileAttack(misile, block){
    misile.remove();
    //ブロックの破壊
    blockBreak(block);
    attackcount++;
    score += scorenum;
}

// 花火のアニメーション
function fireworks(){
    var x = random(10, 590);
    var y = random(10, 250);
    //花火ののスプライトをつくる
    var breakfire = createSprite(x, y);
    //アニメーションを読み込む
    breakfire.addAnimation('fire', fireAnimation);
    breakfire.scale = 0.7;
}

//文字を表示する関数
function dispText(text1, x, y){
    textSize(30);
    noStroke();
    fill(255);
    text(text1, x, y);
}

//実行
function go(){
    if(!(keyDown('SPACE'))){
        // #game1があるページのみ処理を実行
        if($('#game1').length) {
            if(document.printf.printf.value != ""){
                clearcheck = 1;
                clear = document.printf.printf.value;
            }
            $('.main1').append('<br><div class="result">実行しました</div>');
        }
        if($('#game2').length) {
            if(document.calnum.calnum.value != ""){
                scorenum = Number(document.calnum.calnum.value);
            }
            $('.main2').append('<br><div class="result">実行しました</div>');
        }
        if($('#game3').length) {
            if(document.if.if.value == "0"){
                firecheck = 0;
                firecount = 1;
            }
            $('.main3').append('<br><div class="result">実行しました</div>');
        }
        if($('#game4').length) {
            if(document.for.for.value != ""){
                fireN = Number(document.for.for.value);
            }
            $('.main4').append('<br><div class="result">実行しました</div>');
        }
    }
}

//ページ遷移
function pageTrans(){
    
    window.location.href = 'game1.html';

}

function pageTrans1(){
    
    if(clearcheck == 0){
        localStorage.setItem('game1_1', clearcheck);
    } else if(clearcheck == 1){
        localStorage.setItem('game1_1', clearcheck);
        localStorage.setItem('game1_2', clear);
    }
    window.location.href = 'game2.html';

}

function pageTrans2(){

    localStorage.setItem('game2', scorenum);
    window.location.href = 'game3.html';

}

function pageTrans3(){

    localStorage.setItem('game3', firecount);
    window.location.href = 'game4.html';

}

function pageReturn(){

    window.location.href = 'game.html';

}