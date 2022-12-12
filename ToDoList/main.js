(function () {
  "use strict";

  const get = (target) => {
    return document.querySelector(target);
  };

  const URL = "http://localhost:3000/todos";
  const $todos = get(".task-list");
  const $form = get(".todo_form");
  const $input = get(".todo_input");

  const createTodoElement = (item) => {
    const { id, content, completed } = item; // 새로고침 후에도 status가 그대로 남아있도록 구현
    const $todoItem = document.createElement("div");
    const isChecked = completed ? "checked" : "";
    $todoItem.classList.add("item");
    $todoItem.dataset.id = id;
    $todoItem.innerHTML = `
            <div class="content">
              <input
                type="checkbox"
                class='todo_checkbox' 
                ${isChecked} 
              />
              <label>${content}</label>
              <input type="text" value="${content}" />
            </div>
            <div class="item_buttons content_buttons">
              <button class="todo_edit_button">
                <i class="far fa-edit"></i>
              </button>
              <button class="todo_remove_button">
                <i class="far fa-trash-alt"></i>
              </button>
            </div>
            <div class="item_buttons edit_buttons">
              <button class="todo_edit_confirm_button">
                <i class="fas fa-check"></i>
              </button>
              <button class="todo_edit_cancel_button">
                <i class="fas fa-times"></i>
              </button>
            </div>
      `;
    return $todoItem;
  };

  const renderAllToDos = (todos) => {
    $todos.innerHTML = "";
    todos.forEach((item) => {
      const todoElement = createTodoElement(item);
      $todos.appendChild(todoElement);
    });
  };

  const getToDos = () => {
    fetch(URL)
      .then((response) => response.json())
      .then((todos) => {
        renderAllToDos(todos);
      })
      .catch((error) => console.error(error.message)); // catch로 에러핸들링
  };

  const addToDo = (e) => {
    e.preventDefault(); // 인풋 submit시 새로고침 방지

    const todo = {
      content: $input.value,
      completed: false,
    };
    // console.log($input.value);
    fetch(URL, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(todo),
    })
      .then((response) => response.json())
      .then(getToDos)
      .then(() => {
        $input.value = ""; // 인풋 클릭하면 값 리셋시키기
        $input.focus();
      })
      .catch((error) => console.error(error.message));
  };

  const toggleToDo = (e) => {
    // console.log(e.target.className); // 클릭시 해당 클래스네임 콘솔 찍기

    if (e.target.className !== "todo_checkbox") return; // 해당 클래스네임을 클릭하지 않은 경우 함수를 실행시키지 않도록 if문으로 제어
    const $item = e.target.closest(".item"); // 클릭시 가장 가까이 위치하는 item 클래스 찾아주기
    // console.log($item);

    const id = $item.dataset.id;
    // console.log(id);
    const completed = e.target.checked;

    fetch(`${URL}/${id}`, {
      method: "PATCH", // 부분적인 값만 동적으로 변경할때 PATCH 사용
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ completed }), // 변경할 값만 작성해준다
    })
      // .then((response) => response.json())
      .then(getToDos)
      .catch((error) => console.error(error.message));
  };

  const init = () => {
    window.addEventListener("DOMContentLoaded", () => {
      getToDos();
    });
    $form.addEventListener("submit", addToDo);
    $todos.addEventListener("click", toggleToDo);
  };
  init();
})();
