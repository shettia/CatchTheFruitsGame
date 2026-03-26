class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Sky gradient background
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x87CEEB, 0x87CEEB, 0x4a90d9, 0x4a90d9);
        bg.fillRect(0, 0, width, height);

        // Ground
        bg.fillStyle(0x27ae60);
        bg.fillRoundedRect(-10, height - 80, width + 20, 100, 20);
        bg.fillStyle(0x2ecc71);
        bg.fillRoundedRect(-10, height - 75, width + 20, 30, 10);

        // Clouds
        this.createCloud(80, 60);
        this.createCloud(width - 120, 90);
        this.createCloud(width / 2 - 40, 40);

        // Animated falling fruits in background
        this.time.addEvent({
            delay: 800,
            callback: () => this.spawnMenuFruit(),
            loop: true
        });

        // Title with shadow
        this.add.text(width / 2 + 3, 83, 'CATCH THE', {
            fontSize: '36px',
            fill: '#000000',
            fontFamily: 'Arial Black, Arial',
            fontStyle: 'bold',
            alpha: 0.3
        }).setOrigin(0.5);

        this.add.text(width / 2, 80, 'CATCH THE', {
            fontSize: '36px',
            fill: '#ffffff',
            fontFamily: 'Arial Black, Arial',
            fontStyle: 'bold',
            stroke: '#2c3e50',
            strokeThickness: 4
        }).setOrigin(0.5);

        const fruitsTitle = this.add.text(width / 2, 130, 'FRUITS!', {
            fontSize: '52px',
            fill: '#f1c40f',
            fontFamily: 'Arial Black, Arial',
            fontStyle: 'bold',
            stroke: '#e67e22',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Bounce animation on title
        this.tweens.add({
            targets: fruitsTitle,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Display some fruits around the title
        const fruitTypes = ['apple', 'orange', 'banana', 'grapes', 'watermelon', 'strawberry', 'cherry', 'mango'];
        const positions = [
            { x: 60, y: 110 }, { x: width - 60, y: 110 },
            { x: 40, y: 160 }, { x: width - 40, y: 160 }
        ];
        positions.forEach((pos, i) => {
            const fruit = this.add.image(pos.x, pos.y, fruitTypes[i % fruitTypes.length]).setScale(0.7);
            this.tweens.add({
                targets: fruit,
                y: pos.y - 8,
                angle: 10,
                duration: 1000 + i * 200,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });

        // Basket display
        const basketImg = this.add.image(width / 2, height - 130, 'basket').setScale(0.9);
        this.tweens.add({
            targets: basketImg,
            x: width / 2 + 20,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Play button
        const playBtn = this.add.graphics();
        playBtn.fillStyle(0x27ae60);
        playBtn.fillRoundedRect(width / 2 - 100, height / 2 + 30, 200, 60, 15);
        playBtn.lineStyle(3, 0x2ecc71);
        playBtn.strokeRoundedRect(width / 2 - 100, height / 2 + 30, 200, 60, 15);

        const playText = this.add.text(width / 2, height / 2 + 60, 'PLAY', {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: 'Arial Black, Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Make play button interactive
        const playZone = this.add.zone(width / 2, height / 2 + 60, 200, 60).setInteractive({ useHandCursor: true });

        playZone.on('pointerover', () => {
            playBtn.clear();
            playBtn.fillStyle(0x2ecc71);
            playBtn.fillRoundedRect(width / 2 - 100, height / 2 + 30, 200, 60, 15);
            playBtn.lineStyle(3, 0x27ae60);
            playBtn.strokeRoundedRect(width / 2 - 100, height / 2 + 30, 200, 60, 15);
            playText.setScale(1.1);
        });

        playZone.on('pointerout', () => {
            playBtn.clear();
            playBtn.fillStyle(0x27ae60);
            playBtn.fillRoundedRect(width / 2 - 100, height / 2 + 30, 200, 60, 15);
            playBtn.lineStyle(3, 0x2ecc71);
            playBtn.strokeRoundedRect(width / 2 - 100, height / 2 + 30, 200, 60, 15);
            playText.setScale(1);
        });

        playZone.on('pointerdown', () => {
            this.cameras.main.fadeOut(400, 0, 0, 0);
            this.time.delayedCall(400, () => {
                this.scene.start('GameScene');
            });
        });

        // Welcome player
        this.add.text(width / 2, height / 2 + 100, 'Welcome, ' + playerName + '!', {
            fontSize: '20px',
            fill: '#f1c40f',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Instructions
        const isMobile = this.sys.game.device.input.touch;
        const controlText = isMobile
            ? 'Touch & drag to move the basket'
            : 'Use Arrow Keys or Mouse to move';

        this.add.text(width / 2, height / 2 + 130, controlText, {
            fontSize: '16px',
            fill: '#ecf0f1',
            fontFamily: 'Arial',
            stroke: '#2c3e50',
            strokeThickness: 2
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 2 + 160, 'Catch fruits to score points!', {
            fontSize: '14px',
            fill: '#bdc3c7',
            fontFamily: 'Arial',
            stroke: '#2c3e50',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Fade in
        this.cameras.main.fadeIn(500, 0, 0, 0);
    }

    createCloud(x, y) {
        const cloud = this.add.graphics();
        cloud.fillStyle(0xffffff, 0.7);
        cloud.fillCircle(x, y, 25);
        cloud.fillCircle(x + 25, y - 5, 20);
        cloud.fillCircle(x + 50, y, 28);
        cloud.fillCircle(x + 20, y + 5, 22);
        cloud.fillCircle(x + 40, y + 5, 18);
    }

    spawnMenuFruit() {
        const width = this.cameras.main.width;
        const fruitTypes = ['apple', 'orange', 'banana', 'grapes', 'watermelon', 'strawberry', 'cherry', 'mango'];
        const type = Phaser.Utils.Array.GetRandom(fruitTypes);
        const x = Phaser.Math.Between(30, width - 30);

        const fruit = this.add.image(x, -20, type).setScale(0.5).setAlpha(0.4);

        this.tweens.add({
            targets: fruit,
            y: this.cameras.main.height + 30,
            angle: Phaser.Math.Between(-180, 180),
            duration: Phaser.Math.Between(3000, 5000),
            onComplete: () => fruit.destroy()
        });
    }
}
