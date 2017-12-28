//教師がカードの内容を更新する時の処理
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
