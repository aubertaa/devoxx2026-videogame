import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { COLORS, COLORS_HEX, GAME_CONFIG, LEVELS } from '../config/gameConfig';
import { shouldReduceMotion, getAnimationDuration, announce } from '../utils/accessibility';

interface GameOverData {
    score?: number;
    level?: number;
    patterns?: number;
    won?: boolean;
}

export class GameOver extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Rectangle;
    titleText: Phaser.GameObjects.Text;
    scoreText: Phaser.GameObjects.Text;
    levelText: Phaser.GameObjects.Text;
    patternsText: Phaser.GameObjects.Text;
    instructionText: Phaser.GameObjects.Text;

    constructor ()
    {
        super('GameOver');
    }

    create (data: GameOverData)
    {
        const centerX = GAME_CONFIG.WIDTH / 2;
        const centerY = GAME_CONFIG.HEIGHT / 2;
        
        const score = data?.score ?? 0;
        const level = data?.level ?? 1;
        const patterns = data?.patterns ?? 0;
        const won = data?.won ?? false;

        this.camera = this.cameras.main;
        
        // Background color based on win/lose
        const bgColor = won ? COLORS.DEVOXX_BLUE : COLORS.BUG_RED;
        this.background = this.add.rectangle(centerX, centerY, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT, bgColor);

        // Title text - different for win/lose
        const titleMessage = won ? 'YOU WON!' : 'GAME OVER';
        const titleColor = won ? COLORS_HEX.DEVOXX_ORANGE : COLORS_HEX.DEVOXX_WHITE;
        
        this.titleText = this.add.text(centerX, centerY - 150, titleMessage, {
            fontFamily: 'Arial Black',
            fontSize: '72px',
            color: titleColor,
            stroke: COLORS_HEX.DEVOXX_BLACK,
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        // Get level name
        const levelConfig = LEVELS[level - 1] ?? LEVELS[0];
        const levelName = levelConfig.name;

        // Score display
        this.scoreText = this.add.text(centerX, centerY - 40, `Final XP: ${score}`, {
            fontFamily: 'Arial',
            fontSize: '36px',
            color: COLORS_HEX.DEVOXX_WHITE,
            stroke: COLORS_HEX.DEVOXX_BLACK,
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        // Level display
        this.levelText = this.add.text(centerX, centerY + 20, `Level: ${level} - ${levelName}`, {
            fontFamily: 'Arial',
            fontSize: '28px',
            color: COLORS_HEX.DEVOXX_WHITE,
            stroke: COLORS_HEX.DEVOXX_BLACK,
            strokeThickness: 3,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        // Patterns collected
        this.patternsText = this.add.text(centerX, centerY + 70, `Patterns Collected: ${patterns}`, {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: COLORS_HEX.DEVOXX_ORANGE,
            stroke: COLORS_HEX.DEVOXX_BLACK,
            strokeThickness: 2,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        // Restart instruction
        this.instructionText = this.add.text(centerX, centerY + 160, 'Press SPACE or ENTER to Restart\nESC for Main Menu', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: COLORS_HEX.DEVOXX_WHITE,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        // Pulsing animation for instruction (respects reduced motion preference)
        if (!shouldReduceMotion()) {
            this.tweens.add({
                targets: this.instructionText,
                alpha: { from: 1, to: 0.5 },
                duration: getAnimationDuration(800),
                yoyo: true,
                repeat: -1
            });
        }

        // Input handlers - Space/Enter to restart, Escape to main menu
        this.input.keyboard?.on('keydown-SPACE', this.restartGame, this);
        this.input.keyboard?.on('keydown-ENTER', this.restartGame, this);
        this.input.keyboard?.on('keydown-ESC', this.goToMainMenu, this);
        this.input.on('pointerdown', this.restartGame, this);

        // Announce for screen readers
        const statusMessage = won ? 'You won!' : 'Game over!';
        announce(`${statusMessage} Final score: ${score} XP. Level ${level}, ${levelName}. ${patterns} patterns collected. Press Space or Enter to restart, or Escape for main menu.`, 'assertive');
        
        EventBus.emit('current-scene-ready', this);
    }

    restartGame ()
    {
        this.scene.start('Game');
    }

    goToMainMenu ()
    {
        this.scene.start('MainMenu');
    }

    changeScene ()
    {
        this.restartGame();
    }
}
