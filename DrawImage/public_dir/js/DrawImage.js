//図形描写の取得
var canvas = $('#canvas');
var canvas2 = $('#canvas2');
var canvas3 = $('#canvas3');
var canvas4 = $('#canvas4');
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
//データベースに送るデータ
var user;
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
            '<text class="label" font-size="20"></text>'+
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
  user = data.split("=")[1];


//カードの生成
cells[0] = new joint.shapes.devs.Model({
  type: 'devs.Model',
  position: {x: 10, y: 10},
  attrs: {
    '.body': {
      width: cardWidth,
      height: cardHeight
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
      'font-size':20,
      'fill':'',
      'human' : '',
      'state' : '',
      'updown' : ''
    },
    '.attribute2' : {
      text: '',
      'font-size':20,
      //card_hightの方が良い
      'y':170,
      'human':'',
      'state':'',
      'updown':''
    },
    '.attribute3' : {
      text: '',
      'font-size':20,
      'fill':'',
      'human' : '',
      'state' : '',
      'updown' : '',
      'dx' : 140,
    },
    '.attribute4' : {
      text: '',
      'font-size':20,
      'fill':'',
      'human' : '',
      'state' : '',
      'updown' : '',
      'dx' : 140,
      'y':170
    },
    '.attribute5' : {
      text: '',
      'font-size':20,
      'fill':'',
      'human' : '',
      'state' : '',
      'updown' : '',
      'dx' : 280,
    },
    '.attribute6' : {
      text: '',
      'font-size':20,
      'fill':'',
      'human' : '',
      'state' : '',
      'updown' : '',
      'dx' : 280,
      'y':170,
    },
  },
  inPorts: ['center'],
});
//他のカードの複製
//初期値の設定
cells[0].toFront({ deep: true });
cells[0].toFront();
_.invoke(graph.getConnectedLinks(cells[0]), 'toFront');
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
var cellText1='1, 　11世紀になると、貴族が摂政や関白となって政治の実権を握るようになった。貴族たちはこの地位に就くため娘を天皇に嫁がせ、外戚関係を結んだ';
var cellText2='2, 　10世紀になると貴族たちが持つ荘園を守るため「武士」と呼ばれる人々が現れた。彼らは次第に棟梁と呼ばれる指導者の下で武士団が形成されるようになった';
var cellText3='3, 　1156年、天皇家内部で政治の実権を巡る争いが起こった（保元の乱）。天皇家の人々は武士団の協力を得てこれを争った。';
var cellText4='4, 　1159年、後白河上皇の政権内で藤原氏同士の勢力争いが起こり、源氏と平氏もこれに加わった。これに勝った平氏は中央での地位を固めた（平治の乱）。';
var cellText5='5, 　平治の乱に勝利した平清盛は武士でありながら太政大臣となり、政治の実権を握った。また西日本を中心に荘園を拡大し、西国一帯の武士を支配した。';
var cellText6='6, 　源頼朝が挙兵して東国の支持を集め頼朝の名を受けた義経が1185年に壇ノ浦で平氏を滅ぼした。';
var cellText7='7, 　平安時代の半ば、各地の戦乱や飢餓などに苦しんだ人々は阿弥陀仏にすがり、あの世で極楽浄土に生まれ変わることを願う浄土宗を進行するようになった。';
var cellTextLength=14;
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
      height: cardHeight
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
      'font-size':20,
      'fill':'',
      'human' : '',
      'state' : '',
      'updown' : ''
    },
    '.attribute2' : {
      text: '',
      'font-size':20,
      //card_hightの方が良い
      'y':170,
      'human':'',
      'state':'',
      'updown':''
    },
    '.attribute3' : {
      text: '',
      'font-size':20,
      'fill':'',
      'human' : '',
      'state' : '',
      'updown' : '',
      'dx' : 140,
    },
    '.attribute4' : {
      text: '',
      'font-size':20,
      'fill':'',
      'human' : '',
      'state' : '',
      'updown' : '',
      'dx' : 140,
      'y':170
    },
    '.attribute5' : {
      text: '',
      'font-size':20,
      'fill':'',
      'human' : '',
      'state' : '',
      'updown' : '',
      'dx' : 280,
    },
    '.attribute6' : {
      text: '',
      'font-size':20,
      'fill':'',
      'human' : '',
      'state' : '',
      'updown' : '',
      'dx' : 280,
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
}


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
    alert('同じ属性がすでに設定されています');
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
    alert('同じ属性がすでに設定されています');
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
  alert("カードの属性が一致していません");
}
  }else{
    alert("カードに状態が一致していません。カードの状態をもう一度確認してみましょう");
  }
}else{
  alert("同じカードを選択しています")
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

   var userRef = new Firebase("https://myfirstfirebase-cab79.firebaseio.com/"+user);
   var cells_number = [];
   var cells_position_x = [];
   var cells_position_y = [];
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
       cells_number.push(i);
       cells_position_x.push(cells[i].get('position').x);
       cells_position_y.push(cells[i].get('position').y);
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
         cell_number   : cells_number,
         cell_position_x : cells_position_x,
         cell_position_y : cells_position_y,
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
     );alert("送信しました");
   }else{
     //no user is singed in.
     alert("ログインしていません");
   }
 }


