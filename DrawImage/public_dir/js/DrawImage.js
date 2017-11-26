var canvas = $('#canvas');
var canvas2 = $('#canvas2');
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
var user;
var others_links = [];
var cell_attribute_human = [];
var cell_attribute_state = [];
var cell_attribute_updown = [];


//描画用のキャンバス
var paper = new joint.dia.Paper({
  el: canvas,
  //キャンバスのサイズ
  width: 550,
  height: 500,
  model: graph,
  gridSize: 1,

  clickThreshold: 1
});

//他者の図形を表示するためのキャンバス
var paper2 = new joint.dia.Paper({
  el: canvas2,
  //キャンバスのサイズ
  width: 550,
  height: 500,
  model: graph2,
  gridSize: 1,

  clickThreshold: 1
});

//カードclassを拡張、形を変えて、文字の大きさを変更,矢印を引けるようにする
joint.shapes.devs.Model = joint.shapes.devs.Model.extend({
markup: '<g class="element-node">'+
             '<rect class="body" stroke-width="0" rx="3px" ry="5px"></rect>'+
            '<text class="label" y="0.8em" xml:space="preserve" font-size="24" text-anchor="middle" font-family="Arial, helvetica, sans-serif">'+
              '<tspan id="v-18" dy="0em" x="0" class="v-line"></tspan>'+
            '</text>'+

            '<g class="inPorts"/>' +
          '<g class="outPorts"/>' +
        '</g>',
portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/></g>'

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
      width: '100',
      height: '60'
    },
    '.label': {
      text: 'カード１',
    },
    '.element-node' : {
      'data-color': 'gray'
    },
    '.attribute' : {
      'human' : '',
      'state' : '',
      'updown' : '',
    }
  },
  inPorts: ['center']
});
console.log(cells[0].attr('.element-node/data-color'));
//他のカードの複製
cells[1] = cells[0].clone();
cells[1].translate(130, 0);
cells[2] = cells[0].clone();
cells[2].translate(260, 0);
cells[3] = cells[0].clone();
cells[3].translate(390, 0);
cells[4] = cells[0].clone();
cells[4].translate(0, 200);
cells[5] = cells[0].clone();
cells[5].translate(130,200);
cells[6] = cells[0].clone();
cells[6].translate(260, 200);
cells[7] = cells[0].clone();
cells[7].translate(390, 200);
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
      width: '100',
      height: '60'
    },
    '.label': {
      text: 'カード１',
    },
    '.element-node' : {
      'data-color': "#FF00C0"
    },
    '.attribute' : {
      'human' : '',
      'state' : '',
      'updown' : ''
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

function CardStateChange(){
  var card_attribute_number = CardState.source.value;
  var card_attribute_human = CardState.human.value;
  var card_attribute_state = CardState.state.value;
  var card_attribute_UpDown = CardState.UpDown.value;
  cells[card_attribute_number].attr('.attribute/human',card_attribute_human);
  cells[card_attribute_number].attr('.attribute/state',card_attribute_state);
  cells[card_attribute_number].attr('.attribute/updown',card_attribute_UpDown);
  console.log("Hello,World");
}

//新規で矢印作成
function addLink(){
  //HTMLから理由をGET
  var source1 = input_sample.source.value;
  var reason  = input_sample.reason.value;
  var target1 = input_sample.target.value;
  var link_length = links.length;

  /*
  矢印を引くための弾ける条件分岐
  */
  if(source1 != target1){
  if(cells[source1].attr('.attribute/human') != '' && cells[target1].attr('.attribute/human') != ''){
    if((cells[source1].attr('.attribute/human') == cells[target1].attr('.attribute/human')) &&       (cells[source1].attr('.attribute/state') == cells[target1].attr('.attribute/state')) &&
  (cells[source1].attr('.attribute/updown') == cells[target1].attr('.attribute/updown'))){
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
       console.log(i+":"+cells[i].get('position').x+":"+cells[i].get('position').y+cells[i].attr('.element-node/data-color'));
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
         cell_attribute_updown : cell_attribute_updown
       }
     );alert("送信しました");
   }else{
     //no user is singed in.
     alert("ログインしていません");
   }
   /*
   for(var i = 0; i < 8; i++){
     cells_number.push(i);
     cells_position_x.push(cells[i].get('position').x);
     cells_position_y.push(cells[i].get('position').y);
     console.log(i+":"+cells[i].get('position').x+":"+cells[i].get('position').y);
   }
   userRef.set(
     {
       cell_number   : cells_number,
       cell_position_x : cells_position_x,
       cell_position_y : cells_position_y
     }
   );*/

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
/*
 ref.on("child_changed",function(snapshot){

   console.log("change");
 });*/
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
})();
