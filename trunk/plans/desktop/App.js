Ext.define('MyDesktop.App', {
    extend: 'Ext.ux.desktop.App',
    requires: 
        ['Ext.window.MessageBox',
        'Ext.form.Panel',
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
            new MyDesktop.Notepad()
        ];
    },
    
    getDesktopConfig:function () {
        var me = this,ret = me.callParent();
        return Ext.apply(ret,
            {
                contextMenuItems: [
                    {
                        text:window.changesettings || 'Змінити налаштування',
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
            title:window.username,
            iconCls:'user',
            height:300,
            toolConfig:{
                width:120,items:[
                    {
                        text:window.settings || 'Налаштування',
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
                    name:window.addnote || 'Додати запис',
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
    
    updateUserLanguage : function () {
        if (window.languagesHash[window.currentLanguage] === 'present') {
            
        } else {
            if (window.languagesArray.length > 0) {
                this.write(["I'm sorry, but language ", window.currentLanguage, "isn't present in configured languages collection. Try to configure it or don't use browser which has not configured language"].join(''));
                window.currentLanguage = window.languagesArray[0];
            } else {
                this.write("I'm sorry, but configured languages collection is empty. Try to configure it and add some languages nodes");
                delete window.currentLanguage;
                return;
            }
        }
        Ext.Ajax.request({
            url: window.currentLanguage + '.xml',
            params: {
                
            },
            success: Ext.bind(function(response) {
                if (response && response.responseXML && response.responseXML.childNodes) {
                    var root = response.responseXML.childNodes[Ext.isIE ? 1 : 0];
                    if (root && root.nodeName === 'root') {
                        var currentNode = Ext.isIE ? root.firstChild : root.firstElementChild;
                        while (currentNode) {
                            window[currentNode.nodeName] = Ext.isIE ? currentNode.text : currentNode.textContent;
                            currentNode = Ext.isIE ? currentNode.nextSibling : currentNode.nextElementSibling;
                        }
                    }
                }

                MyReader = {
                    read : function (xhr) {
                        var result = Ext.decode(xhr.responseText);
                        window.userLogged = result.success;
                        if (result.success) {
                            window.username = result.username;
                            window.userid = result.userid;
                            window.resultMessage = result.message;
                            //window.currentLanguage = result.language || 'en';
                        }
                        return {
                            success : result.success,
                            records: []
                        }
                    }
                };
    
                window.regForm = Ext.create('Ext.window.Window', {
                    title: (window.regformtitle || 'Реєстраційна форма'),//
                    width: 350,

                    hidden: true,

                    closable: false,
                    border: false,
                    layout:'fit',
                    items: {
                        xtype: 'form',
                        bodyCls: 'x-window-body-default',
                        // Fields will be arranged vertically, stretched to full width
                        bodyPadding: 5,
                        // The form will submit an AJAX request to this URL when submitted
                        url: 'signup.php',
                        
                        layout: 'anchor',
                        defaults: {
                            anchor: '100%'
                        },
                        errorReader : MyReader,

                        // The fields
                        defaultType: 'textfield',
                        fieldDefaults: {
                            labelWidth: 130,
                            msgTarget : 'side'
                        },
                        items: [{
                            fieldLabel: (window.usernamelabel || 'Юзернейм'),
                            name: 'username',
                            allowBlank: false
                        },{
                            fieldLabel: (window.passwordlabel || 'Пароль'),
                            name: 'password',
                            inputType: 'password',
                            allowBlank: false
                        },{
                            fieldLabel: (window.passverlabel || 'Пароль(перевірка)'),
                            name: 'passverif',
                            inputType: 'password',
                            allowBlank: false
                        },{
                            fieldLabel: (window.emaillabel || 'Електронна пошта'),
                            name: 'email',
                            vtype: 'email',
                            allowBlank: false
                        }],

                        // Reset and Submit buttons
                        buttons: [{
                            text: (window.resetlabel || 'Очистити'),
                            handler: function() {
                                this.up('form').getForm().reset();
                            }
                        }, {
                            text: (window.signuplabel || 'Зареєструватися'),
                            formBind: true, //only enabled once the form is valid
                            disabled: true,
                            handler: function() {
                                var form = this.up('form').getForm();
                                if (form.isValid()) {
                                    form.submit({
                                        params: {
                                            language: window.currentLanguage
                                        },
                                    
                                        success: function(form, action) {
                                            regForm.hide();
                                            Ext.Msg.alert((window.successtitle || 'Success'), window.resultMessage, function() {loginForm.show()}, loginForm);
                                        },
                                        failure: function(form, action) {
                                            Ext.Msg.alert((window.failedtitle || 'Failed'), window.resultMessage);
                                        }
                                    });
                                }
                            }
                        }]
                    },
                    renderTo: Ext.getBody()
                });


                window.loginForm = Ext.create('Ext.window.Window', {
                    title: (window.logformtitle || 'Форма логування'),//
                    width: 200,

                    hidden: true,
                    closable: false,
                    border: false,
                    layout:'fit',

                    items: {
                        xtype: 'form',
                        bodyCls : 'x-window-body-default',
                        bodyPadding: 5,
                        // The form will submit an AJAX request to this URL when submitted
                        url: 'login.php',
                        // Fields will be arranged vertically, stretched to full width
                        layout: 'anchor',
                        defaults: {
                            anchor: '100%'
                        },
                        errorReader : MyReader,

                        defaultType: 'textfield',
                        fieldDefaults: {
                            labelWidth: 80,
                            msgTarget : 'side'
                        },
                        items: [{
                            fieldLabel: (window.usernamelabel || 'Юзернейм'),
                            name: 'username',
                            allowBlank: false
                        },{
                            fieldLabel: (window.passwordlabel || 'Пароль'),
                            name: 'password',
                            inputType: 'password',
                            allowBlank: false
                        }],
                        // Reset and Submit buttons
                        buttons: [{
                            text: (window.reglabel || 'Зареєструватися'),
                            handler: function() {
                                loginForm.hide();
                                regForm.show();
                                //alert(window.alertmessage2 || 'поглянь тепер на форму для логування');//this.up('form').getForm().reset();
                            }
                        }, {
                            text: (window.loglabel || 'Login'),
                            formBind: true, //only enabled once the form is valid
                            disabled: true,
                            handler: function() {
                                var form = this.up('form').getForm();
                                if (form.isValid()) {
                                    form.submit({
                                        params: {
                                            language: window.currentLanguage
                                        },
                                        success: function(form, action) {
                                            loginForm.hide();
                                            Ext.Msg.alert((window.successtitle || 'Success'), window.resultMessage);
                                            myDesktopApp.init();
                                        },
                                        failure: function(form, action) {
                                            Ext.Msg.alert((window.failedtitle || 'Failed'), window.resultMessage);
                                        }
                                    });
                                }
                            }
                        }],
                    },
                    renderTo: Ext.getBody()
                });
        
                if (window.userLogged) {
                    myDesktopApp.init();
                } else {
                    window.loginForm.show();
                }
            })
        });
    },
        
    beforeinit : function () {
        window.settingsLoaded = false;
        window.userLoaded = false;
        Ext.getBody().setStyle({
            backgroundImage: 'url(wallpapers/isus-wallpaper.jpg)'
        });
        Ext.Ajax.request({
            url: 'settings.xml',
            params: {
                
            },
            success: Ext.bind(function(response){
                window.languagesArray = [];
                window.languagesHash = {};
                if (response && response.responseXML && response.responseXML.childNodes) {
                    var root = response.responseXML.childNodes[Ext.isIE ? 1 : 0];
                    if (root && root.nodeName === 'root') {
                        var languages = Ext.isIE ? root.firstChild : root.firstElementChild;
                        if (languages && languages.nodeName === 'languages') {
                            currentLanguageNode = Ext.isIE ? languages.firstChild : languages.firstElementChild;
                            while (currentLanguageNode) {
                                window.languagesArray.push(currentLanguageNode.nodeName);
                                window.languagesHash[currentLanguageNode.nodeName] = 'present';
                                currentLanguageNode = Ext.isIE ? currentLanguageNode.nextSibling : currentLanguageNode.nextElementSibling;
                            }
                        }
                    }
                }
                window.settingsLoaded = true;

                if (window.userLoaded) {
                    myDesktopApp.updateUserLanguage();
                }
            }, this)
        });
        
        Ext.Ajax.request({
            url: 'cl.php',
            params: {
                
            },
            success: Ext.bind(function(response){
                var text = response.responseText;
                try{
                var decodedText = Ext.decode(text)
                }
                catch (e) {
                    alert((window.alertmessage1 || 'Error during decoding text:') + '\n' + text);
                }
                window.userLoaded = true;
                window.userLogged = decodedText.success;
                window.currentLanguage = (window.navigator.systemLanguage || window.navigator.userLanguage || window.navigator.language || 'en').substr(0, 2);
                if (decodedText.success) {
                    window.username = decodedText.username;
                    window.userid = decodedText.userid;
                    //window.currentLanguage = decodedText.language || 'en';
                    
                    //alert((window.successtitle || 'success: ') + decodedText.message + '; user = ' + decodedText.username);
                } else {
                    //alert((window.successtitle || 'success: ') + decodedText.message);
                    //window.currentLanguage = (window.navigator.systemLanguage || window.navigator.userLanguage || window.navigator.language || 'en').substr(0, 2);
                    
                }
                if (window.settingsLoaded) {
                    myDesktopApp.updateUserLanguage();
                }
            }, this)
        });

    },
    
    init : function () {
        this.callParent(arguments);
        Ext.Msg.buttonText.yes = window.yes || 'Так';
        Ext.Msg.buttonText.no = window.no || 'Ні';
        
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
                    alert((window.alertmessage1 || 'Error during decoding text:') + '\n' + text);
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
                    alert((window.alertmessage1 || 'Error during decoding text:') + '\n' + text);
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