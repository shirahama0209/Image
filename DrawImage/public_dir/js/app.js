//Firebase初期設
/*
var config = {
    apiKey: "AIzaSyA71e9M2OB0FM3ItG1qv8ZLd2XNMXPkRKU",
    authDomain: "myfirstfirebase-cab79.firebaseapp.com",
    databaseURL: "https://myfirstfirebase-cab79.firebaseio.com",
    projectId: "myfirstfirebase-cab79",
    storageBucket: "myfirstfirebase-cab79.appspot.com",
    messagingSenderId: "1047199251430"
  };
firebase.initializeApp(config);
*/



//DOM取得
var inputarea = document.getElementById('input-area');
var newuser = document.getElementById('newuser');
var login1 = document.getElementById('login1');
var login2 = document.getElementById('login2');
var logout = document.getElementById('logout');
var info = document.getElementById('info');
var teacher = document.getElementById('teacher');


//新規登録処理
newuser.addEventListener('click', function(e) {
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

/*
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .catch(function(error) {
    alert('登録できません（' + error.message + '）');
  });*/

});



//ログイン処理
login1.addEventListener('click', function(e) {
  var user = document.getElementById('user').value;
  var classnumber = document.getElementById('classnumber').value;
  var password = document.getElementById('password').value;
//  location.href = "DrawImage.html?data="+encodeURIComponent(user);
location.href = "DrawImage.html?data="+encodeURIComponent(user)+"?class="+encodeURIComponent(classnumber);

  /*
  firebase.auth().signInWithEmailAndPassword(email, password)
  .catch(function(error) {
    alert('ログインできません（' + error.message + '）');
  });*/
});


//ログイン処理
login2.addEventListener('click', function(e) {
  var user = document.getElementById('user').value;
  var classnumber = document.getElementById('classnumber').value;
  var password = document.getElementById('password').value;
//  location.href = "DrawImage.html?data="+encodeURIComponent(user);
location.href = "DrawImage1.html?data="+encodeURIComponent(user)+"?class="+encodeURIComponent(classnumber);

  /*
  firebase.auth().signInWithEmailAndPassword(email, password)
  .catch(function(error) {
    alert('ログインできません（' + error.message + '）');
  });*/
});




//教師画面に移動
teacher.addEventListener('click', function(e) {
  var user = document.getElementById('user').value;
  var password = document.getElementById('password').value;
location.href = "teacher.html?data="+encodeURIComponent(user);
});

//ログアウト処理
logout.addEventListener('click', function() {
  //firebase.auth().signOut();
});



//認証状態の確認
firebase.auth().onAuthStateChanged(function(user) {
  if(user) {
  //  location.href = "DrawImage.html?data="+encodeURIComponent(user);
    location.href = "DrawImage.html?data="+encodeURIComponent(user)+"?class="+encodeURIComponent(classnumber);


    //window.location.href = 'DrawImage.html';
  }
  else {
    logoutDisplay();
  }
});



function loginDisplay() {
  logout.classList.remove('hide');
  inputarea.classList.add('hide');

  info.textContent = "ログイン中です！";
}


function logoutDisplay() {
  logout.classList.add('hide');
  inputarea.classList.remove('hide');

  info.textContent = "";
}
