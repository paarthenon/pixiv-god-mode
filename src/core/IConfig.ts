export type potentialData = boolean | string | number | Object;

interface IConfig {
    keys: () => Promise<string[]>;
    get: (key: string) => Promise<potentialData>;
    set: (key: string, data: potentialData) => Promise<void>;
}

export default IConfig;
