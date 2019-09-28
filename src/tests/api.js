// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';

const API_URL = 'http://localhost:8000/graphql';
// eslint-disable-next-line import/prefer-default-export
export const user = async variables =>
  axios.post(API_URL, {
    query: `
      query ($id: ID!) {
        user(id: $id) {
          id
          email
          role
        }
      }
    `,
    variables,
  });

export const login = async variables =>
  axios.post(API_URL, {
    query: `
        mutation ($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            token
          }
        }
      `,
    variables,
  });

export const deleteUser = async (variables, token) =>
  axios.post(
    API_URL,
    {
      query: `
          mutation ($id: ID!) {
            deleteUser(id: $id)
          }
        `,
      variables,
    },
    {
      headers: {
        'x-token': token,
      },
    }
  );
