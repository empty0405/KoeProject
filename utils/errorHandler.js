/**
 * 오류 처리 유틸리티
 * Error Handling Utilities
 */

const config = require('../config.json');
const { EmbedBuilder } = require('discord.js');

class ErrorHandler {
    /**
     * Discord 상호작용에서 발생한 오류를 처리합니다
     * @param {CommandInteraction} interaction Discord 상호작용 객체
     * @param {Error} error 발생한 오류
     */
    static async handleInteractionError(interaction, error) {
        console.error('상호작용 오류:', error);
        
        const errorEmbed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('❌ 오류 발생')
            .setDescription('명령어 처리 중 오류가 발생했습니다.')
            .setTimestamp();
        
        try {
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({ embeds: [errorEmbed] });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        } catch (replyError) {
            console.error('오류 응답 중 추가 오류 발생:', replyError);
        }
    }
    
    /**
     * 일반적인 봇 오류를 처리합니다
     * @param {string} context 오류가 발생한 컨텍스트
     * @param {Error} error 발생한 오류
     */
    static handleBotError(context, error) {
        console.error(`[${context}] 오류:`, error);
        
        // 오류 유형에 따른 분류
        if (error.code === 'TOKEN_INVALID') {
            console.error('❌ 잘못된 봇 토큰입니다. .env 파일을 확인해주세요.');
            process.exit(1);
        } else if (error.code === 'DISALLOWED_INTENTS') {
            console.error('❌ 필요한 인텐트가 활성화되지 않았습니다. Discord Developer Portal에서 인텐트를 확인해주세요.');
        } else if (error.code === 'MISSING_PERMISSIONS') {
            console.error('❌ 봇에게 필요한 권한이 없습니다.');
        } else {
            console.error('❌ 예상치 못한 오류가 발생했습니다.');
        }
    }
    
    /**
     * 네트워크 관련 오류를 처리합니다
     * @param {Error} error 네트워크 오류
     */
    static handleNetworkError(error) {
        console.error('네트워크 오류:', error.message);
        
        if (error.code === 'ENOTFOUND') {
            console.error('❌ 인터넷 연결을 확인해주세요.');
        } else if (error.code === 'ETIMEDOUT') {
            console.error('❌ 연결 시간이 초과되었습니다.');
        } else {
            console.error('❌ 네트워크 관련 문제가 발생했습니다.');
        }
    }
    
    /**
     * 권한 관련 오류를 처리합니다
     * @param {CommandInteraction} interaction Discord 상호작용 객체
     * @param {string} permission 필요한 권한
     */
    static async handlePermissionError(interaction, permission) {
        const errorEmbed = new EmbedBuilder()
            .setColor('#ff9900')
            .setTitle('⚠️ 권한 부족')
            .setDescription(`이 명령어를 사용하려면 **${permission}** 권한이 필요합니다.`)
            .setTimestamp();
        
        try {
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({ embeds: [errorEmbed] });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        } catch (error) {
            console.error('권한 오류 응답 중 오류:', error);
        }
    }
    
    /**
     * 쿨다운 오류를 처리합니다
     * @param {CommandInteraction} interaction Discord 상호작용 객체
     * @param {number} timeLeft 남은 시간 (초)
     */
    static async handleCooldownError(interaction, timeLeft) {
        const errorEmbed = new EmbedBuilder()
            .setColor('#ffaa00')
            .setTitle('⏰ 쿨다운')
            .setDescription(`명령어를 너무 빨리 사용하고 있습니다.\n${timeLeft.toFixed(1)}초 후에 다시 시도해주세요.`)
            .setTimestamp();
        
        try {
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        } catch (error) {
            console.error('쿨다운 오류 응답 중 오류:', error);
        }
    }
}

module.exports = ErrorHandler;