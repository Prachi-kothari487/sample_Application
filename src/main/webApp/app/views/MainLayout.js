Ext.define('MusicApp.view.MainLayout', {
    extend: 'Ext.Container',
    xtype: 'mainlayout',

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    items: [
        {
            xtype: 'appsidebar'
        },
        {
            xtype: 'container',
            flex: 1,
            itemId: 'pageContainer',
            cls: 'dashboard-main',
            layout: 'fit',

            items: [
                {
                    xtype: 'dashboardview'
                }
            ]
        }
    ],

    showPage: function (pageXtype) {
        var pageContainer = this.down('#pageContainer');

        pageContainer.removeAll(true);
        pageContainer.add({
            xtype: pageXtype
        });
    }
});