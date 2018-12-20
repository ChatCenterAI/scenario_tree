
var canvas, canvasNodes, canvasSvg;

var loadCanvas = function(firstEventId, letScrollToFirst){

  canvas = document.querySelector('module-canvas');
  canvasSvg = document.querySelector('#canvasSvg');
  canvasNodes = document.querySelector('#canvasNodes');
  

  var width = canvas.offsetWidth;
  var height = canvas.offsetHeight;

  // nodeを追加
  var event;
  for(var i=0; i<scenarioArray.length; i++){
    
    event = scenarioArray[i];
    var pos = event.gui.position;
  
    if(scenarioArray[i].nodeType == 'single'){
      if(scenarioArray[i].type=='normal') addSimpleMessage(pos.x, pos.y, event, true);
      if(scenarioArray[i].type=='openquestion') addOpenQuestion(pos.x, pos.y, event, true);
      if(scenarioArray[i].type=='goto') addGoToNode(pos.x, pos.y, event, true);
    }
    if(scenarioArray[i].nodeType == 'group') addSelections(pos.x, pos.y, event, true);
    
    if(letScrollToFirst && firstEventId==scenarioArray[i].id){
      // はじめのメッセージのところまでスクロール
      document.querySelector('module-canvas').scrollLeft = pos.x - 100;
      document.querySelector('module-canvas').scrollTop = pos.y - window.innerHeight/2;

      // firstのイベントにフォーカスさせる
      focusNode(scenarioArray[i]);
    }

  }


  // lineを追加
  for(var i=0; i<scenarioArray.length; i++){
    var nodeType = scenarioArray[i].nodeType;
    if(nodeType == 'single'){
      if(scenarioArray[i].gui.topLinePosition){
        var pos = scenarioArray[i].gui.topLinePosition;
        var from = {x: pos.origin.x, y: pos.origin.y};
        var to = {x: pos.to.x, y: pos.to.y};
        var topLineId = scenarioArray[i].gui.topLineId;
        addLine(from, to, topLineId);
      }
    }else if(nodeType == 'group'){
      var selections = scenarioArray[i].selections;
      for(var selection_i=0; selection_i<selections.length; selection_i++){
        if(selections[selection_i].topLinePosition){
          var pos = selections[selection_i].topLinePosition;
          var from = {x: pos.origin.x, y: pos.origin.y};
          var to = {x: pos.to.x, y: pos.to.y};
          var topLineId = selections[selection_i].topLineId;
          addLine(from, to, topLineId);
        }
      }
    }
  } // for


  // goto用のlineを追加
  var topLine = document.createElementNS('http://www.w3.org/2000/svg','line');
  topLine.setAttribute('stroke', '#FF4081');
  topLine.setAttribute('id', 'lineForGoToPreview');

  canvasSvg.appendChild(topLine);

}

