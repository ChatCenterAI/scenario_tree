// キーボードイベント
var keydown = function (e){
  
  if((event.ctrlKey || event.metaKey)) {
    event.preventDefault();

    console.log(event.ctrlKey);

    switch(e.key){
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