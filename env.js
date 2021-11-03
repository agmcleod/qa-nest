const fs = require('fs')
const path = require('path')
const { SSM } = require('aws-sdk')

const env = process.env.NODE_ENV
const region = process.env.AWS_REGION
const envfile = path.resolve(__dirname, './.env')

const client = new SSM({ region, version: 'latest' })

const createFileContents = (parameters) => {
  return parameters
    .map((parameter) => {
      const path = parameter.Name.split('/')
      const name = path[path.length - 1]
      return `${name}=${parameter.Value}`
    })
    .join('\n')
}

const loadEnv = async (callback) => {
  const parameters = []
  let nextToken = null
  do {
    const result = await loadParameters(nextToken)
    nextToken = result.nextToken
    parameters.push(...result.parameters)
  } while (nextToken !== null)

  const fileContent = createFileContents(parameters)

  fs.writeFile(envfile, fileContent, (err) => {
    if (err) return callback(err)
    callback()
  })
}

const loadParameters = async (nextToken = null) => {
  const params = {
    Path: `/${env}/`,
    WithDecryption: true,
  }
  if (nextToken) {
    params.NextToken = nextToken
  }
  const result = await client.getParametersByPath(params).promise()
  return {
    parameters: result.Parameters,
    nextToken: result.NextToken || null,
  }
}

loadEnv((err) => {
  if (err) {
    console.log('Error loading env from SSM:', err)
    process.exit(1)
  } else {
    console.log('Successfully loaded env from SSM')
    process.exit(0)
  }
})
