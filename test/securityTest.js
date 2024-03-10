const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;

chai.use(chaiHttp);

describe("Login and Access Control Test", () => {
  it('should return 403 status code for unauthorized access to "http://localhost:8080/urls/b6UTxQ"', () => {
    const agent = chai.request.agent("http://localhost:8080");

    // Step 1: Login with valid credentials
    return agent
      .post("/login")
      .send({ email: "user2@example.com", password: "dishwasher-funk" })
      .then((loginRes) => {
        // Step 2: Make a GET request to a protected resource
        return agent.get("/urls/b6UTxQ").then((accessRes) => {
          // Step 3: Expect the status code to be 403
          expect(accessRes).to.have.status(403);
        });
      });
  });

  it('should redirect to /login for GET request to "/", if user is not logged in', () => {
    const agent = chai.request.agent("http://localhost:8080");

    // Step 1: Make a GET request to "/"
    return agent.get("/").then((res) => {
      // Step 2: Expect a redirect to /login
      expect(res).to.redirectTo("http://localhost:8080/login");
    });
  });

  it('should redirect to /login for GET request to "/urls/new", if user is not logged in', () => {
    const agent = chai.request.agent("http://localhost:8080");

    // Step 1: Make a GET request to "/urls/new"
    return agent.get("/urls/new").then((res) => {
      // Step 2: Expect a redirect to /login
      expect(res).to.redirectTo("http://localhost:8080/login");
    });
  });
  it('should return a 404 status code for GET request to "/urls/NOTEXISTS"', () => {
    const agent = chai.request.agent("http://localhost:8080");
  
    // Step 1: Make a GET request to a non-existent URL
    return agent.get("/urls/NOTEXISTS").then((res) => {
      // Step 2: Expect the status code to be 404
      expect(res).to.have.status(404);
    });
  });
  
  it('should return a 403 status code if they are not logged in', () => {
    const agent = chai.request.agent("http://localhost:8080");
  
    // Step 1: Login with valid credentials (assuming user is not authorized for this URL)
    return agent
      .post("/login")
      .send({ email: "user2@example.com", password: "dishwasher-funk" })
      .then((loginRes) => {
        // Step 2: Make a GET request to a protected resource
        return agent.get("/urls/b6UTxQ").then((accessRes) => {
          // Step 3: Expect the status code to be 403
          expect(accessRes).to.have.status(403);
        });
      });
  });
})