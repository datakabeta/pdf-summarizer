
const config = require("../config");


const cohere = require("cohere-ai");
const fs = require('fs');
const pdfParse = require('pdf-parse');



//Extract text and summarize
exports.summarizer = async function summarizer(file) {
  console.log("Received file on server ", file);
  // console.log("file path: ", file.path);

  //Extract text from PDF
  let extract;

  try {
    extract = await pdfToText(file.path);
    // console.log('File content of PDF: ', extract.text);
  }
  catch (err) {
    console.error("Error extracing text from PDF");
    return { status: 'failed', data: err };
  }


  try {
    const summary = await generateSummary(extract.text);
    console.log("Summary received from Cohere ", summary);

    return Promise.resolve({ status: 'success', data: summary });
  }

  catch (err) {
    console.error("Error summarizing file ", err);

    return Promise.reject({ status: 'failed', data: err });
  }



};


async function pdfToText(filePath) {
  console.log("Extract pdf at ", filePath);
  let readFileSync = fs.readFileSync(filePath);
  try {
    const pdfExtract = await pdfParse(readFileSync);
    // console.log('File content: ', pdfExtract.text);
    // console.log('Total pages: ', pdfExtract.numpages)
    // console.log('All content: ', pdfExtract.info)
    return Promise.resolve(pdfExtract);
  }

  catch (error) {
    console.error("Error extracting text from PDF", error);
    return Promise.reject(error);
  }
}

async function generateSummary(textToSummarize) {

  cohere.init(config.apiKey);
  try {
    const response = await cohere.summarize({
      text: textToSummarize,
      length: 'long',
      format: 'paragraph',
      model: 'summarize-medium',
      additional_command: '',
      temperature: 0.5,
    });

    // console.log("Response from Cohere", response);
    // console.log('Summary:', response.body.summary);

    return Promise.resolve(response.body.summary);
  }

  catch (error) {
    console.error("Error response from Cohere API ", error);
    return Promise.reject(error);
  }

}


  // fs.writeFile(`./assets/test-extract.txt`, extract.text, (err) => {
  //   if (err) throw err;
  //   console.log('The file has been saved!');
  // });