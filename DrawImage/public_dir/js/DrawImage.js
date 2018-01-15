//図形描写の取得
var canvas = $('#canvas');
var canvas2 = $('#canvas2');
var canvas3 = $('#canvas3');
var canvas4 = $('#canvas4');
var canvas5 = $('#canvas5');
//ピックアップのための変数
var filter = $('#filter');
//カードの色を変えるための変数のIDを取得
var addColor = $('#addColor');
//カード、リンク関連の配列
var cells = [];
var others_cells = [];
var cells2=[];
var cells3=[];
var teachercells=[];
var teacherlinks=[];

var links = [];
var links2=[];
var links3=[];
var cell_link_source = [];
var cell_link_target = [];
var cell_link_reason =[];
//joint.dia.Graphを使うため
var graph  = new joint.dia.Graph();
var graph2 = new joint.dia.Graph();
var graph3 = new joint.dia.Graph();
var graph4 = new joint.dia.Graph();
var graph5 = new joint.dia.Graph();
//データベースに送るデータ
var user;
var classnumber;
var others_links = [];
var others_link_source = [];
var others_link_target = [];
var others_link_reason = [];
var cell_attribute_human = [];
var cell_attribute_state = [];
var cell_attribute_updown = [];
var cell_attribute_human2 = [];
var cell_attribute_state2 = [];
var cell_attribute_updown2 = [];
//カードの大きさを管理
var cardWidth=300;
var cardHeight=170;

//描画用のキャンバス
var paper = new joint.dia.Paper({
  el: canvas,
  //キャンバスのサイズ
  width: 1184,
  height: 1200,
  model: graph,
  gridSize: 1,
  clickThreshold: 1,
});

//他者の図形を表示するためのキャンバス
var paper2 = new joint.dia.Paper({
  el: canvas2,
  //キャンバスのサイズ
  width: 1184,
  height: 1200,
  model: graph2,
  gridSize: 1,

  clickThreshold: 1
});
//paper3,4は小さくして比較画面に表示
var paper3 = new joint.dia.Paper({
  el: canvas3,
  //キャンバスのサイズ
  width: 592,
  height: 600,
  model: graph3,
  gridSize: 1,
  clickThreshold: 1
});
var paper4 = new joint.dia.Paper({
  el: canvas4,
  //キャンバスのサイズ
  width: 592,
  height: 600,
  model: graph4,
  gridSize: 1,
  clickThreshold: 1
});
//全体把握画面
var paper5 = new joint.dia.Paper({
  el: canvas5,
  //キャンバスのサイズ
  width: 1184,
  height: 1200,
  model: graph5,
  gridSize: 1,
  clickThreshold: 1,
});







/*
カードclassを拡張、形を変えて、文字の大きさを変更,矢印を引けるようにする
--------------------------extend,markupについての覚書---------------------------------
今後呼ばれるjoint.shapes.devs.Modelについての情報を初期化している。
markupはsvg記法
<tspan>、および<text>でひとまず出力の形式化を行う
オブジェクトを作成した際にclass内のtextを読み込む。
ここでは、.attributeタグ内でtextタグを探している
属性の見た目を変える場合は、カードの生成部分の、.attributeタグ内を編集すればよい（はず）
------------------------------------------------------------------------------------
*/
joint.shapes.devs.Model = joint.shapes.devs.Model.extend({
markup: '<g class="element-node">'+
             '<rect class="body" stroke-width="0" rx="3px" ry="5px"></rect>'+
            '<text class="label" font-size="19" ></text>'+
            '<text><tspan class="attribute1"></tspan></text>'+
            '<text><tspan class="attribute2"></tspan></text>'+
            '<text><tspan class="attribute3"></tspan></text>'+
            '<text><tspan class="attribute4"></tspan></text>'+
            '<text><tspan class="attribute5"></tspan></text>'+
            '<text><tspan class="attribute6"></tspan></text>'+
            '<g class="inPorts"/>' +
          '<g class="outPorts"/>' +
        '</g>',
portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/></g>',
});

//セルの初期化
function initialize(){
  //渡されたuserのパース
  var data = location.href.split("?")[1];
  var class12 = location.href.split("?")[2];
  user = decodeURIComponent(data.split("=")[1]);
  classnumber =class12.split('=')[1];
console.log(decodeURIComponent(user));
console.log(classnumber);

//カードの生成
cells[0] = new joint.shapes.devs.Model({
  type: 'devs.Model',
  position: {x: 10, y: 10},
  attrs: {
    '.body': {
      width: cardWidth,
      height: cardHeight,
    'stroke-width':1,
      stroke:'black'
    },
    '.label': {
      text: 'カード１',
      'y':40
    },
    '.element-node' : {
      'data-color': 'gray'
    },
    '.attribute1' : {
      text: '',
      'font-size':30,
      'fill':'',
      'human' : '',
      'state' : '',
      'updown' : ''
    },
    '.attribute2' : {
      text: '',
      'font-size':30,
      //card_hightの方が良い
      'y':170,
      'human':'',
      'state':'',
      'updown':''
    },
    '.attribute3' : {
      text: '',
      'font-size':30,
      'fill':'',
      'human' : '',
      'state' : '',
      'updown' : '',
      'dx' : 140,
    },
    '.attribute4' : {
      text: '',
      'font-size':30,
      'fill':'',
      'human' : '',
      'state' : '',
      'updown' : '',
      'dx' : 140,
      'y':170
    },
    '.attribute5' : {
      text: '',
      'font-size':30,
      'fill':'',
      'human' : '',
      'state' : '',
      'updown' : '',
      'dx' : 270,
    },
    '.attribute6' : {
      text: '',
      'font-size':30,
      'fill':'',
      'human' : '',
      'state' : '',
      'updown' : '',
      'dx' : 270,
      'y':170,
    },
  },
  inPorts: ['center'],
});
//他のカードの複製
//初期値の設定



cells[1] = cells[0].clone();
cells[1].translate(400, 0);
cells[2] = cells[0].clone();
cells[2].translate(800, 0);
cells[3] = cells[0].clone();
cells[3].translate(0, 200);
cells[4] = cells[0].clone();
cells[4].translate(400, 200);
cells[5] = cells[0].clone();
cells[5].translate(800,200);
cells[6] = cells[0].clone();
cells[6].translate(200, 400);
cells[7] = cells[0].clone();
cells[7].translate(600, 400);
//カードの属性設定
//cells[3].attr('.element-node/data-color','green');
//各カードにラベルづけ


//strをlengthで区切ってjoinで\nを付け足して改行する
function splitByLength(str, length) {
    var resultArr = [];
    if (!str || !length || length < 1) {
        return resultArr;
    }
    var index = 0;
    var start = index;
    var end = start + length;
    while (start < str.length) {
        resultArr[index] = str.substring(start, end);
        index++;
        start = end;
        end = start + length;
    }
    resultArrNew =resultArr.join("\n");

    return resultArrNew;
}
//カードの内容を記述
var cellText0='0, 　794年、桓武天皇によって都が平安京に遷都された。桓武天皇は天皇の権威を確立するために、仏教勢力を都の外に配置するとともに政治の制度を確立していった';
var cellText1='1, 　9~11世紀になると、貴族が摂政や関白となって政治の実権を握るようになった。貴族たちはこの地位に就くため娘を天皇に嫁がせ、外戚関係を結んだ';
var cellText2='2, 　10世紀になると貴族たちが持つ荘園を守るため「武士」と呼ばれる人々が現れた。彼らは次第に棟梁と呼ばれる指導者の下で武士団が形成されるようになった';
var cellText3='3, 　1156年、天皇家内部で政治の実権を巡る争いが起こり（保元の乱）、天皇家の人々は武士団の協力を得てこれを争った';
var cellText4='4, 　1159年、後白河上皇の政権内で藤原氏同士の勢力争いが起こり、源氏と平氏もこれに加わった。これに勝った平氏は中央での地位を固めた（平治の乱）。';
var cellText5='5, 　平治の乱に勝利した平清盛は武士でありながら太政大臣となり、政治の実権を握った。また西日本を中心に荘園を拡大し、西国一帯の武士を支配した。';
var cellText6='6, 　源頼朝が挙兵して東国の支持を集め頼朝の名を受けた義経が1185年に壇ノ浦で平氏を滅ぼした。';
var cellText7='7, 　平安時代の半ば、各地の戦乱や飢餓などに苦しんだ人々は阿弥陀仏にすがり、あの世で極楽浄土に生まれ変わることを願う浄土宗を進行するようになった。';
var cellTextLength=15;
cells[0].attr('.label/text', splitByLength(cellText0,cellTextLength));
cells[1].attr('.label/text', splitByLength(cellText1,cellTextLength));
cells[2].attr('.label/text', splitByLength(cellText2,cellTextLength));
cells[3].attr('.label/text', splitByLength(cellText3,cellTextLength));
cells[4].attr('.label/text', splitByLength(cellText4,cellTextLength));
cells[5].attr('.label/text', splitByLength(cellText5,cellTextLength));
cells[6].attr('.label/text', splitByLength(cellText6,cellTextLength));
cells[7].attr('.label/text', splitByLength(cellText7,cellTextLength));
graph.addCells(cells);








//他者カードの生成

others_cells[0] = new joint.shapes.devs.Model({
  type: 'devs.Model',
  position: {x: 10, y: 10},
  attrs: {
    '.body': {
      width: cardWidth,
      height: cardHeight,
    'stroke-width':1,
      stroke:'black'
    },
    '.label': {
      text: 'カード１',
      'y':40
    },
    '.element-node' : {
      'data-color': 'gray'
    },
    '.attribute1' : {
      text: '',
      'font-size':30,
      'fill':'',
      'human' : '',
      'state' : '',
      'updown' : ''
    },
    '.attribute2' : {
      text: '',
      'font-size':30,
      //card_hightの方が良い
      'y':170,
      'human':'',
      'state':'',
      'updown':''
    },
    '.attribute3' : {
      text: '',
      'font-size':30,
      'fill':'',
      'human' : '',
      'state' : '',
      'updown' : '',
      'dx' : 140,
    },
    '.attribute4' : {
      text: '',
      'font-size':30,
      'fill':'',
      'human' : '',
      'state' : '',
      'updown' : '',
      'dx' : 140,
      'y':170
    },
    '.attribute5' : {
      text: '',
      'font-size':30,
      'fill':'',
      'human' : '',
      'state' : '',
      'updown' : '',
      'dx' : 270,
    },
    '.attribute6' : {
      text: '',
      'font-size':30,
      'fill':'',
      'human' : '',
      'state' : '',
      'updown' : '',
      'dx' : 270,
      'y':170,
    },
  },
  inPorts: ['center'],
  });






//他のカードの複製
others_cells[1] = others_cells[0].clone();
others_cells[2] = others_cells[0].clone();
others_cells[3] = others_cells[0].clone();
others_cells[4] = others_cells[0].clone();
others_cells[5] = others_cells[0].clone();
others_cells[6] = others_cells[0].clone();
others_cells[7] = others_cells[0].clone();
//各カードにラベルづけ
others_cells[0].attr('.label/text', splitByLength(cellText0,cellTextLength));
others_cells[1].attr('.label/text', splitByLength(cellText1,cellTextLength));
others_cells[2].attr('.label/text', splitByLength(cellText2,cellTextLength));
others_cells[3].attr('.label/text', splitByLength(cellText3,cellTextLength));
others_cells[4].attr('.label/text', splitByLength(cellText4,cellTextLength));
others_cells[5].attr('.label/text', splitByLength(cellText5,cellTextLength));
others_cells[6].attr('.label/text', splitByLength(cellText6,cellTextLength));
others_cells[7].attr('.label/text', splitByLength(cellText7,cellTextLength));



//教師カードの作成
teachercells[0] = new joint.shapes.devs.Model({
  type: 'devs.Model',
  position: {x: 10, y: 10},
  attrs: {
    '.body': {
      width: cardWidth,
      height: cardHeight,
    'stroke-width':1,
      stroke:'black'
    },
    '.label': {
      text: 'カード１',
      'y':40
    },
    '.element-node' : {
      'data-color': 'gray'
    },
    '.attribute1' : {
      text: '',
      'font-size':30,
      'fill':'',
      'human' : '',
      'state' : '',
      'updown' : ''
    },
    '.attribute2' : {
      text: '',
      'font-size':30,
      //card_hightの方が良い
      'y':170,
      'human':'',
      'state':'',
      'updown':''
    },
    '.attribute3' : {
      text: '',
      'font-size':30,
      'fill':'',
      'human' : '',
      'state' : '',
      'updown' : '',
      'dx' : 140,
    },
    '.attribute4' : {
      text: '',
      'font-size':30,
      'fill':'',
      'human' : '',
      'state' : '',
      'updown' : '',
      'dx' : 140,
      'y':170
    },
    '.attribute5' : {
      text: '',
      'font-size':30,
      'fill':'',
      'human' : '',
      'state' : '',
      'updown' : '',
      'dx' : 270,
    },
    '.attribute6' : {
      text: '',
      'font-size':30,
      'fill':'',
      'human' : '',
      'state' : '',
      'updown' : '',
      'dx' : 270,
      'y':170,
    },
  },
  inPorts: ['center'],
  });




  //教師用カードの複製
   teachercells[1] = teachercells[0].clone();
   teachercells[2] = teachercells[0].clone();
   teachercells[3] = teachercells[0].clone();
   teachercells[4] = teachercells[0].clone();
   teachercells[5] = teachercells[0].clone();
   teachercells[6] = teachercells[0].clone();
   teachercells[7] = teachercells[0].clone();
   teachercells[0].translate(250, 1000);
   teachercells[1].translate(250, 750);
   teachercells[2].translate(700, 750);
   teachercells[3].translate(850, 500);
   teachercells[4].translate(250,500);
   teachercells[5].translate(400, 250);
   teachercells[6].translate(400, 30);
   teachercells[7].translate(30, 30);
   teachercells[0].attr('.label/text', splitByLength(cellText0,cellTextLength));
   teachercells[1].attr('.label/text', splitByLength(cellText1,cellTextLength));
   teachercells[2].attr('.label/text', splitByLength(cellText2,cellTextLength));
   teachercells[3].attr('.label/text', splitByLength(cellText3,cellTextLength));
   teachercells[4].attr('.label/text', splitByLength(cellText4,cellTextLength));
   teachercells[5].attr('.label/text', splitByLength(cellText5,cellTextLength));
   teachercells[6].attr('.label/text', splitByLength(cellText6,cellTextLength));
   teachercells[7].attr('.label/text', splitByLength(cellText7,cellTextLength));


teachersource=[0,0,1,2,2,2,3,3,4,4,4,5,5,6];
teachertarget=[1,2,2,3,4,7,4,7,5,6,7,6,7,7];
for(var i=0;i<teachersource.length;i++){
   teacherlinks[i] = new joint.dia.Link({
        source: { id: teachersource[i].id },
        target: { id: teachertarget[i].id },
    connector: { name: 'rounded' },
    attrs: {
        '.connection': {
            stroke: '#333333',
            'stroke-width': 4
        },
        '.marker-target': {
            fill: '#333333',
            d: 'M 10 0 L 0 5 L 10 10 z'
        }
    },
   labels: [
        { position: 0.5, attrs: {  rect: { stroke: '#F2F5A9', 'stroke-width': 20, rx: 5, ry: 5 } }}]
    });
}
graph5.addCells(teacherlinks);


     //教師用カードの状態
   teachercells[0].attr('.attribute1/human',"天皇");
   teachercells[0].attr('.attribute1/state',"地位");
   teachercells[0].attr('.attribute1/updown',"下がった");


   //others_cells[i].attr('.attribute1/human',snapshot.val().cell_attribute_human[i]);

   teachercells[0].attr('.attribute3/human',"貴族");
   teachercells[0].attr('.attribute3/state',"地位");
   teachercells[0].attr('.attribute3/updown',"上がった");


  //cells[card_attribute_number].attr('.attribute5/human',card_attribute_human)

   teachercells[1].attr('.attribute2/human',"天皇");
   teachercells[1].attr('.attribute2/state',"地位");
   teachercells[1].attr('.attribute2/updown',"下がった");

   teachercells[1].attr('.attribute4/human',"貴族");
   teachercells[1].attr('.attribute4/state',"地位");
   teachercells[1].attr('.attribute4/updown',"上がった");


   teachercells[1].attr('.attribute1/human',"天皇") ;
   teachercells[1].attr('.attribute1/state',"地位") ;
   teachercells[1].attr('.attribute1/updown',"下がった");

   teachercells[1].attr('.attribute3/human',"貴族");
   teachercells[1].attr('.attribute3/state',"経済力");
   teachercells[1].attr('.attribute3/updown',"上がった");

   teachercells[2].attr('.attribute2/human',"貴族") ;
   teachercells[2].attr('.attribute2/state',"経済力") ;
   teachercells[2].attr('.attribute2/updown',"上がった");

   teachercells[2].attr('.attribute1/human',"貴族");
   teachercells[2].attr('.attribute1/state',"対立");
   teachercells[2].attr('.attribute1/updown',"増えた");

   teachercells[2].attr('.attribute3/human',"武士");
   teachercells[2].attr('.attribute3/state',"地位");
   teachercells[2].attr('.attribute3/updown',"上がった");

   teachercells[2].attr('.attribute5/human',"庶民");
   teachercells[2].attr('.attribute5/state',"生活");
   teachercells[2].attr('.attribute5/updown',"下がった");

   teachercells[3].attr('.attribute2/human',"貴族");
   teachercells[3].attr('.attribute2/state',"対立");
   teachercells[3].attr('.attribute2/updown',"増えた");

   teachercells[3].attr('.attribute1/human',"武士");
   teachercells[3].attr('.attribute1/state',"地位");
   teachercells[3].attr('.attribute1/updown',"上がった");

   teachercells[3].attr('.attribute3/human',"貴族");
   teachercells[3].attr('.attribute3/state',"対立");
   teachercells[3].attr('.attribute3/updown',"増えた");

   teachercells[3].attr('.attribute5/human',"庶民" );
   teachercells[3].attr('.attribute5/state',"生活");
   teachercells[3].attr('.attribute5/updown',"下がった");


   teachercells[4].attr('.attribute2/human',"貴族");
   teachercells[4].attr('.attribute2/state',"対立");
   teachercells[4].attr('.attribute2/updown',"増えた");

   teachercells[4].attr('.attribute1/human',"庶民");
   teachercells[4].attr('.attribute1/state',"生活");
   teachercells[4].attr('.attribute1/updown',"下がった");

   teachercells[4].attr('.attribute3/human',"平氏");
   teachercells[4].attr('.attribute3/state',"地位");
   teachercells[4].attr('.attribute3/updown',"上がった");



   teachercells[5].attr('.attribute2/human',"平氏");
   teachercells[5].attr('.attribute2/state',"地位");
   teachercells[5].attr('.attribute2/updown',"上がった");

   teachercells[5].attr('.attribute1/human',"源氏");
   teachercells[5].attr('.attribute1/state',"不満");
   teachercells[5].attr('.attribute1/updown',"上がった");

   teachercells[5].attr('.attribute3/human',"庶民" );
   teachercells[5].attr('.attribute3/state',"生活");
   teachercells[5].attr('.attribute3/updown',"下がった");


   teachercells[6].attr('.attribute2/human',"源氏");
   teachercells[6].attr('.attribute2/state',"不満");
   teachercells[6].attr('.attribute2/updown',"上がった");

   teachercells[6].attr('.attribute1/human',"平氏");
   teachercells[6].attr('.attribute1/state',"地位");
   teachercells[6].attr('.attribute1/updown',"下がった");

   teachercells[6].attr('.attribute3/human',"源氏");
   teachercells[6].attr('.attribute3/state',"不満");
   teachercells[6].attr('.attribute3/updown',"減った");

   teachercells[6].attr('.attribute5/human',"庶民" );
   teachercells[6].attr('.attribute5/state',"生活");
   teachercells[6].attr('.attribute5/updown',"下がった");

   teachercells[7].attr('.attribute2/human',"庶民");
   teachercells[7].attr('.attribute2/state',"生活");
   teachercells[7].attr('.attribute2/updown',"下がった");

   teachercells[7].attr('.attribute1/human',"庶民");
   teachercells[7].attr('.attribute1/state',"不満");
   teachercells[7].attr('.attribute1/updown',"減った");
graph5.clear();
   graph5.addCells(teachercells);



}
//以上がセルの初期化





