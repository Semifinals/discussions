# Semifinals Discussions

This package is a minimal implementation of the Github GraphQL API for the purpose of fetching Discussions from an organisation for use at a content management system for blogging.

## Installation

To install and use this package, run the following command:

```
npm i @semifinals/discussions
```

The package exports two things: `Discussions` and `Github`. `Github` is the minimal typings included in the package, and `Discussions` is the client used to fetch discussions. Since the package is written in Typescript it offers full auto-completion and all methods are documented. The `Discussions` class can also be extended to implement more features to if is required.

## Example Usage

This is a simple demonstration to fetch a discussion by it's ID. Please keep your `PRIVATE_KEY` secret as an environment variable or by other secure means, as it's like the password to your Github app!

```ts
import { Discussions } from "@semifinals/discussions"

const APP_ID = "..." // Your Github app ID
const PRIVATE_KEY = "..." // Your Github app private key, keep it secret!
const USERNAME = "Semifinals" // Your organisation username
const REPOSITORY = ".github" // The repository set for your organisation discussions

// Initialise the app client
const discussions = await Discussions.init(APP_ID, PRIVATE_KEY, USERNAME)

// Fetch a discussion by a given ID (1)
discussions
  .getDiscussionById(USERNAME, REPOSITORY, 1)
  .then(discussion => console.log(discussion))

// Fetch the discussion categories in a given repository
discussions
  .getDiscussionCategories("Semifinals", ".github")
  .then(categories => categories.forEach(category => console.log(category)))

// Fetch the most recent discussions for a given category ID (DIC_kwDOJL02RM4CVDMn)
discussions
  .getDiscussionsByCategoryId(USERNAME, REPOSITORY, "DIC_kwDOJL02RM4CVDMn", {
    first: 5
  })
  .then(connection =>
    connection.nodes.forEach(discussion => console.log(discussion))
  )
```
