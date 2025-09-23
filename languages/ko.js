/**
 * 한국어 언어 팩
 * Korean Language Pack
 */

module.exports = {
    // 일반 메시지
    general: {
        error: '오류가 발생했습니다',
        success: '성공적으로 완료되었습니다',
        loading: '처리 중입니다...',
        notFound: '찾을 수 없습니다',
        noPermission: '권한이 없습니다',
        invalidCommand: '잘못된 명령어입니다',
        cooldown: '명령어를 너무 빨리 사용하고 있습니다. {time}초 후에 다시 시도해주세요.',
    },
    
    // 봇 상태 메시지
    bot: {
        ready: '봇이 준비되었습니다!',
        loggedIn: '로 로그인되었습니다',
        shutdown: '봇이 종료됩니다...',
        reconnecting: '다시 연결하는 중...',
        connected: 'Discord에 연결되었습니다',
    },
    
    // 명령어 메시지
    commands: {
        ping: {
            name: '핑',
            description: '봇의 응답 시간을 확인합니다',
            response: '퐁! 응답 시간: {ping}ms',
        },
        info: {
            name: '정보',
            description: '봇 정보를 표시합니다',
            response: {
                title: 'KOE PROJECT 봇 정보',
                name: '이름',
                version: '버전',
                author: '제작자',
                language: '언어',
                uptime: '가동 시간',
                servers: '서버 수',
                users: '사용자 수',
            },
        },
        help: {
            name: '도움말',
            description: '도움말을 표시합니다',
            response: {
                title: '사용 가능한 명령어',
                footer: '더 많은 도움이 필요하시면 관리자에게 문의하세요.',
            },
        },
    },
    
    // 오류 메시지
    errors: {
        commandNotFound: '해당 명령어를 찾을 수 없습니다',
        missingPermissions: '이 명령어를 사용할 권한이 없습니다',
        botMissingPermissions: '봇에게 필요한 권한이 없습니다',
        userNotFound: '사용자를 찾을 수 없습니다',
        channelNotFound: '채널을 찾을 수 없습니다',
        guildNotFound: '서버를 찾을 수 없습니다',
        invalidArguments: '잘못된 인수입니다',
        databaseError: '데이터베이스 오류가 발생했습니다',
        networkError: '네트워크 오류가 발생했습니다',
        unknownError: '알 수 없는 오류가 발생했습니다',
    },
    
    // 성공 메시지
    success: {
        commandExecuted: '명령어가 성공적으로 실행되었습니다',
        settingsUpdated: '설정이 업데이트되었습니다',
        userUpdated: '사용자 정보가 업데이트되었습니다',
        messageDeleted: '메시지가 삭제되었습니다',
        roleMemberAdded: '역할이 추가되었습니다',
        roleMemberRemoved: '역할이 제거되었습니다',
    }
};