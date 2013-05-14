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
        return [/*new MyDesktop.MatchesWindow(),
            new MyDesktop.AboutTextWindow(),
            new MyDesktop.VideoWindow(),
            new MyDesktop.SystemStatus(),*/
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
                    data: [/*{ name:'Matches Game',iconCls:'matches-shortcut',module:'matches-win' },
                        { name:'About text',iconCls:'abouttext-shortcut',module:'abouttext-win' },
                        { name:'About video',iconCls:'video-shortcut',module:'video' },
                        { name:'Notepad',iconCls:'notepad-shortcut',module:'notepad' },
                        { name:'System Status',iconCls:'cpu-shortcut',module:'systemstatus'}*/]
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
                        text:'Вийти',
                        disabled:true,
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
            quickStart:[/*{
                name:'Matches Game',
                iconCls:'icon-matches',
                module:'matches-win'
            },
            {
            name:'About video',
            iconCls:'icon-video',
            module:'video'}
            */
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
            //model: 'User',
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
        //xStore.load();
        
        Ext.Ajax.request({
            url: 'gn.php',
            params: {
                hashtag: 0
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
                        /*var ww = this.desktop.createWindow({
                        id:data.id,
                        title:data.title,
                        x:data.x,
                        y:data.y,
                        iconCls:null,
                        animCollapse:false,
                        constrainHeader:true,
                        layout:'fit',
                        tools:[{
                            type:'plus',
                            tooltip: 'Редагувати',
                            // hidden:true,
                            scope:this,
                            handler: function(event, toolEl, panel){
                                alert(this.$className);
                                this.getModule("notepad").edit(panel.ownerCt.id);// refresh logic
                            }
                        },
                        {
                            type:'minus',
                            tooltip: 'Видалити',
                            scope:this,
                            handler: function(event, toolEl, panel){
                                alert(this.$className);
                                this.getModule("notepad").remove(panel.ownerCt.id);// show help here
                            }
                        }],
                        items:{

                            bodyStyle: 'background-color:yellow;',
                            html:xStore.data.items[i].data.text,
                            autoScroll:true
                        }
                    });
                    ww.show();*/
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
                try{
                var decodedText = Ext.decode(text)
                }
                catch (e) {
                    alert('Error during decoding text:\n' + text);
                }
                this.write('text:\n'+text);
                this.write('decodedText:\n'+decodedText);
                xStore.loadData(decodedText);
                //xStore.data = text;//Ext.data.reader.Reader.prototype.readRecords(text);
                //xStore.data = xStore.proxy.reader.readRecords(text);
               
                
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
                    /*var ww = this.desktop.createWindow({
                        id:data.id,
                        title:data.title,
                        x:data.x,
                        y:data.y,
                        iconCls:null,
                        animCollapse:false,
                        constrainHeader:true,
                        layout:'fit',
                        tools:[{
                            type:'plus',
                            tooltip: 'Редагувати',
                            // hidden:true,
                            handler: function(event, toolEl, panel){
                                // refresh logic
                            }
                        },
                        {
                            type:'minus',
                            tooltip: 'Видалити',
                            handler: function(event, toolEl, panel){
                                // show help here
                            }
                        }],
                        items:{

                            bodyStyle: 'background-color:00ff00;',
                            html:xStore.data.items[i].data.text,
                            autoScroll:true
                        }
                    });
                    ww.show();*/
                }
            }, this)
        });
        data = {
            id    : 'usefullinks',
            title : 'Корисні лінки',
            x     : 0,
            y     : 0,
            text  : '<a href="http://www.liturgia.alfaomega.org.ua/index.php" target="_blank">Римокатолицьке Євангеліє на кожен день</a><br/>'+
                '<a href="http://dyvensvit.org/bible-daily/' + x + '/" target="_blank">Грекокатолицьке Євангеліє на кожен день</a><br/>'+
                '<a href="http://www.lopbible.narod.ru/index.htm" target="_blank">Тлумачна Біблія Лопухіна</a><br/>'+
                '<a href="http://forum.ugcc.org.ua/" target="_blank" "="">Форум УГКЦ</a><br><a href="http://www.bibliya.in.ua/" target="_blank">Святе Письмо онлайн</a><br><a href="http://ecumenicalcalendar.org.ua/" target="_blank">Християнський Календар</a><br><a href="http://catechismus.org.ua/" target="_blank">Катехизм Католицької Церкви</a>'
        };
        this.getModule("notepad").showPanel(data, 'background-color:00ffc0;');
		data = {
            id    : 'mail',
            title : 'Пошта',
            x     : 257,
            y     : 0,
            text  : '<a href="http://freemail.ukr.net" target="_blank">ukr.net</a><br><a href="https://accounts.google.com" target="_blank">Gmail</a><br><a href="http://mail.yahoo.com" target="_blank">Yahoo</a><br><a href="http://www.i.ua/" target="_blank">i.ua</a><br><a href="http://mail.ru/" target="_blank">Mail.ru</a>'
        };
		this.getModule("notepad").showPanel(data, 'background-color:c0ff00;');
		
        /*var ww = this.desktop.createWindow({
            id:'xxx',
            title:'Корисні лінки',
            x:0,
            y:0,
            iconCls:null,
            animCollapse:false,
            constrainHeader:true,
            layout:'fit',
            items:{

                bodyStyle: 'background-color:yellow;',
                html:'<a href="http://www.liturgia.alfaomega.org.ua/index.php" target="_blank">Римокатолицьке Євангеліє на кожен день</a><br/>'+
                '<a href="http://dyvensvit.org/bible-daily/' + x + '/" target="_blank">Грекокатолицьке Євангеліє на кожен день</a><br/>'+
                '<a href="http://www.lopbible.narod.ru/index.htm" target="_blank">Тлумачна Біблія Лопухіна</a>',
                autoScroll:true
            }
        });
        ww.show();*/

    },
    
    onSettings:function () {
        var dlg = new MyDesktop.Settings({
            desktop:this.desktop
        });
        dlg.show();
    }
});