//カードの状態変化を削除
function CardStateClear(){
    var can = cardstateclear.source.value;
    var attributnumber =cardstateclear.attribute.value;
      cells[can].attr('.attribute'+attributnumber+'/text','');
      cells[can].attr('.attribute'+attributnumber+'/fill','');
      cells[can].attr('.attribute'+attributnumber+'/human','');
      cells[can].attr('.attribute'+attributnumber+'/state','');
      cells[can].attr('.attribute'+attributnumber+'/updown','');
}





//カードの状態変化を確認
function CardStateView(){
    var can = cardstateclear.source.value;
    var attributnumber =cardstateclear.attribute.value;
if(cells[can].attr('.attribute'+attributnumber+'/human')==""){


  alert("カードの状態は設定されていません");


}else{
    alert("カード"+can+"の左上の状態("+cells[can].attr('.attribute'+attributnumber+'/human')+"の"+cells[can].attr('.attribute'+attributnumber+'/state')+"が"+cells[can].attr('.attribute'+attributnumber+'/updown')+")");
}
}




//上の属性変更　attribute1,3,5
function CardStateChange(){
  var card_attribute_number = CardState.source.value;
  var card_attribute_human = CardState.human.value;
  var card_attribute_state = CardState.state.value;
  var card_attribute_UpDown = CardState.UpDown.value;
  var attflag=0;

//すでに同じ状態が入っていたらカット
  if(
    (cells[card_attribute_number].attr('.attribute1/human')==card_attribute_human &&
    cells[card_attribute_number].attr('.attribute1/state')==card_attribute_state &&
    cells[card_attribute_number].attr('.attribute1/updown')==card_attribute_UpDown)
    ||
    (cells[card_attribute_number].attr('.attribute3/human')==card_attribute_human &&
    cells[card_attribute_number].attr('.attribute3/state')==card_attribute_state &&
    cells[card_attribute_number].attr('.attribute3/updown')==card_attribute_UpDown)
    ||
    (cells[card_attribute_number].attr('.attribute5/human')==card_attribute_human &&
    cells[card_attribute_number].attr('.attribute5/state')==card_attribute_state &&
    cells[card_attribute_number].attr('.attribute5/updown')==card_attribute_UpDown)
  ){
    alert('同じ状態がすでに設定されています。'+'\n'+'状態を一度確認してみましょう。');
  }
//もしattributeが空なら数字が少ない方から状態を代入
  else{
  if(cells[card_attribute_number].attr('.attribute1/human')==''){
  cells[card_attribute_number].attr('.attribute1/human',card_attribute_human);
  cells[card_attribute_number].attr('.attribute1/state',card_attribute_state);
  cells[card_attribute_number].attr('.attribute1/updown',card_attribute_UpDown);
  console.log(cells[card_attribute_number].attr('.attribute1/updown'));
attflag = 1;}
  else if (cells[card_attribute_number].attr('.attribute3/human')=='') {
    cells[card_attribute_number].attr('.attribute3/human',card_attribute_human);
    cells[card_attribute_number].attr('.attribute3/state',card_attribute_state);
    cells[card_attribute_number].attr('.attribute3/updown',card_attribute_UpDown);attflag = 3;
  }
  else{
    cells[card_attribute_number].attr('.attribute5/human',card_attribute_human);
    cells[card_attribute_number].attr('.attribute5/state',card_attribute_state);
    cells[card_attribute_number].attr('.attribute5/updown',card_attribute_UpDown);
    attflag = 5;
  }
  console.log(cells[card_attribute_number].attr('.attribute'+attflag+'/updown'));

//状態によって色を変更していく
  var flag = '0';
  switch (cells[card_attribute_number].attr('.attribute'+attflag+'/human')) {
    case '天皇':  flag = '20';
    break;
    case '貴族':  flag = '40';
    break;
    case '武士':  flag = '60';
    break;
    case '源氏':  flag = '80';
    break;
    case '平氏':  flag = 'a0';
    break;
    case '庶民':  flag = 'c0';
    break;
    case '農民':  flag = 'e0';
    break;
    default:  flag = '0';
  }
  switch (cells[card_attribute_number].attr('.attribute'+attflag+'/state')) {
    case '地位': flag += '20';
    break;
    case '力':   flag += '50';
    break;
    case '経済力': flag += '80';
    break;
    case '生活': flag += 'a0';
    break;
    case '対立':   flag += 'd0';
    break;
    case '不満': flag += 'f0';
    break;
    default: flag = '0';
  }
  switch (cells[card_attribute_number].attr('.attribute'+attflag+'/updown')) {
    case '上がった': flag += '20';
    break;
    case '下がった': flag += '50';
    break;
    case '増えた': flag += '80';
    break;
    case '減った': flag += 'a0';
    break;
    default: flag = '0';
  }
  console.log(flag);

    cells[card_attribute_number].attr('.attribute'+attflag+'/fill','#'+flag);cells[card_attribute_number].attr('.attribute'+attflag+'/text','■');



  console.log(cells[card_attribute_number].attr('.attribute'+attflag+'/fill'));
  console.log(cells[card_attribute_number].attr('.attribute'+attflag+'/text'));
  console.log(card_attribute_number);
  console.log(card_attribute_human);
  console.log(card_attribute_state);
  console.log(card_attribute_UpDown);
}
}
  //cells[card_attribute_number].attr('.attribute/text',card_attribute_human+"の"+card_attribute_state+"が"+card_attribute_UpDown);

