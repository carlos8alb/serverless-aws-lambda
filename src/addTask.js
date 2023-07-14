const AWS = require('aws-sdk')
const crypto = require('crypto')
const middy = require('@middy/core')
const jsonBodyParser = require('@middy/http-json-body-parser')

const addTask = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient()

  const { title, description } = event.body
  const createdAt = Date.now()
  const id = crypto.randomUUID()

  const newTask = {
    id,
    title,
    description,
    createdAt,
    done: false
  }

  await dynamodb
    .put({
      TableName: 'TaskTable',
      Item: newTask
    })
    .promise()

  return {
    status: 200,
    body: newTask
  }
}

module.exports = {
  addTask: middy(addTask).use(jsonBodyParser())
}
