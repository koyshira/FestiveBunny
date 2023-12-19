/** @format */

const { Events } = require('discord.js');

const handleErrorInteraction = async (interaction) => {
	let errorMessage =
		'There was an error while executing this command!\nPlease try again later. If the issue persists, please contact the bot owner.';

	try {
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: errorMessage, ephemeral: true });
		} else {
			await interaction.reply({ content: errorMessage, ephemeral: true });
		}
	} catch (error) {
		console.error('Error while handling interaction error:', error);
	}
};

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		try {
			if (interaction.isCommand()) {
				const command = interaction.client.commands.get(
					interaction.commandName
				);
				if (!command) {
					console.error(
						`No command matching ${interaction.commandName} was found.`
					);
					return;
				}

				await command.execute(interaction);
			}
		} catch (error) {
			console.error('Error occurred during interaction processing:', error);
			await handleErrorInteraction(interaction);
		}
	},
};
