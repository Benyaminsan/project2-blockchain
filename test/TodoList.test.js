const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TodoList", function () {
  async function deployTodoListFixture() {
    const [creator, otherAccount] = await ethers.getSigners();
    const todoList = await ethers.deployContract("TodoList");

    await todoList.waitForDeployment();

    return { todoList, creator, otherAccount };
  }

  describe("Deployment", function () {
    it("should deploy successfully", async function () {
      const { todoList } = await deployTodoListFixture();

      expect(await todoList.getAddress()).to.properAddress;
      expect(await todoList.todoCount()).to.equal(0n);
    });
  });

  describe("createTodo", function () {
    it("should create a todo", async function () {
      const { todoList, creator } = await deployTodoListFixture();

      await todoList.createTodo("Belajar Solidity");

      const todo = await todoList.getTodo(1);
      expect(todo.id).to.equal(1n);
      expect(todo.task).to.equal("Belajar Solidity");
      expect(todo.completed).to.equal(false);
      expect(todo.creator).to.equal(creator.address);
      expect(todo.createdAt).to.be.greaterThan(0n);
      expect(todo.deleted).to.equal(false);
      expect(await todoList.getTotalTodos()).to.equal(1n);
    });

    it("should revert when task is empty", async function () {
      const { todoList } = await deployTodoListFixture();

      await expect(todoList.createTodo("")).to.be.revertedWith("Task cannot be empty");
    });
  });

  describe("getTodo", function () {
    it("should return matching todo data", async function () {
      const { todoList, creator } = await deployTodoListFixture();

      await todoList.createTodo("Kerjakan tugas blockchain");

      const todo = await todoList.getTodo(1);
      expect(todo.id).to.equal(1n);
      expect(todo.task).to.equal("Kerjakan tugas blockchain");
      expect(todo.completed).to.equal(false);
      expect(todo.creator).to.equal(creator.address);
      expect(todo.deleted).to.equal(false);
    });
  });

  describe("toggleCompleted", function () {
    it("should toggle completed status", async function () {
      const { todoList } = await deployTodoListFixture();

      await todoList.createTodo("Buat unit test");
      await todoList.toggleCompleted(1);

      let todo = await todoList.getTodo(1);
      expect(todo.completed).to.equal(true);

      await todoList.toggleCompleted(1);
      todo = await todoList.getTodo(1);
      expect(todo.completed).to.equal(false);
    });
  });

  describe("updateTask", function () {
    it("should allow creator to update task", async function () {
      const { todoList } = await deployTodoListFixture();

      await todoList.createTodo("Task lama");
      await todoList.updateTask(1, "Task baru");

      const todo = await todoList.getTodo(1);
      expect(todo.task).to.equal("Task baru");
    });

    it("should reject update from non creator", async function () {
      const { todoList, otherAccount } = await deployTodoListFixture();

      await todoList.createTodo("Task creator");

      await expect(todoList.connect(otherAccount).updateTask(1, "Task hacker")).to.be.revertedWith(
        "Only creator can modify this todo",
      );
    });

    it("should reject empty new task", async function () {
      const { todoList } = await deployTodoListFixture();

      await todoList.createTodo("Task valid");

      await expect(todoList.updateTask(1, "")).to.be.revertedWith("Task cannot be empty");
    });
  });

  describe("deleteTodo", function () {
    it("should soft delete a todo", async function () {
      const { todoList } = await deployTodoListFixture();

      await todoList.createTodo("Todo yang akan dihapus");
      await todoList.deleteTodo(1);

      const deletedTodo = await todoList.todos(1);
      expect(deletedTodo.deleted).to.equal(true);
      await expect(todoList.getTodo(1)).to.be.revertedWith("Todo has been deleted");
    });
  });

  describe("Events", function () {
    it("should emit TodoCreated", async function () {
      const { todoList, creator } = await deployTodoListFixture();

      await expect(todoList.createTodo("Event create"))
        .to.emit(todoList, "TodoCreated")
        .withArgs(1n, "Event create", creator.address);
    });

    it("should emit TodoUpdated", async function () {
      const { todoList } = await deployTodoListFixture();

      await todoList.createTodo("Sebelum update");

      await expect(todoList.updateTask(1, "Sesudah update"))
        .to.emit(todoList, "TodoUpdated")
        .withArgs(1n, "Sesudah update");
    });

    it("should emit TodoCompleted", async function () {
      const { todoList } = await deployTodoListFixture();

      await todoList.createTodo("Event toggle");

      await expect(todoList.toggleCompleted(1)).to.emit(todoList, "TodoCompleted").withArgs(1n, true);
    });

    it("should emit TodoDeleted", async function () {
      const { todoList } = await deployTodoListFixture();

      await todoList.createTodo("Event delete");

      await expect(todoList.deleteTodo(1)).to.emit(todoList, "TodoDeleted").withArgs(1n);
    });
  });
});
