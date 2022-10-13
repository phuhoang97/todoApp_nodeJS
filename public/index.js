let url = "http://127.0.0.1:3000/api/v1";

// Get DOM elements
let ul = document.getElementById("myUL");
let pending = document.getElementById("pending");
let input = document.getElementById("myInput");
let add = document.getElementById("addBtn");

add.addEventListener("click", () => {
  console.log(input.value); // to do title
  let todo = {
    title: input.value,
    completed: false,
    userId: Math.floor(Math.random() * 21),
    id: Math.floor(Math.random() * 200 + 200),
  };
  console.log(todo);
  fetch(url + "/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  })
    .then((res) => res.json())
    .then((data) => {
      window.location.href = "/";
    })
    .catch((err) => console.log(err));
});

ul.addEventListener("click", function (e) {
  if (e.target.classList.contains("list-item")) {
    // User interface
    e.target.classList.toggle("checked");

    // server
    let completed = e.target.classList.contains("checked"); // true - false
    let id = e.target.id;
    let todo = {
      completed: completed,
    };
    fetch(url + "/todos/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        // window.location.href = "/";
      })
      .catch((err) => console.log(err));
  } else if (e.target.classList.contains("close")) {
    // User interface
    e.target.parentElement.remove();

    // server
    let id = e.target.parentElement.id;
    fetch(url + "/todos/" + id, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        // window.location.href = "/";
      })
      .catch((err) => console.log(err));
  }
});

fetch(url + "/todos?per_page=10")
  .then((res) => res.json())
  .then((data) => {
    let todos = data.data;
    // pending tasks
    let pendingTasks = todos.filter((e) => e.completed === false);
    let pendingLength = pendingTasks.length;
    pending.innerHTML = pendingLength;

    // render tasks
    todos.forEach((e, i) => {
      ul.innerHTML =
        ul.innerHTML +
        (e.completed === true
          ? `<li id=${e.id} class="checked list-item">${e.title}</li>`
          : `<li id=${e.id} class="list-item">${e.title}</li>`);
    });

    let myNodelist = document.getElementsByTagName("li");

    console.log(myNodelist);
    for (i = 0; i < myNodelist.length; i++) {
      var span = document.createElement("SPAN");
      var txt = document.createTextNode("\u00D7");
      span.className = "close";
      span.appendChild(txt);
      myNodelist[i].appendChild(span);
    }
  })
  .catch((err) => console.log(err));
