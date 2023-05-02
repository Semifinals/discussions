import { App, Octokit } from "octokit"

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
  protected async query(query: string) {
    return this.octokit.graphql(`
      query {
        ${query}
      }
    `)
  }

  /**
   * Get a discussion by it's ID.
   * @param id The ID of the discussion
   * @returns An object containing important information about the given discussion
   */
  public async getDiscussionById(id: number, bodyType: "HTML" | "TEXT") {
    return this.query(`
      repository(owner: "Semifinals", name: ".github") {
        discussion(number: ${id}) {
          author {
            avatarUrl
            login
            url
          }
          authorAssociation
          ${bodyType === "HTML" ? "BodyHTML" : "BodyText"}
          category {
            emoji
            isAnswerable
            name
            slug
          }
          labels(first: 10) {
            nodes {
              color
              description
              name
            }
          }
          lastEditedAt
          locked
          number
          publishedAt
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
  }
}
