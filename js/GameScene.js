class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init() {
        this.score = 0;
        this.lives = 5;
        this.level = 1;
        this.fruitsToNextLevel = 10;
        this.fruitsCaughtThisLevel = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.totalCaught = 0;
        this.isGameOver = false;
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.fruitTypes = [
            { key: 'apple', points: 10, color: 0xe74c3c },
            { key: 'orange', points: 15, color: 0xf39c12 },
            { key: 'banana', points: 12, color: 0xf1c40f },
            { key: 'grapes', points: 20, color: 0x8e44ad },
            { key: 'watermelon', points: 25, color: 0x27ae60 },
            { key: 'strawberry', points: 18, color: 0xe74c3c },
            { key: 'cherry', points: 22, color: 0xc0392b },
            { key: 'mango', points: 30, color: 0xf39c12 }
        ];

        // Sky gradient background
        this.bg = this.add.graphics();
        this.bg.fillGradientStyle(0x87CEEB, 0x87CEEB, 0x4a90d9, 0x4a90d9);
        this.bg.fillRect(0, 0, width, height);

        // Ground
        this.bg.fillStyle(0x8B4513);
        this.bg.fillRect(0, height - 20, width, 20);
        this.bg.fillStyle(0x27ae60);
        this.bg.fillRoundedRect(-5, height - 30, width + 10, 20, 8);

        // Clouds (decorative)
        this.createCloud(60, 50);
        this.createCloud(width - 100, 70);
        this.createCloud(width / 2, 35);

        // Fruits group
        this.fruits = this.physics.add.group();

        // Basket
        this.basket = this.physics.add.sprite(width / 2, height - 65, 'basket');
        this.basket.setCollideWorldBounds(true);
        this.basket.setImmovable(true);
        this.basket.body.allowGravity = false;
        this.basket.setScale(0.9);
        this.basket.setSize(90, 30);
        this.basket.setOffset(15, 20);

        // Overlap detection
        this.physics.add.overlap(this.basket, this.fruits, this.catchFruit, null, this);

        // Keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();

        // Mouse/touch controls
        this.input.on('pointermove', (pointer) => {
            if (!this.isGameOver) {
                this.basket.x = Phaser.Math.Clamp(pointer.x, 50, width - 50);
            }
        });

        // HUD Background
        const hudBg = this.add.graphics();
        hudBg.fillStyle(0x000000, 0.5);
        hudBg.fillRoundedRect(5, 5, width - 10, 55, 10);

        // Score display
        this.scoreText = this.add.text(15, 12, 'Score: 0', {
            fontSize: '20px',
            fill: '#f1c40f',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 2
        });

        // Level display
        this.levelText = this.add.text(width / 2, 12, 'Level 1', {
            fontSize: '20px',
            fill: '#2ecc71',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0.5, 0);

        // Lives display with heart icons
        this.livesText = this.add.text(width - 15, 12, '', {
            fontSize: '20px',
            fill: '#e74c3c',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(1, 0);
        this.updateLivesDisplay();

        // Combo display
        this.comboText = this.add.text(width / 2, 38, '', {
            fontSize: '16px',
            fill: '#e67e22',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0.5, 0);

        // Progress bar for next level
        this.progressBg = this.add.graphics();
        this.progressFill = this.add.graphics();
        this.updateProgressBar();

        // Fruit spawn timer
        this.spawnDelay = 1200;
        this.fruitSpeed = 80;
        this.setupSpawnTimer();

        // Fade in
        this.cameras.main.fadeIn(400, 0, 0, 0);
    }

    createCloud(x, y) {
        const cloud = this.add.graphics();
        cloud.fillStyle(0xffffff, 0.5);
        cloud.fillCircle(x, y, 20);
        cloud.fillCircle(x + 20, y - 5, 15);
        cloud.fillCircle(x + 40, y, 22);
        cloud.fillCircle(x + 15, y + 5, 18);
        cloud.fillCircle(x + 35, y + 3, 14);
    }

    setupSpawnTimer() {
        if (this.spawnTimer) {
            this.spawnTimer.remove();
        }
        this.spawnTimer = this.time.addEvent({
            delay: this.spawnDelay,
            callback: this.spawnFruit,
            callbackScope: this,
            loop: true
        });
    }

    spawnFruit() {
        if (this.isGameOver) return;

        const width = this.cameras.main.width;
        const fruitData = Phaser.Utils.Array.GetRandom(this.fruitTypes);
        const x = Phaser.Math.Between(40, width - 40);

        const fruit = this.fruits.create(x, -30, fruitData.key);
        fruit.setData('points', fruitData.points);
        fruit.setData('color', fruitData.color);
        fruit.setData('type', fruitData.key);

        fruit.body.allowGravity = false;
        fruit.setVelocityY(this.fruitSpeed + Phaser.Math.Between(-15, 15));
        fruit.setScale(0.85);
        fruit.setSize(35, 35);

        // Slight random horizontal drift
        fruit.setVelocityX(Phaser.Math.Between(-15, 15));

        // Gentle rotation
        fruit.setAngularVelocity(Phaser.Math.Between(-40, 40));

        // Spawn animation
        fruit.setScale(0);
        this.tweens.add({
            targets: fruit,
            scale: 0.85,
            duration: 300,
            ease: 'Back.easeOut'
        });
    }

    catchFruit(basket, fruit) {
        const points = fruit.getData('points');
        const color = fruit.getData('color');

        // Combo system
        this.combo++;
        if (this.combo > this.maxCombo) {
            this.maxCombo = this.combo;
        }

        let comboMultiplier = 1;
        if (this.combo >= 10) comboMultiplier = 3;
        else if (this.combo >= 5) comboMultiplier = 2;
        else if (this.combo >= 3) comboMultiplier = 1.5;

        const totalPoints = Math.round(points * comboMultiplier);
        this.score += totalPoints;
        this.totalCaught++;
        this.fruitsCaughtThisLevel++;

        // Update displays
        this.scoreText.setText('Score: ' + this.score);

        // Combo text
        if (this.combo >= 3) {
            this.comboText.setText('Combo x' + this.combo + '!');
            this.comboText.setScale(1.3);
            this.tweens.add({
                targets: this.comboText,
                scale: 1,
                duration: 300,
                ease: 'Back.easeOut'
            });
        }

        // Floating score text
        const floatText = this.add.text(fruit.x, fruit.y, '+' + totalPoints, {
            fontSize: comboMultiplier > 1 ? '24px' : '20px',
            fill: comboMultiplier > 1 ? '#f39c12' : '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(0.5);

        this.tweens.add({
            targets: floatText,
            y: fruit.y - 60,
            alpha: 0,
            scale: 1.5,
            duration: 800,
            onComplete: () => floatText.destroy()
        });

        // Catch particle effect
        this.createCatchEffect(fruit.x, fruit.y, color);

        // Basket bounce effect
        this.tweens.add({
            targets: basket,
            scaleY: 0.85,
            duration: 80,
            yoyo: true,
            ease: 'Sine.easeOut'
        });

        // Check level progress
        if (this.fruitsCaughtThisLevel >= this.fruitsToNextLevel) {
            this.levelUp();
        }
        this.updateProgressBar();

        fruit.destroy();
    }

    createCatchEffect(x, y, color) {
        // Create multiple small particles manually
        for (let i = 0; i < 8; i++) {
            const particle = this.add.graphics();
            particle.fillStyle(color);
            particle.fillCircle(0, 0, Phaser.Math.Between(3, 6));
            particle.setPosition(x, y);

            const angle = (Math.PI * 2 * i) / 8;
            const speed = Phaser.Math.Between(60, 120);

            this.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * speed,
                y: y + Math.sin(angle) * speed - 30,
                alpha: 0,
                scale: 0,
                duration: 500,
                ease: 'Cubic.easeOut',
                onComplete: () => particle.destroy()
            });
        }

        // Star burst
        for (let i = 0; i < 3; i++) {
            const star = this.add.image(x + Phaser.Math.Between(-15, 15), y, 'star').setScale(0);
            this.tweens.add({
                targets: star,
                scale: Phaser.Math.FloatBetween(0.5, 1),
                y: y - Phaser.Math.Between(30, 60),
                x: star.x + Phaser.Math.Between(-20, 20),
                alpha: 0,
                angle: Phaser.Math.Between(-90, 90),
                duration: 600,
                delay: i * 50,
                ease: 'Cubic.easeOut',
                onComplete: () => star.destroy()
            });
        }
    }

    levelUp() {
        this.level++;
        this.fruitsCaughtThisLevel = 0;
        this.fruitsToNextLevel = 10 + (this.level - 1) * 3;

        // Increase difficulty
        this.spawnDelay = Math.max(400, this.spawnDelay - 80);
        this.fruitSpeed = Math.min(200, this.fruitSpeed + 12);
        this.setupSpawnTimer();

        // Level up display
        this.levelText.setText('Level ' + this.level);

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const levelUpText = this.add.text(width / 2, height / 2 - 40, 'LEVEL ' + this.level + '!', {
            fontSize: '48px',
            fill: '#f1c40f',
            fontFamily: 'Arial Black, Arial',
            fontStyle: 'bold',
            stroke: '#e67e22',
            strokeThickness: 6
        }).setOrigin(0.5).setScale(0);

        const subText = this.add.text(width / 2, height / 2 + 20, 'Speed Up!', {
            fontSize: '22px',
            fill: '#ecf0f1',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: levelUpText,
            scale: 1,
            duration: 500,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.tweens.add({
                    targets: [levelUpText, subText],
                    alpha: 0,
                    y: '-=30',
                    duration: 800,
                    delay: 800,
                    onComplete: () => {
                        levelUpText.destroy();
                        subText.destroy();
                    }
                });
            }
        });

        this.tweens.add({
            targets: subText,
            alpha: 1,
            duration: 400,
            delay: 300
        });

        // Camera flash
        this.cameras.main.flash(300, 255, 255, 255, false, null, this);
    }

    missedFruit(fruit) {
        this.combo = 0;
        this.comboText.setText('');
        this.lives--;
        this.updateLivesDisplay();

        // Screen shake
        this.cameras.main.shake(200, 0.005);

        // Miss effect
        const missText = this.add.text(fruit.x, this.cameras.main.height - 50, 'Miss!', {
            fontSize: '18px',
            fill: '#e74c3c',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0.5);

        this.tweens.add({
            targets: missText,
            y: missText.y - 40,
            alpha: 0,
            duration: 600,
            onComplete: () => missText.destroy()
        });

        // Red flash on lives
        this.tweens.add({
            targets: this.livesText,
            scale: 1.4,
            duration: 150,
            yoyo: true
        });

        fruit.destroy();

        if (this.lives <= 0) {
            this.gameOver();
        }
    }

    updateLivesDisplay() {
        let hearts = '';
        for (let i = 0; i < this.lives; i++) {
            hearts += '\u2764 ';
        }
        for (let i = this.lives; i < 5; i++) {
            hearts += '\u2661 ';
        }
        this.livesText.setText(hearts.trim());
    }

    updateProgressBar() {
        const width = this.cameras.main.width;

        this.progressBg.clear();
        this.progressBg.fillStyle(0x000000, 0.3);
        this.progressBg.fillRoundedRect(15, 48, width - 30, 8, 4);

        this.progressFill.clear();
        const progress = this.fruitsCaughtThisLevel / this.fruitsToNextLevel;
        const barWidth = (width - 34) * Math.min(progress, 1);
        if (barWidth > 0) {
            this.progressFill.fillStyle(0x2ecc71);
            this.progressFill.fillRoundedRect(17, 50, barWidth, 4, 2);
        }
    }

    gameOver() {
        this.isGameOver = true;

        if (this.spawnTimer) {
            this.spawnTimer.remove();
        }

        // Slow everything down
        this.physics.world.timeScale = 3;

        this.time.delayedCall(600, () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                this.scene.start('GameOverScene', {
                    score: this.score,
                    level: this.level,
                    totalCaught: this.totalCaught,
                    maxCombo: this.maxCombo
                });
            });
        });
    }

    update() {
        if (this.isGameOver) return;

        const width = this.cameras.main.width;
        const basketSpeed = 400;

        // Keyboard movement
        if (this.cursors.left.isDown) {
            this.basket.setVelocityX(-basketSpeed);
        } else if (this.cursors.right.isDown) {
            this.basket.setVelocityX(basketSpeed);
        } else {
            // Only stop if not using pointer
            if (!this.input.activePointer.isDown) {
                this.basket.setVelocityX(0);
            }
        }

        // Keep basket in bounds
        this.basket.x = Phaser.Math.Clamp(this.basket.x, 50, width - 50);

        // Check for fruits that fell off screen (copy array to avoid mutation during iteration)
        const fallenFruits = this.fruits.getChildren().filter(
            (fruit) => fruit.y > this.cameras.main.height + 30
        );
        fallenFruits.forEach((fruit) => this.missedFruit(fruit));
    }
}
