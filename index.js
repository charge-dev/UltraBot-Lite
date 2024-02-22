const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('message-react')
    .setDescription('Reacts to a message.')
    .addStringOption(option => option.setName('message_id').setDescription('The ID of the message to react to.').setRequired(true))
    .addStringOption(option => option.setName('emoji').setDescription('The emoji to react with.').setRequired(true).setMaxLength(2))
    .setDMPermission(false),
  async execute(interaction) {
    const errorEmbed = new EmbedBuilder()
      .setColor(0xDA373C)
      .setTitle('An Error Occurred')
      .addFields(
        { name: 'Missing Permissions', value: '`Administrator`' }
      );

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    const { options } = interaction;
    const messageId = options.getString('message_id');
    const emoji = options.getString('emoji');

    try {
      const message = await interaction.channel.messages.fetch(messageId);

      await message.react(emoji);

      const sucEmbed = new EmbedBuilder()
        .setColor(0x248046)
        .setTitle('Reacted to Message')
        .setDescription(`Reacted with ${emoji} to message.`);

      interaction.reply({ embeds: [sucEmbed], ephemeral: true });
    } catch (error) {
      const error1Embed = new EmbedBuilder()
        .setColor(0xDA373C)
        .setTitle('An Error Occurred')
        .setDescription('Failed to react to message.')
        .addFields(
          { name: 'Possible Issues', value: `>>> Bot missing permissions\nInvalid message ID\nEmoji is invalid/inaccessible` }
        )

      interaction.reply({ embeds: [error1Embed], ephemeral: true });
    }
  },
};
