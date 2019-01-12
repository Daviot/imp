import { Env } from './../../models/env';

export default class Magento2 {
    constructor(env: Env) {
        env.event.emit('imp:module:add', { test: true });
    }
}