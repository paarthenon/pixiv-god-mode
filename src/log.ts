import {logger, Sigil} from 'daslog';

const log = logger()
    .setCategory('PixAss')
    .reformat(([time, level]) => [time, Sigil.Category(), level] as const)
    .setMinimumLogLevel('info');

export default log;