class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    create() {
        // Generate all game assets as graphics textures
        this.createFruitTextures();
        this.createBasketTexture();
        this.createParticleTexture();

        this.scene.start('MenuScene');
    }

    createFruitTextures() {
        // Apple - red circle with stem
        const apple = this.make.graphics({ x: 0, y: 0, add: false });
        apple.fillStyle(0xe74c3c);
        apple.fillCircle(25, 28, 22);
        apple.fillStyle(0xc0392b);
        apple.fillCircle(18, 22, 10);
        apple.fillStyle(0x27ae60);
        apple.fillRect(23, 2, 4, 10);
        apple.fillStyle(0x2ecc71);
        apple.beginPath();
        apple.arc(30, 8, 7, Math.PI, Math.PI * 1.6);
        apple.fillPath();
        apple.generateTexture('apple', 50, 50);
        apple.destroy();

        // Orange
        const orange = this.make.graphics({ x: 0, y: 0, add: false });
        orange.fillStyle(0xf39c12);
        orange.fillCircle(25, 28, 22);
        orange.fillStyle(0xe67e22);
        orange.fillCircle(20, 22, 8);
        orange.fillStyle(0x27ae60);
        orange.fillRect(23, 3, 4, 8);
        orange.generateTexture('orange', 50, 50);
        orange.destroy();

        // Banana - yellow curved shape
        const banana = this.make.graphics({ x: 0, y: 0, add: false });
        banana.fillStyle(0xf1c40f);
        banana.beginPath();
        banana.arc(25, 35, 20, Math.PI * 1.2, Math.PI * 1.9);
        banana.lineTo(40, 10);
        banana.arc(25, 35, 12, Math.PI * 1.9, Math.PI * 1.2, true);
        banana.closePath();
        banana.fillPath();
        banana.fillStyle(0xd4ac0d);
        banana.fillCircle(15, 18, 3);
        banana.generateTexture('banana', 50, 50);
        banana.destroy();

        // Grapes - purple cluster
        const grapes = this.make.graphics({ x: 0, y: 0, add: false });
        grapes.fillStyle(0x8e44ad);
        grapes.fillCircle(20, 22, 8);
        grapes.fillCircle(30, 22, 8);
        grapes.fillCircle(25, 32, 8);
        grapes.fillCircle(15, 32, 8);
        grapes.fillCircle(35, 32, 8);
        grapes.fillCircle(20, 42, 8);
        grapes.fillCircle(30, 42, 8);
        grapes.fillStyle(0x9b59b6);
        grapes.fillCircle(18, 20, 4);
        grapes.fillCircle(28, 20, 4);
        grapes.fillStyle(0x27ae60);
        grapes.fillRect(24, 8, 3, 10);
        grapes.generateTexture('grapes', 50, 50);
        grapes.destroy();

        // Watermelon - green circle with red inside
        const watermelon = this.make.graphics({ x: 0, y: 0, add: false });
        watermelon.fillStyle(0x27ae60);
        watermelon.fillCircle(25, 28, 23);
        watermelon.fillStyle(0x2ecc71);
        watermelon.beginPath();
        watermelon.arc(25, 28, 23, 0, Math.PI, true);
        watermelon.fillPath();
        watermelon.fillStyle(0xe74c3c);
        watermelon.fillCircle(25, 28, 17);
        watermelon.fillStyle(0x2c3e50);
        watermelon.fillCircle(20, 25, 2);
        watermelon.fillCircle(28, 30, 2);
        watermelon.fillCircle(22, 33, 2);
        watermelon.fillCircle(30, 24, 2);
        watermelon.generateTexture('watermelon', 50, 50);
        watermelon.destroy();

        // Strawberry - red triangle-ish with seeds
        const strawberry = this.make.graphics({ x: 0, y: 0, add: false });
        strawberry.fillStyle(0xe74c3c);
        strawberry.beginPath();
        strawberry.moveTo(25, 48);
        strawberry.lineTo(8, 18);
        strawberry.arc(25, 18, 17, Math.PI, 0);
        strawberry.lineTo(25, 48);
        strawberry.closePath();
        strawberry.fillPath();
        strawberry.fillStyle(0xf1c40f);
        strawberry.fillCircle(20, 25, 1.5);
        strawberry.fillCircle(30, 25, 1.5);
        strawberry.fillCircle(25, 32, 1.5);
        strawberry.fillCircle(18, 35, 1.5);
        strawberry.fillCircle(32, 35, 1.5);
        strawberry.fillCircle(22, 40, 1.5);
        strawberry.fillCircle(28, 40, 1.5);
        strawberry.fillStyle(0x27ae60);
        strawberry.fillRect(17, 12, 16, 5);
        strawberry.fillTriangle(17, 12, 20, 5, 23, 12);
        strawberry.fillTriangle(23, 12, 25, 3, 28, 12);
        strawberry.fillTriangle(28, 12, 31, 5, 33, 12);
        strawberry.generateTexture('strawberry', 50, 50);
        strawberry.destroy();

        // Cherry - two red circles with stems
        const cherry = this.make.graphics({ x: 0, y: 0, add: false });
        cherry.lineStyle(3, 0x27ae60);
        cherry.beginPath();
        cherry.moveTo(18, 32);
        cherry.lineTo(25, 8);
        cherry.strokePath();
        cherry.beginPath();
        cherry.moveTo(35, 35);
        cherry.lineTo(25, 8);
        cherry.strokePath();
        cherry.fillStyle(0xc0392b);
        cherry.fillCircle(18, 38, 12);
        cherry.fillCircle(35, 40, 11);
        cherry.fillStyle(0xe74c3c);
        cherry.fillCircle(14, 34, 5);
        cherry.fillCircle(31, 36, 4);
        cherry.generateTexture('cherry', 50, 50);
        cherry.destroy();

        // Mango - yellowish oval using circles
        const mango = this.make.graphics({ x: 0, y: 0, add: false });
        mango.fillStyle(0xf39c12);
        mango.fillCircle(25, 28, 20);
        mango.fillCircle(22, 26, 16);
        mango.fillStyle(0xe74c3c);
        mango.fillCircle(15, 20, 8);
        mango.fillStyle(0xf1c40f);
        mango.fillCircle(30, 32, 6);
        mango.fillStyle(0x27ae60);
        mango.fillRect(24, 6, 3, 8);
        mango.generateTexture('mango', 50, 50);
        mango.destroy();
    }

    createBasketTexture() {
        const basket = this.make.graphics({ x: 0, y: 0, add: false });
        const w = 120, h = 80;

        // Basket body - curved trapezoid shape
        basket.fillStyle(0xC68642);
        basket.beginPath();
        basket.moveTo(15, 20);
        basket.lineTo(5, 72);
        basket.arc(w / 2, 68, w / 2 - 5, Math.PI * 0.95, Math.PI * 0.05, false);
        basket.lineTo(w - 15, 20);
        basket.closePath();
        basket.fillPath();

        // Darker inner area to give depth
        basket.fillStyle(0x8B5E3C);
        basket.beginPath();
        basket.moveTo(22, 24);
        basket.lineTo(14, 66);
        basket.arc(w / 2, 62, w / 2 - 14, Math.PI * 0.95, Math.PI * 0.05, false);
        basket.lineTo(w - 22, 24);
        basket.closePath();
        basket.fillPath();

        // Horizontal weave pattern
        for (let row = 0; row < 4; row++) {
            const y = 30 + row * 12;
            const shrink = row * 1.2;
            for (let col = 0; col < 8; col++) {
                const isOffset = row % 2 === 0;
                const xStart = 12 - shrink + (col * 12) + (isOffset ? 0 : 6);
                if (xStart > w - 15) continue;
                const colWidth = 10;
                // Alternating light/dark weave
                if (col % 2 === 0) {
                    basket.fillStyle(0xDEA65A);
                } else {
                    basket.fillStyle(0xB8782E);
                }
                basket.fillRect(xStart, y, colWidth, 10);
            }
        }

        // Thick rim at the top - oval/rounded
        basket.fillStyle(0x8B4513);
        basket.beginPath();
        basket.moveTo(10, 16);
        basket.lineTo(w - 10, 16);
        basket.lineTo(w - 12, 26);
        basket.lineTo(12, 26);
        basket.closePath();
        basket.fillPath();

        // Rim highlight
        basket.fillStyle(0xA0522D);
        basket.beginPath();
        basket.moveTo(12, 17);
        basket.lineTo(w - 12, 17);
        basket.lineTo(w - 13, 22);
        basket.lineTo(13, 22);
        basket.closePath();
        basket.fillPath();

        // Rim top edge highlight
        basket.lineStyle(2, 0xD4A055);
        basket.beginPath();
        basket.moveTo(12, 17);
        basket.lineTo(w - 12, 17);
        basket.strokePath();

        // Bottom curved edge
        basket.lineStyle(2, 0x6B3410);
        basket.beginPath();
        basket.moveTo(8, 70);
        basket.arc(w / 2, 66, w / 2 - 8, Math.PI * 0.95, Math.PI * 0.05, false);
        basket.strokePath();

        // Handle - arched wicker handle
        basket.lineStyle(5, 0x8B4513);
        basket.beginPath();
        basket.arc(w / 2, 18, 30, Math.PI, 0, false);
        basket.strokePath();

        // Handle highlight
        basket.lineStyle(2, 0xD4A055);
        basket.beginPath();
        basket.arc(w / 2, 18, 30, Math.PI * 1.1, Math.PI * 1.9, false);
        basket.strokePath();

        basket.generateTexture('basket', w, h);
        basket.destroy();
    }

    createParticleTexture() {
        const particle = this.make.graphics({ x: 0, y: 0, add: false });
        particle.fillStyle(0xffffff);
        particle.fillCircle(4, 4, 4);
        particle.generateTexture('particle', 8, 8);
        particle.destroy();

        // Star particle - draw a simple diamond/star shape
        const star = this.make.graphics({ x: 0, y: 0, add: false });
        star.fillStyle(0xf1c40f);
        star.beginPath();
        star.moveTo(8, 0);
        star.lineTo(10, 6);
        star.lineTo(16, 8);
        star.lineTo(10, 10);
        star.lineTo(8, 16);
        star.lineTo(6, 10);
        star.lineTo(0, 8);
        star.lineTo(6, 6);
        star.closePath();
        star.fillPath();
        star.generateTexture('star', 16, 16);
        star.destroy();
    }
}
