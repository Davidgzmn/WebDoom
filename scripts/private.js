/**
 * @name The Private data store
 * 
 * @Copyright 2014-2017, Kibble Games Inc, in cooperation with VFS.  All Rights Reserved.
 * @usage 
 *   // in constructor
 *   let my = app.private( this, somePrivateDataObject );
 *   
 *   // in methods
 *   let my = app.private( this );
 *   
 */
'use strict';

class PrivateDataManager {
    
    constructor() {
        this._privateData = new WeakMap();
    }

    members( object = undefined, value = null ) {
            
        if (object === undefined)
            return null;
        
        if (value != null) {
            this._privateData.set( object, value );
        }
        
        return this._privateData.get( object ); 
    }
}
const PRIVATE = new PrivateDataManager();
