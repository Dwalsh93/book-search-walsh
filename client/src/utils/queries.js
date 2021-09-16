import gql from '@apollo/client';

export const QUERY_ME = gql`
  query me($username: String) {
    me(username: $username) {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;

