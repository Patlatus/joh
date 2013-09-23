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
            
            var color = hash['color'];
    
            return {
                'winId' : moduleName,
                'moduleId' : moduleName,
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
                'color' : color
            }
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
        this.color = this.color || 'yellow';
        this.launcher = (window.xmlconfig.lsEnabled && !window.xmlconfig.guestmode) ? {
            text: this.shortCaption,
            iconCls:'notepad'
        } : null;
            
        if (this.moduleId === 'notepad') {
            if (window.xmlconfig.lsEnabled && window.xmlconfig.stickersEnabled) {
                this.loadStickers('gn.php', window.xmlconfig.userid, 0, 50, 'background-color:yellow;', {
                    showDuplicateButton : false,
                    showEditButton      : true,
                    showRemoveButton    : true
                });
            
                this.loadStickers('gn.php', 'default', 200, 100, 'background-color:00ff00;', {
                    showDuplicateButton : true,
                    showEditButton      : false,
                    showRemoveButton    : false
                });
            }
        } else {
            if (this.doload && (window.xmlconfig.userLogged || this.unauthorizedallowed)) {
                this.loadStickers('gn.php', window.xmlconfig.userid || 'default', 200, 100, 'background-color:' + this.color + ';', {
                    showDuplicateButton : this.showduplicate,
                    showEditButton      : this.showedit,
                    showRemoveButton    : this.showdelete
                });
            }
        }
    },
    
    ps : function (s) {
        return s.replace(/\n/igm, '<br>').replace(/'/igm, '&#39;');
    },

    createWindow : function(){
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow(this.winId);
        if (!win){
            win = desktop.createWindow({
                id: this.winId,
                title:this.buttonTextAndWindowTitle,
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
                        text: this.buttonTextAndWindowTitle,
                        listeners: {
                            click: {
                                scope: this,
                                fn: function() {
                                    var data = {
                                        title : this.ps(Ext.getCmp(this.titleEditorId).getValue()),
                                        x     : this.app.getDesktop().getWindow(this.winId).x,
                                        y     : this.app.getDesktop().getWindow(this.winId).y,
                                        text  : this.ps(Ext.getCmp(this.notepadEditorId).getValue())
                                    };
                                    Ext.Ajax.request({
                                        url: 'as.php',
                                        params: {
                                            hashtag: window.xmlconfig.userid,
                                            text: this.ps(Ext.getCmp(this.notepadEditorId).getValue()),
                                            title:this.ps(Ext.getCmp(this.titleEditorId).getValue()),
                                            x:this.app.getDesktop().getWindow(this.winId).x,
                                            y:this.app.getDesktop().getWindow(this.winId).y
                                        },
                                        scope: this,
                                        success: function(response){
                                            data.id = response.responseText;
                                            this.showPanel(data, 'background-color:yellow;', {
                                                showDuplicateButton : false,
                                                showEditButton      : true,
                                                showRemoveButton    : true
                                            });
                                        }
                                    });
                                    this.app.getDesktop().getWindow(this.winId).close();
                                }
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
                                value: this.defaultTitle
                            }
                        ]
                    },
                    {
                        xtype: 'htmleditor',
                        flex: 1,
                        id: this.notepadEditorId,
                        value: this.defaultText
                    }
                ]
            });
        }
        return win;
    },
    
    duplicate : function (idn) {
        this.idn = idn;
        this.editPanel(this.onDuplicateApplyChangesClick);
        /*
        var desktop = this.app.getDesktop();
        panelWin = desktop.getWindow(idn);
        win = desktop.createWindow({
            id: this.winId,
            title:window.xmlconfig.editnote || 'Редагувати запис',//'Add new note',
            width:600,
            height:400,
            x: panelWin.x,
            y: panelWin.y,
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
                    text: window.xmlconfig.applychanges || 'Застосувати зміни',
                    listeners: {
                        click: {
                            scope: this,
                            fn: function() {
                                var data = {
                                    title : this.ps(Ext.getCmp(this.titleEditorId).getValue()),
                                    x     : this.app.getDesktop().getWindow(this.winId).x,
                                    y     : this.app.getDesktop().getWindow(this.winId).y,
                                    text  : this.ps(Ext.getCmp(this.notepadEditorId).getValue())
                                };
                                Ext.Ajax.request({
                                    url: 'as.php',
                                    params: {
                                        id: idn,
                                        hashtag: window.xmlconfig.userid,
                                        text: this.ps(Ext.getCmp(this.notepadEditorId).getValue()),
                                        title:this.ps(Ext.getCmp(this.titleEditorId).getValue()),
                                        x:this.app.getDesktop().getWindow(this.winId).x,
                                        y:this.app.getDesktop().getWindow(this.winId).y
                                    },
                                    scope: this,
                                    success: function (response){
                                        data.id = response.responseText;
                                        this.showPanel(data, 'background-color:yellow;', {
                                            showDuplicateButton : false,
                                            showEditButton      : true,
                                            showRemoveButton    : true
                                        });
                                    }
                                });
                                this.app.getDesktop().getWindow(this.winId).close();
                            }
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
                            value: panelWin.title
                        }
                    ]
                },
                {
                    xtype: 'htmleditor',
                    flex: 1,
                    id: this.notepadEditorId,
                    value: panelWin.items.items[0].getEl().dom.firstChild.innerHTML
                }
            ]
        });
        win.show();
        */
    },
    
    edit : function (idn) {
        this.idn = idn;
        this.editPanel(this.onEditApplyChangesClick);
        /*
        var desktop = this.app.getDesktop();
        panelWin = desktop.getWindow(idn);
        win = desktop.createWindow({
            id: this.winId,
            title:window.xmlconfig.editnote || 'Редагувати запис',
            width:600,
            height:400,
            x: panelWin.x,
            y: panelWin.y,
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
                    text: window.xmlconfig.applychanges || 'Застосувати зміни',
                    listeners: {
                        click: {
                            scope: this,
                            fn: function () {
                                var data = {
                                    id    : idn,
                                    title : this.ps(Ext.getCmp(this.titleEditorId).getValue()),
                                    x     : this.app.getDesktop().getWindow(this.winId).x,
                                    y     : this.app.getDesktop().getWindow(this.winId).y,
                                    text  : this.ps(Ext.getCmp(this.notepadEditorId).getValue())
                                };
                                Ext.Ajax.request({
                                    url: 'es.php',
                                    params: {
                                        id: idn,
                                        hashtag: window.xmlconfig.userid,
                                        text: this.ps(Ext.getCmp(this.notepadEditorId).getValue()),
                                        title:this.ps(Ext.getCmp(this.titleEditorId).getValue()),
                                        x:this.app.getDesktop().getWindow(this.winId).x,
                                        y:this.app.getDesktop().getWindow(this.winId).y
                                    },
                                    scope: this,
                                    success: function (response){
                                        var destinationWin = this.getDesktop().getWindow(idn);
                                        if (destinationWin && !destinationWin.destroyed) {
                                            destinationWin.destroy();
                                        }
                                        this.showPanel(data, 'background-color:yellow;', {
                                            showDuplicateButton : false,
                                            showEditButton      : true,
                                            showRemoveButton    : true
                                        });
                                    }
                                });
                                this.app.getDesktop().getWindow(this.winId).close();
                            }
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
                            value: panelWin.title
                        }
                    ]
                },
                {
                    xtype: 'htmleditor',
                    flex: 1,
                    id: this.notepadEditorId,
                    value: panelWin.items.items[0].getEl().dom.firstChild.innerHTML
                }
            ]
        });
        win.show();
        */
    },
    
    editPanel : function (callback) {
        var desktop = this.app.getDesktop();
        panelWin = desktop.getWindow(this.idn);
        win = desktop.createWindow({
            id: this.winId,
            title:window.xmlconfig.editnote || 'Редагувати запис',
            width:600,
            height:400,
            x: panelWin.x,
            y: panelWin.y,
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
                    text: window.xmlconfig.applychanges || 'Застосувати зміни',
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
                            value: panelWin.title
                        }
                    ]
                },
                {
                    xtype: 'htmleditor',
                    flex: 1,
                    id: this.notepadEditorId,
                    value: panelWin.items.items[0].getEl().dom.firstChild.innerHTML
                }
            ]
        });
        win.show();
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
            url: 'es.php',
            params: {
                id: this.idn,
                hashtag: window.xmlconfig.userid,
                text: this.ps(Ext.getCmp(this.notepadEditorId).getValue()),
                title:this.ps(Ext.getCmp(this.titleEditorId).getValue()),
                x:this.app.getDesktop().getWindow(this.winId).x,
                y:this.app.getDesktop().getWindow(this.winId).y
            },
            scope: this,
            success: function (response){
                this.destroyWindow(this.idn);
                /*
                var destinationWin = this.app.getDesktop().getWindow(this.idn);
                if (destinationWin && !destinationWin.destroyed) {
                    destinationWin.destroy();
                }
                */
                this.showData(data);
                /*
                this.showPanel(data, 'background-color:yellow;', {
                    showDuplicateButton : false,
                    showEditButton      : true,
                    showRemoveButton    : true
                });
                */
            }
        });
        this.app.getDesktop().getWindow(this.winId).close();
    },
    
    onDuplicateApplyChangesClick : function () {
        var data = this.cookData();
        /*
        var data = {
            title : this.ps(Ext.getCmp(this.titleEditorId).getValue()),
            x     : this.app.getDesktop().getWindow(this.winId).x,
            y     : this.app.getDesktop().getWindow(this.winId).y,
            text  : this.ps(Ext.getCmp(this.notepadEditorId).getValue())
        };
        */
        this.write(Ext.apply(data, {hashtag: window.xmlconfig.userid}));
        this.write(data);
        Ext.Ajax.request({
            url: 'as.php',
            /*
            params: {
                hashtag: window.xmlconfig.userid,
                text: this.ps(Ext.getCmp(this.notepadEditorId).getValue()),
                title:this.ps(Ext.getCmp(this.titleEditorId).getValue()),
                x:this.app.getDesktop().getWindow(this.winId).x,
                y:this.app.getDesktop().getWindow(this.winId).y
            },
            */
            params: Ext.apply(data, {
                hashtag: window.xmlconfig.userid
            }),
            scope: this,
            success: function (response){
                data.id = response.responseText;
                this.showData(data);
                /*
                this.showPanel(data, 'background-color:yellow;', {
                    showDuplicateButton : false,
                    showEditButton      : true,
                    showRemoveButton    : true
                });
                */
            }
        });
        this.app.getDesktop().getWindow(this.winId).close();
    },
    
    remove : function (idn) {
        Ext.Msg.confirm(window.xmlconfig.removenotetitle || "Агов!", window.xmlconfig.removenotetext || "Чи Ви справді бажаєте видалити цей милий і прекрасний запис? Цю дію не можна скасувати.", function(button) {
            if (button === 'yes') {
                Ext.Ajax.request({
                    url: 'rs.php',
                    params: {
                        id: idn
                    },
                    scope: this,
                    success: function(response){
                        this.destroyWindow(idn);
                        /*
                        var destinationWin = this.app.getDesktop().getWindow(idn);
                        if (destinationWin && !destinationWin.destroyed) {
                            destinationWin.destroy();
                        }
                        */
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
