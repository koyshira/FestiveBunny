/** @format */

const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const giftsFilePath = path.join(__dirname, 'gifts.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gift')
		.setDescription('Gift a present to someone!')
		.addUserOption((option) =>
			option
				.setName('user')
				.setDescription('The user to gift a present to.')
				.setRequired(true)
		),

	async execute(interaction) {
		const user = interaction.options.getUser('user');

		if (user.id === interaction.user.id) {
			await interaction.reply({
				content: 'You cannot gift yourself!',
				ephemeral: true,
			});
		} else if (user.bot) {
			await interaction.reply({
				content: 'You cannot gift a bot!',
				ephemeral: true,
			});
		} else {
			// Read existing data from the file
			let giftsData = [];
			if (fs.existsSync(giftsFilePath)) {
				const data = fs.readFileSync(giftsFilePath, 'utf8');
				giftsData = JSON.parse(data);
			}

			// Add new gift information
			const newGift = {
				giver: interaction.user.id,
				recipient: user.id,
				date: new Date().toISOString(),
			};

			giftsData.push(newGift);

			// Write the updated data back to the file
			fs.writeFileSync(giftsFilePath, JSON.stringify(giftsData, null, 2));

			const giftEmbed = {
				color: 0x0099ff,
				title: 'Gift!',
				description: `You gifted a present to ${user}! They can open it on Christmas!`,
				timestamp: new Date(),
			};

			await interaction.reply({ embeds: [giftEmbed] });
		}
	},
};
