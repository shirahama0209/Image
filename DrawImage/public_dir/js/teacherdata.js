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





  //教師用カードの複製
   teachercells[1] = teachercells[0].clone();
   teachercells[2] = teachercells[0].clone();
   teachercells[3] = teachercells[0].clone();
   teachercells[4] = teachercells[0].clone();
   teachercells[5] = teachercells[0].clone();
   teachercells[6] = teachercells[0].clone();
   teachercells[7] = teachercells[0].clone();
   teachercells[1].translate(400, 0);
   teachercells[2].translate(800, 0);
   teachercells[3].translate(0, 200);
   teachercells[4].translate(400, 200);
   teachercells[5].translate(800,200);
   teachercells[6].translate(200, 400);
   teachercells[7].translate(600, 400);
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


   graph5.addCells(teachercells);
   graph5.addCells(others_links);
