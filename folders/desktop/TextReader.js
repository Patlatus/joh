Ext.define('MyDesktop.TextReader', {
    extend: 'Ext.ux.desktop.Module',

    createIFrameTag : function (data) {
        return {
            bodyCls : 'x-window-body-default',
            border : false,
            html: '<iframe style="width=100%; height=100%" src="' + data.fullpath + '"></iframe>'
        };
    },

    prepareNewWinConfig : function (winId, winTitle, data) {
        return {
            id: winId,
            title:winTitle,
            iconCls: data.smallIconCls || 'icon-lyrics',
            animCollapse:false,
            border: false,
            //defaultFocus: this.notepadEditorId, EXTJSIV-1300

            // IE has a bug where it will keep the iframe's background visible when the window
            // is set to visibility:hidden. Hiding the window via position offsets instead gets
            // around this bug.
            hideMode: 'offsets',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                this.createIFrameTag(data)
            ]
        }
    },
    
    createNewWindow : function(winId, data){
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow(winId);
        if (!win){
            win = desktop.createWindow(this.prepareNewWinConfig(winId, this.caption + ' /' + winId, data));
        }
        return win;
    },
    
    init : function() {
        this.write = Ext.ClassManager.get(this.superclass.$className).write;
        this.moduleId = this.moduleId || 'lyrics';
        this.winId = this.winId || 'lyrics';
        this.id = this.moduleId;
        this.caption = this.caption || window.xmlconfig.lyricstitle || 'Opening lyrics:';
    }
});
