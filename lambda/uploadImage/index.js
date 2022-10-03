const { S3 } = require("aws-sdk");

const s3 = new S3();

// const a = (data) => {
//     const res = s3.putObject({
//         Body: data.body,
//         Bucket: process.env.BUCKET_NAME,
//         Key: data.key,
//         contentType : 'application/pdf'
//     });

//     return res;
// }

export const handler = async (dataFromApi) => {
    console.log("Data:");
    console.log(dataFromApi);
    const data = { body: dataFromApi.body, key: "key" };
    
    

    const pdf = dataFromApi.body;

    // const response = {
    //     statusCode: 200,
    //     body: JSON.stringify(data),
    //     isBase64Encoded: false,
    //     headers: {
    //         'Access-Control-Allow-Method': "GET",
    //         'Access-Control-Allow-Origin': "*"
    //     }
    // }
    const res = s3.putObject({
        Body: data.body,
        Bucket: process.env.BUCKET_NAME,
        Key: data.key,
        contentType : 'application/pdf'
    });

    console.log(res)
    return res;
};