//下の属性変更 attribute2,4,6
function CardStateChange2(){
  var card_attribute_number = CardState2.source.value;
  var card_attribute_human = CardState2.human.value;
  var card_attribute_state = CardState2.state.value;
  var card_attribute_UpDown = CardState2.UpDown.value;
  var attflag=0;
  if(
    (cells[card_attribute_number].attr('.attribute2/human')==card_attribute_human &&
    cells[card_attribute_number].attr('.attribute2/state')==card_attribute_state &&
    cells[card_attribute_number].attr('.attribute2/updown')==card_attribute_UpDown)
    ||
    (cells[card_attribute_number].attr('.attribute4/human')==card_attribute_human &&
    cells[card_attribute_number].attr('.attribute4/state')==card_attribute_state &&
    cells[card_attribute_number].attr('.attribute4/updown')==card_attribute_UpDown)
    ||
    (cells[card_attribute_number].attr('.attribute6/human')==card_attribute_human &&
    cells[card_attribute_number].attr('.attribute6/state')==card_attribute_state &&
    cells[card_attribute_number].attr('.attribute6/updown')==card_attribute_UpDown)
  ){
    alert('同じ状態がすでに設定されています。'+'\n'+'状態を一度確認してみましょう。');
  }else{
  if(cells[card_attribute_number].attr('.attribute2/human')==''){
  cells[card_attribute_number].attr('.attribute2/human',card_attribute_human);
  cells[card_attribute_number].attr('.attribute2/state',card_attribute_state);
  cells[card_attribute_number].attr('.attribute2/updown',card_attribute_UpDown);
  console.log(cells[card_attribute_number].attr('.attribute1/updown'));
attflag = 2;}
  else if (cells[card_attribute_number].attr('.attribute4/human')=='') {
    cells[card_attribute_number].attr('.attribute4/human',card_attribute_human);
    cells[card_attribute_number].attr('.attribute4/state',card_attribute_state);
    cells[card_attribute_number].attr('.attribute4/updown',card_attribute_UpDown);attflag = 4;
  }
  else{
    cells[card_attribute_number].attr('.attribute6/human',card_attribute_human);
    cells[card_attribute_number].attr('.attribute6/state',card_attribute_state);
    cells[card_attribute_number].attr('.attribute6/updown',card_attribute_UpDown);
    attflag = 6;
  }
  console.log(cells[card_attribute_number].attr('.attribute'+attflag+'/updown'));
  var flag = '0';
  switch (cells[card_attribute_number].attr('.attribute'+attflag+'/human')) {
    case '天皇':  flag = '20';
    break;
    case '貴族':  flag = '40';
    break;
    case '武士':  flag = '60';
    break;
    case '源氏':  flag = '80';
    break;
    case '平氏':  flag = 'a0';
    break;
    case '庶民':  flag = 'c0';
    break;
    case '農民':  flag = 'e0';
    break;
    default:  flag = '0';
  }
  switch (cells[card_attribute_number].attr('.attribute'+attflag+'/state')) {
    case '地位': flag += '20';
    break;
    case '力':   flag += '50';
    break;
    case '経済力': flag += '80';
    break;
    case '生活': flag += 'a0';
    break;
    case '対立':   flag += 'd0';
    break;
    case '不満': flag += 'f0';
    break;
    default: flag = '0';
  }
  switch (cells[card_attribute_number].attr('.attribute'+attflag+'/updown')) {
    case '上がった': flag += '20';
    break;
    case '下がった': flag += '50';
    break;
    case '増えた': flag += '80';
    break;
    case '減った': flag += 'a0';
    break;
    default: flag = '0';
  }
  console.log(flag);

      cells[card_attribute_number].attr('.attribute'+attflag+'/fill','#'+flag);cells[card_attribute_number].attr('.attribute'+attflag+'/text','■');


}
}



//カードの状態変化を確認
function CardStateView2(){
    var can = cardstateclear1.source2.value;
    var attributnumber =parseInt(cardstateclear1.attribute2.value);
    var text=[];
if((cells2[can].attr('.attribute'+attributnumber+'/human')=="")
&&
(others_cells[can].attr('.attribute'+attributnumber+'/human')=="")
){alert("状態が設定されていません。");}
else{
    if(attributnumber==1){
    if(cells2[can].attr('.attribute'+attributnumber+'/human')!=""){
      　text.push("自分のカード"+can+"のイベント後の状態");
        text.push(cells2[can].attr('.attribute'+attributnumber+'/human')+"の"+cells2[can].attr('.attribute'+attributnumber+'/state')+"が"+cells2[can].attr('.attribute'+attributnumber+'/updown'));
     if(cells2[can].attr('.attribute'+String(attributnumber+2)+'/human')!=""){
        text.push(cells2[can].attr('.attribute'+String(attributnumber+2)+'/human')+"の"+cells2[can].attr('.attribute'+String(attributnumber+2)+'/state')+"が"+cells2[can].attr('.attribute'+String(attributnumber+2)+'/updown'));
     if(cells2[can].attr('.attribute'+String(attributnumber+4)+'/human')!=""){
        text.push(cells2[can].attr('.attribute'+String(attributnumber+4)+'/human')+"の"+cells2[can].attr('.attribute'+String(attributnumber+4)+'/state')+"が"+cells2[can].attr('.attribute'+String(attributnumber+4)+'/updown'));
    }
    }
    }

    if(others_cells[can].attr('.attribute'+attributnumber+'/human')!=""){
    　text.push("");
      text.push("相手のカード"+can+"のイベント後の状態");
        text.push(others_cells[can].attr('.attribute'+attributnumber+'/human')+"の"+others_cells[can].attr('.attribute'+attributnumber+'/state')+"が"+others_cells[can].attr('.attribute'+attributnumber+'/updown'));
     if(others_cells[can].attr('.attribute'+String(attributnumber+2)+'/human')!=""){
        text.push(others_cells[can].attr('.attribute'+String(attributnumber+2)+'/human')+"の"+others_cells[can].attr('.attribute'+String(attributnumber+2)+'/state')+"が"+others_cells[can].attr('.attribute'+String(attributnumber+2)+'/updown'));
     if(others_cells[can].attr('.attribute'+String(attributnumber+4)+'/human')!=""){
        text.push(others_cells[can].attr('.attribute'+String(attributnumber+4)+'/human')+"の"+others_cells[can].attr('.attribute'+String(attributnumber+4)+'/state')+"が"+others_cells[can].attr('.attribute'+String(attributnumber+4)+'/updown'));
    }
    }
    }
alert(text.join('\n'));
    }


if(attributnumber==2){
if(cells2[can].attr('.attribute'+attributnumber+'/human')!=""){
  　text.push("自分のカード"+can+"のイベント前の状態");
    text.push(cells2[can].attr('.attribute'+attributnumber+'/human')+"の"+cells2[can].attr('.attribute'+attributnumber+'/state')+"が"+cells2[can].attr('.attribute'+attributnumber+'/updown'));
 if(cells2[can].attr('.attribute'+String(attributnumber+2)+'/human')!=""){
    text.push(cells2[can].attr('.attribute'+String(attributnumber+2)+'/human')+"の"+cells2[can].attr('.attribute'+String(attributnumber+2)+'/state')+"が"+cells2[can].attr('.attribute'+String(attributnumber+2)+'/updown'));
 if(cells2[can].attr('.attribute'+String(attributnumber+4)+'/human')!=""){
    text.push(cells2[can].attr('.attribute'+String(attributnumber+4)+'/human')+"の"+cells2[can].attr('.attribute'+String(attributnumber+4)+'/state')+"が"+cells2[can].attr('.attribute'+String(attributnumber+4)+'/updown'));
}
}
}

if(others_cells[can].attr('.attribute'+attributnumber+'/human')!=""){
　text.push("");
  text.push("相手のカード"+can+"のイベント前の状態");
    text.push(others_cells[can].attr('.attribute'+attributnumber+'/human')+"の"+others_cells[can].attr('.attribute'+attributnumber+'/state')+"が"+others_cells[can].attr('.attribute'+attributnumber+'/updown'));
 if(others_cells[can].attr('.attribute'+String(attributnumber+2)+'/human')!=""){
    text.push(others_cells[can].attr('.attribute'+String(attributnumber+2)+'/human')+"の"+others_cells[can].attr('.attribute'+String(attributnumber+2)+'/state')+"が"+others_cells[can].attr('.attribute'+String(attributnumber+2)+'/updown'));
 if(others_cells[can].attr('.attribute'+String(attributnumber+4)+'/human')!=""){
    text.push(others_cells[can].attr('.attribute'+String(attributnumber+4)+'/human')+"の"+others_cells[can].attr('.attribute'+String(attributnumber+4)+'/state')+"が"+others_cells[can].attr('.attribute'+String(attributnumber+4)+'/updown'));
}
}
}
alert(text.join('\n'));
}
}


}







