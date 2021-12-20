import Command from "./Command";
import {Client, GuildMember, TextChannel, MessageEmbed} from "discord.js";
import {client, connection, guild} from "../App";
import QuizUser from "../Models/QuizUser";

export default class TopCommand extends Command {

    constructor() {
        super("top");
    }

    async handle(member: GuildMember, channel: TextChannel, args: string[]): Promise<void> {
        let topUsers = await connection.manager.find(QuizUser, {
            order: {
                points: "DESC"
            },
            take: guild.memberCount
        });

        let i0 = 0;
        let i1 = 10;
        let page = 1;

        let embed = new MessageEmbed();
        embed.setAuthor(client.user.username, client.user.avatarURL());
        embed.setColor(0xFFAFAF);
        embed.setTitle("Top " + topUsers.length);
        let desc = `Seite: ${page}/${Math.ceil(topUsers.length/10)}\n\n`;
        let int = 0;
        for(let index in topUsers) {
            int++;
            if(!(int > 10)) {
                let place = Number(index) + 1;
                desc += `${place} **➔** <@${topUsers[index].discordId}> - **${topUsers[index].points}** Punkte **»** <a:yes:777534104777523231> **${topUsers[index].wins}** | <a:no:777534307384295454> **${topUsers[index].loses}**\n`
            }

        }
        embed.setDescription(desc);
        let msg = await channel.send({embeds:[embed]});
        await msg.react("⬅");
		await msg.react("➡");

        // @ts-ignore
        const collector = msg.createReactionCollector((reaction, member) => member.id === member.id);

		collector.on("collect", async(reaction) => {
            await reaction.users.remove(member.id);

			if(reaction.emoji.name === "⬅") {

                if(page-1 <= 0) return;

                i0 = i0-10;
				i1 = i1-10;
				page = page-1;


                desc = `Seite: ${page}/${Math.ceil(topUsers.length/10)}\n\n`;
                let int = i0;
                let index =  i1
				for(let index in topUsers) {
                    // @ts-ignore
                    if(index > i0-1 && !(index > i1-1)) {
                        let place = Number(index) + 1;
                        desc += `${place} **➔** <@${topUsers[index].discordId}> - **${topUsers[index].points}** Punkte **»** <a:yes:777534104777523231> **${topUsers[index].wins}** | <a:no:777534307384295454> **${topUsers[index].loses}**\n`
                    }
                }

				embed.setDescription(desc);

				msg.edit({embeds:[embed]});


        }

			if(reaction.emoji.name === "➡"){

                if(page+1 > Math.ceil(topUsers.length/10)) return;

				i0 = i0+10;
				i1 = i1+10;
				page = page+1;


                desc = `Seite: ${page}/${Math.ceil(topUsers.length/10)}\n\n`;
                let int = i0;
                let index =  i1
				for(let index in topUsers) {
                    // @ts-ignore
                    if(index > i0-1 && !(index > i1-1)) {
                        let place = Number(index) + 1;
                        desc += `${place} **➔** <@${topUsers[index].discordId}> - **${topUsers[index].points}** Punkte **»** <a:yes:777534104777523231> **${topUsers[index].wins}** | <a:no:777534307384295454> **${topUsers[index].loses}**\n`
                    }
                }

				embed.setDescription(desc);

				msg.edit({embeds:[embed]});


            }
        });
    }
}
