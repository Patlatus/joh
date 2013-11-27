/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('Ext.ux.desktop.Module', {
    mixins: {
        observable: 'Ext.util.Observable'
    },

    constructor: function (config) {
        this.mixins.observable.constructor.call(this, config);
        this.init();
    },

    statics : {
        write : function (text) {
            if (window.console) {
                console.log(text);
            }
        },
        
        resolveReference : function (hash, refName, mname) {
            var reference = hash[refName];
            if (!reference) {
                this.write('Empty ' + refName + ' of custom module name for module ' + mname);
            }
            var value = window.xmlconfig[reference];
            if (!value) {
                this.write('Empty ' + refName + ' value of custom module name for module ' + mname + ' in current language ' + window.xmlconfig.currentLanguage);
            }
            return value;
        },
        
        readString : function (hash, refName, mname) {
            var reference = hash[refName];
            if (!reference) {
                this.write('Empty ' + refName + ' of custom module name for module ' + mname);
            }
            return reference;
        },
        
        readBoolean : function (hash, refName, mname) {
            var reference = hash[refName];
            if (!reference) {
                this.write('Empty ' + refName + ' of custom module name for module ' + mname);
            }
            return (reference === 'on') || (reference === 'yes');
        },
        
        prepareConfig  : function (moduleName, hash) {
            return {
                'winId' : moduleName,
                'moduleId' : moduleName,
                'showdesktopicon' : this.readBoolean(hash, 'showdesktopicon', moduleName),
                'showquicklaunchicon' : this.readBoolean(hash, 'showquicklaunchicon', moduleName),
                'showstartmenuitem' : this.readBoolean(hash, 'showstartmenuitem', moduleName),
                'desktopiconcss' : this.readString(hash, 'desktopiconcss', moduleName),
                'startmenuquicklaunchiconcss' : this.readString(hash, 'startmenuquicklaunchiconcss', moduleName)
            }
        }
    },

    init: Ext.emptyFn
});
