var canvas = $('#canvas');
var canvas2 = $('#canvas2');
var canvas3 = $('#canvas3');
var canvas4 = $('#canvas4');
var filter = $('#filter');
var addColor = $('#addColor');
var cells = [];
var others_cells = [];
var links = [];
var cell_link_source = [];
var cell_link_target = [];
var cell_link_reason =[];
var message = $('#message');
var graph = new joint.dia.Graph();
var graph2 = new joint.dia.Graph();
var graph3 = new joint.dia.Graph();
var graph4 = new joint.dia.Graph();
var user;
var others_links = [];
var cell_attribute_human = [];
var cell_attribute_state = [];
var cell_attribute_updown = [];
var cell_attribute_human2 = [];
var cell_attribute_state2 = [];
var cell_attribute_updown2 = [];

//描画用のキャンバス
var paper = new joint.dia.Paper({
  el: canvas,
  //キャンバスのサイズ
  width: 700,
  height: 700,
  model: graph,
  gridSize: 1,
  clickThreshold: 1,
});

//他者の図形を表示するためのキャンバス
var paper2 = new joint.dia.Paper({
  el: canvas2,
  //キャンバスのサイズ
  width: 700,
  height: 700,
  model: graph2,
  gridSize: 1,

  clickThreshold: 1
});
var paper3 = new joint.dia.Paper({
  el: canvas3,
  //キャンバスのサイズ
  width: 700,
  height: 700,
  model: graph,
  gridSize: 1,

  clickThreshold: 1
});

var paper4 = new joint.dia.Paper({
  el: canvas4,
  //キャンバスのサイズ
  width: 700,
  height: 700,
  model: graph2,
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
その際、既存のものは変えないで下さい。(font-sizeは変更化)
------------------------------------------------------------------------------------
*/
joint.shapes.devs.Model = joint.shapes.devs.Model.extend({
markup: '<g class="element-node">'+
             '<rect class="body" stroke-width="0" rx="3px" ry="5px"></rect>'+
            '<text class="label"></text>'+'<text><tspan class="attribute"></tspan></text>'+
            '<text><tspan class="attribute2"></tspan></text>'+
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
  position: {x: 20, y: 20},
  attrs: {
    '.body': {
      width: '150',
      height: '80'
    },
    '.label': {
      text: 'カード１',
    },
    '.element-node' : {
      'data-color': 'gray'
    },
    '.attribute' : {
      text: '',
      'font-size':15,
      'human' : '',
      'state' : '',
      'updown' : ''
    },
    '.attribute2' : {
      text: '',
      'font-size':15,
      //card_hightの方が良い
      'y':80,
      'human':'',
      'state':'',
      'updown':''
    }
  },
  inPorts: ['center'],
});
console.log(cells[0].attr('.element-node/data-color'));
//他のカードの複製
cells[1] = cells[0].clone();
cells[1].translate(170, 0);
cells[2] = cells[0].clone();
cells[2].translate(340, 0);
cells[3] = cells[0].clone();
cells[3].translate(510, 0);
cells[4] = cells[0].clone();
cells[4].translate(0, 200);
cells[5] = cells[0].clone();
cells[5].translate(170,200);
cells[6] = cells[0].clone();
cells[6].translate(340, 200);
cells[7] = cells[0].clone();
cells[7].translate(510, 200);
//カードの属性設定
//cells[3].attr('.element-node/data-color','green');
//各カードにラベルづけ
for(var i=0;i<8;i++){
cells[i].attr('.label/text', 'カード'+i);
}

graph.addCells(cells);

//他人ようカードの生成
others_cells[0] = new joint.shapes.devs.Model({
  type: 'devs.Model',
  position: {x: 0, y: 0},
  attrs: {
    '.body': {
      width: '150',
      height: '80'
    },
    '.label': {
      text: 'カード１',
    },
    '.element-node' : {
      'data-color': "#FF00C0"
    },
    '.attribute' : {
      'font-size' : 15,
      'human' : '',
      'state' : '',
      'updown' : ''
    },
    '.attribute2' : {
        'font-size':15,
        'human':'',
        'state':'',
        'updown':'',
        'y':80
      }
  },
  inPorts: ['center']
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
for(var i=0;i<8;i++){
others_cells[i].attr('.label/text', 'カード'+i);
}


}


//上の属性変更
function CardStateChange(){
  var card_attribute_number = CardState.source.value;
  var card_attribute_human = CardState.human.value;
  var card_attribute_state = CardState.state.value;
  var card_attribute_UpDown = CardState.UpDown.value;
  cells[card_attribute_number].attr('.attribute/human',card_attribute_human);
  cells[card_attribute_number].attr('.attribute/state',card_attribute_state);
  cells[card_attribute_number].attr('.attribute/updown',card_attribute_UpDown);
  cells[card_attribute_number].attr('.attribute/text',card_attribute_human+"の"+card_attribute_state+"が"+card_attribute_UpDown);
}
//下の属性変更
function CardStateChange2(){
  var card_attribute_number = CardState2.source.value;
  var card_attribute_human = CardState2.human.value;
  var card_attribute_state = CardState2.state.value;
  var card_attribute_UpDown = CardState2.UpDown.value;
  cells[card_attribute_number].attr('.attribute2/human',card_attribute_human);
  cells[card_attribute_number].attr('.attribute2/state',card_attribute_state);
  cells[card_attribute_number].attr('.attribute2/updown',card_attribute_UpDown);
  cells[card_attribute_number].attr('.attribute2/text',card_attribute_human+"の"+card_attribute_state+"が"+card_attribute_UpDown);
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
  if(cells[source1].attr('.attribute/human') != '' && cells[target1].attr('.attribute2/human') != ''){
    if((cells[source1].attr('.attribute/human') == cells[target1].attr('.attribute2/human')) &&  (cells[source1].attr('.attribute/state') == cells[target1].attr('.attribute2/state')) &&
  (cells[source1].attr('.attribute/updown') == cells[target1].attr('.attribute2/updown'))){
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
      { position: 0.5, attrs: { text: { text: reason, fill: '#000000', 'font-family': 'sans-serif' }, rect: { stroke: '#D8D8D8', 'stroke-width': 20, rx: 5, ry: 5 } }}]
  });
  cell_link_source[link_length] = source1;
  cell_link_target[link_length] = target1;
  cell_link_reason[link_length] = reason;
  graph.addCells(links);
}else{
  alert("カードの属性が一致していません");
}
  }else{
    alert("カードに属性が設定されていません");
  }
}else{
  alert("同じカードを選択しています")
}
}