//新規で矢印作成
function addLink(){
  //HTMLから理由をGET
  var source1 = input_sample.source.value;
  var reason  = input_sample.reason.value;
  var target1 = input_sample.target.value;
  var link_length = links.length;

  /*
  矢印を引くための条件分岐
  */
  if(source1 != target1){
  if(cells[source1].attr('.attribute1/human') != '' && cells[target1].attr('.attribute2/human') != ''){
  if(
      ((cells[source1].attr('.attribute1/human')  == cells[target1].attr('.attribute2/human'))
    &&  (cells[source1].attr('.attribute1/state')  == cells[target1].attr('.attribute2/state'))
    &&  (cells[source1].attr('.attribute1/updown') == cells[target1].attr('.attribute2/updown')))
    ||
      ((cells[source1].attr('.attribute1/human')  == cells[target1].attr('.attribute4/human'))
    &&  (cells[source1].attr('.attribute1/state')  == cells[target1].attr('.attribute4/state'))
    &&  (cells[source1].attr('.attribute1/updown') == cells[target1].attr('.attribute4/updown')))
    ||
        ((cells[source1].attr('.attribute1/human')  == cells[target1].attr('.attribute6/human'))
    &&  (cells[source1].attr('.attribute1/state')  == cells[target1].attr('.attribute6/state'))
    &&  (cells[source1].attr('.attribute1/updown') == cells[target1].attr('.attribute6/updown')))
  )
    {
 links[link_length] = new joint.dia.Link({
      source: { id: cells[source1].id },
      target: { id: cells[target1].id },
  connector: { name: 'rounded' },
  attrs: {
      '.connection': {
          stroke: '#333333',
          'stroke-width': 4
      },
      '.marker-target': {
          fill: '#333333',
          d: 'M 10 0 L 0 5 L 10 10 z'
      }
  },
 labels: [
      { position: 0.5, attrs: { text: { text: reason, fill: '#000000', 'font-family': 'sans-serif' }, rect: { stroke: '#F2F5A9', 'stroke-width': 20, rx: 5, ry: 5 } }}]
  });
  cell_link_source[link_length] = source1;
  cell_link_target[link_length] = target1;
  cell_link_reason[link_length] = reason;
  graph.addCells(links);
}else if ((cells[source1].attr('.attribute3/human') != '')&&
    ((cells[source1].attr('.attribute3/human')  == cells[target1].attr('.attribute2/human'))
  &&  (cells[source1].attr('.attribute3/state')  == cells[target1].attr('.attribute2/state'))
  &&  (cells[source1].attr('.attribute3/updown') == cells[target1].attr('.attribute2/updown')))
  ||
    ((cells[source1].attr('.attribute3/human')  == cells[target1].attr('.attribute4/human'))
  &&  (cells[source1].attr('.attribute3/state')  == cells[target1].attr('.attribute4/state'))
  &&  (cells[source1].attr('.attribute3/updown') == cells[target1].attr('.attribute4/updown')))
  ||
      ((cells[source1].attr('.attribute3/human')  == cells[target1].attr('.attribute6/human'))
  &&  (cells[source1].attr('.attribute3/state')  == cells[target1].attr('.attribute6/state'))
  &&  (cells[source1].attr('.attribute3/updown') == cells[target1].attr('.attribute6/updown')))
){
  links[link_length] = new joint.dia.Link({
     source: { id: cells[source1].id },
     target: { id: cells[target1].id },
 connector: { name: 'rounded' },
 attrs: {
     '.connection': {
         stroke: '#333333',
         'stroke-width': 4
     },
     '.marker-target': {
         fill: '#333333',
         d: 'M 10 0 L 0 5 L 10 10 z'
     }
 },
labels: [
     { position: 0.5, attrs: { text: { text: reason, fill: '#000000', 'font-family': 'sans-serif' }, rect: { stroke: '#F2F5A9', 'stroke-width': 20, rx: 5, ry: 5 } }}]
 });
 cell_link_source[link_length] = source1;
 cell_link_target[link_length] = target1;
 cell_link_reason[link_length] = reason;
 graph.addCells(links);

}else if ((cells[source1].attr('.attribute5/human') != '')&&
    ((cells[source1].attr('.attribute5/human')  == cells[target1].attr('.attribute2/human'))
  &&  (cells[source1].attr('.attribute5/state')  == cells[target1].attr('.attribute2/state'))
  &&  (cells[source1].attr('.attribute5/updown') == cells[target1].attr('.attribute2/updown')))
  ||
    ((cells[source1].attr('.attribute5/human')  == cells[target1].attr('.attribute4/human'))
  &&  (cells[source1].attr('.attribute5/state')  == cells[target1].attr('.attribute4/state'))
  &&  (cells[source1].attr('.attribute5/updown') == cells[target1].attr('.attribute4/updown')))
  ||
      ((cells[source1].attr('.attribute5/human')  == cells[target1].attr('.attribute6/human'))
  &&  (cells[source1].attr('.attribute5/state')  == cells[target1].attr('.attribute6/state'))
  &&  (cells[source1].attr('.attribute5/updown') == cells[target1].attr('.attribute6/updown')))
){
  links[link_length] = new joint.dia.Link({
       source: { id: cells[source1].id },
       target: { id: cells[target1].id },
   connector: { name: 'rounded' },
   attrs: {
       '.connection': {
           stroke: '#333333',
           'stroke-width': 4
       },
       '.marker-target': {
           fill: '#333333',
           d: 'M 10 0 L 0 5 L 10 10 z'
       }
   },
  labels: [
       { position: 0.5, attrs: { text: { text: reason, fill: '#000000', 'font-family': 'sans-serif' }, rect: { stroke: '#F2F5A9', 'stroke-width': 20, rx: 5, ry: 5 } }}]
   });
   cell_link_source[link_length] = source1;
   cell_link_target[link_length] = target1;
   cell_link_reason[link_length] = reason;
   graph.addCells(links);
}else{
  if( confirm("この状態で大丈夫ですか?\nカードに状態が一致していませんが本当に矢印を引きますか？") ) {
    links[link_length] = new joint.dia.Link({
         source: { id: cells[source1].id },
         target: { id: cells[target1].id },
     connector: { name: 'rounded' },
     attrs: {
         '.connection': {
             stroke: '#333333',
             'stroke-width': 4
         },
         '.marker-target': {
             fill: '#333333',
             d: 'M 10 0 L 0 5 L 10 10 z'
         }
     },
    labels: [
         { position: 0.5, attrs: { text: { text: reason, fill: '#000000', 'font-family': 'sans-serif' }, rect: { stroke: '#F2F5A9', 'stroke-width': 20, rx: 5, ry: 5 } }}]
     });
     cell_link_source[link_length] = source1;
     cell_link_target[link_length] = target1;
     cell_link_reason[link_length] = reason;
     graph.addCells(links);
  }
  else {
      alert("矢印作成を中止します。");
  }


}
//状態変化が一致してない時のアラート

}else{
    if( confirm("この状態で大丈夫ですか？\nカードの状態が一致していませんが本当に矢印を引きますか？") ) {
      links[link_length] = new joint.dia.Link({
           source: { id: cells[source1].id },
           target: { id: cells[target1].id },
       connector: { name: 'rounded' },
       attrs: {
           '.connection': {
               stroke: '#333333',
               'stroke-width': 4
           },
           '.marker-target': {
               fill: '#333333',
               d: 'M 10 0 L 0 5 L 10 10 z'
           }
       },
      labels: [
           { position: 0.5, attrs: { text: { text: reason, fill: '#000000', 'font-family': 'sans-serif' }, rect: { stroke: '#F2F5A9', 'stroke-width': 20, rx: 5, ry: 5 } }}]
       });
       cell_link_source[link_length] = source1;
       cell_link_target[link_length] = target1;
       cell_link_reason[link_length] = reason;
       graph.addCells(links);
    }
    else {
        alert("矢印作成を中止します。");
    }

  }
}else{
  alert('同じカードを選択しています。'+'\n'+'カードの数字を一度確認してみましょう。')
}
}









//矢印を削除した時にトリガー,リストから矢印を削除
graph.on('remove',function(cell,collection,opt){
  if(cell.isLink()){
    var number = links.indexOf(cell);
    links.splice(number,1);
    cell_link_reason.splice(number,1);
    cell_link_source.splice(number,1);
    cell_link_target.splice(number,1);
  }
})

