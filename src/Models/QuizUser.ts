import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export default class QuizUser {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    discordId: string;

    @Column()
    points: number;

    @Column()
    wins: number;

    @Column()
    loses: number;

}