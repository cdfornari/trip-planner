const envVariables = {
  natsServer: process.env.NATS_SERVER,
  authDbHost: process.env.AUTHDB_HOST,
  authDbPort: Number(process.env.AUTHDB_PORT),
  authDbPassword: process.env.AUTHDB_PASSWORD,
  eventStoreHost: process.env.EVENT_STORE_HOST,
  eventStorePort: Number(process.env.EVENT_STORE_PORT),
  jwtSecret: process.env.JWT_SECRET,
  defaultLanguage: process.env.DEFAULT_LANGUAGE,
  translationsPath: process.env.TRANSLATION_PATH,
};

export class Environment {
  static get natsServer() {
    return envVariables.natsServer || 'nats://localhost:4222';
  }

  static get authDb() {
    return {
      host: envVariables.authDbHost || 'localhost',
      port: envVariables.authDbPort || 6379,
      password: envVariables.authDbPassword || '',
    };
  }

  static get eventStore() {
    return {
      host: envVariables.eventStoreHost || 'localhost',
      port: envVariables.eventStorePort || 2113,
    };
  }

  static get jwtSecret() {
    return envVariables.jwtSecret;
  }

  static get defaultLanguage() {
    return envVariables.defaultLanguage || 'en';
  }

  static get translationsPath() {
    return envVariables.translationsPath || './resources/i18n/';
  }
}
