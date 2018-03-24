function addTodo(text) {
  let todo = {
    _id:new Date().toISOString(),
    title: text,
    complete: false
  };
  db.put(todo, function callback(err, res) {
    if(!err) {
      console.log('Successfully posted a todo!')
    }
  });
}

// show
function showTodos() {
  db.allDocs({
    include_docs: true,
    descending: true
  },
  function(err, doc) {
    redrawTodosUI(doc.rows);
  })
}
// updateUI
let remoteCouch = false;
db.change({
  since:"now",
  live:"true"
}).on('change',showTodos);
