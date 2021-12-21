import Question from "./Question";
import fs from "fs";
import * as Discord from "discord.js";
import Answer from "./Answer";
import {channel, client} from "../App";
import {MessageEmbed} from "discord.js";

export let lastQuestionMessage: Discord.Message | null;
export let lastQuestion: Question | null;
export const questions: Question[] = [];

export const letterToIndex = (letter: string): number => {
    switch (letter.toLowerCase()) {
        case "a":
            return 0;
        case "b":
            return 1;
        case "c":
            return 2;
        case "d":
            return 3;
        default:
            return -1;
    }
}

export const cleanChannel = async (): Promise<void> => {
    let fetched = await channel.messages.fetch({limit: 100});
    await channel.bulkDelete(fetched);
}

export const postQuestion = async (): Promise<void> => {
    let question: Question = questions[Math.floor(Math.random() * questions.length)];
    lastQuestion = question;
    let embed: MessageEmbed = new MessageEmbed();
    embed.setColor('RANDOM');
    embed.setTitle("<a:ol_umfrage:833356248035622932> **__UNSER QUIZDUELL__** <a:ol_umfrage:833356248035622932>");
    embed.setDescription(`» ${question.text}\n\n**__ANTWORTMÖGLICHKEITEN:__**\n\nA **➔** ${question.answers[0].text}\nB **➔** ${question.answers[1].text}\nC **➔** ${question.answers[2].text}\nD **➔** ${question.answers[3].text}\n\n<:ol_pfeilrot:919379068930109480> Siehe deine Statistiken mit -stats & die Bestenliste mit -top!`)
    embed.setFooter("» Tippe die jeweils richtige Antwort in den Chat, um Punkte zu bekommen!😄");
    embed.setThumbnail('https://cdn.discordapp.com/attachments/726161126529826827/824043290562396240/Question-test-exam-paper-problem-512.png');

    lastQuestionMessage = await channel.send({embeds:[embed]});
}

const isNumeric = (value: string): boolean => {
    return /^-?\d+$/.test(value);
}

export const clearQuestion = async (): Promise<void> => {
    await lastQuestionMessage.delete();
    lastQuestionMessage = null;
    lastQuestion = null;
}

export const loadQuestions = async (): Promise<void> => {
    let rawData: string = fs.readFileSync("./fragen.json").toString().trim();
    let rawQuestions: any = JSON.parse(rawData)["question"];
    let keys: string[] = Object.keys(rawQuestions);
    let values: any[] = Object.values(rawQuestions);
    for (let index in keys) {
        let key: string = keys[index].trim();
        let value: any = values[index];
        let answers: Answer[] = [];
        for (let i = 0; i <= 3; i++) {
            let answer: Answer = new Answer(Object.values(value)[i] as string);
            answers.push(answer);
        }
        if (isNumeric(Object.values(value)[4] as string)) continue;
        let rightAnswer: Answer = answers[letterToIndex(Object.values(value)[4] as string)];
        questions.push(new Question(key, answers, rightAnswer));
    }
}
