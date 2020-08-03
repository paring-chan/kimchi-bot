module.exports.props = {
    name: '핑',
    aliases: ['ping']
}

module.exports.execute = async (client, msg) => {
    let embed = msg.embed()
    embed.setTitle('PING')
    embed.setDescription('핑 확인중...')
    const m = await msg.channel.send(embed)
    embed = msg.embed()
    embed.setTitle('PING')
    embed.setDescription(
`웹소켓 핑: ${client.ws.ping}ms
메시지 핑: ${Date.now() - m.createdTimestamp}ms`
    )
    await m.edit(embed)
}