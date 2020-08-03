const Discord = require('discord.js')
const config = require('./config')
const Inko = require('inko')
const inko = new Inko()

const client = new Discord.Client(
    {
        presence: {
            activity: {
                type: 'PLAYING',
                name: '김치야 도움'
            },
            status: 'dnd',
            afk: false
        }
    }
)

client.on('ready', () => {
    console.log(
        `ID: ${client.user.id}
TAG: ${client.user.tag}
USER COUNT: ${client.users.cache.size}
GUILD COUNT: ${client.guilds.cache.size}
EMOJI COUNT: ${client.emojis.cache.size}
----------------------------------`)
})

Discord.Message.prototype.embed = function() {
    const embed = new Discord.MessageEmbed()
    embed.setFooter(this.author.username, this.author.avatarURL())
    embed.setTimestamp(new Date())
    return embed
}


client.on('message', async msg => {
    const prefix = '김치야 '
    if (msg.author.bot || !msg.content.startsWith(prefix)) return
    const args = msg.content.slice(prefix.length).split(' ')
    const cmd = args.shift()
    const commands = require('./commands')
    const commands2 = Object.values(commands.categories).map(r => r.commands).reduce((i, o) => [...i, ...o])
    const commands3 = commands2.find(
        r => r.props.name === cmd || (r.props.aliases && r.props.aliases.includes(cmd))
            || r.props.name === inko.en2ko(cmd) || r.props.name === inko.ko2en(cmd)
            || (r.props.aliases && r.props.aliases.includes(inko.en2ko(cmd))) || (r.props.aliases && r.props.aliases.includes(inko.ko2en(cmd)))
    )
    if (!commands3) return
    msg.data = {
        args: args.join(' '),
        argsList: args,
        cmd,
        commands
    }
    if (commands3.props.ownerOnly) {
        if (!config.owners.includes(msg.author.id)) {
            return msg.reply('이 명령어를 실행하려면 봇 소유자여야 합니다.')
        }
    }
    if (commands3.props.guildOnly) {
        if (!msg.guild) {
            return msg.reply('서버에서만 사용 가능합니다.')
        }
    }
    await commands3.execute(client, msg)
})

client.login(config.token)