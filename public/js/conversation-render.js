
var initConversation = function(firstEventId){

  // 表示されているメッセージを全て削除
  var wrapMessages = document.getElementById('wrapMessages');
  wrapMessages.removeChil
  while (wrapMessages.firstChild) wrapMessages.removeChild(wrapMessages.firstChild);

  fireEventOfConversation(firstEventId);

}

var fireEventOfConversation = function(eventId){

  var event = getEventFromScenarioById(eventId);

  if(!event) return;

  switch(event.type){
    case 'normal':
      console.log('event.type:', event.type);
      var isMine = false;
      addMessageToConversationByEvent(event, isMine);
      var nextId = event.next;
      fireEventOfConversation(nextId);

      // 最下部にスクロール
      wrapMessages.scrollTop = wrapMessages.scrollHeight;
    break;

    case 'selection':
      console.log('event.type:', event.type);
      var isMine = false;
      addMessageToConversationByEvent(event, isMine);

      // 選択肢用のinputを出す
      riot.mount('conversation-input-selection', 'item-conversation-input-selection', {content: event});
      riot.update();

      resizeWrapMessages();
      // 最下部にスクロール
      wrapMessages.scrollTop = wrapMessages.scrollHeight;

    break;
  }

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

  var moduleConversation = document.querySelector('module-conversation');
  var moduleConversationHeight = moduleConversation.firstElementChild.clientHeight;
  
  var wrapMessages = document.getElementById('wrapMessages');
  wrapMessages.style.height = (moduleConversationHeight-inputHeight) + 'px';
}


