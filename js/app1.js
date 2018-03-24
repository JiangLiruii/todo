(function ($) {
  $.subscribe('item:init', sync);
  $.subscribe('item:update', showTodos);
  $.subscribe('item:add', addList);
  $.subscribe('item:toggle', itemCompleted);
  $.subscribe('item:remove', itemRemove);
  const db = new PouchDB('todos');
  const remoteCouch = 'http://jlr:jlr@localhost:5984/todos';

  function itemCompleted(e, todo) {
    db.put(todo, (err, data) => {
      if (!err) {
        console.error(data);
      } else {
        console.log(err);
      }
    });
  }
  function itemRemove(e, todo) {
    db.remove(todo)
      .then(() => {
        showTodos();
      });
  }
  function showTodos() {
    db.allDocs({ include_docs: true, descending: true }, (err, doc) => {
      if (!err) {
        $.publish('item:showTodos', [doc.rows]);
      }
    });
  }
  // 同步
  function sync() {
    const opts = { live: true };
    db.replicate.to(remoteCouch, opts, syncError);
    db.replicate.from(remoteCouch, opts, syncError);
  }
  function syncError() {
    $.publish('item:syncError');
  }
  // 增加列表
  function addList(e, data) {
    db.put(data, (err, res) => {
      if (!err) {
        console.log('Successfully put to CouchDB');
        console.log(res);
        $.publish('item:added', [data]);
      } else {
        console.error('something wrong:', err);
      }
    });
  }
}(jQuery));
