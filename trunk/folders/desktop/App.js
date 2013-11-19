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
        'MyDesktop.Folders',
        'MyDesktop.FolderDataLoader',
        'MyDesktop.AudioReader',
        'MyDesktop.TextReader',
        'MyDesktop.FilesDownloader',
        'MyDesktop.SimpleReader',
        'MyDesktop.RegistrationForm',
        'MyDesktop.LoginForm',
        'MyDesktop.Settings'],
        
    getDefaultModules : function() {
        var modulesToReturn = [];
        if (window.xmlconfig.stickersEnabled) {
            modulesToReturn.push(new MyDesktop.AddNote())
        }
        if (window.xmlconfig.foldersEnabled) {
            modulesToReturn.push(new MyDesktop.Folders())
        }
        if (window.xmlconfig.audioEnabled) {
            modulesToReturn.push(new MyDesktop.AudioReader())
        }
        if (window.xmlconfig.lyricsEnabled) {
            modulesToReturn.push(new MyDesktop.TextReader())
        }
        if (window.xmlconfig.filesDownloaderEnabled) {
            modulesToReturn.push(new MyDesktop.FilesDownloader())
        }
        return modulesToReturn;
    },
    
    getTranslations : function() {
        return {
            'stickers' : 'MyDesktop.AddNote',
            'addnote' : 'MyDesktop.AddNote',
            'folders' : 'MyDesktop.Folders'
        };
    },
    
    getCustomModules : function() {
        var translations = this.getTranslations();
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
                return decodeURI(pair[1]);
            }
        } 
        return null;
    },

    /*onFoldersDataLoaded : function () {
        this.write( 'onFoldersDataLoaded called' );
        if (window.xmlconfig.languageUpdated && !myDesktopApp.isReady) {
            if ((window.xmlconfig.userLogged || (window.xmlconfig.guestmodeallowed && window.xmlconfig.guestmode))) {
                myDesktopApp.init();
            } else {
                window.xmlconfig.loginForm.show();
            }
        }
    },*/
    
    preprocessCompleted : function () {
        this.write( 'preprocessCompleted called. Count = ' + window.xmlconfig.preprocesscount);
        window.xmlconfig.preprocesscount--;
        if (window.xmlconfig.preprocesscount < 1) {
            if (window.xmlconfig.languageUpdated && !myDesktopApp.isReady) {
                if ((window.xmlconfig.userLogged || (window.xmlconfig.guestmodeallowed && window.xmlconfig.guestmode))) {
                    myDesktopApp.init();
                } else {
                    window.xmlconfig.loginForm.show();
                }
            }
        }
    },
    
    updateUserLanguage : function () {
        this.write( 'updateUserLanguage called' );
        
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
                    window.xmlconfig.languageUpdated = true;
                    if (window.xmlconfig.preprocesscount === 0 && ((window.xmlconfig.foldersEnabled && window.xmlconfig.foldersDataLoaded) || !window.xmlconfig.foldersEnabled)) {
                        myDesktopApp.init();
                    }
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
                    window.xmlconfig.languageUpdated = true;
                    if (window.xmlconfig.userLogged || (window.xmlconfig.guestmodeallowed && window.xmlconfig.guestmode)) {
                        if (window.xmlconfig.preprocesscount === 0 && ((window.xmlconfig.foldersEnabled && window.xmlconfig.foldersDataLoaded) || !window.xmlconfig.foldersEnabled)) {
                            myDesktopApp.init();
                        }
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
    
    scheduleOpeningFolderForModule : function (moduleId, folderpath) {
        this.openingFoldersScheduled = this.openingFoldersScheduled || [];
        this.openingFoldersScheduled.push({'moduleId':moduleId,'folderpath':folderpath});
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
                    window.xmlconfig.foldersEnabled = true;
                    window.xmlconfig.audioEnabled = true;
                    window.xmlconfig.lyricsEnabled = true;
                    window.xmlconfig.filesDownloaderEnabled = true;
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
                        var foldersValue = window.xmlconfig.appsHash['folders'];
                        var audioValue = window.xmlconfig.appsHash['audio'];
                        var lyricsValue = window.xmlconfig.appsHash['lyrics'];
                        var fdValue = window.xmlconfig.appsHash['filesdownloader'];
                        if (Ext.isDefined(stickersValue)) {
                            window.xmlconfig.stickersEnabled = (stickersValue === 'on' || stickersValue === 'yes');
                        }
                        if (Ext.isDefined(foldersValue)) {
                            window.xmlconfig.foldersEnabled = (foldersValue === 'on' || foldersValue === 'yes');
                        }
                        if (Ext.isDefined(audioValue)) {
                            window.xmlconfig.audioEnabled = (audioValue === 'on' || audioValue === 'yes');
                        }
                        if (Ext.isDefined(fdValue)) {
                            window.xmlconfig.filesDownloaderEnabled = (fdValue === 'on' || fdValue === 'yes');
                        }
                        if (Ext.isDefined(lyricsValue)) {
                            window.xmlconfig.lyricsEnabled = (lyricsValue === 'on' || lyricsValue === 'yes');
                        }
                        
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
                var lValue = this.getQueryVariable('language');
                if (window.xmlconfig.languagesHash[lValue] === 'present') {
                    this.write('Set language to ' + lValue + ' by request parameter');
                    window.xmlconfig.currentLanguage = lValue;
                } else {
                    this.write('Invalid language set try to ' + lValue + ' by request parameter; not found in language hash');
                }


                window.xmlconfig.preprocesscount = 0;
                var translations = this.getTranslations();
                for (var i = 0; i < window.xmlconfig.modulesArray.length; i++) {
                    var moduleName = window.xmlconfig.modulesArray[i];
                    if (!moduleName) {
                        this.write('Preprocessing routine. Empty custom module name');
                        continue;
                    }
                    var parentModuleName = window.xmlconfig.modulesHash[moduleName].parent
                    if (!parentModuleName) {
                        this.write('Preprocessing routine. Empty parent of custom module name for module ' + moduleName);
                        continue;
                    }
                    var translatedClassName = translations[parentModuleName];
                    if (!translatedClassName) {
                        this.write('Preprocessing routine. Unknown parent parent ' + parentModuleName + ' of custom module name for module ' + moduleName);
                        continue;
                    }
                    if (!Ext.ClassManager.get(translatedClassName).requiresPreprocessing) {
                        this.write("Preprocessing routine. This module doesn't require preprocessing.");
                        continue;
                    }
                    window.xmlconfig.preprocesscount++;
                    Ext.ClassManager.get(translatedClassName).preprocess(moduleName, window.xmlconfig.modulesHash[moduleName], Ext.bind(this.preprocessCompleted, this));
                }
                
                if (window.xmlconfig.foldersEnabled) {
                    var fValue = this.getQueryVariable('folder');
                    this.write('fValue : ' + fValue);
                    if (fValue) {
                        fList = fValue.split('|');
                        this.write('fList : ' + fList);
                        if (fList.length > 0) {
                            this.write('fList[0] : ' + fList[0].toLowerCase());
                            
                            var found = false;
                            if (MyDesktop.Folders.basefolder === fList[0].toLowerCase()) {
                                found = true;
                                this.scheduleOpeningFolderForModule(MyDesktop.Folders.moduleId, fValue);
                            } else {
                                for (var i = 0; i < window.xmlconfig.modulesArray.length; i++) {
                                    var moduleName = window.xmlconfig.modulesArray[i];
                                    if (!moduleName) {
                                        this.write('Search for appropriate module routine. Empty custom module name');
                                        continue;
                                    }
                                    var parentModuleName = window.xmlconfig.modulesHash[moduleName].parent
                                    if (!parentModuleName) {
                                        this.write('Search for appropriate module routine. Empty parent of custom module name for module ' + moduleName);
                                        continue;
                                    }
                                    var translatedClassName = translations[parentModuleName];
                                    if (!translatedClassName) {
                                        this.write('Search for appropriate module routine. Unknown parent parent ' + parentModuleName + ' of custom module name for module ' + moduleName);
                                        continue;
                                    }
                                    if (parentModuleName != 'folders') {
                                        this.write('Search for appropriate module routine. Not folders module parent ' + parentModuleName + ' of custom module name for module ' + moduleName);
                                        continue;
                                    }
                                    if (window.xmlconfig.modulesHash[moduleName]['basefolder'] === fList[0].toLowerCase()) {
                                        found = true;
                                        this.scheduleOpeningFolderForModule(moduleName, fValue);
                                        break;
                                    }
                                }

                            }
                            if (!found) {
                                this.write('Search for appropriate module routine. Not found folders module for path ' + fValue);
                            }
                        }
                        window.xmlconfig.guestmode = true;
                    }
                }
                if (window.xmlconfig.foldersEnabled) {
                    window.xmlconfig.preprocesscount++;
                    //MyDesktop.FolderDataLoader.loadFoldersData(Ext.bind(this.onFoldersDataLoaded, this));
                    //MyDesktop.FolderDataLoader.loadFoldersData(Ext.bind(this.preprocessCompleted, this));
                    MyDesktop.Folders.preprocess(null, null, Ext.bind(this.preprocessCompleted, this));
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
        this.write( 'app init called' );
        this.callParent(arguments);
        
        if (this.openingFoldersScheduled && this.openingFoldersScheduled.length > 0) {
            for (var i = 0; i < this.openingFoldersScheduled.length; i++) {
                var module = this.getModule(this.openingFoldersScheduled[i].moduleId);
                if (!module) {
                    this.write('Fatal ERROR : Module ' + this.openingFoldersScheduled[i].moduleId + ' is not FOUND!');
                    continue;
                }
                if (!(module instanceof MyDesktop.Folders)) {
                    this.write('Fatal ERROR : Module ' + this.openingFoldersScheduled[i].moduleId + ' is not instance of Folders!!');
                    continue;
                }
                module.openFolder(this.openingFoldersScheduled[i].folderpath);
            }
        }

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