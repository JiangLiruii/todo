(function($){
  $.subscribe('item:init',sync);
  $.subscribe('item:update',showTodos);
  $.subscribe('item:add',addList);
  $.subscribe('item:toggle',itemCompleted);
  $.subscribe('item:remove',itemRemove);
  let db = new PouchDB('todos');
  let remoteCouch = 'http://jlr:jlr@localhost:5984/todos';

  function itemCompleted(e,todo,todo1){
    console.log(e,todo,todo1);
    db.put(todo,(err,data)=>{
      if(!err) {
      } else {
        console.log(err);
      }
    })
  }
  function itemRemove(e,todo) {
    db.remove(todo)
    .then(function() {
      showTodos();
    })
  }
  function showTodos() {
    db.allDocs({include_docs:true,descending:true},function(err,doc) {
      if(!err) {
        $.publish('item:showTodos',[doc.rows]);
      }
    })
  }
  // 同步
  function sync(){
    let opts = {live: true};
    db.replicate.to(remoteCouch,opts,syncError);
    db.replicate.from(remoteCouch, opts, syncError);
  };
  function syncError(){
    $.publish('item:syncError')
  }
  // 增加列表
  function addList(e,data){
    console.log(arguments);
    db.put(data,(err,res)=>{
      if(!err) {
        console.log('Successfully put to CouchDB');
        console.log(res);
        $.publish('item:added',[data]);
      } else {
        console.error('something wrong:',err);
      }
    });
  };
  //查询列表
  function checkList(todos) {
    todolist.innerHTML = '';
    todos.forEach(function(todo){
      ul.append(addList(todo.doc));
    })
  };
  // 点击更改代办项
  function editList() {

  };
}(jQuery));
