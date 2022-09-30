import { useState, useEffect } from "react";
import "./DropDownList.css";
function DropDownList() {
  const [toDoDetails, setToDoDetails] = useState([]);
  const [filteredToDoDetails, setFilteredToDoDetails] = useState([]);
  const [count, setCount] = useState(0);

  const filterItems = (filter) => {
    if (filter === "ALL" || filter === undefined) {
      setFilteredToDoDetails(toDoDetails);
    } else if (filter === "ACTIVE") {
      setFilteredToDoDetails(toDoDetails.filter((e) => e.finished === false));
    } else if (filter === "COMPLETED") {
      setFilteredToDoDetails(toDoDetails.filter((e) => e.finished === true));
    }
  };

  const refreshTodosData = () => {
    fetch(`http://localhost:4000/todos`)
      .then((response) => response.json())
      .then((response) => {
        setToDoDetails(response);
        setFilteredToDoDetails(response);
        const newAmount = response.filter((e) => e.finished === false);
        setCount(newAmount.length);
      });
  };

  useEffect(() => {
    refreshTodosData();
  }, []);

  const handleAddNewItem = (e) => {
    if (e.code === "Enter") {
      const newValue = e.target.value;
      const i = document.getElementById("todoInputField");
      i.value = "";
      console.log(i);

      const ids = toDoDetails.map((todo) => todo.id);
      const newId = Math.max(...ids) + 1;
      console.log(newId);
      const newTodoItem = {
        id: newId,
        content: newValue,
        finished: false,
      };
      setFilteredToDoDetails([...filteredToDoDetails, newTodoItem]);

      fetch("http://localhost:4000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodoItem),
      })
        .then((res) => res.json())
        .then((res) => {
          refreshTodosData();
        });
    }
  };
  const handleChangeCheckbox = (event, todo) => {
    console.log(event.target.checked);
    console.log(todo);
    setFilteredToDoDetails((oldFilteredTodoItems) => {
      oldFilteredTodoItems.find((e) => (e.id = todo.id)).finished =
        event.target.checked;
      return oldFilteredTodoItems;
    });

    fetch(`http://localhost:4000/todos/${todo.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        finished: event.target.checked,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        refreshTodosData();
      });
  };

  const handleRemoveItemsfromDb = async (event) => {
    setFilteredToDoDetails([
      ...filteredToDoDetails.filter((e) => e.finished === false),
    ]);
    const checkedItems = filteredToDoDetails.filter((e) => e.finished === true);

    console.log(checkedItems);
    const checkedIds = checkedItems.map((todo) => todo.id);
    console.log(checkedIds);

    for (let i = 0; i < checkedIds.length; i++) {
      const idToDelete = checkedIds[i];

      await fetch(`http://localhost:4000/todos/${idToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    refreshTodosData();
  };
  const handleEditItemOnKey = (event, todo) => {
    if (event.code === "Enter") {
      const newContentEdit = event.target.innerHTML;
      fetch(`http://localhost:4000/todos/${todo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newContentEdit,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          refreshTodosData();
        });
    }
  };

  return (
    <>
      <input
        id="todoInputField"
        className="new-todo"
        placeholder="What needs to be done ? "
        onKeyDown={handleAddNewItem}
      />

      <ul className="todo-list">
        {filteredToDoDetails.map((todo) => {
          return (
            <li key={todo.id} className="listItem">
              <input
                className="toggle"
                type="checkbox"
                defaultChecked={todo.finished}
                onChange={(event) => handleChangeCheckbox(event, todo)}
              />

              <label
                contentEditable="true"
                onKeyDown={(event) => handleEditItemOnKey(event, todo)}
              >
                {todo.content}
              </label>
            </li>
          );
        })}
      </ul>
      <footer className="footer">
        <span className="todo-count">{count} items left</span>
        <ul className="filters">
          <li>
            {" "}
            <a
              onClick={(e) => {
                filterItems("ALL");
              }}
            >
              All
            </a>
          </li>

          <li>
            {" "}
            <a
              onClick={(e) => {
                filterItems("ACTIVE");
              }}
            >
              Active
            </a>
          </li>
          <li>
            <a
              onClick={(e) => {
                filterItems("COMPLETED");
              }}
            >
              Completed
            </a>
          </li>
        </ul>
        <button className="clear-completed" onClick={handleRemoveItemsfromDb}>
          Clear completed
        </button>
      </footer>
    </>
  );
}

export default DropDownList;
