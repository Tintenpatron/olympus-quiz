import {Client, GuildMember, TextChannel} from "discord.js";

export default class Command {

    private readonly _name: string;
    private readonly _aliases: string[];

    constructor(name: string, aliases: string[] = []) {
        this._name = name;
        this._aliases = aliases;
    }

    async handle(member: GuildMember, channel: TextChannel, args: string[]): Promise<void> {

    }

    get name(): string {
        return this._name;
    }

    get aliases(): string[] {
        return this._aliases;
    }

}