//firebaseに送信用メソッド
 function send(){

   var userRef = new Firebase("https://myfirstfirebase-cab79.firebaseio.com/"+classnumber+"/"+user);
   var cell_number = [];
   var cell_position_x = [];
   var cell_position_y = [];
   var cell_color =[];
   var cell_attribute_human3=[];
   var cell_attribute_human4=[];
   var cell_attribute_human5=[];
   var cell_attribute_human6=[];
   var cell_attribute_state3=[];
   var cell_attribute_state4=[];
   var cell_attribute_state5=[];
   var cell_attribute_state6=[];
   var cell_attribute_updown3=[];
   var cell_attribute_updown4=[];
   var cell_attribute_updown5=[];
   var cell_attribute_updown6=[];

   if(user){
     //user is signed in.
     for(var i = 0; i < 8; i++){
       cell_number.push(i);
       cell_position_x.push(cells[i].get('position').x);
       cell_position_y.push(cells[i].get('position').y);
       cell_color.push(cells[i].attr('.element-node/data-color'));
       cell_attribute_human.push(cells[i].attr('.attribute1/human'));
       cell_attribute_state.push(cells[i].attr('.attribute1/state'));
       cell_attribute_updown.push(cells[i].attr('.attribute1/updown'));
       cell_attribute_human2.push(cells[i].attr('.attribute2/human'));
       cell_attribute_state2.push(cells[i].attr('.attribute2/state'));
       cell_attribute_updown2.push(cells[i].attr('.attribute2/updown'));
       cell_attribute_human3.push(cells[i].attr('.attribute3/human'));
       cell_attribute_state3.push(cells[i].attr('.attribute3/state'));
       cell_attribute_updown3.push(cells[i].attr('.attribute3/updown'));
       cell_attribute_human4.push(cells[i].attr('.attribute4/human'));
       cell_attribute_state4.push(cells[i].attr('.attribute4/state'));
       cell_attribute_updown4.push(cells[i].attr('.attribute4/updown'));
       cell_attribute_human5.push(cells[i].attr('.attribute5/human'));
       cell_attribute_state5.push(cells[i].attr('.attribute5/state'));
       cell_attribute_updown5.push(cells[i].attr('.attribute5/updown'));
       cell_attribute_human6.push(cells[i].attr('.attribute6/human'));
       cell_attribute_state6.push(cells[i].attr('.attribute6/state'));
       cell_attribute_updown6.push(cells[i].attr('.attribute6/updown'));
     }

     userRef.set(
       {
         user_name : user,
         classnumber : classnumber,
         cell_number   : cell_number,
         cell_position_x : cell_position_x,
         cell_position_y : cell_position_y,
         cell_link_source : cell_link_source,
         cell_link_target : cell_link_target,
         cell_link_reason : cell_link_reason,
         cell_color : cell_color,
         cell_attribute_human : cell_attribute_human,
         cell_attribute_state : cell_attribute_state,
         cell_attribute_updown : cell_attribute_updown,
         cell_attribute_human2 : cell_attribute_human2,
         cell_attribute_state2 : cell_attribute_state2,
         cell_attribute_updown2 : cell_attribute_updown2,
         cell_attribute_human3 : cell_attribute_human3,
         cell_attribute_state3 : cell_attribute_state3,
         cell_attribute_updown3 : cell_attribute_updown3,
         cell_attribute_human4 : cell_attribute_human4,
         cell_attribute_state4 : cell_attribute_state4,
         cell_attribute_updown4 : cell_attribute_updown4,
         cell_attribute_human5 : cell_attribute_human5,
         cell_attribute_state5 : cell_attribute_state5,
         cell_attribute_updown5 : cell_attribute_updown5,
         cell_attribute_human6 : cell_attribute_human6,
         cell_attribute_state6 : cell_attribute_state6,
         cell_attribute_updown6 : cell_attribute_updown6
       }
     );alert('自身のデータを送信しました.'+'\n'+'個人内省画面に移動しましょう');
   }else{
     //no user is singed in.
     alert("ログインしていません");
   }
 }

 //セルの位置情報のgetter
  function get(){
    var user_name = document.getElementById('user_name').value;
    if(user_name){

 var ref = new Firebase("https://myfirstfirebase-cab79.firebaseio.com/"+classnumber+"/"+user_name);
      /*
      ---------------ref.on('value',function(snapshot){});について------------------------------------
      特定のDBパスにあるコンテンツの静的なsnapshotを読み取り、実行イベントの際に読み込まれる。
      データの更新があると、その度に再トリガーされる。
      https://firebase.google.com/docs/database/admin/retrieve-data?hl=ja
      ------------------------------------------------------------------------------------------------
      */
    ref.on("value",function(snapshot){
      //console.log(snapshot.val().user_name + ":" + snapshot.val().cell_position_y + ":" + others_cells[snapshot.val().cell_link_source[0]].id + ":" + snapshot.val().cell_link_source.length);
      //graph内のセルを初期かする
      graph2.clear();
      graph4.clear();
      others_links.length=0;
      others_link_source.length=0;
      others_link_target.length=0;
      others_link_reason.length=0;
      for(var i=0;i<8;i++){
        var attflag = 0;
      others_cells[i].position(snapshot.val().cell_position_x[i],snapshot.val().cell_position_y[i]);
      others_cells[i].attr('.element-node/data-color',snapshot.val().cell_color[i]);
      others_cells[i].attr('.attribute1/human',snapshot.val().cell_attribute_human[i]);
      others_cells[i].attr('.attribute1/state',snapshot.val().cell_attribute_state[i]);
      others_cells[i].attr('.attribute1/updown',snapshot.val().cell_attribute_updown[i]);
      others_cells[i].attr('.attribute2/human',snapshot.val().cell_attribute_human2[i]);
      others_cells[i].attr('.attribute2/state',snapshot.val().cell_attribute_state2[i]);
      others_cells[i].attr('.attribute2/updown',snapshot.val().cell_attribute_updown2[i]);
      others_cells[i].attr('.attribute3/human',snapshot.val().cell_attribute_human3[i]);
      others_cells[i].attr('.attribute3/state',snapshot.val().cell_attribute_state3[i]);
      others_cells[i].attr('.attribute3/updown',snapshot.val().cell_attribute_updown3[i]);
      others_cells[i].attr('.attribute4/human',snapshot.val().cell_attribute_human4[i]);
      others_cells[i].attr('.attribute4/state',snapshot.val().cell_attribute_state4[i]);
      others_cells[i].attr('.attribute4/updown',snapshot.val().cell_attribute_updown4[i]);
      others_cells[i].attr('.attribute5/human',snapshot.val().cell_attribute_human5[i]);
      others_cells[i].attr('.attribute5/state',snapshot.val().cell_attribute_state5[i]);
      others_cells[i].attr('.attribute5/updown',snapshot.val().cell_attribute_updown5[i]);
      others_cells[i].attr('.attribute6/human',snapshot.val().cell_attribute_human6[i]);
      others_cells[i].attr('.attribute6/state',snapshot.val().cell_attribute_state6[i]);
      others_cells[i].attr('.attribute6/updown',snapshot.val().cell_attribute_updown6[i]);


      for(j=0;j<=6;j++){
      var flag = '0';
      if ((others_cells[i].attr('.attribute'+j+'/human'))!= ''){
      switch (others_cells[i].attr('.attribute'+j+'/human')) {
        case '天皇':  flag = '20';
        break;
        case '貴族':  flag = '40';
        break;
        case '武士':  flag = '60';
        break;
        case '源氏':  flag = '80';
        break;
        case '平氏':  flag = 'a0';
        break;
        case '庶民':  flag = 'c0';
        break;
        case '農民':  flag = 'e0';
        break;
        default:  flag = '0';
      }
      switch (others_cells[i].attr('.attribute'+j+'/state')) {
        case '地位': flag += '20';
        break;
        case '力':   flag += '50';
        break;
        case '経済力': flag += '80';
        break;
        case '生活': flag += 'a0';
        break;
        case '対立':   flag += 'd0';
        break;
        case '不満': flag += 'f0';
        break;
        default: flag = '0';
      }
      switch (others_cells[i].attr('.attribute'+j+'/updown')) {
        case '上がった': flag += '20';
        break;
        case '下がった': flag += '50';
        break;
        case '増えた': flag += '80';
        break;
        case '減った': flag += 'a0';
        break;
        default: flag = '0';
      }

 others_cells[i].attr('.attribute'+j+'/fill','#'+flag);others_cells[i].attr('.attribute'+j+'/text','■');

 }

    }
  }
    graph4.addCells(others_cells);

    /*
    矢印の処理
    */
    if(snapshot.val().cell_link_source != null){
    for(var i = 0 ; i < snapshot.val().cell_link_source.length ; i++){
      others_link_source[i]=snapshot.val().cell_link_source[i];
      others_link_target[i]=snapshot.val().cell_link_target[i];
      others_link_reason[i]=snapshot.val().cell_link_reason[i];
    others_links[i] = new joint.dia.Link({
         source: { id: others_cells[snapshot.val().cell_link_source[i]].id },
         target: { id: others_cells[snapshot.val().cell_link_target[i]].id },
     connector: { name: 'rounded' },
     attrs: {
         '.connection': {
             stroke: '#333333',
             'stroke-width': 3
         },
         '.marker-target': {
             fill: '#333333',
             d: 'M 10 0 L 0 5 L 10 10 z'
         }
     },
    labels: [
         { position: 0.5, attrs: { text: { text: snapshot.val().cell_link_reason[i], fill: '#000000', 'font-family': 'sans-serif' }, rect: { stroke: '#F2F5A9', 'stroke-width': 20, rx: 5, ry: 5 } }}]
     });}
   graph4.addCells(others_links);}
   });
 }
 }




 var messege2=[];
 var messege3 = [];
 outputmssg2 = [];
  var user_name=[];
 //セルの位置情報のgetter
   function get2(){

    // var user_name=[];本来の場所
     var classnumber2=[];
     var cell_number=[];
     var cell_position_x=[];
     var cell_position_y=[];
     var cell_link_source=[];
     var cell_link_target=[];
     var cell_link_reason=[];
     var cell_color=[];
     var cell_attribute_human=[];
     var cell_attribute_state=[];
     var cell_attribute_updown=[];
     var cell_attribute_human2=[];
     var cell_attribute_state2=[];
     var cell_attribute_updown2=[];
     var cell_attribute_human3=[];
     var cell_attribute_state3=[];
     var cell_attribute_updown3=[];
     var cell_attribute_human4=[];
     var cell_attribute_state4=[];
     var cell_attribute_updown4=[];
     var cell_attribute_human5=[];
     var cell_attribute_state5=[];
     var cell_attribute_updown5=[];
     var cell_attribute_human6=[];
     var cell_attribute_state6=[];
     var cell_attribute_updown6=[];


       /*
       ---------------ref.on('value',function(snapshot){});について------------------------------------
       特定のDBパスにあるコンテンツの静的なsnapshotを読み取り、実行イベントの際に読み込まれる。
       データの更新があると、その度に再トリガーされる。
       https://firebase.google.com/docs/database/admin/retrieve-data?hl=ja
       ------------------------------------------------------------------------------------------------
       */


       var ref = new Firebase("https://myfirstfirebase-cab79.firebaseio.com/"+classnumber);
       var ff=[];
     ref.on("value",function(snapshot){
     console.log(snapshot.child(user).numChildren()+"人");
     var aaaaaa = JSON.stringify(snapshot.val());
     //console.log(aaaaaa);
     var testJSON = JSON.parse(aaaaaa);
     //console.log(classnumber);
     JSON.parse(aaaaaa,function(key,value){



if(key==='user_name'){
user_name.push(value);
}
     });

console.log(user_name);
console.log(user_name.length);

for(i=0;i<user_name.length;i++){
  if(testJSON[user_name[i]]["cell_link_target"]!=null){
  cell_link_target.push(testJSON[user_name[i]]["cell_link_target"]);
}
  if(testJSON[user_name[i]]["cell_link_source"]!=null){
  cell_link_source.push(testJSON[user_name[i]]["cell_link_source"]);
}
if(testJSON[user_name[i]]["cell_attribute_human"]!=null)
  cell_attribute_human.push(testJSON[user_name[i]]["cell_attribute_human"]);console.log(testJSON[user_name[i]]["cell_attribute_human"]);
  if(testJSON[user_name[i]]["cell_attribute_human2"]!=null)
  cell_attribute_human2.push(testJSON[user_name[i]]["cell_attribute_human2"]);
  if(testJSON[user_name[i]]["cell_attribute_human3"]!=null)
  cell_attribute_human3.push(testJSON[user_name[i]]["cell_attribute_human3"]);
  if(testJSON[user_name[i]]["cell_attribute_human4"]!=null)
  cell_attribute_human4.push(testJSON[user_name[i]]["cell_attribute_human4"]);
  if(testJSON[user_name[i]]["cell_attribute_human5"]!=null)
  cell_attribute_human5.push(testJSON[user_name[i]]["cell_attribute_human5"]);
  if(testJSON[user_name[i]]["cell_attribute_human6"]!=null)
  cell_attribute_human6.push(testJSON[user_name[i]]["cell_attribute_human6"]);
  if(testJSON[user_name[i]]["cell_attribute_state"]!=null)
  cell_attribute_state.push(testJSON[user_name[i]]["cell_attribute_state"]);
  if(testJSON[user_name[i]]["cell_attribute_state2"]!=null)
  cell_attribute_state2.push(testJSON[user_name[i]]["cell_attribute_state2"]);
  if(testJSON[user_name[i]]["cell_attribute_state3"]!=null)
  cell_attribute_state3.push(testJSON[user_name[i]]["cell_attribute_state3"]);
  if(testJSON[user_name[i]]["cell_attribute_state4"]!=null)
  cell_attribute_state4.push(testJSON[user_name[i]]["cell_attribute_state4"]);
  if(testJSON[user_name[i]]["cell_attribute_state5"]!=null)
  cell_attribute_state5.push(testJSON[user_name[i]]["cell_attribute_state5"]);
  if(testJSON[user_name[i]]["cell_attribute_state6"]!=null)
  cell_attribute_state6.push(testJSON[user_name[i]]["cell_attribute_state6"]);
  if(testJSON[user_name[i]]["cell_attribute_updown"]!=null)
  cell_attribute_updown.push(testJSON[user_name[i]]["cell_attribute_updown"]);
  if(testJSON[user_name[i]]["cell_attribute_updown2"]!=null)
  cell_attribute_updown2.push(testJSON[user_name[i]]["cell_attribute_updown2"]);
  if(testJSON[user_name[i]]["cell_attribute_updown3"]!=null)
  cell_attribute_updown3.push(testJSON[user_name[i]]["cell_attribute_updown3"]);
  if(testJSON[user_name[i]]["cell_attribute_updown4"]!=null)
  cell_attribute_updown4.push(testJSON[user_name[i]]["cell_attribute_updown4"]);
  if(testJSON[user_name[i]]["cell_attribute_updown5"]!=null)
  cell_attribute_updown5.push(testJSON[user_name[i]]["cell_attribute_updown5"]);
  if(testJSON[user_name[i]]["cell_attribute_updown6"]!=null)
  cell_attribute_updown6.push(testJSON[user_name[i]]["cell_attribute_updown6"]);
}

/*console.log(cell_link_source[1][0]);
console.log(cell_link_target[1][0]);*/
console.log(cell_attribute_human+"cell_attribute_human");
//console.log(cell_attribute_updown);

var stack = [];
var stack2 = [];
var stack3 =[];
const b = cell_attribute_human[0].length;
console.log(b);
for(var i = 0;i < cell_attribute_human.length;i++){
  for(var j = 0;j < cell_attribute_human[i].length;j++){
    if(cell_attribute_human[i][j]!=""){
      stack.push(j+":"+cell_attribute_human[i][j]);
      stack2.push(j+":"+cell_attribute_state[i][j]);
      stack3.push(j+":"+cell_attribute_updown[i][j]);
    }
  }
}
console.log(stack);
for(var i = 0;i < cell_attribute_human3.length;i++){
  for(var j = 0;j < cell_attribute_human3[i].length;j++){
    if(cell_attribute_human3[i][j]!=""){
      stack.push(j+":"+cell_attribute_human3[i][j]);
      stack2.push(j+":"+cell_attribute_state3[i][j]);
      stack3.push(j+":"+cell_attribute_updown3[i][j]);
    }
  }
}
for(var i = 0;i < cell_attribute_human5.length;i++){
  for(var j = 0;j < cell_attribute_human5[i].length;j++){
    if(cell_attribute_human5[i][j]!=""){
      stack.push(j+":"+cell_attribute_human5[i][j]);
      stack2.push(j+":"+cell_attribute_state5[i][j]);
      stack3.push(j+":"+cell_attribute_updown5[i][j]);
    }
  }
}

console.log(stack);
console.log(stack2);
console.log(stack3);

var count = 1;
var messege = [];
var outputmssg = [];
for(var i = 0;i < stack.length ; i++){
  for(var j = 0;j < stack.length ; j++){
    if(i!=j && stack[i]==stack[j] && stack2[i]==stack2[j] && stack3[i]==stack3[j]){
      count++;
    }
  }
  if(!messege.some(function(value){return value === stack[i]+stack2[i]+stack3[i]})){
    messege.push(stack[i]+stack2[i]+stack3[i]);
    outputmssg.push(stack[i]+"の"+stack2[i].split(":")[1]+"が"+stack3[i].split(":")[1]+":"+(count*100)/user_name.length+"%");
    /*var c = stack[i].split(":")[0];
    console.log(c);
    if(c<8){
    teachercells[c].attr('.attribute'+c+'/text',
    stack[i].split(":")[1]+"の"+stack2[i].split(":")[1]+"が"+stack3[i].split(":")[1]+":"+(count*100)/user_name.length+"%");
  }*/
  }
  count = 1;
}
console.log(outputmssg);
//teachercells[1].attr('.attribute1/text',outputmssg);


var stack4 = [];
var stack5 = [];
var stack6 =[];
for(var i = 0;i < cell_attribute_human2.length;i++){
  for(var j = 0;j < cell_attribute_human2[i].length;j++){
    if(cell_attribute_human2[i][j]!=""){
      stack4.push(j+":"+cell_attribute_human2[i][j]);
      stack5.push(j+":"+cell_attribute_state2[i][j]);
      stack6.push(j+":"+cell_attribute_updown2[i][j]);
    }
  }
}
for(var i = 0;i < cell_attribute_human4.length;i++){
  for(var j = 0;j < cell_attribute_human4[i].length;j++){
    if(cell_attribute_human4[i][j]!=""){
      stack4.push(j+":"+cell_attribute_human4[i][j]);
      stack5.push(j+":"+cell_attribute_state4[i][j]);
      stack6.push(j+":"+cell_attribute_updown4[i][j]);
    }
  }
}
for(var i = 0;i < cell_attribute_human6.length;i++){
  for(var j = 0;j < cell_attribute_human6[i].length;j++){
    if(cell_attribute_human6[i][j]!=""){
      stack4.push(j+":"+cell_attribute_human6[i][j]);
      stack5.push(j+":"+cell_attribute_state6[i][j]);
      stack6.push(j+":"+cell_attribute_updown6[i][j]);
    }
  }
}

console.log(stack4);
console.log(stack5);
console.log(stack6);

count = 1;
messege = [];

for(var i = 0;i < stack4.length ; i++){
  for(var j = 0;j < stack4.length ; j++){
    if(i!=j && stack4[i]==stack4[j] && stack5[i]==stack5[j] && stack6[i]==stack6[j]){
      count++;
    }
  }
  if(!messege.some(function(value){return value === stack4[i]+stack5[i]+stack6[i]})){
    messege.push(stack4[i]+stack5[i]+stack6[i]);
    outputmssg2.push(stack4[i]+"の"+stack5[i].split(":")[1]+"が"+stack6[i].split(":")[1]+":"+Math.round((count*100)/user_name.length)+"%");
  }
  count = 1;
}
console.log(typeof((count*100)/user_name.length));
console.log(outputmssg2);

count =1;
var jj=[];
for(var j = 0;j<cell_link_source.length;j++){
  for(var k=0;k<cell_link_source[j].length;k++){
    jj.push(cell_link_source[j][k]+cell_link_target[j][k]);
  }
}

count = 1;

for(var i = 0;i<jj.length;i++){
  for (var j = 0;j<jj.length;j++){
    if(i!=j && jj[i]==jj[j]){
      count++;
    }
  }
    if(!messege2.some(function(value){return value === jj[i]})){
      messege2.push(jj[i]);
      messege3.push(jj[i]+":"+count);
    }
  count = 1;
}
graph5.clear();
graph5.addCells(teachercells);
var forteacherlinks=[];
var Threshold = cardstateclear10.source5.value;

//var UporDown =cardstateclear4.attribute5.value;
for(var i =0;i<messege3.length;i++){
var wid = messege3[i].split(":")[1];
if(wid>=Threshold){


forteacherlinks[i] = new joint.dia.Link({
     source: { id: teachercells[messege3[i][0]].id },
     target: { id: teachercells[messege3[i][1]].id },
 connector: { name: 'rounded' },
 attrs: {
     '.connection': {
         stroke: '#333333',
         'stroke-width': wid
     },
     '.marker-target': {
         fill: '#333333',
         d: 'M 10 0 L 0 5 L 10 10 z'
     }
 },
labels: [
     { position: 0.5, attrs: { text: { text: wid+"人"+"("+Math.round((wid*100)/user_name.length)+"%)", fill: '#000000', 'font-family': 'sans-serif' }, rect: { stroke: '#F2F5A9', 'stroke-width': 20, rx: 5, ry: 5 } }}]

   })
}

 }
   console.log(messege3);
   graph5.addCells(forteacherlinks);
})
}

