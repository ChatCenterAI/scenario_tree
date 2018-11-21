

var canvas, canvasSvg, canvasWrapper;

var initCanvas = function(firstEventName){

  canvas = document.querySelector('module-canvas');
  canvasWrapper = document.querySelector('#wrapCanvas');
  canvasSvg = document.querySelector('#canvasSvg');
  
  var width = canvas.offsetWidth;
  var height = canvas.offsetHeight;

  /*
  var event;
  for(var i=0; i<scenarioJson.length; i++){
    if(firstEventName==scenarioJson[i].id){
      event = scenarioJson[i];
      break;
    }
  }

  var firstPos = event.gui.position;
  
  document.querySelector('module-canvas').scrollTop = firstPos.y - window.innerHeight/2 - 17;
  addSimpleMessage(firstPos.x, firstPos.y, event, true);
  */

  // nodeを追加
  var event;
  for(var i=0; i<scenarioJson.length; i++){
    
    event = scenarioJson[i];
    var pos = event.gui.position;
  
    if(scenarioJson[i].type == 'normal') addSimpleMessage(pos.x, pos.y, event, true);
    if(scenarioJson[i].type == 'selection') addSelections(pos.x, pos.y, event, true);
    
    // はじめのメッセージのところまでスクロール
    if(firstEventName==scenarioJson[i].id){
      document.querySelector('module-canvas').scrollLeft = pos.x - 100;
      document.querySelector('module-canvas').scrollTop = pos.y - window.innerHeight/3 - 34;
    }

  }

  // lineを追加
  for(var i=0; i<scenarioJson.length; i++){
    var type = scenarioJson[i].type;
    if(type == 'normal'){
      var eId = scenarioJson[i].id;
      var preEvent = getEventFromScenarioByNext(eId);
      if(preEvent){
        //scenarioJson[i].gui.topLinePosition.origin.y = preEvent.gui.topLinePosition.origin.y; //= scenarioJson[i].gui.topLinePosition.origin.y - 20;
        //scenarioJson[i].gui.topLinePosition.to.y =  preEvent.gui.topLinePosition.to.y//= scenarioJson[i].gui.topLinePosition.to.y -20;

        var arrowOrigin = scenarioJson[i].gui.topLinePosition.origin;
        var arrowTo = scenarioJson[i].gui.topLinePosition.to;
        var topLineId = scenarioJson[i].gui.topLineId;
        addLine(arrowOrigin, arrowTo, topLineId);
      }
    }else if(type == 'selection'){

    }
  } // for

}

var addSimpleMessage = function(x, y, content, isLoading){
  debugger;
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

  content.gui.position.x = item.x;
  content.gui.position.y = item.y;

  // イベントをシナリオに追加
  if(!(isLoading)) scenarioJson.push(content);
  
}


var addSelections = function(x, y, content, isLoading){

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

  content.gui.position.x = item.x;
  content.gui.position.y = item.y;

  // イベントをシナリオに追加
  if(!(isLoading)) scenarioJson.push(content);
}



//-------------------------------------------------------------

