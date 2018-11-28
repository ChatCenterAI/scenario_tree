
var initConversation = function(firstEventId){

  // 表示されているメッセージを全て削除
  var wrapMessages = document.getElementById('wrapMessages');
  wrapMessages.removeChil
  while (wrapMessages.firstChild) wrapMessages.removeChild(wrapMessages.firstChild);

  // selection-inputが開いていた場合は閉じる
  $('.wrap-selection-bubble').hide();

  fireEventOfConversation(firstEventId);

}

var fireEventOfConversation = function(eventId){

  var event = getEventFromScenarioById(eventId);

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

        focusNode(event);
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
        focusNode(event);
      })();
      
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

  var moduleConversation = document.querySelector('#moduleConversation');
  var moduleConversationHeight = moduleConversation.firstElementChild.clientHeight;
  
  var wrapMessages = document.getElementById('wrapMessages');
  wrapMessages.style.height = (moduleConversationHeight-inputHeight) + 'px';
}


// スリープ処理
var sleep = msec => new Promise(resolve => setTimeout(resolve, msec));


