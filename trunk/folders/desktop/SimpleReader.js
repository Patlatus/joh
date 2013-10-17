window.xmlconfig = {};
Ext.define('MyDesktop.SimpleReader', {
    singleton: true,
    read : function (xhr) {
        var result = Ext.decode(xhr.responseText);
        window.xmlconfig.userLogged = result.success;
        window.xmlconfig.resultMessage = result.message;
        if (result.success) {
            window.xmlconfig.username = result.username;
            window.xmlconfig.userid = result.userid;
        }
        return {
            success : result.success,
            records: []
        }
    }
});