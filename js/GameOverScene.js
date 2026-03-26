class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.finalScore = data.score || 0;
        this.finalLevel = data.level || 1;
        this.totalCaught = data.totalCaught || 0;
        this.maxCombo = data.maxCombo || 0;

        // High score persistence
        const savedHigh = localStorage.getItem('fruitCatchHighScore');
        this.highScore = savedHigh ? parseInt(savedHigh) : 0;
        this.isNewHighScore = this.finalScore > this.highScore;
        if (this.isNewHighScore) {
            this.highScore = this.finalScore;
            localStorage.setItem('fruitCatchHighScore', this.highScore.toString());
        }
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Dark background
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x16213e);
        bg.fillRect(0, 0, width, height);

        // Sad falling fruits in background
        this.time.addEvent({
            delay: 600,
            callback: () => {
                const fruitTypes = ['apple', 'orange', 'banana', 'grapes', 'watermelon', 'strawberry', 'cherry', 'mango'];
                const type = Phaser.Utils.Array.GetRandom(fruitTypes);
                const x = Phaser.Math.Between(30, width - 30);
                const fruit = this.add.image(x, -20, type).setScale(0.4).setAlpha(0.2);
                this.tweens.add({
                    targets: fruit,
                    y: height + 30,
                    duration: 4000,
                    onComplete: () => fruit.destroy()
                });
            },
            loop: true
        });

        // Hurray message with player name
        const hurrayText = this.add.text(width / 2, 40, 'Hurray ' + playerName + '!', {
            fontSize: '28px',
            fill: '#f1c40f',
            fontFamily: 'Arial Black, Arial',
            fontStyle: 'bold',
            stroke: '#e67e22',
            strokeThickness: 4
        }).setOrigin(0.5).setScale(0);

        this.tweens.add({
            targets: hurrayText,
            scale: 1,
            duration: 500,
            ease: 'Back.easeOut'
        });

        // Game Over text
        const gameOverText = this.add.text(width / 2, 80, 'GAME OVER', {
            fontSize: '40px',
            fill: '#e74c3c',
            fontFamily: 'Arial Black, Arial',
            fontStyle: 'bold',
            stroke: '#c0392b',
            strokeThickness: 5
        }).setOrigin(0.5).setScale(0);

        this.tweens.add({
            targets: gameOverText,
            scale: 1,
            duration: 600,
            delay: 200,
            ease: 'Back.easeOut'
        });

        // Stats panel
        const panelY = 120;
        const panel = this.add.graphics();
        panel.fillStyle(0x000000, 0.4);
        panel.fillRoundedRect(30, panelY, width - 60, 200, 15);
        panel.lineStyle(2, 0x3498db, 0.5);
        panel.strokeRoundedRect(30, panelY, width - 60, 200, 15);

        // Score
        this.add.text(width / 2, panelY + 30, 'SCORE', {
            fontSize: '16px', fill: '#95a5a6', fontFamily: 'Arial', fontStyle: 'bold'
        }).setOrigin(0.5);

        const scoreNum = this.add.text(width / 2, panelY + 60, '0', {
            fontSize: '40px', fill: '#f1c40f', fontFamily: 'Arial Black, Arial', fontStyle: 'bold',
            stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5);

        // Animate score count up
        this.tweens.addCounter({
            from: 0,
            to: this.finalScore,
            duration: 1500,
            delay: 400,
            ease: 'Cubic.easeOut',
            onUpdate: (tween) => {
                scoreNum.setText(Math.round(tween.getValue()).toString());
            }
        });

        // Stats row
        const statsY = panelY + 110;
        const stats = [
            { label: 'Level', value: this.finalLevel, color: '#2ecc71' },
            { label: 'Caught', value: this.totalCaught, color: '#3498db' },
            { label: 'Best Combo', value: this.maxCombo + 'x', color: '#e67e22' }
        ];

        const spacing = (width - 60) / stats.length;
        stats.forEach((stat, i) => {
            const x = 30 + spacing * i + spacing / 2;

            this.add.text(x, statsY, stat.label, {
                fontSize: '13px', fill: '#7f8c8d', fontFamily: 'Arial'
            }).setOrigin(0.5);

            this.add.text(x, statsY + 25, stat.value.toString(), {
                fontSize: '26px', fill: stat.color, fontFamily: 'Arial', fontStyle: 'bold',
                stroke: '#000', strokeThickness: 2
            }).setOrigin(0.5);
        });

        // High score
        const highY = panelY + 170;
        if (this.isNewHighScore) {
            const newHighText = this.add.text(width / 2, highY, 'NEW HIGH SCORE!', {
                fontSize: '20px', fill: '#f1c40f', fontFamily: 'Arial Black, Arial', fontStyle: 'bold',
                stroke: '#e67e22', strokeThickness: 3
            }).setOrigin(0.5);

            this.tweens.add({
                targets: newHighText,
                scale: 1.15,
                duration: 500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        } else {
            this.add.text(width / 2, highY, 'High Score: ' + this.highScore, {
                fontSize: '16px', fill: '#7f8c8d', fontFamily: 'Arial', fontStyle: 'bold'
            }).setOrigin(0.5);
        }

        // Buttons
        const btnY = height - 140;

        // Play Again button
        this.createButton(width / 2, btnY, 'PLAY AGAIN', 0x27ae60, 0x2ecc71, () => {
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.time.delayedCall(300, () => {
                this.scene.start('GameScene');
            });
        });

        // Menu button
        this.createButton(width / 2, btnY + 70, 'MAIN MENU', 0x3498db, 0x2980b9, () => {
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.time.delayedCall(300, () => {
                this.scene.start('MenuScene');
            });
        });

        // Fade in
        this.cameras.main.fadeIn(500, 0, 0, 0);
    }

    createButton(x, y, text, color, hoverColor, callback) {
        const btnWidth = 200;
        const btnHeight = 50;

        const btn = this.add.graphics();
        btn.fillStyle(color);
        btn.fillRoundedRect(x - btnWidth / 2, y - btnHeight / 2, btnWidth, btnHeight, 12);
        btn.lineStyle(2, 0xffffff, 0.3);
        btn.strokeRoundedRect(x - btnWidth / 2, y - btnHeight / 2, btnWidth, btnHeight, 12);

        const btnText = this.add.text(x, y, text, {
            fontSize: '22px', fill: '#ffffff', fontFamily: 'Arial', fontStyle: 'bold'
        }).setOrigin(0.5);

        const zone = this.add.zone(x, y, btnWidth, btnHeight).setInteractive({ useHandCursor: true });

        zone.on('pointerover', () => {
            btn.clear();
            btn.fillStyle(hoverColor);
            btn.fillRoundedRect(x - btnWidth / 2, y - btnHeight / 2, btnWidth, btnHeight, 12);
            btn.lineStyle(2, 0xffffff, 0.5);
            btn.strokeRoundedRect(x - btnWidth / 2, y - btnHeight / 2, btnWidth, btnHeight, 12);
            btnText.setScale(1.05);
        });

        zone.on('pointerout', () => {
            btn.clear();
            btn.fillStyle(color);
            btn.fillRoundedRect(x - btnWidth / 2, y - btnHeight / 2, btnWidth, btnHeight, 12);
            btn.lineStyle(2, 0xffffff, 0.3);
            btn.strokeRoundedRect(x - btnWidth / 2, y - btnHeight / 2, btnWidth, btnHeight, 12);
            btnText.setScale(1);
        });

        zone.on('pointerdown', callback);
    }
}
