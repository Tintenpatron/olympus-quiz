import Command from "./Command";
import {Client, GuildMember, TextChannel, MessageEmbed} from "discord.js";
import {client, connection} from "../App";
import QuizUser from "../Models/QuizUser";
import dotenv from 'dotenv';
dotenv.config();


export default class StatsCommand extends Command {

    constructor() {
        super("stats");
    }

    async handle(member: GuildMember, channel: TextChannel, args: string[]): Promise<void> {
        let quizUser = await connection.manager.findOne(QuizUser, {
            where: {
                discordId: member.user.id
            }
        });
        if(quizUser == null) {
            let embed: MessageEmbed = new MessageEmbed();
            embed.setAuthor(member.user.username, member.user.avatarURL());
            embed.setColor(0xFF0000);
            embed.setTitle("Deine Stats");
            embed.setDescription(`Du hast noch **nie** Quizduell gespielt!`);
            embed.setFooter(process.env.FOOTER);
            return;
        }

        let percentCorrect = (quizUser.wins*100)/(quizUser.wins+quizUser.loses)
        let percentIncorrect = (quizUser.loses*100)/(quizUser.wins+quizUser.loses)
        let embed: MessageEmbed = new MessageEmbed();
            embed.setAuthor(member.user.username, member.user.avatarURL());
            embed.setColor(0xFFAFAF);
            embed.setThumbnail('https://cdn.discordapp.com/attachments/726161126529826827/824043290562396240/Question-test-exam-paper-problem-512.png');
            embed.setTitle("Deine Quizduell-Statistik");
            embed.setDescription(`» Gespielte Runden **➔** **${quizUser.wins + quizUser.loses}**\n» Richtig beantwortet **➔** **${quizUser.wins}** (${percentCorrect.toFixed(2)}%)\n» Falsch beantwortet **➔** **${quizUser.loses}** (${percentIncorrect.toFixed(2)}%)\n\n»  Punkte **➔** **${quizUser.points}**`);
        await channel.send({embeds:[embed]});
    }

}
