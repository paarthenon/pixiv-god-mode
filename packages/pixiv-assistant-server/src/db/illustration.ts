import {Table, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm'
import {File} from './file'

@Table()
export class Illustration {
    @PrimaryGeneratedColumn()
    id :number

    @Column('int')
    illustration_id :number

    @Column('int')
    page :number

    @OneToMany(type => File, file => file.illustration, {
        cascadeAll: true
    })
    files :File[]
}