/*
//カードの状態変化を確認
function ShowStatuesPercent(){
    var can = cardstateclear3.source3.value;
    var attributnumber =cardstateclear3.attribute3.value;
$(function(){
var resultArray = jQuery.grep(outputmssg2, function(aData){
if (aData.indexOf("天皇") > -1) return true; else return false;
});
alert(resultArray);
});

}
*/

//カードの状態変化を確認
function ShowLinkPercent(){
    var sourceX = cardstateclear4.source4.value;
    var targetX =cardstateclear4.target4.value;
    var rightSum=0;
/*
   var labels=["M", "T", "W", "T", "F", "S", "S"];
   var backcolors=[       "#2ecc71",
          "#3498db",
          "#95a5a6",
          "#9b59b6",
          "#f1c40f",
          "#e74c3c",
          "#34495e"];
   var dataX=[12, 19, 3, 17, 28, 24, 7];
*/
var labels=[];
var backcolors=[];
var dataX=[];



    for(var i =0;i<messege3.length;i++){
    var wid = messege3[i].split(":")[1];
//teachercells[messege3[i][0]]
//teachercells[messege3[i][1]]
if(sourceX==messege3[i][0]&&targetX==messege3[i][1]){
  rightSum=wid;
}

labels.push(messege3[i][0]+"から"+messege3[i][1]+"への結線");

var randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
backcolors.push(randomColor);
dataX.push(wid);

}
console.log(rightSum);
console.log(user_name.length);
console.log(typeof(Math.round((rightSum*10)/user_name.length)));
console.log((rightSum*10)/user_name.length);
alert(Math.round((rightSum*100)/user_name.length)+"%の人がここに線を引いています。");




var ctx = document.getElementById("myChart").getContext('2d');


var myChart = new Chart(ctx, {
  type: 'bar',
  scales: {                          //軸設定
                  yAxes: [{                      //y軸設定
                      display: true,             //表示設定
                      scaleLabel: {              //軸ラベル設定
                         display: true,          //表示設定
                         labelString: '縦軸ラベル',  //ラベル
                         fontSize: 18               //フォントサイズ
                      },
                      ticks: {                      //最大値最小値設定
                          min: 0,                   //最小値
                          max: 30,                  //最大値
                          fontSize: 18,             //フォントサイズ
                          stepSize: 5               //軸間隔
                      },
                  }],
},

  data: {
    labels: labels,
    datasets: [{
      label: '引いた結線の人数',
      data: dataX,
      backgroundColor: "rgba(255,153,0,1)",
    },






  ]
  }
});

}


$(function(){

//モーダルウィンドウを出現させるクリックイベント
$("#modal-open").click( function(){

	//キーボード操作などにより、オーバーレイが多重起動するのを防止する
	$( this ).blur() ;	//ボタンからフォーカスを外す
	if( $( "#modal-overlay" )[0] ) return false ;		//新しくモーダルウィンドウを起動しない (防止策1)
	//if($("#modal-overlay")[0]) $("#modal-overlay").remove() ;		//現在のモーダルウィンドウを削除して新しく起動する (防止策2)

	//オーバーレイを出現させる
	$( "body" ).append( '<div id="modal-overlay"></div>' ) ;
	$( "#modal-overlay" ).fadeIn( "slow" ) ;

	//コンテンツをセンタリングする
	centeringModalSyncer() ;

	//コンテンツをフェードインする
	$( "#modal-content" ).fadeIn( "slow" ) ;

	//[#modal-overlay]、または[#modal-close]をクリックしたら…
	$( "#modal-overlay,#modal-close" ).unbind().click( function(){

		//[#modal-content]と[#modal-overlay]をフェードアウトした後に…
		$( "#modal-content,#modal-overlay" ).fadeOut( "slow" , function(){

			//[#modal-overlay]を削除する
			$('#modal-overlay').remove() ;

		} ) ;

	} ) ;

} ) ;

//リサイズされたら、センタリングをする関数[centeringModalSyncer()]を実行する
$( window ).resize( centeringModalSyncer ) ;

	//センタリングを実行する関数
	function centeringModalSyncer() {

		//画面(ウィンドウ)の幅、高さを取得
		var w = $( window ).width() ;
		var h = $( window ).height() ;

		// コンテンツ(#modal-content)の幅、高さを取得
		// jQueryのバージョンによっては、引数[{margin:true}]を指定した時、不具合を起こします。
//		var cw = $( "#modal-content" ).outerWidth( {margin:true} );
//		var ch = $( "#modal-content" ).outerHeight( {margin:true} );
		var cw = $( "#modal-content" ).outerWidth();
		var ch = $( "#modal-content" ).outerHeight();

		//センタリングを実行する
		$( "#modal-content" ).css( {"left": ((w - cw)/2) + "px","top": ((h - ch)/2) + "px"} ) ;

	}

} ) ;


//指定したカード番号以外のopacityを下げる
function pickup2(){
    var cardnumber = pickup.cardnumber.value;
    if(pickup.cardnumber.value!="解除"){

    for(i=0;i<cells2.length;i++){
        cells2[i].attr('.body/opacity',1);
        cells3[i].attr('.body/opacity',1);
    }
    for(i=0;i<cells2.length;i++){
      if(i!=cardnumber){
        cells2[i].attr('.body/opacity',0.2);
        cells3[i].attr('.body/opacity',0.2);
      }
      }
    }else{
      for(i=0;i<cells2.length;i++){
          cells2[i].attr('.body/opacity',1);
          cells3[i].attr('.body/opacity',1);
      }
    }
}

//配列の差分をとる関数の作成 differencesLinksで使用
function diffArray(arr1, arr2) {
  var newArr = [];
  for(var a = 0 ; a < arr1.length; a++){
    if(arr2.indexOf(arr1[a]) === -1 ){
      newArr.push(arr1[a]);
    }
  }
  for(var b = 0; b < arr2.length; b++){
    if(arr1.indexOf(arr2[b]) === -1 ){
       newArr.push(arr2[b]);
       }
  }
  return newArr;
}


var mydiffereceLinkArray=[];
var otherdiffereceLinkArray=[];
var differeceLinksArray=[];
//矢印が違うものを取り出したい
function differencesLinks(){
  for(i=0;i<links.length;i++){
    mydiffereceLinkArray.push("カード"+cell_link_source[i]+"からカード"+cell_link_target[i]+"への矢印は一致してない");
  }
    for(j=0;j<others_links.length;j++){
      otherdiffereceLinkArray.push("カード"+others_link_source[j]+"からカード"+others_link_target[j]+"への矢印は一致してない");
}

      //データを合計する
var  alldiffereceLinkArray=mydiffereceLinkArray.concat(otherdiffereceLinkArray);
  //重複しているものを検出
  // 重複を検出したものを重複しないでリスト
  var duplication = alldiffereceLinkArray.filter(function (x, i, self) {
              return self.indexOf(x) === i && i !== self.lastIndexOf(x);
          });


differeceLinksArray=diffArray(alldiffereceLinkArray, duplication);





/*
    // 重複を削除したリスト
var differeceLinkArrayNew = differeceLinkArray.filter(function (x, i, self) {
            return self.indexOf(x) === i;
        });
        var b = differeceLinkArrayNew.join("\n");
       alert(b);
*/
  }



