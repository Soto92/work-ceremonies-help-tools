# Live Code Sharing App

A real-time collaborative code editor with Socket.IO, Operational Transformation, and cursor sharing for local development.

## Features

- 👥 Multi-user real-time editing
- ✏️ Operational Transformation (OT) support
- 🖱️ Live cursor position sharing
- 📂 Project/file management
- 🔌 No auth required (local use only)

## Installation

```bash
npm install
npm start
```

## Usage

1. Start the server: `npm start`
2. Open `client.html` in browser
3. Connect with friends using same project name

## TODO: VSCode Integration

## Development Scripts

```bash
npm start      # Start development server
npm run dev    # Start with nodemon
npm run build  # Build VSCode extension (future)
```

## Project Structure

.
├── server/ # Socket.IO server code
├── client/ # Web client implementation
├── vscode-extension/ # Future VSCode extension
└── shared-projects/ # Default project storage

```

## License

MIT License - For local/development use only

```
