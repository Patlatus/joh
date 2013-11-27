Ext.define('MyDesktop.LoginForm', {
    extend: 'Ext.window.Window',
    requires: [
        'MyDesktop.SimpleReader',
        'Ext.layout.container.Fit',
        'Ext.form.Panel',
        'Ext.form.field.Checkbox',
        'Ext.form.field.ComboBox',
        'Ext.data.AbstractStore'
    ],
    singleton: true,
    title: (window.xmlconfig.logformtitle || 'Форма логування'),
    width: 250,

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
        errorReader : MyDesktop.SimpleReader,

        defaultType: 'textfield',
        fieldDefaults: {
            labelWidth: 80,
            msgTarget : 'side'
        },
        items: [{
            fieldLabel: (window.xmlconfig.usernamelabel || 'Юзернейм'),
            id: 'username',
            name: 'username',
            allowBlank: false
        },{
            fieldLabel: (window.xmlconfig.passwordlabel || 'Пароль'),
            id: 'password',
            name: 'password',
            inputType: 'password',
            allowBlank: false
        },{
            fieldLabel: (window.xmlconfig.guestmodelabel || 'Як гість'),
            id: 'guestmode',
            name: 'guestmode',
            xtype: 'checkbox',
            visible: window.xmlconfig.guestmodeallowed
        },{
            fieldLabel: (window.xmlconfig.languagelabel || 'Мова'),
            id: 'language',
            name: 'language',
            xtype: 'combo',
            store: {
                fields:['code', 'name']
            },
            displayField: 'name',
            valueField: 'code',
            queryMode: 'local',
            forceSelection: true,
            allowBlank: false
        }],
        // Reset and Submit buttons
        buttons: [{
            text: (window.xmlconfig.reglabel || 'Зареєструватися'),
            id: 'regbutton',
            handler: function() {
                window.xmlconfig.loginForm.hide();
                window.xmlconfig.regForm.show();
            }
        }, {
            text: (window.xmlconfig.loglabel || 'Залогуватися'),
            id: 'logbutton',
            formBind: true, //only enabled once the form is valid
            disabled: true,
            handler: function() {
                var form = this.up('form').getForm();
                if (window.xmlconfig.guestmode) {
                    window.xmlconfig.loginForm.hide();
                    window.xmlconfig.guestmode = true;
                    window.xmlconfig.userLogged = false;
                    window.xmlconfig.resultMessage = '';
                    window.xmlconfig.username = window.xmlconfig['guestmodetitle'] || 'Guest mode';;
                    window.xmlconfig.userid = -1;
                    myDesktopApp.init();
                    return;
                };
                if (form.isValid()) {
                    form.submit({
                        params: {
                            language: window.xmlconfig.currentLanguage
                        },
                        success: function(form, action) {
                            window.xmlconfig.loginForm.hide();
                            Ext.Msg.alert((window.xmlconfig.successtitle || 'Success'), window.xmlconfig.resultMessage);
                            myDesktopApp.init();
                        },
                        failure: function(form, action) {
                            Ext.Msg.alert((window.xmlconfig.failedtitle || 'Failed'), window.xmlconfig.resultMessage);
                        }
                    });
                }
            }
        }]
    },
    
    update : function () {
        this.setTitle(window.xmlconfig.logformtitle || 'Форма логування'),
        Ext.getCmp('username').setFieldLabel(window.xmlconfig.usernamelabel || 'Юзернейм');
        Ext.getCmp('password').setFieldLabel(window.xmlconfig.passwordlabel || 'Пароль');
        Ext.getCmp('guestmode').setFieldLabel(window.xmlconfig.guestmodelabel || 'Як гість');
        Ext.getCmp('regbutton').setText(window.xmlconfig.reglabel || 'Зареєструватися');
        Ext.getCmp('logbutton').setText(window.xmlconfig.loglabel || 'Залогуватися');
        Ext.getCmp('guestmode').setVisible(window.xmlconfig.guestmodeallowed);
        Ext.getCmp('guestmode').on('change', this.guestModeChange, this);
        this.languageCombo = Ext.getCmp('language');
        this.languageCombo.setFieldLabel(window.xmlconfig.languagelabel || 'Мова');
        var data = [];
        for (var i = 0; i < window.xmlconfig.languagesArray.length; i++) {
            var languageCode = window.xmlconfig.languagesArray[i];
            var languageName = window.xmlconfig.languagesNames[languageCode];
            data.push({'code':languageCode,'name':languageName});
        }
        if (!this.languageComboLoaded) {
            this.languageCombo.getStore().loadData(data);
            this.languageComboLoaded = true;
            this.languageCombo.setValue(window.xmlconfig.currentLanguage);
            this.languageCombo.on('change', this.languageChange, this);
        }
    },
    
    guestModeChange : function (field, newValue, oldValue, opts) {
        Ext.getCmp('username').setDisabled(newValue);
        Ext.getCmp('password').setDisabled(newValue);
        window.xmlconfig.guestmode = newValue;
    },
    
    languageChange : function (field, newValue, oldValue, opts) {
        window.xmlconfig.currentLanguage = newValue;
        myDesktopApp.updateUserLanguage();
    }
});