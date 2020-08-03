const fetch = require('node-fetch')

module.exports.props = {
    name: 'npm'
}

module.exports.execute = async (client, msg) => {
    if (!msg.data.args) {
        return msg.reply('김치야 npm <패키지 이름>')
    }
    const pkg = encodeURI(msg.data.args)
    const res = await fetch(`https://registry.npmjs.com/${pkg}`)
    if (res.status === 404 || res.status === 405) {
        return res.reply('검색된 패키지가 없어요!')
    }
    const body = await res.json()
    if (body.time && body.time.unpublish) {
        return msg.reply('공개되지 않은 패키지 입니다.')
    }
    const version = body['dist-tags'] ? body.versions[body['dist-tags'].latest] || body.versions[body['dist-tags']] : {}
    const maintainers = body.maintainers.map(user => `${user.name} <${user.email || '이메일 없음'}>`)
    const dependencies = version.dependencies ? (Object.keys(version.dependencies)) : null
    const embed = msg.embed()
    embed
        .setColor(0xcb0000)
        .setAuthor('npm')
        .setTitle(body.name)
        .setURL(`https://npmjs.com/package/${pkg}`)
        .setDescription(body.description || '설명 없음')
        .addField('메인 파일', version.main || 'index.js', true)
        .addField('의존성 목록', dependencies && dependencies.length ? dependencies.length > 30 ? dependencies.slice(0, 30).join(', ') + '...' : dependencies.join(', ') : '없음', true)
        .addField('라이선스', body.license || '없음', true)
        .addField('버전', body['dist-tags'].latest || '알 수 없음', true)
        .addField('개발자', body.author ? body.author.name : '알 수 없음', true)
        .addField('관리자', maintainers.slice(0, 10).join(', '))
    return msg.channel.send(embed)
}