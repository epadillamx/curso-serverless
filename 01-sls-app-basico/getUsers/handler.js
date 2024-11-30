import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

let dynamoDBClientParams = { region: process.env.AWS_REGION };

const client = new DynamoDBClient(dynamoDBClientParams);
const docClient = DynamoDBDocumentClient.from(client);

export const get = async (event, context) => {
  try {
    const params = {
      TableName: process.env.TABLA_USUARIOS,
    };

    const result = await docClient.send(new ScanCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
