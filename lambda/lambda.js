export const handler = async () => {
    const data = {test: "test"};


    const response = {
        statusCode: 200,
        body: JSON.stringify(data),
        isBase64Encoded: false,
        headers: {
            'Access-Control-Allow-Method': "GET",
            'Access-Control-Allow-Origin': "*"
        }
    }

    return response;
};