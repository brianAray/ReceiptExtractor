const mindee = require("mindee");
// for TS or modules:
// import * as mindee from "mindee";

// Init a new client
const mindeeClient = new mindee.Client({ apiKey: "22f39a5d125ce7e1eefdea1b4e9a6c99" });

// Load a file from disk
const inputSource = mindeeClient.docFromPath("IMG_0104.jpg");

// Parse the file
const apiResponse = mindeeClient.parse(
  mindee.product.ReceiptV5,
  inputSource
);

// Handle the response Promise
apiResponse.then((resp) => {
  // print a string summary
  console.log(resp.document.inference.pages[0].prediction.lineItems);
});

// description
// quantity
// total amount
// unit price

// grab the request and cache it