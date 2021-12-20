export default class Answer {

    private readonly _text: string;

    constructor(text: string) {
        this._text = text;
    }

    get text(): string {
        return this._text;
    }
}