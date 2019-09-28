import { PubSub } from 'apollo-server-express';
import * as PRODUCT_EVENTS from './product';

export const EVENTS = {
  PRODUCT: PRODUCT_EVENTS,
};

export default new PubSub();
