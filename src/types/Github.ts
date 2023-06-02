/**
 * Minimal Github GraphQL API typings for implementation of package.
 */
export namespace Github {
  export type DateTime = string // ISO-8601

  export type Discussion = {
    author: Actor
    authorAssociation: AuthorAssociation
    bodyHTML: string
    bodyText: string
    category: Category
    createdAt: DateTime
    labels: LabelConnection
    lastEditedAt: DateTime | null
    locked: boolean
    number: number
    reactionGroups: ReactionGroup[]
    title: string
    upvoteCount: number
    url: string
  }

  export type Actor = {
    avatarUrl: string
    login: string
    url: string
  }

  export type AuthorAssociation =
    | "COLLABORATOR"
    | "CONTRIBUTOR"
    | "FIRST_TIMER"
    | "FIRST_TIME_CONTRIBUTOR"
    | "MANNEQUIN"
    | "MEMBER"
    | "NONE"
    | "OWNER"

  export type Category = {
    emoji: string
    isAnswerable: boolean
    name: string
    slug: string
  }

  export type LabelConnection = {
    nodes: Label[]
    pageInfo: PageInfo
    totalCount: number
  }

  export type Label = {
    color: string
    description?: string
    name: string
  }

  export type PageInfo = {
    endCursor: string | null
    hasNextPage: boolean
    hasPreviousPage: boolean
    startCursor: string | null
  }

  export type ReactionGroup = {
    content: ReactionContent
    reactors: ReactorConnection
  }

  export type ReactionContent =
    | "CONFUSED"
    | "EYES"
    | "HEART"
    | "HOORAY"
    | "LAUGH"
    | "ROCKET"
    | "THUMBS_DOWN"
    | "THUMBS_UP"

  export type ReactorConnection = {
    totalCount: number
  }

  export type DiscussionConnection = {
    nodes: Discussion
    pageInfo: PageInfo
    totalCount: number
  }

  export type PaginateOptions = {
    after?: string
    before?: string
    first?: number
    last?: number
  }

  export type DiscussionPaginateOptions = PaginateOptions & {
    categoryId?: string
    orderBy?: DiscussionOrder
  }

  export type DiscussionOrder = {
    field: "CREATED_AT" | "UPDATED_AT"
    direction: "DESC" | "ASC"
  }

  export type DiscussionCategory = {
    id: string
    name: string
  }
}