var mydiffereceStatuesArray=[];
var ohterdiffereceStatuesArray=[];
//状態変化が違うものを取り出す
  function differences(){

  //自分の状態を見て違うところ
    //上部が状態変化が一致しているものがあるか判定
    for(i=0;i<cells2.length;i++){
      for(j=1;j<=6;j++){
          if(j%2==1){
            k=1;
          }else{
            k=2;
          }

      if (cells2[i].attr('.attribute'+j+'/human') != ''){
          if(!(
          ((cells2[i].attr('.attribute'+j+'/human')  == cells3[i].attr('.attribute'+k+'/human'))
       &&  (cells2[i].attr('.attribute'+j+'/state')  == cells3[i].attr('.attribute'+k+'/state'))
       &&  (cells2[i].attr('.attribute'+j+'/updown') == cells3[i].attr('.attribute'+k+'/updown')))
       ||
          ((cells2[i].attr('.attribute'+j+'/human')  == cells3[i].attr('.attribute'+k+2+'/human'))
       &&  (cells2[i].attr('.attribute'+j+'/state')  == cells3[i].attr('.attribute'+k+2+'/state'))
       &&  (cells2[i].attr('.attribute'+j+'/updown') == cells3[i].attr('.attribute'+k+2+'/updown')))
       ||
          ((cells2[i].attr('.attribute'+j+'/human')  == cells3[i].attr('.attribute'+k+4+'/human'))
       &&  (cells2[i].attr('.attribute'+j+'/state')  == cells3[i].attr('.attribute'+k+4+'/state'))
       &&  (cells2[i].attr('.attribute'+j+'/updown') == cells3[i].attr('.attribute'+k+4+'/updown')))
)){

switch(j){



  case 1:mydiffereceStatuesArray.push("カード"+i+"の左上の状態("+cells2[i].attr('.attribute'+j+'/human')+"の"+cells2[i].attr('.attribute'+j+'/state')+"が"+cells2[i].attr('.attribute'+j+'/updown')+")");
  break;
  case 2:mydiffereceStatuesArray.push("カード"+i+"の左下の状態("+cells2[i].attr('.attribute'+j+'/human')+"の"+cells2[i].attr('.attribute'+j+'/state')+"が"+cells2[i].attr('.attribute'+j+'/updown')+")");
  break;
  case 3:mydiffereceStatuesArray.push("カード"+i+"の真上の状態("+cells2[i].attr('.attribute'+j+'/human')+"の"+cells2[i].attr('.attribute'+j+'/state')+"が"+cells2[i].attr('.attribute'+j+'/updown')+")");
  break;
  case 4:mydiffereceStatuesArray.push("カード"+i+"の真下の状態("+cells2[i].attr('.attribute'+j+'/human')+"の"+cells2[i].attr('.attribute'+j+'/state')+"が"+cells2[i].attr('.attribute'+j+'/updown')+")");
  break;
  case 5:mydiffereceStatuesArray.push("カード"+i+"の右上の状態("+cells2[i].attr('.attribute'+j+'/human')+"の"+cells2[i].attr('.attribute'+j+'/state')+"が"+cells2[i].attr('.attribute'+j+'/updown')+")");
  break;
  case 6:mydiffereceStatuesArray.push("カード"+i+"の右下の状態("+cells2[i].attr('.attribute'+j+'/human')+"の"+cells2[i].attr('.attribute'+j+'/state')+"が"+cells2[i].attr('.attribute'+j+'/updown')+")");
  break;


    }
  }
     }
     }
  }




//相手から見て状態の違うところ
  //上部が状態変化が一致しているものがあるか判定
  for(i=0;i<cells3.length;i++){
    for(j=1;j<=6;j++){
      if(j%2==1){
        k=1;
      }else{
        k=2;
      }

    if (cells3[i].attr('.attribute'+j+'/human') != ''){
        if(!(
        ((cells3[i].attr('.attribute'+j+'/human')  == cells2[i].attr('.attribute'+k+'/human'))
     &&  (cells3[i].attr('.attribute'+j+'/state')  == cells2[i].attr('.attribute'+k+'/state'))
     &&  (cells3[i].attr('.attribute'+j+'/updown') == cells2[i].attr('.attribute'+k+'/updown')))
     ||
        ((cells3[i].attr('.attribute'+j+'/human')  == cells2[i].attr('.attribute'+k+2+'/human'))
     &&  (cells3[i].attr('.attribute'+j+'/state')  == cells2[i].attr('.attribute'+k+2+'/state'))
     &&  (cells3[i].attr('.attribute'+j+'/updown') == cells2[i].attr('.attribute'+k+2+'/updown')))
     ||
        ((cells3[i].attr('.attribute'+j+'/human')  == cells2[i].attr('.attribute'+k+4+'/human'))
     &&  (cells3[i].attr('.attribute'+j+'/state')  == cells2[i].attr('.attribute'+k+4+'/state'))
     &&  (cells3[i].attr('.attribute'+j+'/updown') == cells2[i].attr('.attribute'+k+4+'/updown')))
)){
console.log(k);
console.log(j);
switch(j){
  case 1:ohterdiffereceStatuesArray.push("カード"+i+"の左上の状態("+cells3[i].attr('.attribute'+j+'/human')+"の"+cells3[i].attr('.attribute'+j+'/state')+"が"+cells3[i].attr('.attribute'+j+'/updown')+")");
　break;
  case 2:ohterdiffereceStatuesArray.push("カード"+i+"の左下の状態("+cells3[i].attr('.attribute'+j+'/human')+"の"+cells3[i].attr('.attribute'+j+'/state')+"が"+cells3[i].attr('.attribute'+j+'/updown')+")");
　break;
　case 3:ohterdiffereceStatuesArray.push("カード"+i+"の真上の状態("+cells3[i].attr('.attribute'+j+'/human')+"の"+cells3[i].attr('.attribute'+j+'/state')+"が"+cells3[i].attr('.attribute'+j+'/updown')+")");
　break;
  case 4:ohterdiffereceStatuesArray.push("カード"+i+"の真下の状態("+cells3[i].attr('.attribute'+j+'/human')+"の"+cells3[i].attr('.attribute'+j+'/state')+"が"+cells3[i].attr('.attribute'+j+'/updown')+")");
　break;
　case 5:ohterdiffereceStatuesArray.push("カード"+i+"の右上の状態("+cells3[i].attr('.attribute'+j+'/human')+"の"+cells3[i].attr('.attribute'+j+'/state')+"が"+cells3[i].attr('.attribute'+j+'/updown')+")");
　break;
  case 6:ohterdiffereceStatuesArray.push("カード"+i+"の右下の状態("+cells3[i].attr('.attribute'+j+'/human')+"の"+cells3[i].attr('.attribute'+j+'/state')+"が"+cells3[i].attr('.attribute'+j+'/updown')+")");
　break;


  }
}
   }
   }
}
}


//矢印の一致を判定するために関数を設定
function arrayDiff1(aOlder, aNewer){
    function f(aElement, aIndex, aArray){  // コールバック関数
        /*
           filter の第 1 引数の各要素についてこの関数は繰り返し実行される。
           filter の第 2 引数がこの関数内の this になる。
        */
        return (this.indexOf(aElement) == -1);  // 配列 this にその要素が含まれなければ true
    }

    /*
       filter メソッドは対象の配列の各要素について反復し、
       各要素について第 1 引数のコールバック関数（今回は f）が実行され、
       その関数が true を返した要素からなる新たな配列を返す。
    */
    var removed = aOlder.filter(f, aNewer);  // aOlder の要素のうち aNewer に含まれないものからなる配列
    var added = aNewer.filter(f, aOlder);  // aNewer の要素のうち aOlder に含まれないものからなる配列

    return removed;  // 複数の値を返す
    //ex var [removed, added] = arrayDiff(["a", "b", "c", "d", "e", "f"], ["a", "bb", "c", "e", "g"]);

}

//矢印の一致を判定するために関数を設定
function arrayDiff2(aOlder, aNewer){
    function f(aElement, aIndex, aArray){  // コールバック関数
        /*
           filter の第 1 引数の各要素についてこの関数は繰り返し実行される。
           filter の第 2 引数がこの関数内の this になる。
        */
        return (this.indexOf(aElement) == -1);  // 配列 this にその要素が含まれなければ true
    }

    /*
       filter メソッドは対象の配列の各要素について反復し、
       各要素について第 1 引数のコールバック関数（今回は f）が実行され、
       その関数が true を返した要素からなる新たな配列を返す。
    */
    var removed = aOlder.filter(f, aNewer);  // aOlder の要素のうち aNewer に含まれないものからなる配列
    var added = aNewer.filter(f, aOlder);  // aNewer の要素のうち aOlder に含まれないものからなる配列

    return added;  // 複数の値を返す
    //ex var [removed, added] = arrayDiff(["a", "b", "c", "d", "e", "f"], ["a", "bb", "c", "e", "g"]);

}




//教師データと比較する関数

//矢印が違うものを取り出したい
var differeceLinksArray1=[];
var differeceLinksArray2=[];
function teacherdifferencesLinks(){
  var mydiffereceLinkArray=[];
  var teacherdiffereceLinkArray=[];


  for(i=0;i<links.length;i++){
    mydiffereceLinkArray.push("カード"+cell_link_source[i]+"からカード"+cell_link_target[i]+"への矢印は一致してない");
  }

      teacherdiffereceLinkArray.push("カード"+0+"からカード"+1+"への矢印は一致してない");
      teacherdiffereceLinkArray.push("カード"+0+"からカード"+2+"への矢印は一致してない");
      teacherdiffereceLinkArray.push("カード"+1+"からカード"+2+"への矢印は一致してない");
      teacherdiffereceLinkArray.push("カード"+2+"からカード"+3+"への矢印は一致してない");
      teacherdiffereceLinkArray.push("カード"+2+"からカード"+4+"への矢印は一致してない");
      teacherdiffereceLinkArray.push("カード"+2+"からカード"+7+"への矢印は一致してない");
      teacherdiffereceLinkArray.push("カード"+3+"からカード"+4+"への矢印は一致してない");
      teacherdiffereceLinkArray.push("カード"+3+"からカード"+7+"への矢印は一致してない");
      teacherdiffereceLinkArray.push("カード"+4+"からカード"+5+"への矢印は一致してない");
      teacherdiffereceLinkArray.push("カード"+4+"からカード"+6+"への矢印は一致してない");
      teacherdiffereceLinkArray.push("カード"+4+"からカード"+7+"への矢印は一致してない");
      teacherdiffereceLinkArray.push("カード"+5+"からカード"+6+"への矢印は一致してない");
      teacherdiffereceLinkArray.push("カード"+5+"からカード"+7+"への矢印は一致してない");
      teacherdiffereceLinkArray.push("カード"+6+"からカード"+7+"への矢印は一致してない");


 differeceLinksArray1  = arrayDiff1(mydiffereceLinkArray, teacherdiffereceLinkArray);
 differeceLinksArray2  = arrayDiff2(mydiffereceLinkArray, teacherdiffereceLinkArray);

}

var BallImg = document.createElement('img');
BallImg.src = "http://sites.google.com/site/westinthefareast/home/datafiles/chrome.png";

//違いを集める行列
  var teacherdiffereceStatuesArray=[];
  var teacherdiffereceStatuesArray1=[];

//状態変化が違うものを取り出す
  function teacherdifferences(){
      //自分の状態を見て違うところ
        //上部の状態変化が一致しているものがあるか判定
        for(i=0;i<cells2.length;i++){
          for(j=1;j<=6;j++){
              if(j%2==1){
                k=1;
              }else{
                k=2;
              }

          if (cells2[i].attr('.attribute'+j+'/human') != ''){
              if(!(
              ((cells2[i].attr('.attribute'+j+'/human')  == teachercells[i].attr('.attribute'+k+'/human'))
           &&  (cells2[i].attr('.attribute'+j+'/state')  == teachercells[i].attr('.attribute'+k+'/state'))
           &&  (cells2[i].attr('.attribute'+j+'/updown') == teachercells[i].attr('.attribute'+k+'/updown')))
           ||
              ((cells2[i].attr('.attribute'+j+'/human')  == teachercells[i].attr('.attribute'+k+2+'/human'))
           &&  (cells2[i].attr('.attribute'+j+'/state')  == teachercells[i].attr('.attribute'+k+2+'/state'))
           &&  (cells2[i].attr('.attribute'+j+'/updown') == teachercells[i].attr('.attribute'+k+2+'/updown')))
           ||
              ((cells2[i].attr('.attribute'+j+'/human')  == teachercells[i].attr('.attribute'+k+4+'/human'))
           &&  (cells2[i].attr('.attribute'+j+'/state')  == teachercells[i].attr('.attribute'+k+4+'/state'))
           &&  (cells2[i].attr('.attribute'+j+'/updown') == teachercells[i].attr('.attribute'+k+4+'/updown')))
    )){

    switch(j){
      case 1:teacherdiffereceStatuesArray.push("カード"+i+"の左上の状態("+cells2[i].attr('.attribute'+j+'/human')+"の"+cells2[i].attr('.attribute'+j+'/state')+"が"+cells2[i].attr('.attribute'+j+'/updown')+")");
      break;
      case 2:teacherdiffereceStatuesArray.push("カード"+i+"の左下の状態("+cells2[i].attr('.attribute'+j+'/human')+"の"+cells2[i].attr('.attribute'+j+'/state')+"が"+cells2[i].attr('.attribute'+j+'/updown')+")");
      break;
      case 3:teacherdiffereceStatuesArray.push("カード"+i+"の真上の状態("+cells2[i].attr('.attribute'+j+'/human')+"の"+cells2[i].attr('.attribute'+j+'/state')+"が"+cells2[i].attr('.attribute'+j+'/updown')+")");
      break;
      case 4:teacherdiffereceStatuesArray.push("カード"+i+"の真下の状態("+cells2[i].attr('.attribute'+j+'/human')+"の"+cells2[i].attr('.attribute'+j+'/state')+"が"+cells2[i].attr('.attribute'+j+'/updown')+")");
      break;
      case 5:teacherdiffereceStatuesArray.push("カード"+i+"の右上の状態("+cells2[i].attr('.attribute'+j+'/human')+"の"+cells2[i].attr('.attribute'+j+'/state')+"が"+cells2[i].attr('.attribute'+j+'/updown')+")");
      break;
      case 6:teacherdiffereceStatuesArray.push("カード"+i+"の右下の状態("+cells2[i].attr('.attribute'+j+'/human')+"の"+cells2[i].attr('.attribute'+j+'/state')+"が"+cells2[i].attr('.attribute'+j+'/updown')+")");
      break;


        }
      }
         }
         }
      }




    //相手から見て状態の違うところ
      //上部が状態変化が一致しているものがあるか判定
      for(i=0;i<cells2.length;i++){
        for(j=1;j<=6;j++){
          if(j%2==1){
            k=1;
          }else{
            k=2;
          }

        if (teachercells[i].attr('.attribute'+j+'/human') != ''){
            if(!(
            ((teachercells[i].attr('.attribute'+j+'/human')  == cells2[i].attr('.attribute'+k+'/human'))
         &&  (teachercells[i].attr('.attribute'+j+'/state')  == cells2[i].attr('.attribute'+k+'/state'))
         &&  (teachercells[i].attr('.attribute'+j+'/updown') == cells2[i].attr('.attribute'+k+'/updown')))
         ||
            ((teachercells[i].attr('.attribute'+j+'/human')  == cells2[i].attr('.attribute'+k+2+'/human'))
         &&  (teachercells[i].attr('.attribute'+j+'/state')  == cells2[i].attr('.attribute'+k+2+'/state'))
         &&  (teachercells[i].attr('.attribute'+j+'/updown') == cells2[i].attr('.attribute'+k+2+'/updown')))
         ||
            ((teachercells[i].attr('.attribute'+j+'/human')  == cells2[i].attr('.attribute'+k+4+'/human'))
         &&  (teachercells[i].attr('.attribute'+j+'/state')  == cells2[i].attr('.attribute'+k+4+'/state'))
         &&  (teachercells[i].attr('.attribute'+j+'/updown') == cells2[i].attr('.attribute'+k+4+'/updown')))
    )){

      console.log("こんにちは");

    switch(j){
      case 1:teacherdiffereceStatuesArray1.push("カード"+i+"の左上の状態("+teachercells[i].attr('.attribute'+j+'/human')+"の"+teachercells[i].attr('.attribute'+j+'/state')+"が"+teachercells[i].attr('.attribute'+j+'/updown')+")");
    　break;
      case 2:teacherdiffereceStatuesArray1.push("カード"+i+"の左下の状態("+teachercells[i].attr('.attribute'+j+'/human')+"の"+teachercells[i].attr('.attribute'+j+'/state')+"が"+teachercells[i].attr('.attribute'+j+'/updown')+")");
    　break;
    　case 3:teacherdiffereceStatuesArray1.push("カード"+i+"の真上の状態("+teachercells[i].attr('.attribute'+j+'/human')+"の"+teachercells[i].attr('.attribute'+j+'/state')+"が"+teachercells[i].attr('.attribute'+j+'/updown')+")");
    　break;
      case 4:teacherdiffereceStatuesArray1.push("カード"+i+"の真下の状態("+teachercells[i].attr('.attribute'+j+'/human')+"の"+teachercells[i].attr('.attribute'+j+'/state')+"が"+teachercells[i].attr('.attribute'+j+'/updown')+")");
    　break;
    　case 5:teacherdiffereceStatuesArray1.push("カード"+i+"の右上の状態("+teachercells[i].attr('.attribute'+j+'/human')+"の"+teachercells[i].attr('.attribute'+j+'/state')+"が"+teachercells[i].attr('.attribute'+j+'/updown')+")");
    　break;
      case 6:teacherdiffereceStatuesArray1.push("カード"+i+"の右下の状態("+teachercells[i].attr('.attribute'+j+'/human')+"の"+teachercells[i].attr('.attribute'+j+'/state')+"が"+teachercells[i].attr('.attribute'+j+'/updown')+")");
    　break;

      }
    }
       }
       }
    }
}












