import { Express } from 'express';
import { Application } from 'express-serve-static-core';

declare module 'apollo-server-express' {
  interface ServerRegistration {
    app: Express;
  }
} 