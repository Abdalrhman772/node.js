const express = require("express");
const bodyParserJson = require("body-parser").json();
const fs = require("fs");
const app = express();

app.use(bodyParserJson);
app.use(express.static("frontend"));

let contacts = [];
let settings = {
  lastContactId: 1,
};

//* route to the frontend
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/frontend/index.html");
});

//* get contacts
app.get("/contacts", function (req, res) {
  let resBody = {
    Success: true,
    Error: "",
    Data: contacts,
  };
  res.send(resBody);
});

//* get a specific contact by id
app.get("/contacts/:id", function (req, res) {
  let specificContact = contacts.find((item) => item.Id == req.params.id);
  let resBody = {
    Success: true,
    Error: "",
    Data: specificContact,
  };
  if (!specificContact) {
    resBody.Success = false;
    resBody.Error = "Contact Not Found";
  }
  res.send(resBody);
});

//* add contact
app.post("/contacts", function (req, res) {
  let resBody = {
    Success: true,
    Error: "",
    Data: req.body,
  };

  let validationResult = validateContact(req.body);
  resBody.Success = validationResult.Success;
  resBody.Error = validationResult.Error;

  //if success add id then push
  if (resBody.Success) {
    req.body.Id = settings.lastContactId++;
    contacts.push(req.body);
  }
  //then save changes & give the response
  saveDataToFile();
  res.send(resBody);
});

//* edit contact
app.put("/contacts", function (req, res) {
  let updatedContact = contacts.find((item) => item.Id == req.body.Id);
  let resBody = {
    Success: true,
    Error: "",
    Data: updatedContact,
  };

  if (!updatedContact) {
    resBody.Success = false;
    resBody.Error = "Contact Not Found";
  }

  if (resBody.Success) {
    let validationResult = validateContact(req.body);
    resBody.Success = validationResult.Success;
    resBody.Error = validationResult.Error;
  }

  if (resBody.Success) {
    updatedContact.Name = req.body.Name;
    updatedContact.Phone = req.body.Phone;
    saveDataToFile();
  }

  res.send(resBody);
});

//* delete contact
app.delete("/contacts/:id", function (req, res) {
  //here i want the index not the item itself
  let deletedContactIndex = contacts.findIndex(
    (contact) => contact.Id == req.params.id
  );
  let resBody = {
    Success: true,
    Error: "",
    Data: req.params.id, //!here
  };

  // -1 means not found
  if (deletedContactIndex == -1) {
    resBody.Success = false;
    resBody.Error = "Contact Not Found";
  }
  if (resBody.Success) {
    contacts.splice(deletedContactIndex, 1);
    saveDataToFile();
  }
  res.send(resBody);
});

//function handle some errors that the user may do
function validateContact(contact) {
  //default values
  let validationResult = { Success: true, Error: "" };

  //adding empty contact
  if (!contact.Name) {
    validationResult.Success = false;
    validationResult.Error = "Contact Name Not Found";
  }

  //adding an exist
  let exist = contacts.find(
    (item) => item.Name == contact.Name && item.Id != contact.Id
  );
  if (exist) {
    validationResult.Success = false;
    validationResult.Error = "Contact Name is Already Exist";
  }
  return validationResult;
}

//save to file (database)
function saveDataToFile() {
  fs.writeFile("contacts.db", JSON.stringify(contacts), function (err) {
    if (err) console.log(err);
  });
  fs.writeFile("settings.db", JSON.stringify(settings), function (err) {
    if (err) console.log(err);
  });
}

// load data from file (database)
function loadDataFromFile() {
  fs.readFile("contacts.db", function (err, data) {
    if (err) console.log(err);
    else contacts = JSON.parse(data);
  });
  fs.readFile("settings.db", function (err, data) {
    if (err) console.log(err);
    else settings = JSON.parse(data);
  });
}

loadDataFromFile();

app.listen(5500);
