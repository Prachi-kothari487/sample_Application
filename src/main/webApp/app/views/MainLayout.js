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

        console.log('Requested page:', pageXtype);

        var pageContainer = this.getComponent('pageContainer');

        if (!pageContainer) {
            console.error('Page container not found!');
            return;
        }

        console.log('Page container found:', pageContainer);

        pageContainer.removeAll(true);

        var newPage = Ext.create({
            xtype: pageXtype
        });

        pageContainer.add(newPage);

        console.log('Page loaded:', pageXtype);
    }
});