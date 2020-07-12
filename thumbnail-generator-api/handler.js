'use strict';
const Sharp = require('sharp');
const Parser = require('lambda-multipart-parser');

module.exports.resize = async (event) => {
  const formData = await Parser.parse(event);
  const {files:[original]} = formData;
  if(!["image/png", "image/jpeg"].includes(original.contentType)) return {statusCode:400}
  const sharp = Sharp(original.content);
  console.log(sharp)
  const metadata = await sharp.metadata();
  console.log(metadata)

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