var addSimpleMessage = function(x, y, content, isLoading){
  // 前のイベントと関連づけする
  if(!(isLoading) && targetEvent && targetEvent.nodeType=='single'){
    targetEvent.next = content.id;
  }

  if(!(isLoading) && targetEvent && targetEvent.nodeType=='group'){
    
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
  itemWrapper.id = content.id;

  itemWrapper.addEventListener("mousedown", mdownOnNode, false);
  itemWrapper.addEventListener("touchstart", mdownOnNode, false);

  //canvas.appendChild(itemWrapper);
  canvasNodes.appendChild(itemWrapper);

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
  

  if(isLoading){
    style.left = `${content.gui.position.x}px`;
    style.top = `${content.gui.position.y}px`;
  }else{
    style.left = `${item.x}px`;
    style.top = `${item.y}px`;
    content.gui.position.x = item.x;
    content.gui.position.y = item.y;
  }

  // イベントをシナリオに追加
  if(!(isLoading)) scenarioArray.push(content);
  
}


var addSelections = function(x, y, content, isLoading){

  // 前のイベントと関連づけする
  if(!(isLoading) && targetEvent) targetEvent.next = content.id;

  if(!(isLoading) && targetEvent && targetEvent.nodeType=='group'){
    
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
  itemWrapper.id = content.id;

  itemWrapper.addEventListener("mousedown", mdownOnNode, false);
  itemWrapper.addEventListener("touchstart", mdownOnNode, false);

  //canvas.appendChild(itemWrapper);
  canvasNodes.appendChild(itemWrapper);

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

  if(isLoading){
    style.left = `${content.gui.position.x}px`;
    style.top = `${content.gui.position.y}px`;
  }else{
    style.left = `${item.x}px`;
    style.top = `${item.y}px`;
    content.gui.position.x = item.x;
    content.gui.position.y = item.y;
  }

  // イベントをシナリオに追加
  if(!(isLoading)) scenarioArray.push(content);
}


var addOpenQuestion = function(x, y, content, isLoading){
  // 前のイベントと関連づけする
  if(!(isLoading) && targetEvent && targetEvent.nodeType=='single'){
    targetEvent.next = content.id;
  }

  if(!(isLoading) && targetEvent && targetEvent.nodeType=='group'){
    
    var selections = targetEvent.selections;
    for(var i=0; i<selections.length; i++){
      if(selections[i].id==targetSelectionEventId){
        selections[i].next = content.id;
      }
    }
    targetEvent.selections = selections;
  }

  /*if(!(isLoading) && content.type=='goto'){

  }*/


  // 最初の要素を入れ込む
  var itemWrapper = document.createElement('div');
  itemWrapper.classList.add('wrap-item-message');
  itemWrapper.dataset.id = content.id;
  itemWrapper.id = content.id;

  itemWrapper.addEventListener("mousedown", mdownOnNode, false);
  itemWrapper.addEventListener("touchstart", mdownOnNode, false);

  //canvas.appendChild(itemWrapper);
  canvasNodes.appendChild(itemWrapper);

  riot.mount(itemWrapper, 'item-open-question-node', {content: content});
  riot.update();


  // 初期位置に配置
  var item = {};
  item.width = itemWrapper.offsetWidth;
  item.height = itemWrapper.offsetHeight;
  item.x = x;// - item.width/2;
  item.y = y - item.height/2;

  var style = itemWrapper.style;
  style.position = 'absolute';
  

  if(isLoading){
    style.left = `${content.gui.position.x}px`;
    style.top = `${content.gui.position.y}px`;
  }else{
    style.left = `${item.x}px`;
    style.top = `${item.y}px`;
    content.gui.position.x = item.x;
    content.gui.position.y = item.y;
  }

  // イベントをシナリオに追加
  if(!(isLoading)) scenarioArray.push(content);
  
}



var addGoToNode = function(x, y, content, isLoading){

  // 最初の要素を入れ込む
  var itemWrapper = document.createElement('div');
  //itemWrapper.classList.add('wrap-item-message');
  itemWrapper.dataset.id = content.id;
  itemWrapper.id = content.id;

  itemWrapper.addEventListener("mousedown", mdownOnNode, false);
  itemWrapper.addEventListener("touchstart", mdownOnNode, false);

  canvasNodes.appendChild(itemWrapper);

  riot.mount(itemWrapper, 'item-goto-node', {content: content});
  riot.update();


  // 初期位置に配置
  var item = {};
  item.width = itemWrapper.offsetWidth;
  item.height = itemWrapper.offsetHeight;
  item.x = x;
  item.y = y - item.height/2;

  var style = itemWrapper.style;
  style.position = 'absolute';
  

  if(isLoading){
    style.left = `${content.gui.position.x}px`;
    style.top = `${content.gui.position.y}px`;
  }else{
    style.left = `${item.x}px`;
    style.top = `${item.y}px`;
    content.gui.position.x = item.x;
    content.gui.position.y = item.y;
  }
  
  itemWrapper.classList.add('is-go-to-node');

  if(!(isLoading)){
    //var preNode = getNodeFromScenarioById(goToFromId);
    //preNode.next = goToFromId;
    scenarioArray.push(content);
  }

}

var addLine = function(arrowOrigin, arrowTo, id){
  var topLine = document.createElementNS('http://www.w3.org/2000/svg','line');
  topLine.setAttribute('x1', arrowOrigin.x);
  topLine.setAttribute('y1', arrowOrigin.y);
  topLine.setAttribute('x2', arrowTo.x);
  topLine.setAttribute('y2', arrowTo.y);
  topLine.setAttribute('stroke', '#2196F3');
  topLine.setAttribute('id', id);

  canvasSvg.appendChild(topLine);

  return topLine;
}




//-------------------------------------------------------------

var targetId;
var targetEvent;
var targetSelectionEventId
var targetEventNodeType;

var x, y;
//マウスが押された際の関数
var mdownOnNode = function(e) {

  e.stopPropagation();
  
  //タッチデイベントとマウスのイベントの差異を吸収
  if(e.type === "mousedown"){
    var event = e;
  }else{
    var event = e.changedTouches[0];
  }

  targetId = $(e.target).parents('.node')[0].dataset.id;
  for(var i=0; i<scenarioArray.length; i++){
    if(targetId==scenarioArray[i].id){
      targetEvent = scenarioArray[i];
      break;
    }
  }
  targetEventNodeType = targetEvent.nodeType;


  //クラス名に .drag を追加
  this.classList.add("drag");

  //要素内の相対座標を取得
  x = event.pageX - this.offsetLeft;
  y = event.pageY - this.offsetTop;

  
  //ムーブイベントにコールバック
  document.body.addEventListener("mousemove", mmoveOnNode, false);
  document.body.addEventListener("touchmove", mmoveOnNode, false);

  // マウスボタンが離されたとき、またはカーソルが外れたとき発火
  document.body.addEventListener("mouseup", mupOnNode, false);
  document.body.addEventListener("touchleave", mupOnNode, false);

}

//マウスカーソルが動いたときに発火
var mmoveOnNode = function(e) {

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
    targetEvent.gui.topLinePosition.origin.x += gapX;
    targetEvent.gui.topLinePosition.origin.y += gapY;
    
    topLine.setAttribute("x1", parseInt(topLine.getAttribute("x1")) + gapX);
    topLine.setAttribute("y1", parseInt(topLine.getAttribute("y1")) + gapY);

  }

  if(targetEventNodeType=='group'){
    var selections = targetEvent.selections;
    for(var i=0; i<selections.length; i++){
      if(selections[i].topLineId){
        if(selections[i].topLinePosition){
          selections[i].topLinePosition.origin.x += gapX;
          selections[i].topLinePosition.origin.y += gapY;
        }
        var selectionTopLine = document.querySelector(`#${selections[i].topLineId}`);
        selectionTopLine.setAttribute("x1", parseInt(selectionTopLine.getAttribute("x1")) + gapX);
        selectionTopLine.setAttribute("y1", parseInt(selectionTopLine.getAttribute("y1")) + gapY);
      }
    }
  }

  // 前のテンプレートからつながってるlineの終点を修正
  var preNormalNodes = getNormalNodesFromScenarioByNext(targetId);
  for(var i=0; i<preNormalNodes.length; i++){
    preNormalNodes[i].gui.topLinePosition.to.x += gapX;
    preNormalNodes[i].gui.topLinePosition.to.y += gapY;
    var bLineId = preNormalNodes[i].gui.topLineId;
    var bLine = document.querySelector(`#${bLineId}`);
    bLine.setAttribute("x2", parseInt(bLine.getAttribute("x2")) + gapX);
    bLine.setAttribute("y2", parseInt(bLine.getAttribute("y2")) + gapY);
  }

  var preSelectionNodes = getSelectionsFromScenarioByNext(targetId);
  for(var i=0; i<preSelectionNodes.length; i++){
    preSelectionNodes[i].topLinePosition.to.x += gapX;
    preSelectionNodes[i].topLinePosition.to.y += gapY;
    var bLineId = preSelectionNodes[i].topLineId;
    var bLine = document.querySelector(`#${bLineId}`);
    bLine.setAttribute("x2", parseInt(bLine.getAttribute("x2")) + gapX);
    bLine.setAttribute("y2", parseInt(bLine.getAttribute("y2")) + gapY);
  }

  
}

//マウスボタンが上がったら発火
var mupOnNode = function(e) {

  e.stopPropagation();

  var drag = document.getElementsByClassName("drag")[0];

  if(drag){
    drag.removeEventListener("mouseup", mupOnNode, false);
    drag.removeEventListener("touchend", mupOnNode, false);
    //クラス名 .drag も消す
    drag.classList.remove("drag");

    //saveScenario();
    console.log('mupOnNode');
    saveScenarioAsSubcollection();
  }

  //ムーブベントハンドラの消去
  document.body.removeEventListener("mousemove", mmoveOnNode, false);
  document.body.removeEventListener("touchmove", mmoveOnNode, false);
 
}





//----------------------------------------------------------------------------------





// 扱っているlineの始点と終点
var arrowOrigin = {};
var arrowTo = {};

// ドラック中かどうかを判定
var isDraging = false;

var mdownOnLineStart = function(e){
  e.stopPropagation();
  
  isDraging = true;

  if(e.type === "mousedown") {
    var event = e;
  } else {
    var event = e.changedTouches[0];
  }

  // 操作しているテンプレートに紐づくイベントを取得
  targetId = $(e.target).parents('.node')[0].dataset.id;
  
  targetEvent = getEventFromScenarioById(targetId);
  targetEventNodeType = targetEvent.nodeType;

  if(targetEventNodeType=='group'){
    targetSelectionEventId = e.target.dataset.selectionid;
  }

  // lineの始点を取得
  var button = event.target.getBoundingClientRect();
  // インスペクタの大きさ分を考慮
  var leftOffset = document.querySelector('inspector').offsetWidth;
  var buttonOffset = 16/2; // 8はボタンの半径
  arrowOrigin.x = button.left + buttonOffset + canvas.scrollLeft - leftOffset;
  arrowOrigin.y = button.top + buttonOffset + canvas.scrollTop-48;


  // セーブされていないlineがあったら削除してポップがでてたらそれも消す
  var unsavedLine = document.querySelector('.unsaved');
  if(unsavedLine){
    unsavedLine.parentNode.removeChild(unsavedLine);
    var pop = document.querySelector('wrap-pop-after-drag');
    pop.classList.remove('show-pop');

    var nodeId = unsavedLine.id.split('-')[1];
    var node = getNodeFromScenarioById(nodeId);
    delete node.topLineId;
    delete node.topLinePosition;
  }


  document.body.addEventListener("mousemove", moveOnLineStart, false);
  document.body.addEventListener("touchmove", moveOnLineStart, false);
}

var moveOnLineStart = function(e){
  
  if(e.type === "mousemove") {
    var event = e;
  } else {
    var event = e.changedTouches[0];
  }

  // lineの終点の取得
  // インスペクタの大きさ分を考慮
  var leftOffset = document.querySelector('inspector').offsetWidth;
  arrowTo.x = e.pageX + canvas.scrollLeft - leftOffset;
  arrowTo.y = e.pageY + canvas.scrollTop - 48;

  // プレヴュー用のlineを表示
  var lineForPreview = document.querySelector('#lineForPreview');
  lineForPreview.classList.add('show');
  lineForPreview.setAttribute('x1', arrowOrigin.x);
  lineForPreview.setAttribute('y1', arrowOrigin.y);
  lineForPreview.setAttribute('x2', arrowTo.x);
  lineForPreview.setAttribute('y2', arrowTo.y);
  lineForPreview.setAttribute('stroke', '#1976d2');


  document.body.addEventListener("mouseup", upOnLineStart, false);
  document.body.addEventListener("touchleave", upOnLineStart, false);
}

var upOnLineStart = function(e){

  isDraging = false;

  // プレヴュー用のlineを非表示
  var lineForPreview = document.querySelector('#lineForPreview');
  lineForPreview.classList.remove('show');

  // 次のテンプレートにつなぐlineを追加
  var topLine = addLine(arrowOrigin, arrowTo, targetEvent.id);
  topLine.classList.add('unsaved');


  if(targetEventNodeType=='single'){
    // 前に描画したtoplineがあるなら削除してguiプロパティに新しいtopLineを追加
    var preTopLine = document.querySelector(`#${targetEvent.gui.topLineId}`);
    if(preTopLine) preTopLine.parentNode.removeChild(preTopLine);

    topLine.setAttribute('id', 'line-'+targetEvent.id);
    targetEvent.gui.topLineId = 'line-'+targetEvent.id;

    var from = {x: arrowOrigin.x, y: arrowOrigin.y};
    var to = {x: arrowTo.x, y: arrowTo.y};

    targetEvent.gui.topLinePosition = {origin: from, to: to};

  }else if(targetEventNodeType=='group'){
    var selections = targetEvent.selections;
    for(var i=0; i<selections.length; i++){
      if(targetSelectionEventId==selections[i].id){
        // 前に描画したtoplineがあるなら削除してguiプロパティに新しいtopLineを追加
        var preTopLine = document.querySelector(`#${selections[i].topLineId}`);
        if(preTopLine) preTopLine.parentNode.removeChild(preTopLine);

        topLine.setAttribute('id', 'line-'+targetSelectionEventId);
        //selections[i].topLine = topLine;
        selections[i].topLineId = 'line-'+targetSelectionEventId;

        // topLinePositionを追加
        var from = {x: arrowOrigin.x, y: arrowOrigin.y};
        var to = {x: arrowTo.x, y: arrowTo.y};

        selections[i].topLinePosition = {origin: from, to: to};
      }
    } // for()
  }


  // ドラッグしているマウスがtemplateの上ならそのテンプレートとイベントをつなげる
  if(isOverTemplate){

    // topLineの終点をマウスオーバーしているテンプレートの座標に修正
    var elemX = parseInt(overTemplateElm.style.left);
    var elemY = parseInt(overTemplateElm.style.top);
    var offsetY = overTemplateElm.offsetHeight/2;
    topLine.setAttribute('x2', elemX);
    topLine.setAttribute('y2', elemY + offsetY);


    // nextイベントをマウスオーバーしているテンプレートのイベントに紐付け
    if(targetEventNodeType=='single'){

      targetEvent.next = idOfOverTemplate;
      var from = {x: arrowOrigin.x, y: arrowOrigin.y};
      var to = {x: elemX, y: elemY + offsetY};
      targetEvent.gui.topLinePosition = {origin: from, to: to};
      targetEvent.topLineId = `line-${targetId}`;

    }else if(targetEventNodeType=='group'){

      for(var i=0; i<targetEvent.selections.length; i++){
        if(targetEvent.selections[i].id==targetSelectionEventId){
          targetEvent.selections[i].next = idOfOverTemplate;
          var from = {x: arrowOrigin.x, y: arrowOrigin.y};
          var to = {x: elemX, y: elemY + offsetY};
          targetEvent.selections[i].topLinePosition = {origin: from, to: to};
          targetEvent.selections[i].topLineId = `line-${selections[i].id}`;
        }
      }

    }

    //saveScenario();
    saveScenarioAsSubcollection();

  }else{
    // 終点にポップを出す
    riot.mount('wrap-pop-after-drag', 'item-pop-after-drag');
    riot.update();

    var pop = document.querySelector('wrap-pop-after-drag');
    pop.classList.add('show-pop');

    var popOffset = pop.offsetHeight/2; //= 66.5/2;
    pop.style.left = `${arrowTo.x}px`;
    pop.style.top = `${arrowTo.y - popOffset}px`;

  }

  document.body.removeEventListener("mousemove", moveOnLineStart, false);
  document.body.removeEventListener("mouseup", upOnLineStart, false);
  document.body.removeEventListener("touchmove", upOnLineStart, false);
}




//--------------------------------------------------------------------------------------





var underChoiceOfGoTo = false;
var goToFrom, goToFromId; // goToNodeを作ろうとした時の派生元のノードのイベントを一時保存しておく変数

var clickOnNode = function(e){

  targetId = $(e.target).parents('.node')[0].dataset.id;
  targetEvent = getEventFromScenarioById(targetId);
  
  // ノードにフォーカスする
  focusNode(targetEvent);

  // Go toの先を選択する場合
  if(underChoiceOfGoTo){

    underChoiceOfGoTo = false;

    var goToContent = {
      author: session.user.uid,
      id: `goToTmp${riot.currentProject.nodeNum}`,
      toId: targetEvent.id,
      num: riot.currentProject.nodeNum,//scenarioArray.length,
      type: 'goto',
      nodeType: 'single',
      text: targetEvent.num,
      gui: {
        position: {},
      },
    };

    var preNode = getNodeFromScenarioById(goToFromId);
    preNode.next = `goToTmp${riot.currentProject.nodeNum}`;

    addGoToNode(arrowTo.x, arrowTo.y, goToContent, false);

    riot.currentProject.nodeNum++;

    //saveScenario();
    saveScenarioAsSubcollection(goToContent);
 
    // ポップを消去
    var pop = document.querySelector('wrap-pop-after-drag');
    pop.classList.remove('show-pop');


    // オーバーレイを閉じてもとのz-indexにもどす
    $('#canvasOverlay').fadeOut(400);
    var canvasNodes = document.getElementById('canvasNodes');
    canvasNodes.classList.remove('add-node-z');

  }

  underSelectionOfGoTo = false;

}

var currentFocusedEvent;
var focusNode = function(focusedEvent){

  currentFocusedEvent = focusedEvent;

  // Go Toのプレヴュー用のラインを削除
  var lineForGoToPreview = document.getElementById('lineForGoToPreview');
  if(lineForGoToPreview) lineForGoToPreview.classList.remove('show');

  switch(focusedEvent.type){
    case 'normal':

      // インスペクタに表示
      riot.mount('inspector', 'module-inspector-normal', {content: focusedEvent});
      riot.update();

    break;
    case 'selection':

      riot.mount('inspector', 'module-inspector-selection', {content: focusedEvent});
      riot.update();

    break;
    case 'openquestion':

      riot.mount('inspector', 'module-inspector-openquestion', {content: focusedEvent});
      riot.update();

    break;
    case 'goto':

      var toId = focusedEvent.toId;
      var toEvent = getEventFromScenarioById(toId);

      if(toEvent.type=='normal'){
        riot.mount('inspector', 'module-inspector-normal', {content: toEvent});
        riot.update();
      }else if(toEvent.type=='selection'){
        riot.mount('inspector', 'module-inspector-selection', {content: toEvent});
        riot.update();
      }

      var toNode = document.getElementById(toEvent.id);
      toNode.classList.add('focused-node');

      // Go Toがどこにつながっているかをプレヴュー
      var fromNode = document.getElementById(focusedEvent.id);
      
      var x1 = parseInt(fromNode.style.left);
      var y1 = parseInt(fromNode.style.top) + fromNode.offsetHeight/2;
      var x2 = parseInt(toNode.style.left) + toNode.offsetWidth;///2;
      var y2 = parseInt(toNode.style.top) + toNode.offsetHeight/2;

      if(lineForGoToPreview){
        lineForGoToPreview.classList.add('show');
        lineForGoToPreview.setAttribute('x1', x1);
        lineForGoToPreview.setAttribute('y1', y1);
        lineForGoToPreview.setAttribute('x2', x2);
        lineForGoToPreview.setAttribute('y2', y2);
        lineForGoToPreview.id = 'lineForGoToPreview';
      }

    break;
  }

  $('.focused-node').removeClass('focused-node');
  var node = document.getElementById(focusedEvent.id);
  node.classList.add('focused-node');

  if(focusedEvent.type=='goto'){
    var toNode = document.getElementById(toEvent.id);
    console.log('toNode:', toNode);
    toNode.classList.add('focused-node');
  }

}



