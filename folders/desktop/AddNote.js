/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('MyDesktop.AddNote', {
    extend: 'Ext.ux.desktop.Module',

    requires: [
        'Ext.form.field.HtmlEditor'
    ],

    statics : {
        prepareConfig  : function (moduleName, hash) {
            var supercls = Ext.ClassManager.get(this.superclass.$className);
            this.resolveReference = supercls.resolveReference;
            this.readBoolean = supercls.readBoolean;
            this.readString = supercls.readString;
            this.write = supercls.write;
            
            var bigtitle = this.resolveReference(hash, 'bigtitlereference', moduleName);
            var shorttitle = this.resolveReference(hash, 'shorttitlereference', moduleName);
            var deftitle = this.resolveReference(hash, 'defaulttitlereference', moduleName);
            var deftext = this.resolveReference(hash, 'defaulttextreference', moduleName);
            
            var showsticker = this.readBoolean(hash, 'showstickeraftermodification', moduleName);
            var showduplicate = this.readBoolean(hash, 'showduplicateoption', moduleName);
            var showedit = this.readBoolean(hash, 'showeditoption', moduleName);
            var showdelete = this.readBoolean(hash, 'showdeleteoption', moduleName);
            var loadstickers = this.readBoolean(hash, 'loadstickers', moduleName);
            var unauthorizedallowed = this.readBoolean(hash, 'enabledforunauthorizeduser', moduleName);
            var defaulthashtag = this.resolveReference(hash, 'defaulthashtagreference', moduleName);
            var getstickersapi = this.readString(hash, 'getstickersapi', moduleName);
            var addstickerapi = this.readString(hash, 'addstickerapi', moduleName);
            var editstickerapi = this.readString(hash, 'editstickerapi', moduleName);
            var deletestickerapi = this.readString(hash, 'deletestickerapi', moduleName);
            var overrideuseridbydefaulttag = this.readBoolean(hash, 'overrideuseridbydefaulttag', moduleName);
            var color = hash['color'];
    
            return Ext.apply(supercls['prepareConfig'].apply(this, arguments), {
                'titleEditorId' : moduleName + '||title-editor',
                'notepadEditorId' : moduleName + '||notepad-editor',
                'buttonTextAndWindowTitle' : bigtitle,
                'shortCaption' : shorttitle,
                'defaultTitle' : deftitle,
                'defaultText' : deftext,
                'showsticker' : showsticker,
                'showduplicate' : showduplicate,
                'showedit' : showedit,
                'showdelete' : showdelete,
                'doload' : loadstickers,
                'unauthorizedallowed' : unauthorizedallowed,
                'color' : color,
                'defaulthashtag' : defaulthashtag || 'default',
                'getstickersapi' : getstickersapi || 'gn.php',
                'addstickerapi' : addstickerapi || 'as.php',
                'editstickerapi' : editstickerapi || 'es.php',
                'deletestickerapi' : deletestickerapi || 'rs.php',
                'overrideuseridbydefaulttag' : overrideuseridbydefaulttag
            })
        }
    },
    

    init : function() {
        this.write = Ext.ClassManager.get(this.superclass.$className).write;
        this.moduleId = this.moduleId || 'notepad';
        this.winId = this.winId || 'notepad';
        this.titleEditorId = this.titleEditorId || 'title-editor';
        this.notepadEditorId = this.notepadEditorId || 'notepad-editor';
        this.defaultTitle = this.defaultTitle || '';
        this.defaultText = (this.defaultText || '').replace(/\\n/igm, '<br>') || 'Some <b>rich</b> <font color="red">text</font> goes <u>here</u><br>Give it a try!'
        this.id = this.moduleId;
        this.buttonTextAndWindowTitle = this.buttonTextAndWindowTitle || window.xmlconfig.addnewnote || 'Додати новий запис';
        this.shortCaption = this.shortCaption || window.xmlconfig.addnote || 'Додати запис';
        this.doload = Ext.isDefined(this.doload) ? this.doload : (this.moduleId === 'notepad');
        this.unauthorizedallowed = this.unauthorizedallowed || false;
        this.showsticker = Ext.isDefined(this.showsticker) ? this.showsticker : true;
        this.showduplicate = Ext.isDefined(this.showduplicate) ? this.showduplicate : true;
        this.showedit = Ext.isDefined(this.showedit) ? this.showedit : true;
        this.showdelete = Ext.isDefined(this.showdelete) ? this.showdelete : true;
        this.overrideuseridbydefaulttag = this.overrideuseridbydefaulttag || false;
        this.color = this.color || 'yellow';
        this.defaulthashtag = this.defaulthashtag || 'default';
        this.getstickersapi = this.getstickersapi || 'gn.php';
        this.addstickerapi = this.addstickerapi || 'as.php';
        this.editstickerapi = this.editstickerapi || 'es.php';
        this.deletestickerapi = this.deletestickerapi || 'rs.php';
        this.showquicklaunchicon = Ext.isDefined(this.showquicklaunchicon) ? this.showquicklaunchicon : true;
        this.showstartmenuitem = Ext.isDefined(this.showstartmenuitem) ? this.showstartmenuitem : true;
        this.showdesktopicon = this.showdesktopicon || false;
        this.desktopiconcss = this.desktopiconcss || 'tutor-shortcut';
        this.startmenuquicklaunchiconcss = this.startmenuquicklaunchiconcss || 'notepad';
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
        
        if (this.moduleId === 'notepad') {
            if (window.xmlconfig.lsEnabled) {
                this.loadStickers(this.getstickersapi, window.xmlconfig.userid, 0, 50, 'background-color:yellow;', {
                    showDuplicateButton : false,
                    showEditButton      : true,
                    showRemoveButton    : true
                });
            
                this.loadStickers(this.getstickersapi, 'default', 200, 100, 'background-color:00ff00;', {
                    showDuplicateButton : true,
                    showEditButton      : false,
                    showRemoveButton    : false
                });
            }
        } else {
            if (this.doload && (window.xmlconfig.userLogged || this.unauthorizedallowed)) {
                this.loadStickers(this.getstickersapi, this.getUserId(), 0, 50, 'background-color:' + this.color + ';', {
                    showDuplicateButton : this.showduplicate,
                    showEditButton      : this.showedit,
                    showRemoveButton    : this.showdelete
                });
            }
        }
    },
    
    getUserId : function () {
        return this.overrideuseridbydefaulttag ? this.defaulthashtag : window.xmlconfig.userid || this.defaulthashtag
    },
    
    ps : function (s) {
        return s.replace(/\n/igm, '<br>').replace(/'/igm, '&#39;');
    },

    createWindow : function(){
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow(this.winId);
        if (!win){
            win = desktop.createWindow(this.prepareWinConfig(this.buttonTextAndWindowTitle, this.buttonTextAndWindowTitle, this.defaultTitle, this.defaultText, this.onDuplicateApplyChangesClick));
        }
        return win;
    },
    
    duplicate : function (idn) {
        this.idn = idn;
        this.editPanel(this.onDuplicateApplyChangesClick);
    },
    
    edit : function (idn) {
        this.idn = idn;
        this.editPanel(this.onEditApplyChangesClick);
    },
    
    editPanel : function (callback) {
        var desktop = this.app.getDesktop();
        panelWin = desktop.getWindow(this.idn);
        win = desktop.createWindow(Ext.apply(this.prepareWinConfig(window.xmlconfig.editnote || 'Редагувати запис', window.xmlconfig.applychanges || 'Застосувати зміни', panelWin.title, panelWin.items.items[0].getEl().dom.firstChild.innerHTML, callback), {
            width:600,
            height:400
        }));
        win.show();
    },
    
    prepareWinConfig : function (winTitle, btnText, title, text, callback) {
        return {
            id: this.winId,
            title:winTitle,
            width:600,
            height:400,
            iconCls: 'notepad',
            animCollapse:false,
            border: false,
            //defaultFocus: this.notepadEditorId, EXTJSIV-1300

            // IE has a bug where it will keep the iframe's background visible when the window
            // is set to visibility:hidden. Hiding the window via position offsets instead gets
            // around this bug.
            hideMode: 'offsets',
            bbar: [
                { 
                    xtype: 'button',
                    text: btnText,
                    listeners: {
                        click: {
                            scope: this,
                            fn: callback
                        }
                    }
                }
            ],
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'panel',
                    
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            html: window.xmlconfig.titletext || 'Заголовок:'
                        },
                        {
                            xtype: 'textfield',
                            id: this.titleEditorId,
                            value: title
                        }
                    ]
                },
                {
                    xtype: 'htmleditor',
                    flex: 1,
                    id: this.notepadEditorId,
                    value: text
                }
            ]
        }
    },
    
    onEditApplyChangesClick : function () {
        var data = {
            id    : this.idn,
            title : this.ps(Ext.getCmp(this.titleEditorId).getValue()),
            x     : this.app.getDesktop().getWindow(this.winId).x,
            y     : this.app.getDesktop().getWindow(this.winId).y,
            text  : this.ps(Ext.getCmp(this.notepadEditorId).getValue())
        };
        Ext.Ajax.request({
            url: this.editstickerapi,
            params: {
                id: this.idn,
                hashtag: this.getUserId(),
                text: this.ps(Ext.getCmp(this.notepadEditorId).getValue()),
                title:this.ps(Ext.getCmp(this.titleEditorId).getValue()),
                x:this.app.getDesktop().getWindow(this.winId).x,
                y:this.app.getDesktop().getWindow(this.winId).y
            },
            scope: this,
            success: function (response){
                this.destroyWindow(this.idn);
                this.showData(data);
            }
        });
        this.app.getDesktop().getWindow(this.winId).close();
    },
    
    onDuplicateApplyChangesClick : function () {
        var data = this.cookData();
        Ext.Ajax.request({
            url: this.addstickerapi,
            params: Ext.apply({
                hashtag: this.getUserId()
            }, data),
            scope: this,
            success: function (response){
                data.id = response.responseText;
                this.showData(data);
            }
        });
        this.app.getDesktop().getWindow(this.winId).close();
    },
    
    remove : function (idn) {
        Ext.Msg.confirm(window.xmlconfig.removenotetitle || "Агов!", window.xmlconfig.removenotetext || "Чи Ви справді бажаєте видалити цей милий і прекрасний запис? Цю дію не можна скасувати.", function(button) {
            if (button === 'yes') {
                Ext.Ajax.request({
                    url: this.deletestickerapi,
                    params: {
                        id: idn
                    },
                    scope: this,
                    success: function(response){
                        this.destroyWindow(idn);
                    }
                });
            }
        }, this);
        
    },
    
    showPanel : function (data, bodyStyle, options) {
        var toolsConfig = [];
        if (options) {
            if (options.showDuplicateButton) {
                toolsConfig.push({
                    type:'plus',
                    tooltip: window.xmlconfig.duplicate || 'Дублювати',
                    scope:this,
                    handler: function(event, toolEl, panel){
                        this.duplicate(panel.ownerCt.id);
                    }
                });
            }
            if (options.showEditButton) {
                toolsConfig.push({
                    type:'gear',
                    tooltip: window.xmlconfig.edit || 'Редагувати',
                    scope:this,
                    handler: function(event, toolEl, panel){
                        this.edit(panel.ownerCt.id);
                    }
                });
            }
            if (options.showRemoveButton) {
                toolsConfig.push({
                    type:'minus',
                    tooltip: window.xmlconfig.remove || 'Видалити',
                    scope:this,
                    handler: function(event, toolEl, panel){
                        this.remove(panel.ownerCt.id);
                    }
                });
            }
        }
        var ww = this.app.getDesktop().createWindow({
            id:data.id,
            title:data.title,
            x:data.x,
            y:data.y,
            minWidth: 100,
            minHeight: 40,
            iconCls:null,
            animCollapse:false,
            constrainHeader:true,
            layout:'fit',
            tools:toolsConfig,
            items:{
                bodyStyle: bodyStyle,
                html:data.text,
                autoScroll:true
            }
        });
        ww.show();
    },

    showData : function (data) {
        if (!this.showsticker) {
            return;
        }
        this.showPanel(data, 'background-color:' + this.color + ';', {
            showDuplicateButton : this.showduplicate,
            showEditButton      : this.showedit,
            showRemoveButton    : this.showdelete
        });
    },
    
    destroyWindow : function (idn) {
        var destinationWin = this.app.getDesktop().getWindow(idn);
        if (destinationWin && !destinationWin.destroyed) {
            destinationWin.destroy();
        }
    },
    
    cookData : function () {
        return {
            title : this.ps(Ext.getCmp(this.titleEditorId).getValue()),
            x     : this.app.getDesktop().getWindow(this.winId).x,
            y     : this.app.getDesktop().getWindow(this.winId).y,
            text  : this.ps(Ext.getCmp(this.notepadEditorId).getValue())
        };
    },

    loadStickers : function (url, hashtag, defX, defYShift, bodyStyle, options) {
        var xStore = Ext.create('Ext.data.Store', {
            fields: [
                {name: 'id', type: 'int'},
                {name: 'text', type: 'string'},
                {name: 'title', type: 'string'},
                {name: 'x', type: 'int'},
                {name: 'y', type: 'int'},
                {name: 'hashtag', type: 'string'}
            ],
            autoLoad: true
        });
        Ext.Ajax.request({
            url: url,
            params: {
                'hashtag': hashtag
            },
            success: Ext.bind(function(response){
                var text = response.responseText;
                try {
                    var decodedText = Ext.decode(text)
                }
                catch (e) {
                    alert((window.xmlconfig.alertmessage1 || 'Error during decoding text:') + '\n' + text);
                }
                this.write('text:\n' + text);
                this.write('decodedText:\n' + decodedText);
                xStore.loadData(decodedText);
               
                
                for (var i = 0; i < xStore.data.items.length; i++) {
                    var data = xStore.data.items[i].data;
                    if (data.x === null || data.x === undefined) {
                        data.x = defX;
                    }
                    if (data.y === null || data.y === undefined) {
                        data.y = i * defYShift;
                    }
                    this.showPanel(data, bodyStyle, options);
                }
            }, this)
        });
    }
});
