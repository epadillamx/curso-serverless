import json
import os
import boto3
from botocore.exceptions import ClientError

# Configuración del cliente DynamoDB
dynamodb_client = boto3.client("dynamodb", region_name=os.getenv("AWS_REGION"))

def get_users(event, context):
    """
    Obtiene todos los usuarios de la tabla DynamoDB.
    """
    try:
        table_name = os.getenv("TABLA_USUARIOS")
        if not table_name:
            raise ValueError("Environment variable 'TABLA_USUARIOS' is not set.")

        # Escanea la tabla
        response = dynamodb_client.scan(TableName=table_name)
        items = response.get("Items", [])

        # Convertir a un formato legible
        users = [deserialize_dynamodb_item(item) for item in items]

        return {
            "statusCode": 200,
            "body": json.dumps(users)
        }
    except ClientError as error:
        print(f"ClientError: {error}")
        return {
            "statusCode": 500,
            "body": json.dumps({"message": f"Error retrieving users: {error.response['Error']['Message']}"})
        }
    except Exception as error:
        print(f"Error: {error}")
        return {
            "statusCode": 500,
            "body": json.dumps({"message": str(error)})
        }


def deserialize_dynamodb_item(item):
    """
    Convierte un objeto DynamoDB en un diccionario legible.
    """
    from boto3.dynamodb.types import TypeDeserializer

    deserializer = TypeDeserializer()
    return {key: deserializer.deserialize(value) for key, value in item.items()}
