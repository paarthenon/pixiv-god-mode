import {logger, Sigil} from 'daslog';

const log = logger()
    .setCategory('PixAss')
    .reformat(([time, level]) => [time, level, Sigil.Category()] as const)
    .setMinimumLogLevel('info');

export default log;
