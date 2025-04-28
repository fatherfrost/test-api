## Description

Test project for butch creating, updating and deleting items

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Items routes

POST /items

Bulk create items
Body: Array of items to create
Returns: { message: string, jobId: string }


GET /items

Get all items
Returns: Array of items


GET /items/:id

Get item by ID
Returns: Single item


PATCH /items/update


Bulk update items
Body: Array of items to update
Returns: { message: string, jobId: string }


DELETE /items/delete

Bulk delete items
Body: Array of items to delete
Returns: { message: string, jobId: string }

## Jobs
GET /jobs/:id
Get job status by ID
Returns:
{
id: string;
status: string;
progress: number;
processedCount?: number;
failedReason?: string;
}
