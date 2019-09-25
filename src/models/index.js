const users = {
  1: {
    id: '1',
    email: 'me@pauljaworski.com',
    password: 'lolwut2019',
    firstName: 'Paul',
    lastName: 'Jaworski',
    productIds: [1],
  },
  2: {
    id: '2',
    email: 'fake@example.com',
    password: 'fakepw2019',
    firstName: 'fake',
    lastName: 'user',
    productIds: [2],
  },
};

const products = {
  1: {
    id: '1',
    title: 'Tree Cap',
    userId: '1',
  },
  2: {
    id: '2',
    title: '20oz Watter Bottle',
    userId: '2',
  },
};

export default {
  users,
  products,
};