//セルの位置情報のgetter
 function get(){
   var user_name = document.getElementById('user_name').value;
   if(user_name){
     var ref = new Firebase("https://myfirstfirebase-cab79.firebaseio.com/"+user_name);
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
     /*
     if(others_cells[i].attr('.attribute1/human')==''){
     others_cells[i].attr('.attribute1/human',card_attribute_human);
     others_cells[i].attr('.attribute1/state',card_attribute_state);
     others_cells[i].attr('.attribute1/updown',card_attribute_UpDown);
   attflag = 1;}
     else if (others_cells[i].attr('.attribute3/human')=='') {
       others_cells[i].attr('.attribute3/human',card_attribute_human);
       others_cells[i].attr('.attribute3/state',card_attribute_state);
       others_cells[i].attr('.attribute3/updown',card_attribute_UpDown);attflag = 3;
     }
     else{
       others_cells[i].attr('.attribute5/human',card_attribute_human);
       others_cells[i].attr('.attribute5/state',card_attribute_state);
       others_cells[i].attr('.attribute5/updown',card_attribute_UpDown);
       attflag = 5;
     }*/
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
   graph2.addCells(others_cells);

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
  graph2.addCells(others_links);}
  });
}
}

  $('#get').on('click', get);
  $('#send').on('click', send);

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
function arrayDiff(aOlder, aNewer){
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

    return [removed, added];  // 複数の値を返す
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


 [differeceLinksArray1, differeceLinksArray2] = arrayDiff(mydiffereceLinkArray, teacherdiffereceLinkArray);


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








//ピックアップを止めるために全てのopacityを１にする
  function ReturnPickup(){
    for(i=0;i<cells2.length;i++){
        cells2[i].attr('.body/opacity',1);
        cells3[i].attr('.body/opacity',1);
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

//ボタンをクリックするとイベントが発生するようにする
//$('#addLink').on('click', addLink);
//$('#addCell').on('click', addCell);
$('#colorChange').on('click', colorChange);
$('#ReturnPickup').on('click',ReturnPickup);

$('#differences').on('click',differences);
$('#differences').on('click',differencesLinks);
$('#differences').on('click',teacherdifferences);
$('#differences').on('click',teacherdifferencesLinks);
$('#differences').on('click',reWrite);
$('#differences').on('click',aaa);
function aaa(){
alert("違いを抽出しました。状態、矢印の差を見てみましょう")
}
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
        graph4.addCells(cells3);
        graph4.addCells(links3);
      }
    });
  }

})();






//差異一覧画面い違いを表示する
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

      document.getElementById("teacherLinks2").innerText=differeceLinksArray2.sort().join('\n');
      console.log(differeceLinksArray2.join("\n"));

      console.log(teachercells[2].attr('.attribute2/human'));
      console.log((teachercells[2].attr('.attribute2/state')));
      console.log((teachercells[2].attr('.attribute2/updown')));
      console.log(cells2[0].attr('.attribute1/human'));
      console.log(cells2[0].attr('.attribute1/state'));
      console.log(cells2[0].attr('.attribute1/updown'));
}






paper3=paper3.scale(0.5, 0.5)
paper4=paper4.scale(0.5, 0.5)
