const { Pokemon, conn } = require("../../src/db.js");
const { expect } = require("chai");

describe("Pokemon model", () => {
  before(() =>
    conn.authenticate().catch((err) => {
      console.error("Unable to connect to the database:", err);
    })
  );
  describe("Validators", () => {
    beforeEach(() => Pokemon.sync({ force: true }));
    describe("name", () => {
      it("Should work when its a valid name", () => {
        Pokemon.create({ name: "Pikachu" })
          .then(() => done())
          .catch(() => done(new Error("It requires a valid name")));
      });
    });
  });

  describe("Stats", () => {
    it("Should throw an error if Hp is not a number", (done) => {
      Pokemon.create({ name: "pikachu", hp: "abc" })
        .then(() => done(new Error("Hp is not a number")))
        .catch(() => done());
    });

    it("Should throw an error if attack is not a number", (done) => {
      Pokemon.create({ name: "pikachu", attack: "abc" })
        .then(() => done(new Error("Attack is not a number")))
        .catch(() => done());
    });
    it("Should throw an error if defense is not a number", (done) => {
      Pokemon.create({ name: "pikachu", defense: "abc" })
        .then(() => done(new Error("Defense is not a number")))
        .catch(() => done());
    });

    it("Should throw an error if speed is not a number", (done) => {
      Pokemon.create({ name: "pikachu", speed: "abc" })
        .then(() => done(new Error("Speed is not a number")))
        .catch(() => done());
    });

    it("Should throw an error if height is not a number", (done) => {
      Pokemon.create({ name: "pikachu", height: "abc" })
        .then(() => done(new Error("Height is not a number")))
        .catch(() => done());
    });

    it("Should throw an error if weight is not a number", (done) => {
      Pokemon.create({ name: "pikachu", weight: "abc" })
        .then(() => done(new Error("Weight is not a number")))
        .catch(() => done());
    });
  });
});
