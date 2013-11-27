Ext.define('MyDesktop.FolderDataLoader', {
    statics: {
        loadFoldersData : function (getfoldersapi, moduleName, hash, callback) {
            Ext.Ajax.request({
                url: getfoldersapi,
                params: {
                    folders:'music;progs;photos;lyrics;texts'
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
                    if (moduleName && hash) {
                        hash['foldersDataLoaded'] = true;
                        hash['foldersData'] = decodedText;
                    } else {
                        window.xmlconfig.foldersDataLoaded = true;
                        window.xmlconfig.foldersData = decodedText;
                    }
                    if (callback) {
                        callback(decodedText);
                    }
                }, this)
            });
        }
    }
});