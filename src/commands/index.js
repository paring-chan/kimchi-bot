module.exports.categories = {
    info: {
        commands: require('./info'),
        name: '정보'
    },
    coding: {
        commands: require('./dev'),
        name: '코딩'
    },
    help: {
        commands: require('./help'),
        name: '도움말'
    }
}