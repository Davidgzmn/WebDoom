/**
 * App Base Class
 *
 * @copyright: (C) 2016-2017 Kibble Games Inc in cooperation with Vancouver Film School.
 * All Rights Reserved.
 *
 * @author: Scott Henshaw
 * @link mailto:shenshaw@vfs.com
 * @version: 1.1.0
 * @summary: Framework Singleton Class to contain a web app
 *
 */
'use strict';

class App {
    constructor() {
        this['private'] = new WeakMap();
        this.private.members = ( key, value ) => {
            if (key == undefined)
                return null;

            if (value != undefined)
                this.private.set( key, value );

            return this.private.get( key );
        }
    }
}
const app = new App();
