(function ($) {
  $(document).ready(() => {
    const ENTER_KEY = 13;
    const newTodoDom = $('#new-todo');
    const syncDom = $('#sync-wrapper');
    const todolist = $('#todo-list');
    const buttons = $('#buttons button');
    const select = $('select');
    select.on('change', (e) => {
      console.log(e.target.value);
    });

    // 监听回车事件
    newTodoDom.on('keypress', onKeyPress);
    buttons.on('click', onButtonClick);
    $.subscribe('item:added', onAdded);
    $.subscribe('item:syncError', onSyncError);
    $.subscribe('item:showTodos', onShow);

    function onShow(e, rows) {
      todolist.html('');
      if (rows.length > 0) {
        rows.forEach((row) => {
          const data = row.doc;
          const newLi = $(`<li class="${data.completed ? 'completed' : ''}"><input type="checkbox" class="toggle"><label>${data.title}</label><span class="date">${data.date}</span><button class="destroy"></button>`);
          const toggle = newLi.find('input.toggle');
          toggle[0].checked = data.completed;
          toggle.on('change', itemToggle.bind(this, data));
          const destroy = newLi.find('button');
          destroy.on('click', onDestroy.bind(this, data));
          todolist.append(newLi);
        });
      }
      count();
    }
    function onDestroy(todo) {
      $.publish('item:remove', [todo]);
    }
    function itemToggle(todo, e) {
      todo.completed = e.target.checked;
      $(e.target).parent().toggleClass('completed');
      $.publish('item:toggle', [todo, count]);
    }
    function onAdded() {
      $.publish('item:update');
      newTodoDom.val('');
      syncDom.attr('data-sync-state', 'synced');
    }
    function onSyncError() {
      syncDom.attr('data-sync-state', 'error');
    }

    function onButtonClick(e) {
      const type = e.target.id !== 'unfinished';
      $.publish('item:button', type);
    }

    function onKeyPress(event) {
      const inputValue = $(event.target).val().trim();
      const data = { _id: '' };
      const date = new Date();
      if (event.which === ENTER_KEY && inputValue) {
        syncDom.attr('data-sync-state', 'syncing');
        data.completed = false;
        data._id = date.toISOString();
        data.title = inputValue;
        data.date = date.toLocaleDateString() + date.toLocaleTimeString();
        $.publish('item:add', [data]);
        event.target.blur();
      }
    }
    function count() {
      $('#todo-count').text(`todo-count: ${$('li').length - $('li.completed').length}`);
    }
    $.publish('item:init');
    $.publish('item:update');
  });
}(jQuery));
