import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';
import { COLORS, COLORS_HEX, GAME_CONFIG } from '../config/gameConfig';
import { shouldReduceMotion, getAnimationDuration, announce } from '../utils/accessibility';

export class MainMenu extends Scene
{
    background: GameObjects.Rectangle;
    title: GameObjects.Text;
    subtitle: GameObjects.Text;
    instruction: GameObjects.Text;
    focusIndicator: GameObjects.Graphics;

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
        this.instruction = this.add.text(centerX, centerY + 120, 'Press SPACE or ENTER to Start', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: COLORS_HEX.DEVOXX_WHITE,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        // Visible focus indicator around instruction
        this.focusIndicator = this.add.graphics();
        this.focusIndicator.lineStyle(3, COLORS.DEVOXX_ORANGE, 1);
        const bounds = this.instruction.getBounds();
        this.focusIndicator.strokeRoundedRect(
            bounds.x - 15,
            bounds.y - 10,
            bounds.width + 30,
            bounds.height + 20,
            8
        );
        this.focusIndicator.setDepth(99);

        // Pulsing animation for instruction (respects reduced motion preference)
        if (!shouldReduceMotion()) {
            this.tweens.add({
                targets: [this.instruction, this.focusIndicator],
                alpha: { from: 1, to: 0.5 },
                duration: getAnimationDuration(800),
                yoyo: true,
                repeat: -1
            });
        }

        // Input handlers - Space and Enter to start
        this.input.keyboard?.on('keydown-SPACE', this.changeScene, this);
        this.input.keyboard?.on('keydown-ENTER', this.changeScene, this);
        this.input.on('pointerdown', this.changeScene, this);

        // Announce for screen readers
        announce('Main menu. Press Space or Enter to start', 'polite');

        EventBus.emit('current-scene-ready', this);
    }
    
    changeScene ()
    {
        this.scene.start('Game');
    }
}
