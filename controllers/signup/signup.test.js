const request = require("supertest");
const app = require("../../index");
const database = require("../database");
const Pool = database.Pool;

const badSignupFormData = {
  firstName: "jest",
  lastName: "test",
  userName: "Jest Test",
  email: "jestTest@ashleythewebdeveloper.com.au",
  password: "1234",
};

const goodSignupFormData = {
  firstName: "jest",
  lastName: "test",
  userName: "Jest Test",
  email: "jestTest@ashleythewebdeveloper.com.au",
  password: "12341234",
};

describe("test signup endpoint", () => {
  describe("test when bad user input is given to the endpoint", () => {
    test("should return 422 when missing password from form data", () =>
      request(app)
        .post("/api/signup/")
        .send({ ...badSignupFormData, password: "" })
        .expect(422));

    test("should return message to user when missing password from form data", async () => {
      await request(app)
        .post("/api/signup/")
        .send({ ...badSignupFormData, password: "" })
        .then((response) => {
          const parsedResponseBodyObject = JSON.parse(response.res.text);
          expect(
            parsedResponseBodyObject.message.includes(
              "Invalid signup form structure."
            )
          ).toBeTruthy();
        });
    });

    test("should return 422 when missing email from form data", async () => {
      await request(app)
        .post("/api/signup/")
        .send({ ...badSignupFormData, email: "" })
        .expect(422);
    });

    test("should return message to user when missing email from form data", async () => {
      await request(app)
        .post("/api/signup/")
        .send({ ...badSignupFormData, email: "" })
        .then((response) => {
          const parsedResponseBodyObject = JSON.parse(response.res.text);
          expect(
            parsedResponseBodyObject.message.includes(
              "Invalid signup form structure."
            )
          ).toBeTruthy();
        });
    });

    test("should return 422 when missing first name from form data", async () => {
      await request(app)
        .post("/api/signup/")
        .send({ ...badSignupFormData, firstName: "" })
        .expect(422);
    });

    test("should return message to user when missing first name from form data", async () => {
      await request(app)
        .post("/api/signup/")
        .send({ ...badSignupFormData, firstName: "" })
        .then((response) => {
          const parsedResponseBodyObject = JSON.parse(response.res.text);
          expect(
            parsedResponseBodyObject.message.includes(
              "Invalid signup form structure."
            )
          ).toBeTruthy();
        });
    });

    test("should return 422 when missing last name from form data", async () => {
      await request(app)
        .post("/api/signup/")
        .send({ ...badSignupFormData, lastName: "" })
        .expect(422);
    });

    test("should return message to user when missing last name from form data", async () => {
      await request(app)
        .post("/api/signup/")
        .send({ ...badSignupFormData, lastName: "" })
        .then((response) => {
          const parsedResponseBodyObject = JSON.parse(response.res.text);
          expect(
            parsedResponseBodyObject.message.includes(
              "Invalid signup form structure."
            )
          ).toBeTruthy();
        });
    });

    test("should return 422 when missing username from form data", async () => {
      await request(app)
        .post("/api/signup/")
        .send({ ...badSignupFormData, userName: "" })
        .expect(422);
    });

    test("should return message to user when missing username from form data", async () => {
      await request(app)
        .post("/api/signup/")
        .send({ ...badSignupFormData, userName: "" })
        .then((response) => {
          const parsedResponseBodyObject = JSON.parse(response.res.text);
          expect(
            parsedResponseBodyObject.message.includes(
              "Invalid signup form structure."
            )
          ).toBeTruthy();
        });
    });

    test("should return 422 when the password provided dosen't meet the requirments", async () => {
      await request(app)
        .post("/api/signup/")
        .send({ ...goodSignupFormData, password: "1234" })
        .expect(422);
    });

    test("should retun message if the password provided dosen't meet the requirments", async () => {
      await request(app)
        .post("/api/signup/")
        .send({ ...goodSignupFormData, password: "1234" })
        .then((response) => {
          const parsedResponseBodyObject = JSON.parse(response.res.text);
          expect(parsedResponseBodyObject.message.notificationMessage).toBe(
            "Your password must be longer than 8 charaters. Please try again."
          );
        });
    });

    test("should return 422 when the email provided isn't vaild", async () => {
      await request(app)
        .post("/api/signup/")
        .send({ ...goodSignupFormData, email: "sdasda.com.au" })
        .expect(422);
    });

    test("should retun message if the email provided isn't vaild", async () => {
      await request(app)
        .post("/api/signup/")
        .send({ ...goodSignupFormData, email: "sdasda.com.au" })
        .then((response) => {
          const parsedResponseBodyObject = JSON.parse(response.res.text);
          expect(parsedResponseBodyObject.message.notificationMessage).toBe(
            "Invalid email address. Please enter a valid email address."
          );
        });
    });
  });

  describe("tests once a user is created", () => {
    test("should return 201 when user is created", async () => {
      jest.spyOn(database, "SaveUser").mockReturnValueOnce({
        status: "User Saved",
        errorField: "",
        messageType: "",
        messageTitle: "",
        message: "Your account has been successfully created",
      });
      await request(app)
        .post("/api/signup/")
        .send(goodSignupFormData)
        .expect(201);
    });

    test("should return message when user is created", async () => {
      jest.spyOn(database, "SaveUser").mockReturnValueOnce({
        status: "User Saved",
        errorField: "",
        messageType: "",
        messageTitle: "",
        message: "Your account has been successfully created",
      });
      await request(app)
        .post("/api/signup/")
        .send(goodSignupFormData)
        .then((response) => {
          const parsedResponseBodyObject = JSON.parse(response.res.text);
          expect(parsedResponseBodyObject.message.notificationMessage).toBe(
            "Your account has been created."
          );
        });
    });

    test("should return 422 when a user with the same email exists", async () => {
      jest.spyOn(database, "SaveUser").mockReturnValueOnce({
        status: "User Exists",
        errorField: "Email",
        messageType: "error",
        messageTitle: "Error",
        message:
          "An account with this email address already exists. Please login.",
      });
      await request(app)
        .post("/api/signup/")
        .send({ ...goodSignupFormData, userName: "JoeTest" })
        .expect(422);
    });

    test("should return message when a user with the same email exists", async () => {
      jest.spyOn(database, "SaveUser").mockReturnValueOnce({
        status: "User Exists",
        errorField: "Email",
        messageType: "error",
        messageTitle: "Error",
        message:
          "An account with this email address already exists. Please login.",
      });
      await request(app)
        .post("/api/signup/")
        .send({ ...goodSignupFormData, userName: "JoeTest" })
        .then((response) => {
          const parsedResponseBodyObject = JSON.parse(response.res.text);
          expect(parsedResponseBodyObject.message.notificationMessage).toBe(
            "An account with this email address already exists. Please login."
          );
        });
    });

    test("should return 422 when a user with the same username exists", async () => {
      jest.spyOn(database, "SaveUser").mockReturnValueOnce({
        status: "User Exists",
        errorField: "Username",
        messageType: "error",
        messageTitle: "Error",
        message:
          "An account with this username already exists. Please choose another.",
      });
      await request(app)
        .post("/api/signup/")
        .send({ ...goodSignupFormData, email: "JoeTest@gmail.com" })
        .expect(422);
    });

    test("should return message when a user with the same username exists", async () => {
      jest.spyOn(database, "SaveUser").mockReturnValueOnce({
        status: "User Exists",
        errorField: "Username",
        messageType: "error",
        messageTitle: "Error",
        message:
          "An account with this username already exists. Please choose another.",
      });
      await request(app)
        .post("/api/signup/")
        .send({ ...goodSignupFormData, email: "JoeTest@gmail.com" })
        .then((response) => {
          const parsedResponseBodyObject = JSON.parse(response.res.text);
          expect(parsedResponseBodyObject.message.notificationMessage).toBe(
            "An account with this username already exists. Please choose another."
          );
        });
    });

    test("should return a username with underscores instead of whitespace and be lowercase", async () => {
      let returnedUserName;
      jest
        .spyOn(database, "SaveUser")
        .mockImplementationOnce(
          (userName, ...prams) => (returnedUserName = userName)
        );
      await request(app).post("/api/signup/").send(goodSignupFormData);
      expect(returnedUserName).toBe(
        goodSignupFormData.userName.replace(/ /g, "_").toLowerCase()
      );
    });

    test("should return an email in lowercase", async () => {
      let returnedEmail;
      jest
        .spyOn(database, "SaveUser")
        .mockImplementationOnce(
          (userName, firstName, lastName, email, password) =>
            (returnedEmail = email)
        );
      await request(app).post("/api/signup/").send(goodSignupFormData);
      expect(returnedEmail).toBe(goodSignupFormData.email.toLowerCase());
    });

    test("should return a first name with the first letter as a capital", async () => {
      let returnedFirstName;
      jest
        .spyOn(database, "SaveUser")
        .mockImplementationOnce(
          (userName, firstName, lastName, email, password) =>
            (returnedFirstName = firstName)
        );
      await request(app).post("/api/signup/").send(goodSignupFormData);
      expect(returnedFirstName).toBe(
        goodSignupFormData.firstName[0].toUpperCase() +
          goodSignupFormData.firstName.slice(1)
      );
    });

    test("should return a last name with the first letter as a capital", async () => {
      let returnedLastName;
      jest
        .spyOn(database, "SaveUser")
        .mockImplementationOnce(
          (userName, firstName, lastName, email, password) =>
            (returnedLastName = lastName)
        );
      await request(app).post("/api/signup/").send(goodSignupFormData);
      expect(returnedLastName).toBe(
        goodSignupFormData.lastName[0].toUpperCase() +
          goodSignupFormData.lastName.slice(1)
      );
    });
  });
});
