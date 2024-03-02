import { gql } from "@apollo/client";

const ADD_TEXT_POST = gql`
  mutation AddNewTextPost($id: ID!, $text: String) {
    addTextPost(id: $id, text: $text) {
      _id
      owner {
        _id
        username
        name
        avatarUrl
      }
      likes {
        _id
      }
      bookmarks {
        _id
      }
      comments {
        _id
      }
      postType
      text
      createdAt
    }
  }
`;
const ADD_MEDIA_POST = gql`
  mutation AddNewMediaPost($id: ID!, $caption: String, $mediaUrls: [String]) {
    addMediaPost(id: $id, caption: $caption, mediaUrls: $mediaUrls) {
      _id
      owner {
        _id
        username
        name
        avatarUrl
      }
      likes {
        _id
      }
      bookmarks {
        _id
      }
      comments {
        _id
      }
      postType
      mediaUrls
      caption
      createdAt
    }
  }
`;

const POST_COMMENT = gql`
  mutation PostComment($userId: ID!, $postId: ID!, $text: String!) {
    postAComment(userId: $userId, postId: $postId, text: $text) {
      _id
      post {
        _id
      }
      owner {
        _id
        username
        name
        avatarUrl
      }
      text
      createdAt
      childComments {
        _id
      }
      parentComment {
        _id
      }
      likes {
        _id
      }
    }
  }
`;
const POST_REPLY = gql`
  mutation PostReply(
    $userId: ID!
    $postId: ID!
    $commentId: ID!
    $text: String!
  ) {
    postAReply(
      userId: $userId
      postId: $postId
      commentId: $commentId
      text: $text
    ) {
      _id
      post {
        _id
      }
      owner {
        _id
        username
        name
        avatarUrl
      }
      text
      createdAt
      childComments {
        _id
      }
      parentComment {
        _id
      }
      likes {
        _id
      }
    }
  }
`;

const ADD_NEW_USER_LOGIN = gql`
  mutation LoginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      _id
      username
      name
      avatarUrl
      bio
      website
      followers {
        _id
      }
      following {
        _id
      }
    }
  }
`;

const ADD_NEW_USER_SIGNUP = gql`
  mutation NewUser(
    $name: String!
    $username: String!
    $email: String!
    $password: String!
  ) {
    newUser(
      name: $name
      username: $username
      email: $email
      password: $password
    ) {
      _id
      username
      password
      name
      avatarUrl
      bio
      website
      createdAt
      followers {
        _id
      }
      following {
        _id
      }
    }
  }
`;

const CHECK_USERNAME = gql`
  mutation usernameCheck($username: String!) {
    checkUsername(username: $username)
  }
`;

const GET_POSTS = gql`
  query GetPosts($start: Int, $end: Int) {
    posts(start: $start, end: $end) {
      _id
      owner {
        _id
        username
        name
        avatarUrl
      }
      likes {
        _id
      }
      bookmarks {
        _id
      }
      comments {
        _id
      }
      postType
      caption
      text
      mediaUrls
      createdAt
    }
  }
`;
const RELOAD_POSTS = gql`
  query ReloadPosts($id: ID) {
    reloadFeed(id: $id) {
      _id
      owner {
        _id
        username
        name
        avatarUrl
      }
      likes {
        _id
      }
      bookmarks {
        _id
      }
      comments {
        _id
      }
      postType
      caption
      text
      mediaUrls
      createdAt
    }
  }
`;

const GET_USER_POSTS = gql`
  query GetPosts($id: ID!) {
    userPosts(id: $id) {
      _id
      owner {
        _id
        username
        name
        avatarUrl
      }
      likes {
        _id
      }
      bookmarks {
        _id
      }
      comments {
        _id
      }
      postType
      caption
      text
      mediaUrls
      createdAt
    }
  }
`;

const GET_REPLIES = gql`
  query GetReplies($commentId: ID!) {
    replies(commentId: $commentId) {
      _id
      post {
        _id
      }
      owner {
        _id
        username
        name
        avatarUrl
      }
      text
      createdAt
      childComments {
        _id
      }
      parentComment {
        _id
      }
      likes {
        _id
      }
    }
  }
`;

const UPDATE_PROFILE = gql`
  mutation updateUserProfile(
    $id: ID!
    $name: String!
    $username: String!
    $bio: String
    $website: String
    $avatarUrl: String
  ) {
    updateProfile(
      id: $id
      name: $name
      username: $username
      bio: $bio
      website: $website
      avatarUrl: $avatarUrl
    ) {
      _id
      username
      name
      avatarUrl
      bio
      website
      followers {
        _id
      }
      following {
        _id
      }
    }
  }
`;
const GET_FOLLOWING = gql`
  query GetFollowing($id: ID!) {
    following(id: $id) {
      _id
      username
      name
      avatarUrl
    }
  }
`;

const GET_FOLLOWERS = gql`
  query GetFollowers($id: ID!) {
    followers(id: $id) {
      _id
      username
      name
      avatarUrl
    }
  }
`;

const GET_USER = gql`
  query GetUser($id: ID!) {
    oneUser(id: $id) {
      _id
      username
      name
      avatarUrl
      bio
      website
      followers {
        _id
      }
      following {
        _id
      }
    }
  }
`;

const FOLLOW_USER = gql`
  mutation FollowUser($userId: ID!, $followerId: ID!) {
    followUser(userId: $userId, followerId: $followerId)
  }
`;
const UNFOLLOW_USER = gql`
  mutation unFollowUser($userId: ID!, $followerId: ID!) {
    unFollowUser(userId: $userId, followerId: $followerId)
  }
`;

const GET_OTHER_USER_POSTS = gql`
  query GetPosts($id: ID!) {
    userPosts(id: $id) {
      _id
      owner {
        _id
        username
        name
        avatarUrl
      }
      likes {
        _id
      }
      bookmarks {
        _id
      }
      comments {
        _id
      }
      postType
      caption
      text
      mediaUrls
      createdAt
    }
  }
`;

const GET_COMMENTS = gql`
  query GetComments($postId: ID!) {
    comments(postId: $postId) {
      _id
      post {
        _id
      }
      owner {
        _id
        username
        name
        avatarUrl
      }
      text
      createdAt
      childComments {
        _id
      }
      parentComment {
        _id
      }
      likes {
        _id
      }
    }
  }
`;

const LIKE_POST = gql`
  mutation LikePost($userId: ID!, $postId: ID!) {
    likePost(userId: $userId, postId: $postId)
  }
`;

const UNLIKE_POST = gql`
  mutation UnlikePost($userId: ID!, $postId: ID!) {
    unlikePost(userId: $userId, postId: $postId)
  }
`;

export {
  POST_COMMENT,
  POST_REPLY,
  ADD_MEDIA_POST,
  ADD_TEXT_POST,
  ADD_NEW_USER_LOGIN,
  ADD_NEW_USER_SIGNUP,
  CHECK_USERNAME,
  GET_POSTS,
  RELOAD_POSTS,
  GET_USER_POSTS,
  GET_REPLIES,
  UPDATE_PROFILE,
  GET_FOLLOWERS,
  GET_FOLLOWING,
  GET_USER,
  FOLLOW_USER,
  UNFOLLOW_USER,
  GET_OTHER_USER_POSTS,
  GET_COMMENTS,
  LIKE_POST,
  UNLIKE_POST,
};
