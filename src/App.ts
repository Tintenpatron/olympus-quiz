import "reflect-metadata";
import dotenv from 'dotenv';
import {createConnection, Connection} from "typeorm";
import QuitUser from "./Models/QuizUser";
import * as Discord from "discord.js";
import Command from "./Command/Command";
import StatsCommand from "./Command/StatsCommand";
import {
    cleanChannel, clearQuestion,
    lastQuestion,
    lastQuestionMessage,
    letterToIndex,
    loadQuestions,
    postQuestion
} from "./Quiz/QuestionManager";
import QuizUser from "./Models/QuizUser";
import {GuildMember, MessageEmbed, TextChannel} from "discord.js";
import TopCommand from "./Command/TopCommand";
import AddQuestionCommand from './Command/AddQuestionCommand';


dotenv.config();

export const client: Discord.Client = new Discord.Client();
export let guild: Discord.Guild;
export let channel: Discord.TextChannel;
export let connection: Connection;
export const commands: Command[] = [new StatsCommand(), new TopCommand(), new AddQuestionCommand()];

export const getCommandByName = (name: string): Command => {
    for(let command of commands) {
        if(command.name.toLowerCase().trim() == name.toLowerCase().trim()) return command;
    }
    return null;
}

(async () => {
    connection = await createConnection({
        type: "sqlite",
        database: "database.sqlite",
        entities: [ QuitUser ],
        logging: true,
        synchronize: true
    });
    await loadQuestions();
    client.on("ready", async () => {
        console.log(`Logged in as "${client.user.tag}".`);
        guild = await client.guilds.fetch('650458489243697222', false, true);
        channel = (await client.channels.fetch('787428642505359391', false, true)) as Discord.TextChannel;

        await cleanChannel();
        await postQuestion();
    });

    client.on("message", async (message) => {
        if (message.author.id == client.user.id) return;
        if (message.guild.id != guild.id) return;
        if (message.channel.id == channel.id) {
            await message.delete();
            if (lastQuestionMessage == null) return;
            let answerLetter = message.cleanContent.toLowerCase().trim();
            if (letterToIndex(answerLetter) == -1) {
                return;
            }

            let quizUser = await connection.manager.findOne(QuizUser, {
                where: {
                    discordId: message.author.id
                }
            });
            if(quizUser == null) {
                quizUser = new QuizUser();
                quizUser.discordId = message.author.id;
                quizUser.points = 0;
                quizUser.wins = 0;
                quizUser.loses = 0;
                await connection.manager.insert(QuizUser, quizUser);
            }

            let answer = lastQuestion.answers[letterToIndex(answerLetter)];
            let rightAnswer = lastQuestion.rightAnswer;

            if (answer != rightAnswer) {
                await clearQuestion();
                if(quizUser.points != 0) {
                    quizUser.points--;
                }
                quizUser.loses++;
                let embed: MessageEmbed = new MessageEmbed();
                embed.setAuthor(client.user.username, client.user.avatarURL());
                embed.setColor(0xFF0000);
                embed.setDescription(`» Das ist falsch ${message.author.username} <a:no:777534307384295454>\n» Die richtige Antwort war **➔** ${rightAnswer.text}\n\n**➔** Du hast noch **${quizUser.points}** Punkte`);
                embed.setThumbnail('https://cdn.discordapp.com/attachments/726161126529826827/824043290562396240/Question-test-exam-paper-problem-512.png');
                let msg = await channel.send(embed);
                setTimeout(async () => {
                    await msg.delete();
                    await postQuestion();
                }, 5000);
                await connection.manager.save(QuizUser, quizUser);
                return;
            }

            await clearQuestion();
            quizUser.points += 3;
            quizUser.wins++;
            let embed: MessageEmbed = new MessageEmbed();
            embed.setAuthor(client.user.username, client.user.avatarURL());
            embed.setColor(0x00FF00);
            embed.setDescription(`» Das ist richtig ${message.author.username} <a:yes:777534104777523231>\n\n**➔** Du hast jetzt **${quizUser.points}** Punkte`);
            embed.setThumbnail('https://cdn.discordapp.com/attachments/726161126529826827/824043290562396240/Question-test-exam-paper-problem-512.png');
            let msg = await channel.send(embed);
            setTimeout(async () => {
                await msg.delete();
                await postQuestion();
            }, 5000);
            await connection.manager.save(QuizUser, quizUser);
            return;
        }

        // Commands Handlen
        let messageContents = message.cleanContent.trim();
        if(!messageContents.startsWith("-")) return;

        let splittedMessage = messageContents.split(" ");
        let commandName = splittedMessage[0];
        commandName = commandName.substring(1, commandName.length);
        splittedMessage.shift();

        let command: Command = getCommandByName(commandName);
        if(command == null) return;
        await command.handle(message.member, message.channel as TextChannel, splittedMessage);

    });

    await client.login('ODUxNTUyOTAzMzc4MzcwNTg3.YL58cQ.sOJLPUFd3HLcJs-2XCY1mKJmyNA');
})();