var targetId;
var targetEvent;
var targetSelectionEventId
//var targetIndex;
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
      //targetIndex = i;
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

  targetEvent.gui.position.x = event.pageX - x;
  targetEvent.gui.position.y = event.pageY - y;


  var gapX = parseInt(drag.style.left) - parseInt(preLeft);
  var gapY = parseInt(drag.style.top) - parseInt(preTop);

  // 次のテンプレートにつないでいるlineの始点を修正
  var topLine = document.querySelector(`#${targetEvent.gui.topLineId}`);//targetEvent.gui.topLine;
  if(topLine){
    topLine.setAttribute("x1", parseInt(topLine.getAttribute("x1")) + gapX);
    topLine.setAttribute("y1", parseInt(topLine.getAttribute("y1")) + gapY);
  }

  if(targetEventType=='selection'){
    var selections = targetEvent.selections;
    for(var i=0; i<selections.length; i++){
      if(selections[i].topLineId){
        var selectionTopLine = document.querySelector(`#${selections[i].topLineId}`);
        selectionTopLine.setAttribute("x1", parseInt(selectionTopLine.getAttribute("x1")) + gapX);
        selectionTopLine.setAttribute("y1", parseInt(selectionTopLine.getAttribute("y1")) + gapY);
      }
    }
  }

  // 前のテンプレートからつながってるlineの終点を修正
  var bottomLines = [];
  for(var i=0; i<scenarioJson.length; i++){

    if(scenarioJson[i].type=='normal'){
      
      if(scenarioJson[i].next==targetId){
        var bLine = document.querySelector(`#${scenarioJson[i].gui.topLineId}`);
        bottomLines.push(bLine);
      }

    }else if(scenarioJson[i].type=='selection'){

      for(var selection_i=0; selection_i<scenarioJson[i].selections.length; selection_i++){
        if(scenarioJson[i].selections[selection_i].next==targetId){
          var bLineId = scenarioJson[i].selections[selection_i].topLineId;
          var bLine = document.querySelector(`#${bLineId}`);
          bottomLines.push(bLine);
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

    console.log('save');
    service.db.collection('projects').doc(riot.currentProjectId)
        .update({'scenario': scenarioJson});
  }

  //ムーブベントハンドラの消去
  document.body.removeEventListener("mousemove", mmove, false);
  document.body.removeEventListener("touchmove", mmove, false);
 
}





//----------------------------------------------------------------------------------







// 扱っているlineの始点と終点
var arrowOrigin = {};
var arrowTo = {};

// ドラック中かどうかを判定
var isDraging = false;

var mdownOnNode = function(e){
  e.stopPropagation();
  console.log('前前前', scenarioJson);
  isDraging = true;

  if(e.type === "mousedown") {
    var event = e;
  } else {
    var event = e.changedTouches[0];
  }

  // 操作しているテンプレートに紐づくイベントを取得
  targetId = $(e.target).parents('.message')[0].dataset.id;
  
  targetEvent = getEventFromScenarioById(targetId);
  /*for(var i=0; i<scenarioJson.length; i++){
    if(targetId==scenarioJson[i].id){
      targetEvent = scenarioJson[i];
      //targetIndex = i;
      break;
    }
  }*/
  targetEventType = targetEvent.type;

  if(targetEventType=='selection'){
    targetSelectionEventId = e.target.dataset.selectionid;
  }

  // lineの始点を取得
  var button = event.target.getBoundingClientRect();
  var buttonOffset = 16/2; // 8はボタンの半径
  arrowOrigin.x = button.left + buttonOffset + canvas.scrollLeft;
  arrowOrigin.y = button.top + buttonOffset + canvas.scrollTop-48;

  //var $message = $(event.target).parents('.message');
  //var top = $message.offset().top;
  //var left = $message.offset().left;
  //arrowOrigin.x = left + buttonOffset + canvasWrapper.scrollLeft;
  //arrowOrigin.y = top + buttonOffset + canvas.scrollTop;

  document.body.addEventListener("mousemove", moveOnNode, false);
}

var moveOnNode = function(e){
  console.log('前前', scenarioJson);
  if(e.type === "mousemove") {
    var event = e;
  } else {
    var event = e.changedTouches[0];
  }

  // lineの終点の取得
  arrowTo.x = e.pageX + canvas.scrollLeft;
  arrowTo.y = e.pageY + canvas.scrollTop - 48;

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
  var topLine = addLine(arrowOrigin, arrowTo, targetEvent.id);

  console.log('前', scenarioJson);

  if(targetEventType=='normal'){
    // 前に描画したtoplineがあるなら削除してguiプロパティに新しいtopLineを追加
    var pretopLine = targetEvent.gui.topLine;
    if(pretopLine) pretopLine.parentNode.removeChild(pretopLine);

    topLine.setAttribute('id', 'line-' + targetEvent.id);
    //targetEvent.gui.topLine = topLine;
    targetEvent.gui.topLineId = 'line-' + targetEvent.id;

    //targetEvent.gui.topLinePosition = {origin: arrowOrigin, to:arrowTo};
    
    //var preEvent = getEventFromScenarioByNext(targetEvent.id);
    // preEvent.gui.topLinePosition = {origin: arrowOrigin, to:arrowTo};
  }else if(targetEventType=='selection'){
    var selections = targetEvent.selections;
    for(var i=0; i<selections.length; i++){
      if(targetSelectionEventId==selections[i].id){
        // 前に描画したtoplineがあるなら削除してguiプロパティに新しいtopLineを追加
        var pretopLine = selections[i].topLine;
        if(pretopLine) pretopLine.parentNode.removeChild(pretopLine);

        topLine.setAttribute('id', targetSelectionEventId);
        //selections[i].topLine = topLine;
        selections[i].topLineId = targetSelectionEventId;
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







//----------------------------------------------------------------------------------








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



var addLine = function(arrowOrigin, arrowTo, id){
  var topLine = document.createElementNS('http://www.w3.org/2000/svg','line');
  topLine.setAttribute('x1', arrowOrigin.x);
  topLine.setAttribute('y1', arrowOrigin.y);
  topLine.setAttribute('x2', arrowTo.x);
  topLine.setAttribute('y2', arrowTo.y);
  topLine.setAttribute('stroke', '#1976d2');
  topLine.setAttribute('id', id);

  canvasSvg.appendChild(topLine);

  return topLine;
}


// あるidを持つイベントをシナリオから取り出す
var getEventFromScenarioById = function(id){
  var event;
  for(var i=0; i<scenarioJson.length; i++){
    if(scenarioJson[i].id == id){
      event = scenarioJson[i];
      break;
    }
  }
  return event;
}

var getEventFromScenarioByNext = function(next){
  var event;
  for(var i=0; i<scenarioJson.length; i++){
    if(scenarioJson[i].next == next){
      event = scenarioJson[i];
      break;
    }
  }
  return event;
}
