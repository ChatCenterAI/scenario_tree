
var exportCsv = function(){
  // 配列 の用意
  var array_data = convertScenarioArrayToCsv(); //[['りんご',1,200],['メロン',2,4000],['バナナ',4,500]];

  // BOM の用意（文字化け対策）
  var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);

  // CSV データの用意
  var csv_data = array_data.map(function(l){return l.join(',')}).join('\r\n');

  var blob = new Blob([bom, csv_data], { type: 'text/csv' });

  var url = (window.URL || window.webkitURL).createObjectURL(blob);

  var a = document.getElementById('downloader');
  a.download = 'data.csv';
  a.href = url;

  // ダウンロードリンクをクリックする
  $('#downloader')[0].click();
}

var resultToExportArray = [];
var convertScenarioArrayToCsv = function(){
  resultToExportArray = [];

  // ヘッダーだけ先に入れる
  var headerArray = ['ID','type','key','value','key','value','key','value'];
  resultToExportArray.push(headerArray);

  // 全てのnormalテンプレートを作成
  for(var i=0; i<scenarioArray.length; i++){
    var event = scenarioArray[i];
    var id = event.id;
    if(event.type=='normal'){
      var tmp = [`${id}`,'template','title',`Template ${id}`,'text',`${event.text}`,'',''];
      resultToExportArray.push(tmp);
      // 改行
      resultToExportArray.push(['','','','','','','','']);
    }

  } // for

  // 全てのselectionテンプレートを作成
  for(var i=0; i<scenarioArray.length; i++){
    var event = scenarioArray[i];
    var id = event.id;
    if(event.type=='selection'){
      var askTmp = [`${id}`,'template','title',`Template ${id}`,'text',`${event.text}`,'',''];
      resultToExportArray.push(askTmp);

      // 選択肢のテンプレートをつくる
      var selections = event.selections;
      for(var s_i=0; s_i<selections.length; s_i++){
        var selection = selections[s_i];
        var tmpActionNum = s_i + 1;
        //var selectionTmp = [`${selection.id}.action${actionNum}`,'template_action','label',`${selection.label}`,'','','',''];
        var selectionTmp = [`${id}.action${tmpActionNum}`,'template_action','label',`${selection.label}`,'','','',''];
        resultToExportArray.push(selectionTmp);
      }
      // 改行
      resultToExportArray.push(['','','','','','','','']);
    }
  } // for


  // automation作成開始
  // はじめのautomationからselectionを表示するまでを先に入れる
  var firstEventId = `first-${riot.currentProjectId}`;
  var firstEvent = getEventFromScenarioById(firstEventId);
  var firstAutomationActionNum = 0;
  resultToExportArray.push([`auto-${firstEventId}`,'automation','event','Dialog.open','name',`Automation ${firstEventId}`,'','']);
  resultToExportArray.push([`auto-${firstEventId}.case1`,'automation_case','','','','','','']);
  resultToExportArray.push([`auto-${firstEventId}.case1.action${firstAutomationActionNum}`,'automation_action','type','send_message','template', firstEventId,'','']);
  firstAutomationActionNum++;

  var currentEvent = firstEvent;
  while(true){

    // selectionまできたら抜ける
    if(currentEvent.type=='selection') break;

    var nextId = currentEvent.next;
    // nextがなければ抜ける
    if(!nextId) break;

    // nextがあってかつnormalな場合、次のeventをactionをautomationに足す
    var nextEvent = getEventFromScenarioById(nextId);
    resultToExportArray.push([`auto-${firstEventId}.case1.action${firstAutomationActionNum}`,'automation_action','type','send_message','template', nextEvent.id,'','']);
    firstAutomationActionNum++;

    // nextEventを更新してもう一周
    currentEvent = nextEvent;
  }

  resultToExportArray.push(['','','','','','','','']); // first用の改行


  // 全てのselections[i]から次のselectionEventもしくはnextがないnormalEventまでのautomationを追加する
  for(var i=0; i<scenarioArray.length; i++){

    if(scenarioArray[i].type=='selection' && scenarioArray[i]!=firstEventId){
      var groupIdOfSelection = scenarioArray[i].id;
      var selections = scenarioArray[i].selections;
      for(var s_i=0; s_i<selections.length; s_i++){
        //var selection = selections[s_i];
        var currentNode = selections[s_i];
        var tmpActionNum = s_i + 1;
        var automationNum = 1;

        if(!currentNode.next) continue;
        resultToExportArray.push([`auto-${currentNode.id}`,'automation','event','Dialog.question.answered','name',`Automation ${currentNode.id}`,'','']);
        resultToExportArray.push([`auto-${currentNode.id}.case1`,'automation_case','','','','','','']);
        resultToExportArray.push([`auto-${currentNode.id}.case1.condition1`,'automation_condition','type','response_match','templateAction',`${groupIdOfSelection}.action${tmpActionNum}`,'','']);
        resultToExportArray.push([`auto-${currentNode.id}.case1.action${automationNum}`,'automation_action','type','send_message','template',`${currentNode.next}`,'','']);
        automationNum++;
        
        // selectionから連続していくnormalのノードを全て追加
        var rootNodeId = currentNode.id;
        while(true){
          // ノードにnextがなければ抜ける
          var nextId = currentNode.next;
          if(!nextId) break;

          var nextNode = getEventFromScenarioById(nextId);

          // 次のノードがselectionだったら抜ける
          if(nextNode.type=='selection' || !nextNode.next) break;

          // ノードがnormalで、かつnextもある場合、actionを足す
          resultToExportArray.push([`auto-${rootNodeId}.case1.action${automationNum}`,'automation_action','type','send_message','template',nextNode.next,'','']);
          automationNum++;

          currentNode = nextNode;
        }

        // 改行
        resultToExportArray.push(['','','','','','','','']);
        
      } // for

    } //if(scenarioArray.type=='selection')

  } // for

  
  

  return resultToExportArray;
}


