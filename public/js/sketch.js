
var scenarioJson = [
  {
    id: 'first',
    type: 'normal',
    text: 'This is My Message',
    gui: {},
  },
];

var canvas, canvasSvg, canvasWrapper;

var initCanvas = function(){

  canvas = document.querySelector('#canvas');
  canvasWrapper = document.querySelector('#wrapCanvas');
  canvasSvg = document.querySelector('#canvasSvg');
  
  var width = canvas.offsetWidth;
  var height = canvas.offsetHeight;

  var event;
  for(var i=0; i<scenarioJson.length; i++){
    if('first'==scenarioJson[i].id){
      event = scenarioJson[i];
      break;
    }
  }

  addSimpleMessage(150, 400, event, true);

}

var addSimpleMessage = function(x, y, content, isLoading){

  // イベントをシナリオに追加
  if(!(isLoading)) scenarioJson.push(content);

  // 前のイベントと関連づけする
  if(!(isLoading) && targetEvent && targetEvent.type!='selection') targetEvent.next = content.id;

  if(!(isLoading) && targetEvent && targetEvent.type=='selection'){
    
    var selections = targetEvent.selections;
    for(var i=0; i<selections.length; i++){
      if(selections[i].id==targetSelectionEventId){
        selections[i].next = content.id;
      }
    }
    targetEvent.selections = selections;
  }

  // 最初の要素を入れ込む
  var itemWrapper = document.createElement('div');
  itemWrapper.classList.add('wrap-item-message');
  itemWrapper.dataset.id = content.id;

  itemWrapper.addEventListener("mousedown", mdown, false);
  itemWrapper.addEventListener("touchstart", mdown, false);

  canvas.appendChild(itemWrapper);

  riot.mount(itemWrapper, 'item-message', {content: content});
  riot.update();

  // 初期位置に配置
  var item = {};
  item.width = itemWrapper.offsetWidth;
  item.height = itemWrapper.offsetHeight;
  item.x = x;// - item.width/2;
  item.y = y - item.height/2;

  var style = itemWrapper.style;
  style.position = 'absolute';
  style.left = `${item.x}px`;
  style.top = `${item.y}px`;
}


var addSelections = function(x, y, content, isLoading){

  // イベントをシナリオに追加
  if(!(isLoading)) scenarioJson.push(content);


  // 前のイベントと関連づけする
  if(!(isLoading) && targetEvent) targetEvent.next = content.id;

  if(!(isLoading) && targetEvent && targetEvent.type=='selection'){
    
    var selections = targetEvent.selections;
    for(var i=0; i<selections.length; i++){
      if(selections[i].id==targetSelectionEventId){
        selections[i].next = content.id;
      }
    }
    targetEvent.selections = selections;
  }

  // 最初の要素を入れ込む
  var itemWrapper = document.createElement('div');
  itemWrapper.classList.add('wrap-item-selection');
  itemWrapper.dataset.id = content.id;

  itemWrapper.addEventListener("mousedown", mdown, false);
  itemWrapper.addEventListener("touchstart", mdown, false);

  canvas.appendChild(itemWrapper);

  riot.mount(itemWrapper, 'item-selection', {content: content});
  riot.update();

  // 初期位置に配置
  var item = {};
  item.width = itemWrapper.offsetWidth;
  item.height = itemWrapper.offsetHeight;
  item.x = x;// - item.width/2;
  item.y = y - item.height/2;

  var style = itemWrapper.style;
  style.position = 'absolute';
  style.left = `${item.x}px`;
  style.top = `${item.y}px`;
}



//-------------------------------------------------------------

var targetId;
var targetEvent;
var targetSelectionEventId
var targetIndex;
var targetEventType;

var x, y;
//マウスが押された際の関数
var mdown = function(e) {

  e.stopPropagation();
  
  //タッチデイベントとマウスのイベントの差異を吸収
  if(e.type === "mousedown"){
    var event = e;
  }else{
    var event = e.changedTouches[0];
  }

  targetId = $(e.target).parents('.message')[0].dataset.id;
  for(var i=0; i<scenarioJson.length; i++){
    if(targetId==scenarioJson[i].id){
      targetEvent = scenarioJson[i];
      targetIndex = i;
      break;
    }
  }
  targetEventType = targetEvent.type;
  /*
  if(targetEventType=='selection'){
    targetSelectionEventId = e.target.dataset.selectionid;
  }
  */

  //クラス名に .drag を追加
  this.classList.add("drag");

  //要素内の相対座標を取得
  x = event.pageX - this.offsetLeft;
  y = event.pageY - this.offsetTop;

  
  //ムーブイベントにコールバック
  document.body.addEventListener("mousemove", mmove, false);
  document.body.addEventListener("touchmove", mmove, false);

}

