'use babel';

import chefProvider from './chef-provider';

export default {
    getProvider() {
        return [chefProvider];
    }
};