//矢印を削除した時にトリガー,リストから矢印を削除
graph.on('remove',function(cell,collection,opt){
  if(cell.isLink()){
    var number = links.indexOf(cell);
    console.log(number + 'is deleted!');
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

   if(user){
     //user is signed in.
     for(var i = 0; i < 8; i++){
       cells_number.push(i);
       cells_position_x.push(cells[i].get('position').x);
       cells_position_y.push(cells[i].get('position').y);
       cell_color.push(cells[i].attr('.element-node/data-color'));
       cell_attribute_human.push(cells[i].attr('.attribute/human'));
       cell_attribute_state.push(cells[i].attr('.attribute/state'));
       cell_attribute_updown.push(cells[i].attr('.attribute/updown'));
       cell_attribute_human2.push(cells[i].attr('.attribute2/human'));
       cell_attribute_state2.push(cells[i].attr('.attribute2/state'));
       cell_attribute_updown2.push(cells[i].attr('.attribute2/updown'));
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
         cell_attribute_updown2 : cell_attribute_updown2
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
     for(var i=0;i<8;i++){
     others_cells[i].position(snapshot.val().cell_position_x[i],snapshot.val().cell_position_y[i]);
     others_cells[i].attr('.element-node/data-color',snapshot.val().cell_color[i]);
     others_cells[i].attr('.attribute/human',snapshot.val().cell_attribute_human[i]);
     others_cells[i].attr('.attribute/state',snapshot.val().cell_attribute_state[i]);
     others_cells[i].attr('.attribute/updown',snapshot.val().cell_attribute_updown[i]);
     others_cells[i].attr('.attribute/text',others_cells[i].attr('.attribute/human')+" "+others_cells[i].attr('.attribute/state')+" "+others_cells[i].attr('.attribute/updown'));
     others_cells[i].attr('.attribute2/human',snapshot.val().cell_attribute_human2[i]);
     others_cells[i].attr('.attribute2/state',snapshot.val().cell_attribute_state2[i]);
     others_cells[i].attr('.attribute2/updown',snapshot.val().cell_attribute_updown2[i]);
     others_cells[i].attr('.attribute2/text',others_cells[i].attr('.attribute2/human')+" "+others_cells[i].attr('.attribute2/state')+" "+others_cells[i].attr('.attribute2/updown'));
   }
   graph2.addCells(others_cells);

   /*
   矢印の処理
   */
   if(snapshot.val().cell_link_source != null){
   for(var i = 0 ; i < snapshot.val().cell_link_source.length ; i++){
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
        { position: 0.5, attrs: { text: { text: snapshot.val().cell_link_reason[i], fill: '#f6f6f6', 'font-family': 'sans-serif' }, rect: { stroke: '#7c68fc', 'stroke-width': 20, rx: 5, ry: 5 } }}]
    });}
  graph2.addCells(others_links);}
  });
}
}

  $('#get').on('click', get);
  $('#send').on('click', send);



