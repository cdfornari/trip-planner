const envVariables = {
  natsServer: process.env.NATS_SERVER,
  authDbHost: process.env.AUTHDB_HOST,
  authDbPort: process.env.AUTHDB_PORT,
  authDbPassword: process.env.AUTHDB_PASSWORD,
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
}
