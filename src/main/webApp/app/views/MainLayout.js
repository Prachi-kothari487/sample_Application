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

    initialize: function () {
        this.callParent(arguments);

        var savedPage = window.location.hash.substring(1);

        var allowedPages = [
            'dashboardview',
            'usersview',
            'songsview',
            'profileview',
            'likedsongsview'
        ];

        if (allowedPages.indexOf(savedPage) !== -1) {
            this.showPage(savedPage);
        } else {
            window.location.hash = 'dashboardview';
        }
    },


    showPage: function (pageXtype, pageData) {

        console.log('Requested page:', pageXtype);

        var pageContainer = this.getComponent('pageContainer');

        if (!pageContainer) {
            console.error('Page container not found!');
            return;
        }

        pageContainer.removeAll(true);

        var pageConfig = {
            xtype: pageXtype
        };

        if (pageXtype === 'playlistdetailsview' && pageData) {
            pageConfig.playlist = pageData;
        }

        var newPage = Ext.create(pageConfig);

        pageContainer.add(newPage);

        window.location.hash = pageXtype;

        console.log('Page loaded:', pageXtype);
    }

});
