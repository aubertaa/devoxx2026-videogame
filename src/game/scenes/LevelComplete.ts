import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { COLORS, COLORS_HEX, GAME_CONFIG, LEVELS } from '../config/gameConfig';
import { shouldReduceMotion, getAnimationDuration, announce } from '../utils/accessibility';

interface LevelCompleteData {
    level: number;
    score: number;
    patterns: number;
}

export class LevelComplete extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Rectangle;
    titleText: Phaser.GameObjects.Text;
    levelNameText: Phaser.GameObjects.Text;
    encouragementText: Phaser.GameObjects.Text;
    continueText: Phaser.GameObjects.Text;
    
    private levelData: LevelCompleteData;

    constructor ()
    {
        super('LevelComplete');
    }

    create (data: LevelCompleteData)
    {
        const centerX = GAME_CONFIG.WIDTH / 2;
        const centerY = GAME_CONFIG.HEIGHT / 2;
        
        this.levelData = {
            level: data?.level ?? 1,
            score: data?.score ?? 0,
            patterns: data?.patterns ?? 0
        };

        this.camera = this.cameras.main;
        
        // Background with Devoxx blue
        this.background = this.add.rectangle(centerX, centerY, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT, COLORS.DEVOXX_BLUE);

        // Level complete title
        this.titleText = this.add.text(centerX, centerY - 100, `Level ${this.levelData.level} Complete!`, {
            fontFamily: 'Arial Black',
            fontSize: '56px',
            color: COLORS_HEX.DEVOXX_ORANGE,
            stroke: COLORS_HEX.DEVOXX_BLACK,
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        // Get next level name
        const nextLevel = this.levelData.level + 1;
        const nextLevelConfig = LEVELS[nextLevel - 1];
        const nextLevelName = nextLevelConfig?.name ?? 'Master Craftsman';

        // Next level name
        this.levelNameText = this.add.text(centerX, centerY, `Next: ${nextLevelName}`, {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: COLORS_HEX.DEVOXX_WHITE,
            stroke: COLORS_HEX.DEVOXX_BLACK,
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        // Encouragement messages
        const encouragements = [
            'Keep crafting!',
            'Great coding skills!',
            'Level up your craft!',
            'Clean code ahead!',
            'You\'re a pattern master!'
        ];
        const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];

        this.encouragementText = this.add.text(centerX, centerY + 60, encouragement, {
            fontFamily: 'Arial',
            fontSize: '28px',
            color: COLORS_HEX.DEVOXX_WHITE,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        // Continue text
        this.continueText = this.add.text(centerX, centerY + 140, 'Press SPACE or ENTER to continue', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: COLORS_HEX.DEVOXX_WHITE,
            align: 'center'
        }).setOrigin(0.5).setDepth(100).setAlpha(0.7);

        // Auto-continue after 2 seconds
        this.time.delayedCall(2000, () => {
            this.continueToGame();
        });

        // Allow early skip with Space, Enter, or click
        this.input.keyboard?.on('keydown-SPACE', this.continueToGame, this);
        this.input.keyboard?.on('keydown-ENTER', this.continueToGame, this);
        this.input.on('pointerdown', this.continueToGame, this);

        // Announce for screen readers
        announce(`Level ${this.levelData.level} complete! Next: ${nextLevelName}. Press Space to continue.`, 'assertive');

        EventBus.emit('current-scene-ready', this);
    }

    continueToGame ()
    {
        this.scene.start('Game', {
            level: this.levelData.level + 1,
            score: this.levelData.score,
            patterns: this.levelData.patterns
        });
    }

    changeScene ()
    {
        this.continueToGame();
    }
}
