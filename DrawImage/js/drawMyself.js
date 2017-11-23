

var canvas = $('#canvas');
var filter = $('#filter');
var addColor = $('#addColor');
var colorChange = $('#colorChange');
var cells = [];
var links = [];
var message = $('#message');
var graph = new joint.dia.Graph();

//描画用のキャンバス
var paper = new joint.dia.Paper({
  el: canvas,
  //キャンバスのサイズ
  width: 1000,
  height: 600,
  model: graph,
  gridSize: 10,

  clickThreshold: 1
});

joint.shapes.devs.Model = joint.shapes.devs.Model.extend({
markup: '<g class="element-node">'+
             '<rect class="body" stroke-width="0" rx="3px" ry="5px"></rect>'+
            '<text class="label" y="0.8em" xml:space="preserve" font-size="34" text-anchor="middle" font-family="Arial, helvetica, sans-serif">'+
              '<tspan id="v-18" dy="0em" x="0" class="v-line"></tspan>'+
            '</text>'+
          '<g class="inPorts"/>' +
          '<g class="outPorts"/>' +
        '</g>',
portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/></g>'
});

//カードの生成
cells[0] = new joint.shapes.devs.Model({
  type: 'devs.Model',
  position: {x: 20, y: 20},
  attrs: {
    '.body': {
      width: '180',
      height: '60'
    },
    '.label': {
      text: 'カード１',
    },
    '.element-node' : {
      'data-color': 'gray'
    }
  },
  inPorts: ['center']
});


//他のカードの複製
cells[1] = cells[0].clone();
cells[1].translate(200, 0);
cells[2] = cells[0].clone();
cells[2].translate(400, 0);
cells[3] = cells[0].clone();
cells[3].translate(600, 0);
cells[4] = cells[0].clone();
cells[4].translate(0, 200);
cells[5] = cells[0].clone();
cells[5].translate(200,200);
cells[6] = cells[0].clone();
cells[6].translate(400, 200);
cells[7] = cells[0].clone();
cells[7].translate(600, 200);
//カードの属性設定
cells[3].attr('.element-node/data-color','pink');

//各カードにラベルづけ
for(var i=0;i<8;i++){
cells[i].attr('.label/text', 'カード'+i);
}

//矢印、およびテキストの作成
/*
links[0] = new joint.dia.Link({
     source: { id: cells[0].id },
     target: { id: cells[5].id },
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
     { position: 0.5, attrs: { text: { text: '一人当たりの土地が減ったため', fill: '#f6f6f6', 'font-family': 'sans-serif' }, rect: { stroke: '#7c68fc', 'stroke-width': 20, rx: 5, ry: 5 } }}]

 });*/

//新規で矢印作成

function addLink(){
  //HTMLから理由を取り出す
  var source1 = input_sample.source.value;
  var reason  = input_sample.reason.value;
  var target1 = input_sample.target.value;
 links[0] = new joint.dia.Link({
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
  graph.addCells(links);
}


function colorChange(){
  var color = colorChange.value();
cells[color].attr('.element-node/data-color','pink');
cells[5].attr('.element-node/data-color','black');
graph.addCells(cells);
}

 graph.addCells(cells);
 graph.addCells(links);


//firebaseに送信用メソッド
 function send(){
   console.log(cells[1].id, ':', cells[1].get('position'));
 }

 $('#send').on('click', send);



function addCell(){
  var color = addColor.val();
  var number = cells.length;
  cells[number] = cells[0].clone();
  cells[number].translate(0, 100);
  cells[number].attr('.element-node/data-color', color);
  cells[number].attr('.text/text', 'NEW');
  graph.addCells(cells);
}

$('#addCell').on('click', addCell);
//$('#addLink').on('click', addLink);
$('#colorChange').on('click', colorChange);


$(filter).on('change', function(e){
  canvas.attr('data-filter', e.target.value);
});

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

(function(){
  paper.on('cell:pointerdown', function(){
    svgZoom.disablePan();
  });
  paper.on('cell:pointerup', function(){
    svgZoom.enablePan();
  });

  paper.on('cell:pointerclick', function(e){
    message.addClass('visible');
    message.html(e.el.textContent+' clicked');
  setTimeout(function(){  message.removeClass('visible');
                       }, 1000);
  });
})();
