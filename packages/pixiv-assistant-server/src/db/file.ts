import {Table, Column, PrimaryGeneratedColumn, ManyToOne} from 'typeorm'
import {Illustration} from './illustration'

@Table()
export class File {
    @PrimaryGeneratedColumn()
    id :number

    @Column()
    path :string

    @ManyToOne(type => Illustration, Illustration => Illustration.files, {
        cascadeAll: true
    })
    illustration :Illustration
}
