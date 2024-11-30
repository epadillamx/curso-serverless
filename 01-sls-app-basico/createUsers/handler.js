import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

let dynamoDBClientParams = { region:  process.env.AWS_REGION }


const client = new DynamoDBClient(dynamoDBClientParams);
const docClient = DynamoDBDocumentClient.from(client);


export const create  = async (event, context) => {
  try {
    const user = JSON.parse(event.body);
    
    const newUser = {
        ...user
    };
    await docClient.send(new PutCommand({
        TableName: process.env.TABLA_USUARIOS,
        Item: newUser,
    }));

    return {
        statusCode: 201,
        body: JSON.stringify(newUser),
    };
}
catch (error) {
    console.error(error);
    return {
        statusCode: 500,
        body: JSON.stringify({ message: error.message }),
    };
}

};