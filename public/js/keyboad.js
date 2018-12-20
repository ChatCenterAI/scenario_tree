// キーボードイベント
var keydown = function (e){
  
  //e.preventDefault();

  if((e.ctrlKey || e.metaKey)) {

    e.preventDefault();

    switch(e.key){

      case 'm':
        if(currentFocusedEvent) addNewSimpleMessageViaCommand();
      break

      case 'r': 
        window.location.reload();  
      break;
      case 's': 
        saveScenarioAsSubcollection();
      break;
      case 'y': 
        redoCanvas();
      break;
      case 'z': 
        undoCanvas();
      break;

    }

    return false;
  }
  
}

document.onkeydown = keydown;



var addNewSimpleMessageViaCommand = function(){
  
  console.log(currentFocusedEvent);

  var focusedNode = document.getElementById(currentFocusedEvent.id);
  var newPosX = currentFocusedEvent.gui.position.x + focusedNode.offsetWidth + 50;
  var newPosY = currentFocusedEvent.gui.position.y + focusedNode.offsetHeight/2;
  
  var content = {
    author: session.user.uid,
    id: `simpleTmp${riot.currentProject.nodeNum}`,
    num: riot.currentProject.nodeNum,
    type: 'normal',
    nodeType: 'single',
    text: 'Message',
    gui: {
      position: {},
    },
  };
  riot.currentProject.nodeNum++;

  //targetEvent = currentFocusedEvent;
  addSimpleMessage(newPosX, newPosY, content, false);

  // lineを追加
  var origin = {x:newPosX-70, y: newPosY};
  var to = {x: newPosX, y: newPosY};
  currentFocusedEvent.next = content.id;
  currentFocusedEvent.gui.topLineId = `line-${currentFocusedEvent.id}`;
  currentFocusedEvent.gui.topLinePosition = {};
  currentFocusedEvent.gui.topLinePosition.origin = origin;
  currentFocusedEvent.gui.topLinePosition.to = to;

  targetEvent = null;
  addLine(origin, to, currentFocusedEvent.gui.topLineId);

  saveScenarioAsSubcollection(content);
  focusNode(content);

}



// DOING: 一個前の履歴と差が生じているノードだけレンダリングするようにしているところ
// sketch.jsの41行目がヒントになりそう
// scenarioArrayにあって変更先の履歴にノードがない場合はそのノードをcanvasから削除
// scenarioArrayになくて変更先の履歴にノードがある場合はそのノードを追加
// scenarioArrayにも変更先の履歴にもあるけど、差が生じているノードはcanvasから削除して再描画

var undoCanvas = function() {

  if(currentHistoryIndex < scenarioHistories.length) currentHistoryIndex++;
  if(scenarioHistories[scenarioHistories.length-currentHistoryIndex]){
    $(canvasNodes).empty();
    $(canvasSvg).empty();

    var lineForPreview = document.createElementNS('http://www.w3.org/2000/svg','line');
    lineForPreview.id = 'lineForPreview';
    canvasSvg.append(lineForPreview);

    var array = scenarioHistories[scenarioHistories.length-currentHistoryIndex];
    scenarioArray = array.slice(0, array.length);

    var firstEventName = `first-${riot.currentProject.id}`;
    loadCanvas(firstEventName, false);

    //saveScenarioAsSubcollection();
  }

}

var redoCanvas = function() {

  if(currentHistoryIndex > 0) currentHistoryIndex--;
  if(scenarioHistories[scenarioHistories.length-currentHistoryIndex]){
    $(canvasNodes).empty();
    $(canvasSvg).empty();

    var lineForPreview = document.createElementNS('http://www.w3.org/2000/svg','line');
    lineForPreview.id = 'lineForPreview';
    canvasSvg.append(lineForPreview);

    var array = scenarioHistories[scenarioHistories.length-currentHistoryIndex];
    scenarioArray = array.slice(0, array.length);

    var firstEventName = `first-${riot.currentProject.id}`;
    loadCanvas(firstEventName, false);

    //saveScenarioAsSubcollection();
  }

}






