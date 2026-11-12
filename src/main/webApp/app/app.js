
Ext.application({
    name: 'MusicApp',

    launch: function () {

        var params = new URLSearchParams(window.location.search);
        var resetToken = params.get('resetToken');

        if (resetToken) {
            Ext.Viewport.add({
                xtype: 'resetpasswordview',
                token: resetToken
            });
        } else {
            Ext.Viewport.add({
                xtype: 'loginview'
            });
        }
    }
});
