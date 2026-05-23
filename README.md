# Todo List On-Chain

Todo List On-Chain adalah project backend blockchain tanpa frontend. Seluruh data todo disimpan langsung di smart contract Ethereum lokal menggunakan Hardhat Network.

## Author

| Nama: Benjamin Khawarizmi Habibi |
| -------- |
| NRP: 5027231078 |

## Teknologi

- Solidity
- Hardhat
- Ethers.js
- Mocha + Chai
- Node.js
- VSCode Solidity Extension

## Instalasi

```bash
npm install
```

## Compile Contract

```bash
npx hardhat compile
```

## Menjalankan Hardhat Node

```bash
npx hardhat node
```

Biarkan terminal ini tetap berjalan agar network lokal `localhost` aktif.

## Deploy Contract

Buka terminal kedua, lalu jalankan:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

Contoh output:

```text
TodoList deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

## Menjalankan Interaction Script

Gunakan address hasil deploy:

```bash
TODO_LIST_ADDRESS=0x5*********************aa3 npx hardhat run scripts/interact.js --network localhost
```

Di PowerShell Windows:

```powershell
$env:TODO_LIST_ADDRESS="0x5*************************aa3"
npx hardhat run scripts/interact.js --network localhost
```

## Testing

```bash
npx hardhat test
```

Contoh output:

```text
TodoList
  Deployment
    should deploy successfully
  createTodo
    should create a todo
    should revert when task is empty
  ...
```

## Struktur Folder

```text
project2-blockchain/
├── contracts/
│   └── TodoList.sol
├── test/
│   └── TodoList.test.js
├── scripts/
│   ├── deploy.js
│   └── interact.js
├── hardhat.config.js
├── package.json
└── README.md
```

## Fitur Smart Contract

- Membuat todo baru dengan task, creator, timestamp, dan status default.
- Melihat detail todo berdasarkan id.
- Toggle status completed dari `false` ke `true`, atau sebaliknya.
- Update task hanya oleh creator.
- Soft delete todo hanya oleh creator.
- Menghitung total todo yang pernah dibuat.
- Emit event untuk create, update, completed, dan delete.

## Penjelasan File

- `contracts/TodoList.sol`: smart contract utama berisi struct, mapping, event, modifier, dan semua function todo.
- `scripts/deploy.js`: script deployment contract ke Hardhat Network atau localhost.
- `scripts/interact.js`: script untuk connect ke contract yang sudah deploy, membuat todo, membaca todo, toggle completed, dan update task.
- `test/TodoList.test.js`: unit test Mocha + Chai untuk deployment, validasi, permission creator, soft delete, dan events.
- `hardhat.config.js`: konfigurasi Hardhat dengan Solidity `0.8.20`.
- `package.json`: metadata project, dependency, dan command script.

## Command Setup Dari Awal

```bash
npm install
npx hardhat compile
npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

## Placeholder Screenshot

Tambahkan screenshot hasil compile, test, deploy, dan interaction script di sini.

```text
screenshots/
├── compile.png
├── test.png
├── deploy.png
└── interact.png
```


