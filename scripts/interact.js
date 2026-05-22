const { ethers } = require("hardhat");

const CONTRACT_ADDRESS = process.env.TODO_LIST_ADDRESS || "PASTE_DEPLOYED_CONTRACT_ADDRESS_HERE";

async function main() {
  if (CONTRACT_ADDRESS === "PASTE_DEPLOYED_CONTRACT_ADDRESS_HERE") {
    throw new Error("Set TODO_LIST_ADDRESS or replace CONTRACT_ADDRESS with the deployed contract address.");
  }

  const todoList = await ethers.getContractAt("TodoList", CONTRACT_ADDRESS);

  console.log("Connected to TodoList:", await todoList.getAddress());

  const createTx = await todoList.createTodo("Belajar Solidity dan Hardhat");
  await createTx.wait();
  const todoId = await todoList.getTotalTodos();
  console.log(`Created todo #${todoId}`);

  let todo = await todoList.getTodo(todoId);
  console.log("Todo after create:", formatTodo(todo));

  const toggleTx = await todoList.toggleCompleted(todoId);
  await toggleTx.wait();
  console.log(`Toggled todo #${todoId}`);

  todo = await todoList.getTodo(todoId);
  console.log("Todo after toggle:", formatTodo(todo));

  const updateTx = await todoList.updateTask(todoId, "Belajar testing smart contract");
  await updateTx.wait();
  console.log(`Updated todo #${todoId}`);

  todo = await todoList.getTodo(todoId);
  console.log("Todo after update:", formatTodo(todo));
}

function formatTodo(todo) {
  return {
    id: todo.id.toString(),
    task: todo.task,
    completed: todo.completed,
    creator: todo.creator,
    createdAt: todo.createdAt.toString(),
    deleted: todo.deleted,
  };
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
