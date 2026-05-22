// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TodoList {
    struct Todo {
        uint id;
        string task;
        bool completed;
        address creator;
        uint createdAt;
        bool deleted;
    }

    uint public todoCount;
    mapping(uint => Todo) public todos;

    event TodoCreated(uint id, string task, address creator);
    event TodoUpdated(uint id, string newTask);
    event TodoCompleted(uint id, bool completed);
    event TodoDeleted(uint id);

    modifier onlyCreator(uint _id) { // buat modifier aja
        require(todos[_id].creator == msg.sender, "Only creator can modify this todo");
        _;
    }

    modifier todoExists(uint _id) { // buat modifier yang ngecek apakah todo ada atau engga
        require(_id > 0 && _id <= todoCount, "Todo does not exist");
        require(!todos[_id].deleted, "Todo has been deleted");
        _;
    }

    function createTodo(string memory _task) external {
        require(bytes(_task).length > 0, "Task cannot be empty");

        todoCount++;

        todos[todoCount] = Todo({
            id: todoCount,
            task: _task,
            completed: false,
            creator: msg.sender,
            createdAt: block.timestamp,
            deleted: false
        });

        emit TodoCreated(todoCount, _task, msg.sender);
    }

    function getTodo(uint _id) external view todoExists(_id) returns (Todo memory) {
        return todos[_id];
    }

    function toggleCompleted(uint _id) external todoExists(_id) onlyCreator(_id) {
        Todo storage todo = todos[_id];
        todo.completed = !todo.completed;

        emit TodoCompleted(_id, todo.completed);
    }

    function updateTask(uint _id, string memory _newTask) external todoExists(_id) onlyCreator(_id) {
        require(bytes(_newTask).length > 0, "Task cannot be empty");

        todos[_id].task = _newTask;

        emit TodoUpdated(_id, _newTask);
    }

    function deleteTodo(uint _id) external todoExists(_id) onlyCreator(_id) {
        todos[_id].deleted = true;

        emit TodoDeleted(_id);
    }

    function getTotalTodos() external view returns (uint) {
        return todoCount;
    }
}
