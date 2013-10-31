Ext.define('MyDesktop.AudioReader', {
    extend: 'Ext.ux.desktop.Module',

    createAudioTag : function (data) {
        return {
            bodyCls : 'x-window-body-default',
            border : false,
            html: '<audio controls><source src="' + data.fullpath + '" type="audio/' + (data.type == 'mp3' ? 'mpeg' : 'ogg') + '">Your browser does not support the audio element.</audio>'
        };
    },
    
    prepareNewWinConfig : function (winId, winTitle, data) {
        return {
            id: winId,
            title:winTitle,
            /*width:300,
            height:65,*/
            iconCls: data.smallIconCls || 'icon-music',
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
                this.createAudioTag(data)
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
        this.moduleId = this.moduleId || 'audio';
        this.winId = this.winId || 'audio';
        this.id = this.moduleId;
        this.caption = this.caption || window.xmlconfig.audiotitle || 'Playing audio file:';
    }
});
