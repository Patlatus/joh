Ext.define('MyDesktop.Folders', {
    extend: 'Ext.ux.desktop.Module',
    
    shortcutItemSelector: 'div.ux-folders-shortcut',

    shortcutTpl: [
        '<tpl for=".">',
            '<div class="ux-folders-shortcut" id="{name}-shortcut">',
                '<div class="ux-folders-shortcut-icon {iconCls}">',
                    '<img src="',Ext.BLANK_IMAGE_URL,'" title="{name}">',
                '</div>',
                '<span class="ux-folders-shortcut-text">{name}</span>',
            '</div>',
        '</tpl>',
        '<div class="x-clear"></div>'
    ],

   statics : {
        requiresPreprocessing : true,
        
        basefolder : 'music',
        moduleId : 'folders',
        
        preprocess : function (moduleName, hash, callback) {
            var supercls = Ext.ClassManager.get(this.superclass.$className);
            this.readString = supercls.readString;
            var getfoldersapi = ((moduleName && hash) ? this.readString(hash, 'getfoldersapi', moduleName) : null) || 'rsdmusic.php';
            MyDesktop.FolderDataLoader.loadFoldersData(getfoldersapi, moduleName, hash, callback);
        },
        
        prepareConfig  : function (moduleName, hash) {
            var supercls = Ext.ClassManager.get(this.superclass.$className);
            this.resolveReference = supercls.resolveReference;
            this.readBoolean = supercls.readBoolean;
            this.readString = supercls.readString;
            this.write = supercls.write;

            return Ext.apply(supercls['prepareConfig'].apply(this, arguments), {
                'caption' : this.resolveReference(hash, 'bigtitlereference', moduleName),
                'shortCaption' : this.resolveReference(hash, 'shorttitlereference', moduleName),
                'unauthorizedallowed' : this.readBoolean(hash, 'enabledforunauthorizeduser', moduleName),
                'getfoldersapi' : this.readString(hash, 'getfoldersapi', moduleName) || 'rsdmusic.php',
                'basefolder' : this.readString(hash, 'basefolder', moduleName),
                'foldersDataLoaded' : hash['foldersDataLoaded'],
                'foldersData' : hash['foldersData']
            })
        }
    },
    
    createDataView: function () {
        var me = this;
        return {
            xtype: 'dataview',
            overItemCls: 'x-view-over',
            trackOver: true,
            itemSelector: me.shortcutItemSelector,
            store: me.shortcuts,
            style: {
                position: 'absolute'
            },
            listeners : {
                itemclick : Ext.bind(this.onShortcutItemClick, this)
            },
            width: 40,
            height: 40,
            x: 0,
            y: 0,
            tpl: new Ext.XTemplate(me.shortcutTpl)
        };
    },
    
    prepareWinConfig : function (winTitle) {
        return {
            id: this.winId,
            title:winTitle,
            width:screen.width > 600 ? 600 : screen.availWidth,
            height:screen.height > 400 ? 400 : screen.availHeight,
            iconCls: this.startmenuquicklaunchiconcss,
            animCollapse:false,
            border: false,
            //defaultFocus: this.notepadEditorId, EXTJSIV-1300

            // IE has a bug where it will keep the iframe's background visible when the window
            // is set to visibility:hidden. Hiding the window via position offsets instead gets
            // around this bug.
            hideMode: 'offsets',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                this.createDataView()
            ]
        }
    },
    
    createNewDataView: function (data) {
        var me = this;
        return {
            xtype: 'dataview',
            overItemCls: 'x-view-over',
            trackOver: true,
            itemSelector: me.shortcutItemSelector,
            store: Ext.create('Ext.data.Store', {
                model : 'Ext.ux.desktop.ShortcutModel',
                data : data ? this.preprocessRawDataFromServer(data) : this.getDefaultFolderData()
            }),
            style: {
                position: 'absolute'
            },
            listeners : {
                itemclick : Ext.bind(this.onShortcutItemClick, this)
            },
            width: 40,
            height: 40,
            x: 0, 
            y: 0,
            tpl: new Ext.XTemplate(me.shortcutTpl)
        };
    },
    
    prepareNewWinConfig : function (winId, winTitle, data) {
        return {
            id: winId,
            title:winTitle,
            width:screen.width > 600 ? 600 : screen.availWidth,
            height:screen.height > 400 ? 400 : screen.availHeight,
            iconCls: data.smallIconCls,
            animCollapse:false,
            border: false,
            //defaultFocus: this.notepadEditorId, EXTJSIV-1300

            // IE has a bug where it will keep the iframe's background visible when the window
            // is set to visibility:hidden. Hiding the window via position offsets instead gets
            // around this bug.
            hideMode: 'offsets',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                this.createNewDataView(data.data)
            ]
        }
    },
    
    createWindow : function(){
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow(this.winId);
        if (!win){
            win = desktop.createWindow(this.prepareWinConfig(this.caption + ' /' + this.basefolder));
        }
        return win;
    },
    
    createNewWindow : function(winId, data){
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow(winId);
        if (!win){
            win = desktop.createWindow(this.prepareNewWinConfig(winId, this.caption + ' /' + winId, data));
        }
        return win;
    },
    
    onShortcutItemClick: function (dataView, record) {
        if (record.data.module) {
            var me = this,
            module = me.app.getModule(record.data.module);
            if (!module){
                alert(this.missingordisabledmoduleerror + module);
                return;
            }
            win = module && module.createNewWindow(record.data.fullpath, record.data);
            if (win) {
                win.show();
            }
        } else {
            alert(this.unknowndatatypeerror + record.data.name);
        }
    },
    
    preprocessRawDataFromServer : function (data) {
        for (var i = 0; i < data.length; i++) {
            data[i].iconCls = 'unknown-type-shortcut';
            data[i].smallIconCls = 'icon-unknown-type';
            if (data[i].type === 'folder') {
                data[i].module = 'folders';
                data[i].iconCls = 'folder-shortcut';
                data[i].smallIconCls = 'icon-folder';
            }
            if (data[i].type === 'mp3' || data[i].type === 'ogg' || data[i].type === 'wav') {
                data[i].module = 'audio';
                data[i].iconCls = 'music-shortcut';
                data[i].smallIconCls = 'icon-music';
            }
            if (data[i].type === 'exe') {
                data[i].module = 'filesdownloader';
                data[i].iconCls = 'exe-shortcut';
            }
        }
        return data;
    },
    
    getDefaultFolderData : function () {
        return [{
            name : 'dummy folder',
            type : 'folder',
            data : [{
                name : 'dummy embedded file',
                type : 'file',
                iconCls : this.desktopiconcss
            }],
            iconCls : this.desktopiconcss
        }, {
            name : 'dummy file',
            type : 'music',
            iconCls : this.desktopiconcss
        }]
    },
    
    init : function() {
        this.write = Ext.ClassManager.get(this.superclass.$className).write;
        this.moduleId = this.moduleId || 'folders';
        this.winId = this.winId || 'folders';
        this.id = this.moduleId;
        this.unauthorizedallowed = Ext.isDefined(this.unauthorizedallowed) ? this.unauthorizedallowed : true;
        this.showquicklaunchicon = Ext.isDefined(this.showquicklaunchicon) ? this.showquicklaunchicon : true;
        this.showstartmenuitem = Ext.isDefined(this.showstartmenuitem) ? this.showstartmenuitem : true;
        this.showdesktopicon = this.showdesktopicon || true;
        this.desktopiconcss = this.desktopiconcss || 'music-folder-shortcut';
        this.startmenuquicklaunchiconcss = this.startmenuquicklaunchiconcss || 'icon-music-folder';
        this.caption = this.caption || window.xmlconfig.folderstitle || 'Folders:';
        this.shortCaption = this.shortCaption || window.xmlconfig.foldersshortcut || 'folders';
        this.unknowndatatypeerror = this.unknowndatatypeerror || window.xmlconfig.foldersunknowndatatypeerror || 'Unknown data type of file with name: ';
        this.missingordisabledmoduleerror = this.missingordisabledmoduleerror || window.xmlconfig.foldersmissingordisabledmoduleerror || 'This module is missing or probably has been disabled by administrator: ';
        this.basefolder = this.basefolder || 'music';
            
        if (!Ext.isDefined(this.foldersDataLoaded)) {
            this.foldersDataLoaded = window.xmlconfig.foldersDataLoaded;
        }
        if (!Ext.isDefined(this.foldersData)) {
            this.foldersData = window.xmlconfig.foldersData;
        }
        
        this.shortcuts = Ext.create('Ext.data.Store', {
            model:'Ext.ux.desktop.ShortcutModel',
            //data: window.xmlconfig.foldersDataLoaded ? this.preprocessRawDataFromServer(window.xmlconfig.foldersData) : this.getDefaultFolderData()
            data: this.foldersDataLoaded ? this.preprocessRawDataFromServer(this.foldersData) : this.getDefaultFolderData()
        }),
        this.launcher = (this.showstartmenuitem && (this.unauthorizedallowed || (window.xmlconfig.lsEnabled && !window.xmlconfig.guestmode))) ? {
            text : this.shortCaption,
            iconCls : this.startmenuquicklaunchiconcss
        } : null;
        
        this.quickLaunch = this.showquicklaunchicon && (this.unauthorizedallowed || (window.xmlconfig.lsEnabled && !window.xmlconfig.guestmode)) ? {
            name : this.shortCaption,
            iconCls : this.startmenuquicklaunchiconcss,
            module : this.moduleId
        } : null;
            
        this.shortCut = this.showdesktopicon && (this.unauthorizedallowed || (window.xmlconfig.lsEnabled && !window.xmlconfig.guestmode)) ? {
            name : this.shortCaption,
            iconCls : this.desktopiconcss,
            module : this.moduleId
        } : null;
    },
    
    recursiveSearch : function (foldersData, path) {
        for (var i = 0; i < foldersData.length; i++) {
            if (foldersData[i].type === 'folder' && foldersData[i].fullpath.toLowerCase() === path.toLowerCase()) {
                return {
                    success : true,
                    record : foldersData[i]
                }
            }
        }
        for (var i = 0; i < foldersData.length; i++) {
            if (foldersData[i].type === 'folder') {
                var record = this.recursiveSearch(foldersData[i].data, path);
                if (record.success) {
                    return record;
                }
            }
        }
        return {
            success : false,
            record : null
        }
    },
    
    openFolder : function (path) {
        fList = path.split('|');
        this.write('fList : ' + fList);
        if (fList.length > 0) {
            this.write('fList[0] : ' + fList[0].toLowerCase());
            if (this.basefolder.toLowerCase() !== fList[0].toLowerCase()) {
                this.write('Root folder ' + fList[0].toLowerCase() + ' is different from base folder of module ' + this.basefolder.toLowerCase());
                return;
            }
            //fList.shift();
            var fullpath = fList.join('/');
            this.write('this.foldersData : ' + this.foldersData + ' ; fullpath fList.join("\") : ' + fullpath);
            if (this.basefolder.toLowerCase() === fullpath) {
                this.createWindow().show();
                return;
            }
            var record = this.recursiveSearch(this.foldersData, fullpath);
            
            this.write('record : ' + record.record + ' ; record.success : ' + record.success);
            
            if (record.success) {
                this.createNewWindow(record.record.fullpath, record.record).show();
            } else {
                alert('Cannot find folder ' + fullpath)
            }
        }
    }
});
