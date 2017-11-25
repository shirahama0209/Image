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

//他者の図形を表示留守ためのキャンバス
var paper2 = new joint.dia.Paper({
  el: canvas2,
  //キャンバスのサイズ
  width: 550,
  height: 500,
  model: graph2,
  gridSize: 10,

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
      'data-color': 'blue'
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
}

//新規で矢印作成
function addLink(){
  //HTMLから理由を取り出す
  var source1 = input_sample.source.value;
  var reason  = input_sample.reason.value;
  var target1 = input_sample.target.value;
  var link_length = links.length;
 links[link_length] = new joint.dia.Link({
      source: { id: cells[source1].id },
      target: { id: cells[target1].id },
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
      { position: 0.5, attrs: { text: { text: reason, fill: '#f6f6f6', 'font-family': 'sans-serif' }, rect: { stroke: '#7c68fc', 'stroke-width': 20, rx: 5, ry: 5 } }}]
  });
  cell_link_source[link_length] = source1;
  cell_link_target[link_length] = target1;
  cell_link_reason[link_length] = reason;
  graph.addCells(links);
}

//firebaseに送信用メソッド
 function send(){
   var userRef = new Firebase("https://myfirstfirebase-cab79.firebaseio.com/"+user);
   //console.log(cells[1].id, ':', cells[1].get('position'));
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
       console.log(i+":"+cells[i].get('position').x+":"+cells[i].get('position').y+cells[i].attr('.element-node/data-color'));
     }
     /*
     console.log(links[0].get('source').id+":"+links[0].get('target').id
     +":"+links.length);
     console.log(cells[0].id+":"+cells[7].id);*/

     userRef.set(
       {
         user_name : user,
         cell_number   : cells_number,
         cell_position_x : cells_position_x,
         cell_position_y : cells_position_y,
         cell_link_source : cell_link_source,
         cell_link_target : cell_link_target,
         cell_link_reason : cell_link_reason,
         cell_color : cell_color
       }
     );
   }else{
     //no user is singed in.

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
   others_cells[0] = new joint.shapes.devs.Model({
     type: 'devs.Model',
     position: {x: 0, y: 0},
     attrs: {
       '.body': {
         width: '180',
         height: '60'
       },
       '.label': {
         text: 'カード１',
       },
       '.element-node' : {
         'data-color': "#FF00C0"
       }
     },
     inPorts: ['center']
   });
   console.log(others_cells[0].attr('.element-node/data-color'));
   console.log(others_cells[0].attr('.label/text'));
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
   console.log(others_cells[0].attr('element-node/data-color'));
   console.log(others_cells[1].attr('.element-node/data-color'));
   //graph2.addCells(others_cells);
   var user_name = document.getElementById('user_name').value;
   if(user_name){
     var ref = new Firebase("https://myfirstfirebase-cab79.firebaseio.com/"+user_name);
   ref.on("value",function(snapshot){
     //console.log(snapshot.val().user_name + ":" + snapshot.val().cell_position_y + ":" + others_cells[snapshot.val().cell_link_source[0]].id + ":" + snapshot.val().cell_link_source.length);
     for(var i=0;i<8;i++){
     others_cells[i].translate(snapshot.val().cell_position_x[i],snapshot.val().cell_position_y[i]);
     others_cells[i].attr('.element-node/data-color',snapshot.val().cell_color[i]);
   }
   graph2.addCells(others_cells);
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
//canvasの図形を拡大表示、縮小表示する
var svgZoom = svgPanZoom('#canvas svg', {
  center: false,
  zoomEnabled: true,
  panEnabled: true,
  controlIconsEnabled: true,
  fit: false,
  minZoom: 0.75,
  maxZoom:1.5,
  zoomScaleSensitivity: 0.5
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
  zoomScaleSensitivity: 0.5
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
