const { ethers } = require("hardhat");

async function main() {
  const todoList = await ethers.deployContract("TodoList");

  await todoList.waitForDeployment();

  console.log("TodoList deployed to:", await todoList.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