//マウスカーソルが動いたときに発火
var mmove = function(e) {

  e.stopPropagation();
  
  //同様にマウスとタッチの差異を吸収
  if(e.type === "mousemove") {
    var event = e;
  } else {
    var event = e.changedTouches[0];
  }

  //フリックしたときに画面を動かさないようにデフォルト動作を抑制
  e.preventDefault();
 
  //ドラッグしている要素を取得
  var drag = document.getElementsByClassName("drag")[0];

  var preLeft = drag.style.left;
  var preTop = drag.style.top;

  //マウスが動いた場所に要素を動かす
  drag.style.left = event.pageX - x + "px";
  drag.style.top = event.pageY - y + "px";


  var gapX = parseInt(drag.style.left) - parseInt(preLeft);
  var gapY = parseInt(drag.style.top) - parseInt(preTop);

  // 次のテンプレートにつないでいるlineの始点を修正
  var topLine = targetEvent.gui.topLine;
  if(topLine){
    topLine.setAttribute("x1", parseInt(topLine.getAttribute("x1")) + gapX);
    topLine.setAttribute("y1", parseInt(topLine.getAttribute("y1")) + gapY);
  }

  // TO DO: 選択肢のlineの始点がついてくるようにする
  if(targetEventType=='selection'){
    var selections = targetEvent.selections;
    for(var i=0; i<selections.length; i++){
      if(selections[i].topLine){
        selections[i].topLine.setAttribute("x1", parseInt(selections[i].topLine.getAttribute("x1")) + gapX);
        selections[i].topLine.setAttribute("y1", parseInt(selections[i].topLine.getAttribute("y1")) + gapY);
      }
    }
  }

  // 前のテンプレートからつながってるlineの終点を修正
  /*
  var bottomLine = targetEvent.gui.bottomLine;
  if(bottomLine){
    bottomLine.setAttribute("x2", parseInt(bottomLine.getAttribute("x2")) + gapX);
    bottomLine.setAttribute("y2", parseInt(bottomLine.getAttribute("y2")) + gapY);
  }
  */
  // 前のテンプレートからつながってるlineの終点を修正
  var bottomLines = [];
  for(var i=0; i<scenarioJson.length; i++){

    if(scenarioJson[i].type=='normal'){
      
      if(scenarioJson[i].next==targetId){
        bottomLines.push(scenarioJson[i].gui.topLine);
      }

    }else if(scenarioJson[i].type=='selection'){

      for(var selection_i=0; selection_i<scenarioJson[i].selections.length; selection_i++){
        if(scenarioJson[i].selections[selection_i].next==targetId){
          bottomLines.push(scenarioJson[i].selections[selection_i].topLine);
        }
      } // for

    }
  } // for


  for(var i=0; i<bottomLines.length; i++){
    bottomLines[i].setAttribute("x2", parseInt(bottomLines[i].getAttribute("x2")) + gapX);
    bottomLines[i].setAttribute("y2", parseInt(bottomLines[i].getAttribute("y2")) + gapY);
  }


  // マウスボタンが離されたとき、またはカーソルが外れたとき発火
  drag.addEventListener("mouseup", mup, false);
  drag.addEventListener("touchend", mup, false);


  document.body.addEventListener("mouseleave", mup, false);
  document.body.addEventListener("touchleave", mup, false);
}

//マウスボタンが上がったら発火
var mup = function(e) {

  e.stopPropagation();

  var drag = document.getElementsByClassName("drag")[0];

  if(drag){
    drag.removeEventListener("mouseup", mup, false);
    drag.removeEventListener("touchend", mup, false);
    //クラス名 .drag も消す
    drag.classList.remove("drag");
  }

  //ムーブベントハンドラの消去
  document.body.removeEventListener("mousemove", mmove, false);
  document.body.removeEventListener("touchmove", mmove, false);
 
}


//-------------------------------------------------------------

// 扱っているlineの始点と終点
var arrowOrigin = {};
var arrowTo = {};

// 次のイベントに保存するためにlineの要素を一時保存する変数
var topLineToSaveToNextEvent;

// ドラック中かどうかを判定
var isDraging = false;

var mdownOnNode = function(e){
  e.stopPropagation();

  isDraging = true;

  if(e.type === "mousedown") {
    var event = e;
  } else {
    var event = e.changedTouches[0];
  }

  // 操作しているテンプレートに紐づくイベントを取得
  targetId = $(e.target).parents('.message')[0].dataset.id;
  for(var i=0; i<scenarioJson.length; i++){
    if(targetId==scenarioJson[i].id){
      targetEvent = scenarioJson[i];
      targetIndex = i;
      break;
    }
  }
  targetEventType = targetEvent.type;

  if(targetEventType=='selection'){
    targetSelectionEventId = e.target.dataset.selectionid;
  }

  // lineの始点を取得
  var button = event.target.getBoundingClientRect();
  var buttonOffset = 16/2; // 8はボタンの半径
  arrowOrigin.x = button.left + buttonOffset + canvasWrapper.scrollLeft;
  arrowOrigin.y = button.top + buttonOffset + canvas.scrollTop;

  document.body.addEventListener("mousemove", moveOnNode, false);
}

