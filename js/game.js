// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 420,
    height: 680,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
            width: 320,
            height: 480
        },
        max: {
            width: 420,
            height: 680
        }
    },
    scene: [BootScene, MenuScene, GameScene, GameOverScene],
    backgroundColor: '#1a1a2e',
    render: {
        pixelArt: false,
        antialias: true
    },
    input: {
        activePointers: 1,
        touch: {
            capture: true
        }
    }
};

// Create the game
const game = new Phaser.Game(config);
