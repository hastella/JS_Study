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
    const { id, content } = item;
    const $todoItem = document.createElement("div");
    $todoItem.classList.add("item");
    $todoItem.dataset.id = id;
    $todoItem.innerHTML = `
            <div class="content">
              <input
                type="checkbox"
                class='todo_checkbox' 
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
      .then((todos) => renderAllToDos(todos))
      .catch((error) => console.error(error)); // catch로 에러핸들링
  };

  const addToDo = (e) => {
    e.preventDefault(); // 인풋 submit시 새로고침 방지
    const todo = {
      content: $input.value,
      completed: false,
    };
    console.log($input.value);
    fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });
  };

  const init = () => {
    window.addEventListener("DOMContentLoaded", () => {
      getToDos();
    });
    $form.addEventListener("submit", addToDo);
    $input.addEventListener("focus", function () {
      // 인풋 클릭하면 값 리셋시키기
      $input.value = "";
    });
  };
  init();
})();
