import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

let dynamoDBClientParams = { region: process.env.AWS_REGION };

const client = new DynamoDBClient(dynamoDBClientParams);
const docClient = DynamoDBDocumentClient.from(client);

export const update = async (event, context) => {
  try {
    const user = JSON.parse(event.body);
    
    if (!user.email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "The 'email' field is required as the primary key." }),
      };
    }

    const updateExpression = [];
    const expressionAttributeValues = {};
    const expressionAttributeNames = {};

    for (const key in user) {
      if (key !== "email") {
        updateExpression.push(`#${key} = :${key}`);
        expressionAttributeValues[`:${key}`] = user[key];
        expressionAttributeNames[`#${key}`] = key;
      }
    }

    if (updateExpression.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "No attributes provided to update." }),
      };
    }

    const params = {
      TableName: process.env.TABLA_USUARIOS,
      Key: { email: user.email },
      UpdateExpression: `SET ${updateExpression.join(", ")}`,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames,
      ReturnValues: "ALL_NEW",
    };

    const result = await docClient.send(new UpdateCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
