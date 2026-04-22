import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';
import { COLORS, COLORS_HEX, GAME_CONFIG } from '../config/gameConfig';

export class MainMenu extends Scene
{
    background: GameObjects.Rectangle;
    title: GameObjects.Text;
    subtitle: GameObjects.Text;
    instruction: GameObjects.Text;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        const centerX = GAME_CONFIG.WIDTH / 2;
        const centerY = GAME_CONFIG.HEIGHT / 2;

        // Background with Devoxx blue
        this.background = this.add.rectangle(centerX, centerY, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT, COLORS.DEVOXX_BLUE);

        // Main title with Devoxx orange
        this.title = this.add.text(centerX, centerY - 80, 'Craft Runner', {
            fontFamily: 'Arial Black',
            fontSize: '64px',
            color: COLORS_HEX.DEVOXX_ORANGE,
            stroke: COLORS_HEX.DEVOXX_BLACK,
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        // Subtitle
        this.subtitle = this.add.text(centerX, centerY, 'Devoxx 2026', {
            fontFamily: 'Arial Black',
            fontSize: '32px',
            color: COLORS_HEX.DEVOXX_WHITE,
            stroke: COLORS_HEX.DEVOXX_BLACK,
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        // Instruction text with pulsing animation
        this.instruction = this.add.text(centerX, centerY + 120, 'Press SPACE or Click to Start', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: COLORS_HEX.DEVOXX_WHITE,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        // Pulsing animation for instruction
        this.tweens.add({
            targets: this.instruction,
            alpha: { from: 1, to: 0.5 },
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // Input handlers
        this.input.keyboard?.on('keydown-SPACE', this.changeScene, this);
        this.input.on('pointerdown', this.changeScene, this);

        EventBus.emit('current-scene-ready', this);
    }
    
    changeScene ()
    {
        this.scene.start('Game');
    }
}
