import { expect } from 'chai';
import * as userApi from './api';

describe('users', () => {
  describe('user(id: String!): User', () => {
    it('returns a user when one can be found', async () => {
      const expected = {
        data: {
          user: {
            id: '04c24519-51d9-4197-9579-d536d38d2887',
            email: 'paulmattjaws@gmail.com',
            role: 'ADMIN',
          },
        },
      };

      const result = await userApi.user({
        id: '04c24519-51d9-4197-9579-d536d38d2887',
      });

      expect(result.data).to.eql(expected);
    });

    it('returns null when user cannot be found', async () => {
      const expected = {
        data: {
          user: null,
        },
      };
      const result = await userApi.user({
        id: '59C2DEF4-14B3-4666-B74C-D7A9AAEF7D37',
      });
      expect(result.data).to.eql(expected);
    });
  });

  describe('deleteUser(id: String!): Boolean!', () => {
    it('returns an error if authenticated user is not an admin', async () => {
      const {
        data: {
          data: {
            login: { token },
          },
        },
      } = await userApi.login({
        email: 'fakeuser@example.com',
        password: 'hotdogs',
      });

      const {
        data: { errors },
      } = await userApi.deleteUser({ id: '1' }, token);

      expect(errors[0].message).to.eql('Not authorized as admin.');
    });
  });
});
