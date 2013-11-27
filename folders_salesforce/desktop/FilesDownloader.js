Ext.define('MyDesktop.FilesDownloader', {
    extend: 'Ext.ux.desktop.Module',

    createNewWindow : function(winId, data){
        window.open(data.fullpath);
    },
    
    init : function() {
        this.write = Ext.ClassManager.get(this.superclass.$className).write;
        this.moduleId = this.moduleId || 'filesdownloader';
        this.winId = this.winId || 'filesdownloader';
        this.id = this.moduleId;
    }
});