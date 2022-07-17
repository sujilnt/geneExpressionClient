import {Configuration, GenesApi } from '@/api';
import type { ConfigurationParameters } from '@/api';

class API{
  public genes: GenesApi;
  private static readonly CONFIG:ConfigurationParameters = {
    basePath: `http://localhost:8000`,
    credentials: 'include' as RequestCredentials,
  }

  constructor() {
   const config = new Configuration(API.CONFIG);
   this.genes = new GenesApi(config);
  }
}

export default new API();
