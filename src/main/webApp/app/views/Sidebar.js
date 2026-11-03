Ext.define('MusicApp.view.Sidebar', {
    extend: 'Ext.Container',
    xtype: 'appsidebar',

    width: 250,
    cls: 'dashboard-sidebar',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [
        {
            xtype: 'button',
            text: '⌂   Dashboard',
            cls: 'dashboard-nav-button active',
            margin: '8 0',
            handler: function (button) {
                button.up('mainlayout').showPage('dashboardview');
            }
        },
        {
            xtype: 'button',
            text: '♟   Users',
            cls: 'dashboard-nav-button',
            margin: '8 0',
            handler: function (button) {
                button.up('mainlayout').showPage('usersview');
            }
        },
        {
            xtype: 'button',
            text: '♫   Songs',
            cls: 'dashboard-nav-button',
            margin: '8 0',
            handler: function (button) {
                button.up('mainlayout').showPage('songsview');
            }
        },
        {
            xtype: 'button',
            text: '♙   Profile',
            cls: 'dashboard-nav-button',
            margin: '8 0'
        },
        {
            xtype: 'button',
            text: '⇥   Logout',
            cls: 'dashboard-nav-button',
            margin: '8 0'
        }
    ]


});