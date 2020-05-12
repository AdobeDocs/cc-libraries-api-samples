require("dotenv").config();
const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;
const server = require("../../app");

chai.use(chaiHttp);

describe("GET /", () => {
  it("Returns the homepage", (done) => {
    chai
      .request(server)
      .get("/")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.contain(
          `<button id="get-libraries">Get CC Libraries</button>`
        );
        done();
      });
  });
});

describe("GET /cc-libraries/data", () => {
  it("Returns JSON data describing the user's libraries", (done) => {
    chai
      .request(server)
      .get("/cc-libraries/data")
      .set("x-api-key", process.env.API_KEY)
      .set("Authorization", `Bearer ${process.env.ACCESS_TOKEN}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.a.property("total_count").that.is.a("number");
        expect(res.body).to.have.a.property("libraries").that.is.a("array");
        done();
      });
  });
});
