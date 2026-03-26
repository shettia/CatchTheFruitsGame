# Catch The Fruits!

A fun browser-based fruit catching game built with [Phaser 3](https://phaser.io/).

## How to Run

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge)
- One of: Node.js, Python, or any static file server

### Steps

**Option 1 — Node.js (npx)**
```bash
git clone https://github.com/shettia/CatchTheFruitsGame.git
cd CatchTheFruitsGame
npx http-server -p 8080
```
Then open `http://localhost:8080` in your browser.

**Option 2 — Python**
```bash
git clone https://github.com/shettia/CatchTheFruitsGame.git
cd CatchTheFruitsGame
python -m http.server 8080
```
Then open `http://localhost:8080`.

**Option 3 — VS Code Live Server**
1. Clone the repo and open the folder in VS Code
2. Install the **Live Server** extension
3. Right-click `index.html` → **Open with Live Server**

### Why a server is needed
The game loads Phaser 3 from a CDN (`cdn.jsdelivr.net`). Opening `index.html` directly as a `file://` URL may block the CDN script due to browser security policies. A local HTTP server avoids this.

## Project Structure

```
├── index.html          # Main HTML page
└── js/
    ├── BootScene.js    # Asset loading scene
    ├── MenuScene.js    # Main menu scene
    ├── GameScene.js    # Core gameplay scene
    ├── GameOverScene.js# Game over screen
    └── game.js         # Phaser game configuration
```
