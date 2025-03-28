const { owners } = require("../../../config.json");
const { queryParams } = require("../../../db/db");
const generate = require("../../utils/generate");
module.exports = {
  name: "generate",
  description: `Generate a license key`,
  options: [
    {
      name: "generate",
      description: `Generate a license key!`,
      type: 3,
      required: false,
    },
  ],
  callback: async (client, interaction) => {
    if (owners.includes(interaction.user.id)) {
      let key = generate(32);

      let license = interaction.options.getString("generate");
      if (license) {
        let ifExist = await queryParams(
          `SELECT * FROM licenses WHERE license=?`,
          [license]
        );
        if (ifExist.length == 0) {
          return interaction.reply({
            content: `Invalid license!`,
            ephemeral: true,
          });
        } else {
          return interaction.reply({
            content: `Valid license!`,
            ephemeral: true,
          });
        }
      } else {
        try {
          await queryParams(`INSERT INTO licenses(license) VALUES(?)`, [
            key,
          ]);
          return interaction.reply({ content: key, ephemeral: true });
        } catch (e) {
          return interaction.reply({ content: `Failed`, ephemeral: true });
        }
      }
    } else {
      return interaction.reply({ content: `generate`, ephemeral: true });
    }
  },
};
