import { App, Octokit } from "octokit"
import { Github } from "./types/Github"

/**
 * Discussions manager to handle querying Github.
 */
export class Discussions {
  protected constructor(protected readonly octokit: Octokit) {}

  /**
   * Initialise a discussions manager for a Github organisation.
   * @param appId The ID for the Github app
   * @param privateKey The private key for the Github app
   * @param username The username of the organisation which contains the discussions
   */
  public static async init(
    appId: number,
    privateKey: string,
    username: string
  ): Promise<Discussions> {
    const app = new App({ appId, privateKey })

    const res = await app.octokit.request("GET /orgs/{username}/installation", {
      username
    })

    const octokit = await app.getInstallationOctokit(res.data.id)

    return new Discussions(octokit)
  }

  /**
   * Submit a graphql query to Github.
   * @param query The graphql query to send
   * @returns The result of the query
   */
  protected async query(query: string): Promise<any> {
    return this.octokit.graphql(`
      query {
        ${query}
      }
    `)
  }

  public async getDiscussionCategories(
    owner: string,
    repository: string
  ): Promise<Github.DiscussionCategory[]> {
    return (
      await this.query(`
      repository(owner: "${owner}", name: "${repository}") {
        discussionCategories(first: 10) {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    `)
    ).repository.discussionCategories.edges.map(
      (edge: { node: Github.DiscussionCategory }) => edge.node
    ) as Github.DiscussionCategory[]
  }

  /**
   * Get a discussion by it's ID.
   * @param id The ID of the discussion
   * @returns An object containing important information about the given discussion
   */
  public async getDiscussionById(
    owner: string,
    repository: string,
    discussionId: number
  ): Promise<Github.Discussion> {
    return (
      await this.query(`
        repository(owner: "${owner}", name: "${repository}") {
          discussion(number: ${discussionId}) {
            author {
              avatarUrl
              login
              url
            }
            authorAssociation
            bodyHTML
            bodyText
            category {
              emoji
              isAnswerable
              name
              slug
            }
            createdAt
            labels(first: 8) {
              nodes {
                color
                description
                name
              }
              totalCount
              pageInfo {
                  endCursor
                  hasNextPage
                  hasPreviousPage
                  startCursor
                }
            }
            lastEditedAt
            locked
            number
            reactionGroups {
              content
              reactors {
                totalCount
              }
            }
            title
            upvoteCount
            url
          }
        }
      `)
    ).repository.discussion as Promise<Github.Discussion>
  }

  public async getDiscussionsByCategoryId(
    owner: string,
    repository: string,
    categoryId: string,
    options: Github.DiscussionPaginateOptions
  ): Promise<Github.DiscussionConnection> {
    return (
      await this.query(`
        repository(owner: "${owner}", name: "${repository}") {
          discussions(
            categoryId: "${categoryId}",
            ${options.first ? `first: ${options.first}` : ""}
            ${options.last ? `last: ${options.last}` : ""}
            ${options.after ? `after: "${options.after}"` : ""}
            ${options.before ? `before: "${options.before}"` : ""}
            ${
              options.orderBy
                ? `
                  orderBy: {
                    field: ${options.orderBy.field}
                    direction: ${options.orderBy.direction}
                  }
                `
                : ""
            }
          ) {
            nodes {
              author {
                avatarUrl
                login
                url
              }
              authorAssociation
              bodyHTML
              bodyText
              category {
                emoji
                isAnswerable
                name
                slug
              }
              createdAt
              labels(first: 8) {
                nodes {
                  color
                  description
                  name
                }
                pageInfo {
                  endCursor
                  hasNextPage
                  hasPreviousPage
                  startCursor
                }
                totalCount
              }
              lastEditedAt
              locked
              number
              reactionGroups {
                content
                reactors {
                  totalCount
                }
              }
              title
              upvoteCount
              url
            }
            pageInfo {
              endCursor
              hasNextPage
              hasPreviousPage
              startCursor
            }
            totalCount
          }
        }
      `)
    ).repository.discussions as Promise<Github.DiscussionConnection>
  }
}
