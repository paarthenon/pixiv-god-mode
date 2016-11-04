import 'reflect-metadata'

import {createConnection} from 'typeorm'
import {Illustration} from './illustration'
import {File} from './File'

console.log('test');
createConnection({
    driver: {
        type: 'sqlite',
        storage: 'test.sqlite',
    },
    entities: [
        Illustration,
        File,
    ],
    autoSchemaSync: true,
}).then(connection => {
    console.log('connected');

    let illust = new Illustration();
    illust.illustration_id = 40;
    illust.page = 0;

    let file1 = new File();
    file1.path = 'one';

    let file2 = new File();
    file2.path = 'two';

    illust.files = [file1, file2];
    connection.getRepository(Illustration).persist(illust).then(() => console.log('completed'));
}).catch(x => {
    console.log(x);
})