function addCell(){
  var color = addColor.val();
  var number = cells.length;
  cells[number] = cells[0].clone();
  cells[number].translate(0, 100);
  cells[number].attr('.element-node/data-color', color);
  cells[number].attr('.label/text', 'NEW');
  graph.addCells(cells);
}
//ボタンをクリックするとイベントが発生するようにする
$('#addLink').on('click', addLink);
$('#addCell').on('click', addCell);
$('#colorChange').on('click', colorChange);

function colorChange(){
  var cardnumber = ChangeColor.cardnumber.value;
  var colors = ChangeColor.color.value;
  cells[cardnumber].attr('.element-node/data-color',colors);
}


$(filter).on('change', function(e){
  canvas.attr('data-filter', e.target.value);
});
/*
//canvasの図形を拡大表示、縮小表示する
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
var svgZoom = svgPanZoom('#canvas2 svg', {
  center: false,
  zoomEnabled: true,
  panEnabled: true,
  controlIconsEnabled: true,
  fit: false,
  minZoom: 0.75,
  maxZoom:1.5,
  zoomScaleSensitivity: 0.05
});
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


//どのカードを触っているか表示
(function(){
  paper.on('cell:pointerdown', function(){
    svgZoom.disablePan();
  });
  paper.on('cell:pointerup', function(){
    svgZoom.enablePan();
  });

  paper.on('cell:pointerclick', function(e){
    message.addClass('visible');
    message.html(e.el.textContent+'選択');
  setTimeout(function(){  message.removeClass('visible');
                       }, 1000);
  });
});

// create an array with nodes
var nodes = new vis.DataSet([
  {id: 1, label: 'カード 1'},
  {id: 2, label: 'カード 2'},
  {id: 3, label: 'カード 3'},
  {id: 4, label: 'カード 4'},
  {id: 5, label: 'カード 5'},
  {id: 6, label: 'カード 6'},
  {id: 7, label: 'カード 7'},
  {id: 8, label: 'カード 8'}
]);

// create an array with edges
var edges = new vis.DataSet([
  {from: 1, to: 8, arrows:'to'},
  {from: 1, to: 3, arrows:'from'},
  {from: 8, to: 7, arrows:'to'},
  {from: 7, to: 4, arrows:'to'},
  {from: 1, to: 2, arrows:'to'},
  {from: 2, to: 4, arrows:'to'},
  {from: 2, to: 5, arrows:'to'},
  {from: 6, to: 7, arrows:'to'},
]);

// create a network
var container = document.getElementById('mynetwork');
var data = {
  nodes: nodes,
  edges: edges
};
var options = {};
var network = new vis.Network(container, data, options);

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

    });
  }

})();
