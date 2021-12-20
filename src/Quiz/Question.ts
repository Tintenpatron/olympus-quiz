import Answer from "./Answer";

export default class Question {

    private readonly _text: string;
    private readonly _answers: Answer[];
    private readonly _rightAnswer: Answer;

    constructor(text: string, answers: Answer[], rightAnswer: Answer) {
        this._text = text;
        this._answers = answers;
        this._rightAnswer = rightAnswer;
    }

    get text(): string {
        return this._text;
    }

    get answers(): Answer[] {
        return this._answers;
    }

    get rightAnswer(): Answer {
        return this._rightAnswer;
    }

}