var moveOnNode = function(e){

  if(e.type === "mousemove") {
    var event = e;
  } else {
    var event = e.changedTouches[0];
  }

  // lineの終点の取得
  arrowTo.x = e.pageX + canvasWrapper.scrollLeft;
  arrowTo.y = e.pageY + canvas.scrollTop;

  // プレヴュー用のlineを表示
  var lineForPreview = document.querySelector('#lineForPreview');
  lineForPreview.classList.add('show');
  lineForPreview.setAttribute('x1', arrowOrigin.x);
  lineForPreview.setAttribute('y1', arrowOrigin.y);
  lineForPreview.setAttribute('x2', arrowTo.x);
  lineForPreview.setAttribute('y2', arrowTo.y);
  lineForPreview.setAttribute('stroke', '#1976d2');


  document.body.addEventListener("mouseup", upOnNode, false);
}

var upOnNode = function(e){

  isDraging = false;

  // プレヴュー用のlineを非表示
  var lineForPreview = document.querySelector('#lineForPreview');
  lineForPreview.classList.remove('show');

  // 次のテンプレートにつなぐlineを追加
  var topLine = document.createElementNS('http://www.w3.org/2000/svg','line');
  topLine.setAttribute('x1', arrowOrigin.x);
  topLine.setAttribute('y1', arrowOrigin.y);
  topLine.setAttribute('x2', arrowTo.x);
  topLine.setAttribute('y2', arrowTo.y);
  topLine.setAttribute('stroke', '#1976d2');
  topLineToSaveToNextEvent = topLine;

  canvasSvg.appendChild(topLine);

  if(targetEventType=='normal'){
    // 前に描画したtoplineがあるなら削除してguiプロパティに新しいtopLineを追加
    var pretopLine = targetEvent.gui.topLine;
    if(pretopLine) pretopLine.parentNode.removeChild(pretopLine);
    targetEvent.gui.topLine = topLine;
  }else if(targetEventType=='selection'){
    var selections = targetEvent.selections;
    for(var i=0; i<selections.length; i++){
      if(targetSelectionEventId==selections[i].id){
        // 前に描画したtoplineがあるなら削除してguiプロパティに新しいtopLineを追加
        var pretopLine = selections[i].topLine;
        if(pretopLine) pretopLine.parentNode.removeChild(pretopLine);
        selections[i].topLine = topLine;
      }
    } // for()
  }

  // ドラッグしているマウスがtemplateの上ならそのテンプレートとイベントをつなげる
  if(isOverTemplate){
    // nextイベントをマウスオーバーしているテンプレートのイベントに紐付け
    if(targetEventType=='normal'){
      targetEvent.next = idOfOverTemplate;
    }else if(targetEventType=='selection'){
      for(var i=0; i<targetEvent.selections.length; i++){
        if(targetEvent.selections[i].id==targetSelectionEventId){
          targetEvent.selections[i].next = idOfOverTemplate;
        }
      }
    }

    // topLineの終点をマウスオーバーしているテンプレートの座標に修正
    var elemX = parseInt(overTemplateElm.style.left);
    var elemY = parseInt(overTemplateElm.style.top);
    var offsetY = overTemplateElm.offsetHeight/2;
    topLine.setAttribute('x2', elemX);
    topLine.setAttribute('y2', elemY + offsetY);

    /*
    // マウスオーバーしているテンプレートのbuttomLineを更新
    for(var i=0; i<scenarioJson.length; i++){
      if(idOfOverTemplate == scenarioJson[i].id){
        scenarioJson[i].gui.buttomLine = topLine;
        debugger
        break;
      }
    }
    */

  }else{
    // 終点にポップを出す
    var pop = document.querySelector('item-pop-after-drag');
    var popOffset = 66.5/2;
    pop.style.left = `${arrowTo.x}px`;
    pop.style.top = `${arrowTo.y - popOffset}px`;
    pop.classList.add('show-pop');
  }

  document.body.removeEventListener("mousemove", moveOnNode, false);
  document.body.removeEventListener("mouseup", upOnNode, false);
}

//-------------------------------------------------------------

var isOverTemplate = false;
var idOfOverTemplate, overTemplateElm;
var moverTemplate = function(e){
  isOverTemplate = true;

  if(isDraging){
    var targetElem = e.currentTarget;
    overTemplateElm = targetElem;
    idOfOverTemplate = targetElem.dataset.id;
    targetElem.classList.add('active-over');
  }
}

var moutTemplate = function(e){
  isOverTemplate = false;

  var targetElem = e.currentTarget;
  idOfOverTemplate = targetElem.dataset.id;
  targetElem.classList.remove('active-over');
}






