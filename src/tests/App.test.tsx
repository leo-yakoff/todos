import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";

import App from "../components/App";

const constants = {
  firstTodoName: "First ToDo",
  secondTodoName: "Second ToDo",
};

const addToDo = (value: string) => {
  const input = screen.getByPlaceholderText("What needs to be done?");
  expect(input).toBeInTheDocument();

  fireEvent.change(input, { target: { value } });
  fireEvent.keyDown(input, { key: "Enter", code: "Enter", charCode: 13 });
};

describe("components/App", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("should handle adding a new ToDo", () => {
    expect(screen.getByText("0 items left")).toBeInTheDocument();
    expect(
      screen.queryByLabelText(constants.firstTodoName)
    ).not.toBeInTheDocument();

    addToDo(constants.firstTodoName);

    expect(
      screen.queryByLabelText(constants.firstTodoName)
    ).toBeInTheDocument();
    expect(screen.getByText("1 item left")).toBeInTheDocument();
  });

  it("should handle completion of the ToDo", () => {
    addToDo(constants.firstTodoName);
    fireEvent.click(screen.getByLabelText(constants.firstTodoName));
    expect(screen.getByText("0 items left")).toBeInTheDocument();
  });

  it("should filter ToDos", () => {
    addToDo(constants.firstTodoName);
    addToDo(constants.secondTodoName);

    fireEvent.click(screen.getByLabelText(constants.firstTodoName));

    fireEvent.click(screen.getByLabelText("Active"));
    expect(
      screen.queryByLabelText(constants.firstTodoName)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText(constants.secondTodoName)
    ).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Completed"));
    expect(
      screen.queryByLabelText(constants.firstTodoName)
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText(constants.secondTodoName)
    ).not.toBeInTheDocument();
  });

  it("should handle clear completed ToDos", () => {
    addToDo(constants.firstTodoName);

    fireEvent.click(screen.getByLabelText("Active"));

    fireEvent.click(screen.getByLabelText(constants.firstTodoName));
    expect(
      screen.queryByLabelText(constants.firstTodoName)
    ).not.toBeInTheDocument();

    const clearButton = screen.getByText("Clear completed");
    expect(clearButton).toBeInTheDocument();
    fireEvent.click(clearButton);
    expect(
      screen.queryByLabelText(constants.firstTodoName)
    ).toBeInTheDocument();
  });
});
