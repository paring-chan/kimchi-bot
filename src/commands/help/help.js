const config = require('../../config')

module.exports.props = {
    name: '도움',
    aliases: ['도움말'],
}

module.exports.execute = async (client, msg) => {
    const embed = msg.embed()
    embed.setTitle('도움말')
    Object.values(msg.data.commands.categories).forEach(
        category => {
            embed.addField(category.name,
                '`' +category.commands.map(
                    r => r.props.name
                ).join('` `') + '`')
        }
    )
    embed.addField('개발자', config.owners.map(r => {
        const user = client.users.cache.get(r)
        return user.tag
    }).join(', '))
    msg.channel.send(embed)
}