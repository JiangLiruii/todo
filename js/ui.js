(function($){
  'user strict';
  
  $(document).ready(function(){
    const ENTER_KEY = 13;
    let newTodoDom = $('#new-todo');
    let syncDom = $('#sync-wrapper');
    let todolist = $('#todo-list');

    // 监听回车事件
    newTodoDom.on('keypress',onKeyPress);
    $.subscribe('item:added',onAdded);
    $.subscribe('item:syncError', onSyncError);
    $.subscribe('item:showTodos', onShow);

    function onShow(e,rows){
      todolist.html('');
      rows.forEach(function(row) {
      let data = row.doc;
      console.log(data.completed);
      let newLi = $(`<li><input type="checkbox" class="toggle"><label>${data.title}</label><span class="date">${data.date}</span><button class="destroy"></button>`);
      let toggle = newLi.find('input.toggle');
      toggle[0].checked = data.completed;
      toggle.on('change',itemToggle.bind(this, data));
      let destroy = newLi.find('button');
      destroy.on('click',onDestroy.bind(this,data));
      todolist.append(newLi);
      })
    }
    function onDestroy(todo,e) {
      console.log(todo);
      $.publish('item:remove',[todo]);
    }
    function itemToggle(todo,e){
      todo.completed = e.target.checked;
      $.publish('item:toggle',[todo]);
    }
    function onAdded(e,data) {
      $.publish('item:update');
      newTodoDom.val('');
      syncDom.attr('data-sync-state', 'synced');      
    };
    function onSyncError() {
      syncDom.attr('data-sync-state', 'error');            
    };
    function onKeyPress(event) {
      let inputValue = $(event.target).val().trim(),
          data = {},
          date = new Date();
      if (event.which === ENTER_KEY && inputValue) {
        syncDom.attr('data-sync-state', 'syncing');
        data.completed = false;
        data._id = date.toISOString();
        data.title = inputValue;
        data.date = date.toLocaleDateString() + date.toLocaleTimeString();
        $.publish('item:add',[data]);
        event.target.blur();
      }
    };
    $.publish('item:init');
    $.publish('item:update');
  })
}(jQuery))