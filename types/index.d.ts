import express from 'express';

declare module "node-sqlite-tables-data" {

    export function getTablesData(dbName: string): express.RequestHandler;
  }
  