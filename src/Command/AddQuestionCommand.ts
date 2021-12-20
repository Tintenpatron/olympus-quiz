import Command from './Command';
import {
  Client,
  GuildMember,
  TextChannel,
  MessageEmbed,
  Permissions,

} from 'discord.js';
import { client, connection } from '../App';
import Question from '../Quiz/Question';
import fs from 'fs/promises';

export default class AddQuestionCommand extends Command {
  constructor() {
    super('addquestion');
  }

  async handle(
    member: GuildMember,
    channel: TextChannel,
    args: string[],
  ): Promise<void> {
    if (!member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return;
    let message: string = args.join(' ').trim();
    let customArgs: string[] = message.split('|');
    if (customArgs.length != 6) {
      await channel.send(
        'Verwendung: -addquestion Frage | A | B | C | D | Antwort (Buchstabe)',
      );
      return;
    }

    let answerData = {
      a: customArgs[1].trim(),
      b: customArgs[2].trim(),
      c: customArgs[3].trim(),
      d: customArgs[4].trim(),
      true: customArgs[5].trim().toUpperCase().replace(' ', '').trim(),
    };

    let rawJson: string = (await fs.readFile('./fragen.json'))
      .toString()
      .trim();
    let questionData: any = JSON.parse(rawJson);
    questionData.question[customArgs[0].trim()] = answerData;
    await fs.writeFile('./fragen.json', JSON.stringify(questionData, null, 4));
    let json = JSON.parse(rawJson);
    let fragen = Object.keys(json.question).length
    fragen = fragen+1
    await channel.send(
      'Frage hinzugefügt.\nFragen insgesamt: ' + fragen,
    );
  }
}
