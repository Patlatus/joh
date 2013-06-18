Ext.define('MyDesktop.App', {
    extend: 'Ext.ux.desktop.App',
    requires: 
        ['Ext.window.MessageBox',
        'Ext.ux.desktop.ShortcutModel',
        'Ext.ux.desktop.Desktop',
        'MyDesktop.SystemStatus',
        'MyDesktop.VideoWindow',
        'MyDesktop.MatchesWindow',
        'MyDesktop.AboutTextWindow',
        'MyDesktop.Notepad',
        'MyDesktop.Settings'],
    getModules : function(){
        return [
            new MyDesktop.Notepad()];
    },
    
    getDesktopConfig:function () {
        var me = this,ret = me.callParent();
        return Ext.apply(ret,
            {
                contextMenuItems: [
                    {
                        text:'Змінити налаштування',
                        handler:me.onSettings,
                        scope:me
                    }
                ],
                shortcuts:Ext.create('Ext.data.Store',{
                    model:'Ext.ux.desktop.ShortcutModel',
                    data: []
                }),
                wallpaper: 'wallpapers/isus-wallpaper.jpg',
                wallpaperStretch:false
            }
        );
    },
    
    getStartConfig :function() {
        var me = this,ret = me.callParent();
        return Ext.apply(ret, {
            title:'Адмін',
            iconCls:'user',
            height:300,
            toolConfig:{
                width:120,items:[
                    {
                        text:'Налаштування',
                        iconCls:'settings',
                        handler:me.onSettings,
                        scope:me
                    },
                    '-',
                    {
                        text:(window.logoutlabel || 'Вийти'),
                        iconCls:'logout',
                        handler:me.onLogout,
                        scope:me
                    }
                ]
            }
        });
    },
    
    getTaskbarConfig:function () {
        var ret = this.callParent();
        return Ext.apply(ret, {
            quickStart:[
                {
                    name:'Додати запис',
                    iconCls:'notepad',
                    module:'notepad'
                }
            ],
            trayItems:[
                { 
                    xtype:'trayclock',
                    flex:1
                }
            ]
        });
    },
    
    write : function (text) {
        if (window.console) {
            console.log(text);
        }
    },
    
    init : function () {
        this.callParent(arguments);
        Ext.Msg.buttonText.yes = 'Так';
        Ext.Msg.buttonText.no = 'Ні';
        
        var dt = new Date();
        var x = Ext.Date.format(dt, 'Y-m-d');
            
            
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
            url: 'gn.php',
            params: {
                hashtag: window.userid
            },
            success: Ext.bind(function(response){
                var text = response.responseText;
                try{
                var decodedText = Ext.decode(text)
                }
                catch (e) {
                    alert('Error during decoding text:\n' + text);
                }
                this.write('text:\n'+text);
                this.write('decodedText:\n'+decodedText);
                xStore.loadData(decodedText);
                
                for (var i = 0; i < xStore.data.items.length; i++) {
                    var data = xStore.data.items[i].data;
                    if (data.x === null || data.x === undefined) {
                        data.x = 0;
                    }
                    if (data.y === null || data.y === undefined) {
                        data.y = i * 50;
                    }
                    this.getModule("notepad").showPanel(data, 'background-color:yellow;', {
                        showDuplicateButton : false,
                        showEditButton      : true,
                        showRemoveButton    : true
                    });
                }
            }, this)
        });
        Ext.Ajax.request({
            url: 'gn.php',
            params: {
                hashtag: 'default'
            },
            success: Ext.bind(function(response){
                var text = response.responseText;
                try {
                    var decodedText = Ext.decode(text)
                }
                catch (e) {
                    alert('Error during decoding text:\n' + text);
                }
                this.write('text:\n' + text);
                this.write('decodedText:\n' + decodedText);
                xStore.loadData(decodedText);
               
                
                for (var i = 0; i < xStore.data.items.length; i++) {
                    var data = xStore.data.items[i].data;
                    if (data.x === null || data.x === undefined) {
                        data.x = 200;
                    }
                    if (data.y === null || data.y === undefined) {
                        data.y = i * 100;
                    }
                    this.getModule("notepad").showPanel(data, 'background-color:00ff00;', {
                        showDuplicateButton : true,
                        showEditButton      : false,
                        showRemoveButton    : false
                    });
                }
            }, this)
        });
    },
    
    onSettings:function () {
        var dlg = new MyDesktop.Settings({
            desktop:this.desktop
        });
        dlg.show();
    },
    
    onLogout : function () {
        Ext.Ajax.request({
            url: 'lo.php',
            params: {
                
            },
            success: Ext.bind(function(response){
                myDesktopApp.shutdown();
                loginForm.show();
            })
        });
    }
});