
const config = require("../config");


const cohere = require("cohere-ai");
const fs = require('fs');
const pdfParse = require('pdf-parse');


//Get classification
exports.fileUpload = async function fileUpload(file) {
  console.log("Received file on server ",file);


  console.log("file path: ", file.path);

  const extract = await getPDF(file.path);

  fs.writeFile(`./assets/test-extract.txt`, extract.text, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });

  // console.log('File content of PDF: ', extract.text);


  cohere.init(config.apiKey); // This is your trial API key

  const response = await cohere.summarize({
    text: extract.text,
    length: 'auto',
    format: 'bullets',
    model: 'summarize-medium',
    additional_command: '',
    temperature: 0.6,
  });
  
  console.log('Summary:', response.body.summary);

  return { 'status': 'success' };
};



//Get classification
exports.getClassification = async function getClassification(requestBody) {

  cohere.init(config.apiKey); // This is your trial API key

  const response = await cohere.generate({
    model: 'command-xlarge-nightly',
    prompt: 'Write 5 titles for a blog ideas for the keywords \"large language model\" or \"text generation\"',
    max_tokens: 300,
    temperature: 0.9,
    k: 0,
    stop_sequences: [],
    return_likelihoods: 'NONE'
  });

  console.log(`Prediction: ${response.body.generations[0].text}`);

  return { 'status': 'success' };
};


async function getPDF(file) {
  console.log("get pdf: ", file);
  let readFileSync = fs.readFileSync(file);
  try {
    const pdfExtract = await pdfParse(readFileSync);
    // console.log('File content: ', pdfExtract.text);
    // console.log('Total pages: ', pdfExtract.numpages)
    // console.log('All content: ', pdfExtract.info)
    return (pdfExtract);
  } catch (error) {
    console.error("Error extracting text from PDF", error);
  }
}

async function processFile() {
  const filePath = 'uploads/' + req.body.filename;
  const fileContent = fs.readFileSync(filePath, 'binary');
  axios.post('https://api.cohere.ai/v1/summary', {
    text: fileContent
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_COHERE_API_KEY'
    }
  }).then(response => {
    res.send({ summary: response.data.summary });
  }).catch(error => {
    console.log(error);
    res.status(500).send({ message: 'Error processing text' });
  });
}


