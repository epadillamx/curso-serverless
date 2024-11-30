import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

let dynamoDBClientParams = { region: process.env.AWS_REGION };

const client = new DynamoDBClient(dynamoDBClientParams);
const docClient = DynamoDBDocumentClient.from(client);

export const deleteitem = async (event, context) => {
  try {
    const { email } = JSON.parse(event.body);

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "The 'email' field is required as the primary key." }),
      };
    }

    const params = {
      TableName: process.env.TABLA_USUARIOS,
      Key: { email },
    };

    await docClient.send(new DeleteCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `User with email ${email} deleted successfully.` }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
