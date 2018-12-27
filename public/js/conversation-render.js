var currentProjectForConversation;
var underAnotherProject = false;

var initConversation = function(firstEventId){

  // 表示されているメッセージを全て削除
  var wrapMessages = document.getElementById('wrapMessages');
  wrapMessages.removeChil
  while (wrapMessages.firstChild) wrapMessages.removeChild(wrapMessages.firstChild);

  // selection-inputが開いていた場合は閉じる
  $('.wrap-selection-bubble').hide();

  // G編集しているプロジェクトにシナリオを設定
  var currentScenarioArray = scenarioArray;
  currentScenarioArrayForConversation = currentScenarioArray;
  currentProjectForConversation = riot.currentProject;

  // 自由文入力をリセット
  var textarea = document.getElementById('conversationMessageInput');
  textarea.placeholder = 'Message';

  fireEventOfConversation(firstEventId);

}

var fireEventOfConversation = function(eventId){

  var event = getEventFromCurrentScenarioByIdForConversation(eventId);

  if(!event) return;

  var wrapMessages = document.getElementById('wrapMessages');

  switch(event.type){
    case 'normal':
      
      (async () => {
        await sleep(1200);
        var isMine = false;
        addMessageToConversationByEvent(event, isMine);
        var nextId = event.next;
        fireEventOfConversation(nextId);

        if(location.hash.indexOf('#project') >= 0 && !(underAnotherProject)) focusNode(event);
      })();

    break;

    case 'selection':

      (async () => {
        await sleep(1200);
        var isMine = false;
        addMessageToConversationByEvent(event, isMine);
        // 選択肢用のinputを出す
        riot.mount('conversation-input-selection', 'item-conversation-input-selection', {content: event});
        riot.update();
        
        // selectionを出してmodule-conversationを調整
        $('.wrap-selection-bubble').slideToggle(400, resizeWrapMessages);
        
        if(location.hash.indexOf('#project') >= 0 && !(underAnotherProject)) focusNode(event);
      })();
      
    break;

    case 'openquestion':

      (async () => {
        await sleep(1200);
        var isMine = false;
        addMessageToConversationByEvent(event, isMine);
        
        var sendIcon = document.getElementById('conversationSendIcon');
        sendIcon.dataset.next = event.next;

        var textarea = document.getElementById('conversationMessageInput');
        textarea.placeholder = event.expectedAnswer;
        
        if(location.hash.indexOf('#project') >= 0 && !(underAnotherProject)) focusNode(event);
      })();

      if(location.hash.indexOf('#project') >= 0 && !(underAnotherProject)) focusNode(event);
    break;

    case 'goto':

      var nextId = event.toId;
      fireEventOfConversation(nextId);

      if(location.hash.indexOf('#project') >= 0 && !(underAnotherProject)) focusNode(event);
    break;

    case 'gotoAnotherProject':

      (async () => {
        currentProjectForConversation = await service.db.collection("projects")
          .doc(event.scenarioId).get();
        currentProjectForConversation = currentProjectForConversation.data();

        var newScenario = await service.db.collection("projects")
          .doc(event.scenarioId)
          .collection("scenario")
          .get()
          .then(function(doc) {
            var resultScenario = [];     
            for(var i=0; i<doc.docs.length; i++){
              //var data = doc.docs[i].data();
              resultScenario.push(doc.docs[i].data());
            }
            return resultScenario;
          });
        
        currentScenarioArrayForConversation = newScenario;

        underAnotherProject = true;
        fireEventOfConversation(event.firstEventOfScenario);
      })();

      if(location.hash.indexOf('#project') >= 0) focusNode(event);
    break;
  }

}

// eventIdからとってくる
var getEventFromCurrentScenarioByIdForConversation = function(id){

  var event;
  for(var i=0; i<currentScenarioArrayForConversation.length; i++){
    if(currentScenarioArrayForConversation[i].id == id){
      event = currentScenarioArrayForConversation[i];
      break;
    }
  }
  return event;

}

// メッセージバブルを追加
var addMessageToConversationByEvent = function(event, isMine){
  var wrapMessages = document.getElementById('wrapMessages');
  var newMessageElem = document.createElement('div');
  wrapMessages.appendChild(newMessageElem);

  riot.mount(newMessageElem, 'item-bubble-message', {
    content: event,
    isMine: isMine,
  });
  riot.update();
}

// #wrapMessagesの高さをinputの高さによって調整
var resizeWrapMessages = function(){
  var wrapInput = document.querySelector('#wrapConversationInput');
  var inputHeight = wrapInput.clientHeight;

  var moduleConversation = document.querySelector('#moduleConversation');
  var moduleConversationHeight = moduleConversation.firstElementChild.clientHeight;
  
  var wrapMessages = document.getElementById('wrapMessages');
  wrapMessages.style.height = (moduleConversationHeight-inputHeight) + 'px';
}


// スリープ処理
var sleep = msec => new Promise(resolve => setTimeout(resolve, msec));


