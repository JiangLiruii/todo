(function($){
  $.subscribe('item:init',showTodos);
  $.subscribe('item:update',showTodos);
  $.subscribe('item:add',addList);
  $.subscribe('item:toggle',itemCompleted);
  $.subscribe('item:remove',itemRemove);
  let db = new PouchDB('https://fcc9803d-0f80-4217-9b12-dd98150bbf3d-bluemix.cloudant.com/todos/');

  function itemCompleted(e,todo,todo1){
    console.log(e,todo,todo1);
    db.put(todo,(err,data)=>{
      if(!err) {
      } else {
        console.log(err);
      }
    })
  };
  function itemRemove(e,todo) {
    db.remove(todo)
    .then(function() {
      showTodos();
    })
  };
  function showTodos() {
    db.allDocs({include_docs:true,descending:true},function(err,doc) {
      if(!err) {
        $.publish('item:showTodos',[doc.rows]);
      } else {
        $.publish('item:syncError');
      }
    })
  };
  // 增加列表
  function addList(e,data){
    console.log(arguments);
    db.put(data,(err,res)=>{
      if(!err) {
        $.publish('item:added',[data]);
      } else {
        console.error('something wrong:',err);
      }
    });
  };
}(jQuery));