function addCell(){
  var color = addColor.val();
  var number = cells.length;
  cells[number] = cells[0].clone();
  cells[number].translate(0, 100);
  cells[number].attr('.element-node/data-color', color);
  cells[number].attr('.label/text', 'NEW');
  graph.addCells(cells);
}


function colorChange(){
  var cardnumber = ChangeColor.cardnumber.value;
  var colors = ChangeColor.color.value;
  cells[cardnumber].attr('.element-node/data-color',colors);
}

//selectボックスの色を変える
function changeColor(){
var e = document.getElementById("color");
e.style.background = e.options[e.selectedIndex].style.background;
}


//ボタンをクリックするとイベントが発生するようにする
//$('#addLink').on('click', addLink);
//$('#addCell').on('click', addCell);

$('#get').on('click', get);
$('#send').on('click', send);

$('#colorChange').on('click', colorChange);


$('#send').on('click',differences);
$('#send').on('click',differencesLinks);
$('#send').on('click',teacherdifferences);
$('#send').on('click',teacherdifferencesLinks);
$('#send').on('click',reWrite);


//$('#ShowStatuesPercent').on('click', ShowStatuesPercent);
//$('#ShowLinkPercent').on('click', ShowLinkPercent);

/*
$('#differencesLinks').on('click',differencesLinks);
$('#teacherdifferences').on('click',teacherdifferences);
$('#teacherdifferencesLinks').on('click',teacherdifferencesLinks);
*/

/*
$(filter).on('change', function(e){
  canvas.attr('data-filter', e.target.value);
});*/

//canvasの図形を拡大表示、縮小表示する
/*
var svgZoom = svgPanZoom('#canvas svg', {
  center: false,
  zoomEnabled: true,
  panEnabled: true,
  controlIconsEnabled: true,
  fit: false,
  minZoom: 0.75,
  maxZoom:1.5,
  zoomScaleSensitivity: 0.05
});
$(filter).on('change', function(e){
  canvas2.attr('data-filter', e.target.value);
});
//canvasの図形を拡大表示、縮小表示する
/*
var svgZoom = svgPanZoom('#canvas2 svg', {
  center: false,
  zoomEnabled: true,
  panEnabled: true,
  controlIconsEnabled: true,
  fit: false,
  minZoom: 0.75,
  maxZoom:1.5,
  zoomScaleSensitivity: 0.05
});*/
/*
var svgZoom = svgPanZoom('#canvas3 svg', {
  center: false,
  zoomEnabled: true,
  panEnabled: true,
  controlIconsEnabled: true,
  fit: false,
  minZoom: 0.75,
  maxZoom:1.5,
  zoomScaleSensitivity: 0.05
});
$(filter).on('change', function(e){
  canvas3.attr('data-filter', e.target.value);
});
var svgZoom = svgPanZoom('#canvas4 svg', {
  center: false,
  zoomEnabled: true,
  panEnabled: true,
  controlIconsEnabled: true,
  fit: false,
  minZoom: 0.75,
  maxZoom:1.5,
  zoomScaleSensitivity: 0.05
});
$(filter).on('change', function(e){
  canvas4.attr('data-filter', e.target.value);
});*/

  var touchkaisu =0;
//メニュー表示の切り替え
(function() {
  'use strict';

  var menuItems = document.getElementsByClassName('menu_item');
  var contents = document.getElementsByClassName('content');

  var i;
//メニュークリック時の処理
  for (i = 0; i < menuItems.length; i++) {
    menuItems[i].addEventListener('click', function(e) {
      e.preventDefault();
      console.log(this);
      var i;
//全てのmenuItemsのclassからactiveをとる
      for (i = 0; i < menuItems.length; i++) {
        menuItems[i].className = 'menu_item';
      }
//その後　activeクラスをつける
      this.className = 'menu_item active';

      for (i = 0; i < contents.length; i++) {
        contents[i].className = 'content';
      }
      document.getElementById(this.dataset.id).className = 'content active';

      if(this.dataset.id == "Comparing"){
        touchkaisu++;

        graph3.clear();
        graph4.clear();
        for(i = 0 ; i < cells.length ; i++){
          cells2[i]=cells[i].clone();
        }
        for(i = 0 ; i < links.length ; i++){
          links2[i] = new joint.dia.Link({
               source: { id: cells2[cell_link_source[i]].id },
               target: { id: cells2[cell_link_target[i]].id },
           connector: { name: 'rounded' },
           attrs: {
               '.connection': {
                   stroke: '#333333',
                   'stroke-width': 4
               },
               '.marker-target': {
                   fill: '#333333',
                   d: 'M 10 0 L 0 5 L 10 10 z'
               }
           },
          labels: [
               { position: 0.5, attrs: { text: { text: cell_link_reason[i], fill: '#000000', 'font-family': 'sans-serif' }, rect: { stroke: '#F2F5A9', 'stroke-width': 20, rx: 5, ry: 5 } }}]
           });
        }
       graph3.addCells(cells2);
        graph3.addCells(links2);

        for(i = 0 ; i < others_cells.length ; i++){
          cells3[i]=others_cells[i].clone();
        }
        for(i = 0 ; i < others_links.length ; i++){
          links3[i] = new joint.dia.Link({
               source: { id: cells3[others_link_source[i]].id },
               target: { id: cells3[others_link_target[i]].id },
           connector: { name: 'rounded' },
           attrs: {
               '.connection': {
                   stroke: '#333333',
                   'stroke-width': 4
               },
               '.marker-target': {
                   fill: '#333333',
                   d: 'M 10 0 L 0 5 L 10 10 z'
               }
           },
          labels: [
               { position: 0.5, attrs: { text: { text: others_link_reason[i], fill: '#000000', 'font-family': 'sans-serif' }, rect: { stroke: '#F2F5A9', 'stroke-width': 20, rx: 5, ry: 5 } }}]
           });
        }

        if(touchkaisu!=1){
        graph4.addCells(cells3);
        graph4.addCells(links3);
}
console.log(touchkaisu);

        for(i = 0 ; i < others_cells.length ; i++){
          cells3[i]=others_cells[i].clone();
        }
        for(i = 0 ; i < others_links.length ; i++){
          links3[i] = new joint.dia.Link({
               source: { id: cells3[others_link_source[i]].id },
               target: { id: cells3[others_link_target[i]].id },
           connector: { name: 'rounded' },
           attrs: {
               '.connection': {
                   stroke: '#333333',
                   'stroke-width': 4
               },
               '.marker-target': {
                   fill: '#333333',
                   d: 'M 10 0 L 0 5 L 10 10 z'
               }
           },
          labels: [
               { position: 0.5, attrs: { text: { text: others_link_reason[i], fill: '#000000', 'font-family': 'sans-serif' }, rect: { stroke: '#F2F5A9', 'stroke-width': 20, rx: 5, ry: 5 } }}]
           });
        }


      }



      if(this.dataset.id == "Summary"){
        graph5.clear();



        for(i = 0 ; i < teachercells.length ; i++){
          teachercells[i]=teachercells[i].clone();
        }


        var forteacherlinks=[];
        var messege3 = [];
        for(var i =0;i<messege3.length;i++){
        var wid = messege3[i].split(":")[1];
        forteacherlinks[i] = new joint.dia.Link({
             source: { id: teachercells[messege3[i][0]].id },
             target: { id: teachercells[messege3[i][1]].id },
         connector: { name: 'rounded' },
         attrs: {
             '.connection': {
                 stroke: '#333333',
                 'stroke-width': wid
             },
             '.marker-target': {
                 fill: '#333333',
                 d: 'M 10 0 L 0 5 L 10 10 z'
             }
         },
        labels: [
             { position: 0.5, attrs: { text: { fill: '#000000', 'font-family': 'sans-serif' }, rect: { stroke: '#F2F5A9', 'stroke-width': 20, rx: 5, ry: 5 } }}]

           })}
           graph5.addCells(teachercells);
           graph5.addCells(forteacherlinks);



      }








    });
  }

})();






//差異一覧画面の違いを表示する
function reWrite(){
  /*
      document.getElementById("myStatues").innerText=mydiffereceStatuesArray.sort().join('\n');
      console.log(mydiffereceStatuesArray.join("\n"));

      document.getElementById("otherStatues").innerText=ohterdiffereceStatuesArray.sort().join('\n');
      console.log(ohterdiffereceStatuesArray.join("\n"));

      document.getElementById("Links").innerText=differeceLinksArray.sort().join('\n');
      console.log(ohterdiffereceStatuesArray.join("\n"));
*/
      document.getElementById("teacherStatues").innerText=teacherdiffereceStatuesArray.sort().join('\n');
      console.log(teacherdiffereceStatuesArray.join("\n"));

      document.getElementById("othersteacherStatues").innerText=teacherdiffereceStatuesArray1.sort().join('\n');
      console.log(teacherdiffereceStatuesArray1.join("\n"));

      document.getElementById("teacherLinks1").innerText=differeceLinksArray1.sort().join('\n');
      console.log(differeceLinksArray1.join("\n"));
/*
      document.getElementById("teacherLinks2").innerText=differeceLinksArray2.sort().join('\n');
      console.log(differeceLinksArray2.join("\n"));
*/

}


$(function(){

    $(window).on('beforeunload', function() {

        return "このページを離れると、入力したデータが削除されます。";

    });

});





paper3=paper3.scale(0.5, 0.5)
paper4=paper4.scale(0.5, 0.5)
