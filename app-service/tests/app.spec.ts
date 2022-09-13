import request from "supertest";
import {Express} from 'express-serve-static-core';
import app from "../src/app"
let server: Express
describe(`Token Request`, () => {
  beforeAll(() => {
    server = app;
  });
  it("case here", (done) => {
     
  })
});