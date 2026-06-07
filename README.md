## Quote Central

React/Vite quoting and costing application for managing customers, materials, metals, in-house work, outsourcing, item versions, and quotes.

## Overview

The app is deployed and served by AWS Amplify Hosting. The React code handles the business workflow directly and uses Cognito-authenticated AWS SDK clients as a DynamoDB DAO.

## Features

- **Authentication**: Amazon Cognito via `react-oidc-context`.
- **Database**: Direct DynamoDB access through the AWS SDK.
- **Quoting workflow**: Cost models for materials, operations, outsourcing, setup, wastage, overhead, and quote generation.

## Deployment

Amplify Hosting builds the frontend using `amplify.yml`. There is no Amplify-managed backend definition in this repository.

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.

## Local Development

```sh
npm run dev
```
