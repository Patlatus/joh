Ext.define('MyDesktop.App', {
    extend: 'Ext.ux.desktop.App',
    requires: 
        ['Ext.window.MessageBox',
        'Ext.form.Panel',
        'Ext.data.reader.Json',
        'Ext.form.field.Checkbox',
        'Ext.data.Store',
        'Ext.ux.desktop.ShortcutModel',
        'Ext.ux.desktop.Desktop',
        'MyDesktop.SystemStatus',
        'MyDesktop.VideoWindow',
        'MyDesktop.AboutTextWindow',
        'MyDesktop.AddNote',
        'MyDesktop.SimpleReader',
        'MyDesktop.RegistrationForm',
        'MyDesktop.LoginForm',
        'MyDesktop.Settings'],
        
    getDefaultModules : function() {
        return [
            new MyDesktop.AddNote()
        ];
    },
    

    getCustomModules : function() {
        var translations = {
            'stickers' : 'MyDesktop.AddNote',
            'addnote' : 'MyDesktop.AddNote'
        };
        var modules = [];
        for (var i = 0; i < window.xmlconfig.modulesArray.length; i++) {
            var moduleName = window.xmlconfig.modulesArray[i];
            if (!moduleName) {
                this.write('Empty custom module name');
                continue;
            }
            var parentModuleName = window.xmlconfig.modulesHash[moduleName].parent
            if (!parentModuleName) {
                this.write('Empty parent of custom module name for module ' + moduleName);
                continue;
            }
            var translatedClassName = translations[parentModuleName];
            if (!translatedClassName) {
                this.write('Unknown parent parent ' + parentModuleName + ' of custom module name for module ' + moduleName);
                continue;
            }
            /*var bigtitle = this.resolveReference(window.xmlconfig.modulesHash[moduleName], 'bigtitlereference', moduleName);
            var shorttitle = this.resolveReference(window.xmlconfig.modulesHash[moduleName], 'shorttitlereference', moduleName);
            var deftitle = this.resolveReference(window.xmlconfig.modulesHash[moduleName], 'defaulttitlereference', moduleName);
            var deftext = this.resolveReference(window.xmlconfig.modulesHash[moduleName], 'defaulttextreference', moduleName);*/
            
            /*var bigtitlereference = window.xmlconfig.modulesHash[moduleName].bigtitlereference;
            if (!bigtitlereference) {
                this.write('Empty bigtitlereference of custom module name for module ' + moduleName);
            }
            var shorttitlereference = window.xmlconfig.modulesHash[moduleName].shorttitlereference;
            if (!shorttitlereference) {
                this.write('Empty shorttitlereference of custom module name for module ' + moduleName);
            }
            var bigtitle = window.xmlconfig[bigtitlereference];
            if (!bigtitle) {
                this.write('Empty bigtitle of custom module name for module ' + moduleName + ' in current language ' + window.xmlconfig.currentLanguage);
            }
            var shorttitle = window.xmlconfig[shorttitlereference];
            if (!shorttitle) {
                this.write('Empty shorttitle of custom module name for module ' + moduleName + ' in current language ' + window.xmlconfig.currentLanguage);
            }*/
                
            modules.push(Ext.create(translatedClassName, Ext.ClassManager.get(translatedClassName).prepareConfig(moduleName, window.xmlconfig.modulesHash[moduleName])/* {
                'winId' : moduleName,
                'moduleId' : moduleName,
                'titleEditorId' : moduleName + '||title-editor',
                'notepadEditorId' : moduleName + '||notepad-editor',
                'buttonTextAndWindowTitle' : bigtitle,
                'shortCaption' : shorttitle,
                'defaultTitle' : deftitle,
                'defaultText' : deftext
            }*/));
        }
        return modules;
    },
    
    getModules : function() {
        return this.getDefaultModules().concat(this.getCustomModules());
    },
    
    getDesktopConfig:function () {
        var me = this,ret = me.callParent();
        return Ext.apply(ret, {
            contextMenuItems: [{
                text:window.xmlconfig.changesettings || 'Змінити налаштування',
                handler:me.onSettings,
                scope:me
            }],

            wallpaper: 'wallpapers/isus-wallpaper.jpg',
            wallpaperStretch:false
        });
    },
    
    getStartConfig :function() {
        var me  = this,
            ret = me.callParent();
        return Ext.apply(ret, {
            title: window.xmlconfig.username,
            iconCls: 'user',
            height: 300,
            toolConfig: {
                width: 120,
                items: [{
                    text:window.xmlconfig.settings || 'Налаштування',
                    iconCls:'settings',
                    handler:me.onSettings,
                    scope:me
                },
                '-',
                {
                    text:(window.xmlconfig.logoutlabel || 'Вийти'),
                    iconCls:'logout',
                    disabled : !window.xmlconfig.lsEnabled,
                    handler:me.onLogout,
                    scope:me
                }]
            }
        });
    },
    
    getTaskbarConfig:function () {
        var ret = this.callParent();
        return Ext.apply(ret, {
            trayItems:[{ 
                xtype:'trayclock',
                flex:1
            }]
        });
    },
    
    write : function (text) {
        if (window.console) {
            console.log(text);
        }
    },
    
    getQueryVariable : function (variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        } 
        return null;
    },

    updateUserLanguage : function () {
        if (window.xmlconfig.languagesHash[window.xmlconfig.currentLanguage] === 'present') {
            
        } else {
            if (window.xmlconfig.languagesArray.length > 0) {
                this.write(["I'm sorry, but language '", window.xmlconfig.currentLanguage, "' isn't present in configured languages collection. Try to configure it or don't use browser which has not configured language"].join(''));
                window.xmlconfig.currentLanguage = window.xmlconfig.languagesArray[0];
            } else {
                this.write("I'm sorry, but configured languages collection is empty. Try to configure it and add some languages nodes");
                delete window.xmlconfig.currentLanguage;
                return;
            }
        }
        Ext.Ajax.request({
            url: window.xmlconfig.currentLanguage + '.xml',
            params: {
                
            },
            success: Ext.bind(function(response) {
                if (response && response.responseXML && response.responseXML.childNodes) {
                    var root = response.responseXML.childNodes[Ext.isIE ? 1 : 0];
                    if (root && root.nodeName === 'root') {
                        var currentNode = Ext.isIE ? root.firstChild : root.firstElementChild;
                        while (currentNode) {
                            window.xmlconfig[currentNode.nodeName] = Ext.isIE ? currentNode.text : currentNode.textContent;
                            currentNode = Ext.isIE ? currentNode.nextSibling : currentNode.nextElementSibling;
                        }
                    }
                }
                if (!window.xmlconfig.lsEnabled) {
                    myDesktopApp.init();
                    return;
                }
                if (window.xmlconfig.guestmode) {
                    window.xmlconfig.username = window.xmlconfig['guestmodetitle'] || 'Guest mode';
                }
                if (window.xmlconfig.doctitle) {
                    document.title = window.xmlconfig.doctitle;
                }
                var isInitialized = window.xmlconfig.regForm && window.xmlconfig.loginForm;
                if (!isInitialized) {
                    window.xmlconfig.regForm = MyDesktop.RegistrationForm;
                    window.xmlconfig.regForm.update();
                    window.xmlconfig.regForm.render(Ext.getBody());
                    
                    window.xmlconfig.loginForm = MyDesktop.LoginForm;
                    window.xmlconfig.loginForm.update();
                    window.xmlconfig.loginForm.render(Ext.getBody());
                    if (window.xmlconfig.userLogged || (window.xmlconfig.guestmodeallowed && window.xmlconfig.guestmode)) {
                        myDesktopApp.init();
                    } else {
                        window.xmlconfig.loginForm.show();
                    }
                } else {
                    window.xmlconfig.regForm.update();
                    window.xmlconfig.loginForm.update();
                }
            }, this)
        });
    },
        
    readAllChildrenFromXMLNode : function (node, hash, array, presenthash) {
        currentNode = Ext.isIE ? node.firstChild : node.firstElementChild;
        while (currentNode) {
            array.push(currentNode.nodeName);
            if (presenthash) {
                presenthash[currentNode.nodeName] = 'present';
            }
            hash[currentNode.nodeName] = Ext.isIE ? currentNode.text : currentNode.textContent;
            currentNode = Ext.isIE ? currentNode.nextSibling : currentNode.nextElementSibling;
        }
    },
    
    beforeinit : function () {
        window.xmlconfig.settingsLoaded = false;
        window.xmlconfig.userLoaded = false;
        window.xmlconfig.WallpaperManager = {
            setWallpaper : function (url) {
                Ext.getBody().setStyle({
                    backgroundImage: ['url(',url,')'].join('')
                });
            }
        };
        window.xmlconfig.WallpaperManager.setWallpaper('wallpapers/isus-wallpaper.jpg');
        Ext.Ajax.request({
            url: 'settings.xml',
            params: {
                
            },
            success: Ext.bind(function(response){
                window.xmlconfig.languagesArray = [];
                window.xmlconfig.languagesHash = {};
                window.xmlconfig.languagesNames = {};
                if (response && !response.responseXML) {
                    this.write('Broken or missing settings.xml alert!');
                }
                if (response && response.responseXML && response.responseXML.childNodes) {
                    window.xmlconfig.lsEnabled = true;
                    window.xmlconfig.guestmodeallowed = false;
                    window.xmlconfig.guestmode = false;
                    window.xmlconfig.appsArray = [];
                    window.xmlconfig.appsHash = {};
                    window.xmlconfig.stickersEnabled = true;
                    window.xmlconfig.modulesArray = [];
                    window.xmlconfig.modulesHash = {};
                    
                    var languages = response.responseXML.getElementsByTagName("languages")[0];
                    if (languages && languages.nodeName === 'languages') {
                        this.readAllChildrenFromXMLNode(languages, window.xmlconfig.languagesNames, window.xmlconfig.languagesArray, window.xmlconfig.languagesHash);
                        /*currentLanguageNode = Ext.isIE ? languages.firstChild : languages.firstElementChild;
                        while (currentLanguageNode) {
                            window.xmlconfig.languagesArray.push(currentLanguageNode.nodeName);
                            window.xmlconfig.languagesHash[currentLanguageNode.nodeName] = 'present';
                            window.xmlconfig.languagesNames[currentLanguageNode.nodeName] = Ext.isIE ? currentLanguageNode.text : currentLanguageNode.textContent;
                            currentLanguageNode = Ext.isIE ? currentLanguageNode.nextSibling : currentLanguageNode.nextElementSibling;
                        }*/
                    }
                    var loginsignup = response.responseXML.getElementsByTagName("loginsignup")[0];
                    
                    if (loginsignup && loginsignup.nodeName === "loginsignup") {
                        var lsValue = (Ext.isIE ? loginsignup.text : loginsignup.textContent)
                        window.xmlconfig.lsEnabled = (lsValue === 'on' || lsValue === 'yes');
                    }
                    var allowguestmode = response.responseXML.getElementsByTagName("allowguestmode")[0];
                    
                    if (allowguestmode && allowguestmode.nodeName === "allowguestmode") {
                        var gmaValue = (Ext.isIE ? allowguestmode.text : allowguestmode.textContent)
                        window.xmlconfig.guestmodeallowed = (gmaValue === 'on' || gmaValue === 'yes');
                    }
                    
                    
                    var apps = response.responseXML.getElementsByTagName("apps")[0];
                    
                    if (apps && apps.nodeName === "apps") {
                        currentAppNode = Ext.isIE ? apps.firstChild : apps.firstElementChild;
                        while (currentAppNode) {
                            window.xmlconfig.appsArray.push(currentAppNode.nodeName);
                            window.xmlconfig.appsHash[currentAppNode.nodeName] = Ext.isIE ? currentAppNode.text : currentAppNode.textContent;
                            currentAppNode = Ext.isIE ? currentAppNode.nextSibling : currentAppNode.nextElementSibling;
                        }
                        var stickersValue = window.xmlconfig.appsHash['stickers'];
                        window.xmlconfig.stickersEnabled = (stickersValue === 'on' || stickersValue === 'yes');
                    }
                    var modules = response.responseXML.getElementsByTagName("modules")[0];

                    if (modules && modules.nodeName === 'modules') {
                        currentModuleNode = Ext.isIE ? modules.firstChild : modules.firstElementChild;
                        while (currentModuleNode) {
                            window.xmlconfig.modulesArray.push(currentModuleNode.nodeName);
                            window.xmlconfig.modulesHash[currentModuleNode.nodeName] = {'status':'present'};
                            window.xmlconfig.modulesHash[currentModuleNode.nodeName].propertiesArray = [];
                            this.readAllChildrenFromXMLNode(currentModuleNode, window.xmlconfig.modulesHash[currentModuleNode.nodeName], window.xmlconfig.modulesHash[currentModuleNode.nodeName].propertiesArray);
                            /*var parentModule = currentModuleNode.getElementsByTagName("parent")[0];
                            if (parentModule && parentModule.nodeName === "parent") {
                                window.xmlconfig.modulesHash[currentModuleNode.nodeName].parent = (Ext.isIE ? parentModule.text : parentModule.textContent)
                            }
                            var bigtitlereference = currentModuleNode.getElementsByTagName("bigtitlereference")[0];
                            if (bigtitlereference && bigtitlereference.nodeName === "bigtitlereference") {
                                window.xmlconfig.modulesHash[currentModuleNode.nodeName].bigtitlereference = (Ext.isIE ? bigtitlereference.text : bigtitlereference.textContent)
                            }
                            var shorttitlereference = currentModuleNode.getElementsByTagName("shorttitlereference")[0];
                            if (shorttitlereference && shorttitlereference.nodeName === "shorttitlereference") {
                                window.xmlconfig.modulesHash[currentModuleNode.nodeName].shorttitlereference = (Ext.isIE ? shorttitlereference.text : shorttitlereference.textContent)
                            }*/
                            currentModuleNode = Ext.isIE ? currentModuleNode.nextSibling : currentModuleNode.nextElementSibling;
                        }
                    }
                }
                window.xmlconfig.currentLanguage = (window.navigator.userLanguage || window.navigator.systemLanguage || window.navigator.language || 'en').substr(0, 2);
                if (window.xmlconfig.guestmodeallowed) {
                    var gValue = this.getQueryVariable('guest');
                    if (gValue === 'true' || gValue === 'on' || gValue === 'yes') {
                        window.xmlconfig.guestmode = true;
                    }
                }
                if (window.xmlconfig.lsEnabled && !window.xmlconfig.guestmode) {
                    Ext.Ajax.request({
                        url: 'cl.php',
                        params: {
                            
                        },
                        success: Ext.bind(function(response){
                            var text = response.responseText;
                            var decodedText = {};
                            try{
                                decodedText = Ext.decode(text)
                            }
                            catch (e) {
                                alert((window.xmlconfig.alertmessage1 || 'Error during decoding text:') + '\n' + text);
                            }
                            window.xmlconfig.userLoaded = true;
                            window.xmlconfig.userLogged = decodedText.success;
                            
                            if (decodedText.success) {
                                window.xmlconfig.username = decodedText.username;
                                window.xmlconfig.userid = decodedText.userid;
                            }
                            if (window.xmlconfig.settingsLoaded) {
                                myDesktopApp.updateUserLanguage();
                            }
                        }, this)
                    });
                } else {
                    window.xmlconfig.userLoaded = true;
                }
                window.xmlconfig.settingsLoaded = true;

                if (window.xmlconfig.userLoaded) {
                    myDesktopApp.updateUserLanguage();
                }
            }, this)
        });
        
        
    },
    
    init : function () {
        this.callParent(arguments);
        Ext.Msg.buttonText.yes = window.xmlconfig.yes || 'Так';
        Ext.Msg.buttonText.no = window.xmlconfig.no || 'Ні';
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
                window.xmlconfig.userLogged = false;
                myDesktopApp.shutdown();
                window.xmlconfig.loginForm.show();
            })
        });
    }
});