//---utils-------------------------------------------------------------------------------


// scenarioのセーブ
/*
var saveScenario = function(){

  var unsavedLine = document.querySelector('.unsaved');
  if(unsavedLine) unsavedLine.classList.remove('unsaved');

  //$('#wrapSaving').fadeIn(400);
  service.db.collection('projects').doc(riot.currentProjectId)
    .update(riot.currentProject)
    .then(function(){
      //$('#wrapSaving').fadeOut(400);
      console.log('save array');
    });

}
*/

var scenarioHistories = [];

// scenarioのセーブ
async function saveScenarioAsSubcollection(scenarioObj){

  var unsavedLine = document.querySelector('.unsaved');
  if(unsavedLine) unsavedLine.classList.remove('unsaved');

  addHistory();

  // nodeNumを更新
  service.db.collection('projects').doc(riot.currentProjectId)
    .update({nodeNum: riot.currentProject.nodeNum});

  if(scenarioObj){
    var doc = await service.db.collection('projects').doc(riot.currentProjectId)
      .collection('scenario')
      .doc(scenarioObj.id)
      .get();

    // 存在しなければ追加する
    if(!(doc.exists)){
      service.db.collection('projects').doc(riot.currentProjectId)
        .collection('scenario')
        .doc(scenarioObj.id)
        .set(scenarioObj);
    }
  }

  var scenarioOfDatabase = await service.db.collection("projects")
    .doc(riot.currentProjectId)
    .collection('scenario')
    .get()
    .then(function(doc) {
      var resultScenario = [];     
      for(var i=0; i<doc.docs.length; i++){
        //var data = doc.docs[i].data();
        resultScenario.push(doc.docs[i].data());
      }
      return resultScenario;
    });

  // クライアントの持つシナリオとデータベースのシナリオを比較して異なるものだけを更新する
  for(var i=0; i<scenarioOfDatabase.length; i++){

    var eventOfClient = getEventFromScenarioById(scenarioOfDatabase[i].id);
    
    // clientにないノードはデータベース側からも削除する
    if(eventOfClient==undefined){
      service.db.collection('projects').doc(riot.currentProjectId)
        .collection('scenario')
        .doc(scenarioOfDatabase[i].id)
        .delete();
      //console.log('delete: ', scenarioOfDatabase[i]);
      i++;
      continue;
    }

    // 差があるイベントについてはクライアントに合わせて更新
    if(JSON.stringify(scenarioOfDatabase[i]) != JSON.stringify(eventOfClient)){
      service.db.collection('projects').doc(riot.currentProjectId)
        .collection('scenario')
        .doc(eventOfClient.id)
        .update(eventOfClient);
      //console.log('save to sub: ', eventOfClient);
    }

  }

}





// 履歴の管理
var currentHistoryIndex = 0;
var addHistory = function(){
  //var history = scenarioArray.slice(0, scenarioArray.length);
  //scenarioHistories.push(history);

  var history = JSON.stringify(scenarioArray);
  scenarioHistories.push(JSON.parse(history));

  currentHistoryIndex = 0;
}





// ノードの上にドラッグ中のカーソルがのっているかを判定
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



// あるidを持つイベントをシナリオから取り出す
var getEventFromScenarioById = function(id){
  var event;
  for(var i=0; i<scenarioArray.length; i++){
    if(scenarioArray[i].id == id){
      event = scenarioArray[i];
      break;
    }
  }
  return event;
}

var getEventFromScenarioByNext = function(next){
  var event;
  for(var i=0; i<scenarioArray.length; i++){
    if(scenarioArray[i].next == next){
      event = scenarioArray[i];
      break;
    }
  }
  return event;
}

var getNodeFromScenarioById = function(id){
  var node;
  for(var i=0; i<scenarioArray.length; i++){
    if(scenarioArray[i].nodeType == 'single'){
      
      if(scenarioArray[i].id == id) node = scenarioArray[i];

    }else if(scenarioArray[i].nodeType == 'group'){

      var selections = scenarioArray[i].selections;
      for(var selection_i=0; selection_i<selections.length; selection_i++){
        if(selections[selection_i].id == id) node = selections[selection_i];
      }

    }
  } // for
  return node;
}

// nextからnodeを取得
var getNormalNodesFromScenarioByNext = function(next){

  var resultNodes = [];
  for(var i=0; i<scenarioArray.length; i++){
    if(scenarioArray[i].nodeType=='single' && scenarioArray[i].next == next){
      resultNodes.push(scenarioArray[i]);
    }
  }
  return resultNodes;

}

var getSelectionsFromScenarioByNext = function(next){

  var resultSelection = [];
  for(var i=0; i<scenarioArray.length; i++){
    if(scenarioArray[i].nodeType=='group'){
      var selections = scenarioArray[i].selections;
      for(var selection_i=0; selection_i<selections.length; selection_i++){
        if(selections[selection_i].next==next){
          resultSelection.push(selections[selection_i]);
        }
      }
    }
  }

  return resultSelection;
}



// nextからscenarioArrayのindexを取得
var getIndexesOfNormalNodesFromScenarioByNext = function(next){

  var resultIndexs = [];
  for(var i=0; i<scenarioArray.length; i++){
    if(scenarioArray[i].nodeType=='single' && scenarioArray[i].next == next){
      resultIndexs.push({scenarioIndex: i});
    }
  }
  return resultIndexs;

}

var getIndexesOfSelectionsFromScenarioByNext = function(next){

  var resultIndexs = [];
  for(var i=0; i<scenarioArray.length; i++){
    if(scenarioArray[i].nodeType=='group'){
      var selections = scenarioArray[i].selections;
      for(var selection_i=0; selection_i<selections.length; selection_i++){
        if(selections[selection_i].next==next){
          resultIndexs.push({scenarioIndex: i, selectionIndex: selection_i});
        }
      }
    }
  }

  return resultIndexs;
}





// gotoのeventをtoIdから取得
var getEventOfGoToByToId = function(toId){

  var events = [];

  for(var i=0; i<scenarioArray.length; i++){
    if(scenarioArray[i].type=='goto'){
      if(scenarioArray[i].toId==toId) events.push(scenarioArray[i]);
    }
  }

  return events;

}