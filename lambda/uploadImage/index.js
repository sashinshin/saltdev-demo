const { S3 } = require("aws-sdk");

const s3 = new S3();

const a = (data) => {
    const res = s3.putObject({
        Body: data.test,
        Bucket: process.env.BUCKET_NAME,
        Key: data.key,
    });

    return res;
}

export const handler = async () => {
    const data = { test: "test", key: "key" };



    // const response = {
    //     statusCode: 200,
    //     body: JSON.stringify(data),
    //     isBase64Encoded: false,
    //     headers: {
    //         'Access-Control-Allow-Method': "GET",
    //         'Access-Control-Allow-Origin': "*"
    //     }
    // }
    const res = a(data);

    return res;
};