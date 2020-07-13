'use strict';
const AWS = require('aws-sdk');
const S3 = new AWS.S3({});
const Sharp = require('sharp');
const Parser = require('lambda-multipart-parser');
const uuid = require("uuid").v4;

const SIZES = [
  [400, 300],
  [160, 120],
  [120, 120],
];

const wrapper = (fn) => async (event) => {
  const response = await fn(event);
  return {
    ...(
      response.body ?
        response :
        {
          body: JSON.stringify(response)
        }
    ),
    statusCode: response.statusCode || 200,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
        ...(response.headers || {})
    }
  }
}

module.exports.resize = wrapper(async (event) => {

  const formData = await Parser.parse(event);
  const {files:[original]} = formData;

  if(!original)
    return {statusCode:400}

  if(Buffer.byteLength(original.content)>5000000)
    return {statusCode:413}

  if(!["image/png", "image/jpeg"].includes(original.contentType))
    return {statusCode:415}

  const sharp = Sharp(original.content);

  const metadata = await sharp.metadata();
  if(!["png", "jpeg"].includes(metadata.format))
    return {statusCode:415}

  const CONFIG = SIZES.map(([width, height], i) => ({
    key: `${width}x${height}-${uuid()}-${original.filename}`,
    image: (i===(SIZES.length-1) ? sharp : sharp.clone())
      .resize(width, height),
  }))

  await Promise.all(
    CONFIG.map(async ({key, image})=>
      S3.putObject({
        Body: await image.toBuffer(),
        Bucket: process.env.bucket,
        ContentType: original.contentType,
        Key: key,
      }).promise()
    )
  )

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        thumbnails: CONFIG.map(({key}) => `https://${process.env.bucket}.s3.amazonaws.com/${key}`)
      },
      null,
      2
    ),
  };
});
