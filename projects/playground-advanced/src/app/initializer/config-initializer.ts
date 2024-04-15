import { ConfigService } from "../config.service";

export const configInitializer = (configService: ConfigService): any => () => configService.loadConfig();
