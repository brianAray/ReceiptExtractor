const express = require('express');
const multer = require('multer');

const mindee = require('mindee');

// Init a new client
const mindeeClient = new mindee.Client({ apiKey: "22f39a5d125ce7e1eefdea1b4e9a6c99" });

const app = express();
const PORT = 3000;

app.use(express.json());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads/'); // Images will be stored in the 'uploads/' directory
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname); // Use the original file name
    },
  });

const upload = multer({ storage });

// Set up a route for file uploads
app.post('/upload', upload.single('file'), (req, res) => {
    // Handle the uploaded file
    res.json({ message: 'File uploaded successfully!' });
});


app.post('/receipt',upload.single('file'), async (req, res) => {
    // upload receipt
    // parse it
    // return json representation of the receipt
    // discard the image
    if (!req.file) {
        return res.status(400).send({
            message: 'No image uploaded.'
        });
      }
    // Load a file from disk
    const inputSource = mindeeClient.docFromPath(req.file.originalname);

    // Parse the file
    const apiResponse = mindeeClient.parse(
    mindee.product.ReceiptV5,
    inputSource
    );

    // Handle the response Promise
    let response = await apiResponse;

    let items = formatData(response);
    
    res.send({
        // message: response.document.inference.pages[0].prediction.lineItems
        items
    });
});

function formatData(data){
    let items = [];
    data.document.inference.pages[0].prediction.lineItems.forEach((item) => items.push({name: item.description, quantity: item.quantity, totalAmount: item.totalAmount, unitPrice: item.unitPrice}))
    return items;
}

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}/`);
})
