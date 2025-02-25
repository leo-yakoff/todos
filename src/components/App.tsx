import React from "react";

import "../styles/App.css";

interface Todo {
  name: string;
  isCompleted: boolean;
}

const filters = ["All", "Active", "Completed"];

const App: React.FC = () => {
  const [todo, setTodo] = React.useState("");
  const [todoList, setTodoList] = React.useState<Todo[]>([]);
  const [filter, setFilter] = React.useState<string>(filters[0]);

  const addTodo = () => {
    const newTodoList = [...todoList, { name: todo, isCompleted: false }];
    setTodoList(newTodoList);
    setTodo("");
  };

  const handleKeyPress = (value: string) => {
    if (value === "Enter" && todo) {
      addTodo();
    }
  };

  const toggleIsCompleted = (index: number) => {
    const todoItem = todoList[index];
    const newTodoList = [...todoList];
    newTodoList[index] = {
      name: todoItem.name,
      isCompleted: !todoItem.isCompleted,
    };
    setTodoList(newTodoList);
  };

  const clearCompleted = () => {
    const newTodoList: Todo[] = todoList.map((elem) => ({
      name: elem.name,
      isCompleted: false,
    }));
    setTodoList(newTodoList);
  };

  const getRadioWithLabel = (index: number, value: string) => {
    const id = `radio-${index}`;
    return (
      <div key={id} className="filter-item">
        <input
          type="radio"
          id={id}
          value={value}
          name="filter"
          checked={filter === value}
          onChange={() => setFilter(value)}
        />
        <label htmlFor={id}>{value}</label>
      </div>
    );
  };

  const getCheckboxWithLabel = (
    index: number,
    name: string,
    isCompleted: boolean
  ) => {
    const id = `checkbox-${index}`;
    const className = "todo-item" + (isCompleted ? " completed" : "");
    return (
      <div key={id} className={className}>
        <input
          type="checkbox"
          id={id}
          checked={isCompleted}
          onChange={() => toggleIsCompleted(index)}
        />
        <label htmlFor={id}>{name}</label>
      </div>
    );
  };

  const renderTodoList = React.useMemo(() => {
    let list = todoList;
    switch (filter) {
      case filters[1]:
        list = todoList.filter((elem) => !elem.isCompleted);
        break;
      case filters[2]:
        list = todoList.filter((elem) => elem.isCompleted);
        break;
    }
    return list.map((elem, index) =>
      getCheckboxWithLabel(index, elem.name, elem.isCompleted)
    );
  }, [todoList, filter]);

  const renderTodosLeft = React.useMemo(() => {
    const count = todoList.reduce(
      (accumulator, elem) => accumulator + (elem.isCompleted ? 0 : 1),
      0
    );
    return <span>{`${count} item${count === 1 ? "" : "s"} left`}</span>;
  }, [todoList]);

  const renderFilter = React.useMemo(() => {
    return (
      <div className="filter-container">
        {filters.map((elem, index) => getRadioWithLabel(index, elem))}
      </div>
    );
  }, [filter]);

  return (
    <>
      <header>
        <h1>todos</h1>
      </header>
      <main>
        <div className="add-todo">
          <input
            type="text"
            id="todo"
            value={todo}
            placeholder="What needs to be done?"
            onChange={(e) => setTodo(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e.key)}
          />
          <button type="button" onClick={addTodo}>
            Add
          </button>
        </div>
        {renderTodoList}
      </main>
      <footer>
        {renderTodosLeft}
        {renderFilter}
        <button type="button" onClick={clearCompleted}>
          Clear completed
        </button>
      </footer>
    </>
  );
};

export default App;
