/** @format */

// Import necessary modules
const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Set the file path for gifts data
const giftsFilePath = path.join(__dirname, 'gifts.json');

// List of festive gifts
const festiveGifts = [
	'Candy Cane',
	'Snow Globe',
	'Festive Hat',
	'Holiday Cookie',
	'Gift Card',
	'Jingle Bells',
	'Christmas Stocking',
	'Gingerbread House',
	"Santa's Sleigh",
	'Mistletoe',
	'Fancy Ornament',
	'Yule Log',
];

// Export the command module
module.exports = {
	data: new SlashCommandBuilder()
		.setName('open')
		.setDescription('Open your received gifts!'),

	async execute(interaction) {
		const today = new Date();
		const isChristmas = today.getMonth() === 11 && today.getDate() === 25;

		if (!isChristmas) {
			const noChristmasEmbed = {
				color: 0x0099ff,
				title: 'You can only open gifts on Christmas!',
				description: 'Come back on Christmas to open your gifts!',
				fields: [
					{
						name: 'Today',
						value: today.toDateString(),
					},
					{
						name: 'Christmas',
						value: 'December 25',
					},
				],
				timestamp: new Date(),
				footer: {
					text: 'Christmas Bot',
				},
			};

			await interaction.reply({ embeds: [noChristmasEmbed], ephemeral: true });
			return;
		}

		// Continue with the rest of the command if it's Christmas
		const userId = interaction.user.id;

		// Read existing data from the file
		let giftsData = [];
		if (fs.existsSync(giftsFilePath)) {
			const data = fs.readFileSync(giftsFilePath, 'utf8');
			giftsData = JSON.parse(data);
		}

		// Filter gifts for the user running the command as the recipient
		const userGifts = giftsData.filter((gift) => gift.recipient === userId);

		if (userGifts.length === 0) {
			await interaction.reply({
				content: 'You have no gifts to open!',
				ephemeral: true,
			});
		} else {
			const giftCount = userGifts.length;

			// Open gifts and list random items
			const openedGifts = [];
			for (let i = 0; i < giftCount; i++) {
				const randomGift =
					festiveGifts[Math.floor(Math.random() * festiveGifts.length)];
				openedGifts.push(randomGift);
			}

			// Remove the opened gifts from the original array
			giftsData = giftsData.filter((gift) => gift.recipient !== userId);

			// Save the updated giftsData back to the file
			fs.writeFileSync(giftsFilePath, JSON.stringify(giftsData, null, 2));

			const giftEmbed = {
				color: 0x0099ff,
				title: 'Your gifts have been opened!',
				fields: [
					{
						name: 'Gifts',
						value: openedGifts.join(', '),
					},
				],
				timestamp: new Date(),
				footer: {
					text: 'Christmas Bot',
				},
			};

			await interaction.reply({ embeds: [giftEmbed] });
		}
	},
};
