//* customize fetch method to not repeat yourself
//* and to satisfy your needs here
async function customFetch(url, options) {
  let response = await fetch(url, options);
  let resJson = await response.json();
  if (!resJson.Success) {
    alert(resJson.Error);
  }
  return resJson;
}

async function getAllContacts() {
  let response = await customFetch("/contacts");
  return response["Data"];

  // let contactsData = [];
  // fetch("/contacts")
  //     .then((response) => response.json())
  //     .then((data) => contactsData = data.Data)
  // return contactsData;
}

//add contact
async function addContact(contact) {
  let response = await customFetch("/contacts", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(contact),
  });
  return response;
}
//update contact
async function updateContact(contact) {
  let response = await customFetch("/contacts", {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(contact),
  });
  return response;
}
//update contact
async function deleteContact(contactId) {
  let response = await customFetch("/contacts/" + contactId, {
    method: "Delete",
    //i don't need a header or body here as i don't send data
    // i'm just delete it
  });
  return response;
}
