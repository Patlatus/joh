Ext.define('MyDesktop.RegistrationForm', {
    extend: 'Ext.window.Window',
    requires: [
        'MyDesktop.SimpleReader',
        'Ext.layout.container.Fit',
        'Ext.form.Panel'
    ],
    singleton: true,
    title: (window.xmlconfig.regformtitle || 'Реєстраційна форма'),
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
        errorReader : MyDesktop.SimpleReader,

        // The fields
        defaultType: 'textfield',
        fieldDefaults: {
            labelWidth: 130,
            msgTarget : 'side'
        },
        items: [{
            fieldLabel: (window.xmlconfig.usernamelabel || 'Юзернейм'),
            id:'run',
            name: 'rusername',
            allowBlank: false
        },{
            fieldLabel: (window.xmlconfig.passwordlabel || 'Пароль'),
            id:'rpw',
            name: 'rpassword',
            inputType: 'password',
            allowBlank: false
        },{
            fieldLabel: (window.xmlconfig.passverlabel || 'Пароль(перевірка)'),
            id:'rpv',
            name: 'passverif',
            inputType: 'password',
            allowBlank: false
        },{
            fieldLabel: (window.xmlconfig.emaillabel || 'Електронна пошта'),
            id:'re',
            name: 'email',
            vtype: 'email',
            allowBlank: false
        }],

        // Reset and Submit buttons
        buttons: [{
            text: (window.xmlconfig.backlabel || 'Назад'),
            id:'rbb',
            handler: function() {
                window.xmlconfig.regForm.hide();
                window.xmlconfig.loginForm.show();
            }
        }, {
            text: (window.xmlconfig.resetlabel || 'Очистити'),
            id:'rrb',
            handler: function() {
                this.up('form').getForm().reset();
            }
        }, {
            text: (window.xmlconfig.signuplabel || 'Зареєструватися'),
            id:'rsb',
            formBind: true, //only enabled once the form is valid
            disabled: true,
            handler: function() {
                var form = this.up('form').getForm();
                if (form.isValid()) {
                    form.submit({
                        params: {
                            language: window.xmlconfig.currentLanguage
                        },
                    
                        success: function(form, action) {
                            window.xmlconfig.regForm.hide();
                            Ext.Msg.alert((window.xmlconfig.successtitle || 'Success'), window.xmlconfig.resultMessage, function() {window.xmlconfig.loginForm.show()}, window.xmlconfig.loginForm);
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
        this.setTitle(window.xmlconfig.regformtitle || 'Реєстраційна форма'),
        Ext.getCmp('run').setFieldLabel(window.xmlconfig.usernamelabel || 'Юзернейм');
        Ext.getCmp('rpw').setFieldLabel(window.xmlconfig.passwordlabel || 'Пароль');
        Ext.getCmp('rpv').setFieldLabel(window.xmlconfig.passverlabel || 'Пароль(перевірка)');
        Ext.getCmp('re').setFieldLabel(window.xmlconfig.emaillabel || 'Електронна пошта');
        Ext.getCmp('rbb').setText(window.xmlconfig.backlabel || 'Назад');
        Ext.getCmp('rrb').setText(window.xmlconfig.resetlabel || 'Очистити');
        Ext.getCmp('rsb').setText(window.xmlconfig.signuplabel || 'Зареєструватися');
    }
});