import axios from 'axios'

async function notifyDiscordChat ({ changelogContent, ora, nextVersion, isBeta, hasGithubRelease }) {
  const tag = `v${nextVersion}`

  const discordSpinner = ora('Notificando chat do discord...').start()
  const mentionContent = process.env.DISCORD_ROLE_ID ? `<@&${process.env.DISCORD_ROLE_ID}> ` : ''

  try {
    await axios.post(process.env.DISCORD_WEBHOOK_CHANGELOG, {
      username: 'Asteroid',
      content: `${mentionContent}Nova versão ${isBeta ? '**beta**' : ''} do asteroid lançada!`,
      embeds: [
        {
          title: tag,
          description: changelogContent,
          ...(hasGithubRelease && { url: `https://github.com/bildvitta/asteroid/releases/tag/${tag}` })
        }
      ]
    })

    discordSpinner.succeed('Chat do discord notificado.')
  } catch {
    discordSpinner.fail('Falha ao notificar chat do discord.')
  }
}

export default notifyDiscordChat
