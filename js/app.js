(function ($) {
  $.subscribe('item:init', syncs);
  $.subscribe('item:update', showTodos);
  $.subscribe('item:add', addList);
  $.subscribe('item:toggle', itemCompleted);
  $.subscribe('item:remove', itemRemove);
  $.subscribe('item:button',buttonClick);
  const db = new PouchDB('todos');
  const remoteCouch = 'https://fcc9803d-0f80-4217-9b12-dd98150bbf3d-bluemix.cloudant.com/todos';

  function itemCompleted(e, todo, callback) {
    db.put(todo, () => {
      callback();
      showTodos();
    });
  }
  function itemRemove(e, todo) {
    db.remove(todo)
      .then(() => {
        showTodos();
      })
      .catch((err) => {
        console.error(err);
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
  function syncs() {
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
        $.publish('item:added', [data]);
      } else {
        console.error('something wrong:', err);
      }
    });
  }
  function buttonClick(e,type) {
    db.allDocs({ include_docs: true, descending: true }).then((doc) => {
      let rows = [];
      console.log(doc);
      doc.rows.forEach(element => {
        if (element.doc.completed === type) {
          rows.push(element);
        }
      });
      $.publish('item:showTodos',[rows]);

    }).catch(err=>console.error(err))
  }
}(jQuery));
