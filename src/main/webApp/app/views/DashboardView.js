
Ext.define('MusicApp.view.DashboardView', {
    extend: 'Ext.Container',
    xtype: 'dashboardview',
    cls: 'cappuccino-dashboard',

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    items: [

        {
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
                    margin: '8 0'
                },
                {
                    xtype: 'button',
                    text: '♟   Users',
                    cls: 'dashboard-nav-button',
                    margin: '8 0',
                    handler: function () {
                        Ext.Viewport.removeAll(true);
                        Ext.Viewport.add({
                            xtype: 'usersview'
                        });
                    }
                },
                {
                    xtype: 'button',
                    text: '♫   Songs',
                    cls: 'dashboard-nav-button',
                    margin: '8 0',
                    handler: function () {
                        Ext.Msg.alert('Songs', 'Songs section is coming next!');
                    }
                },
                {
                    xtype: 'button',
                    text: '♙   Profile',
                    cls: 'dashboard-nav-button',
                    margin: '8 0',
                    handler: function () {
                        Ext.Msg.alert('Profile', 'Profile section is coming next!');
                    }
                },
                {
                    xtype: 'button',
                    text: '⇥   Logout',
                    cls: 'dashboard-nav-button',
                    margin: '8 0',
                    handler: function () {
                        Ext.Msg.alert('Logout', 'Logout will be connected next!');
                    }
                }
            ]
        },

        // MAIN CONTENT
        {
            flex: 1,
            cls: 'dashboard-main',

            layout: {
                type: 'vbox',
                align: 'stretch'
            },

            items: [
                {
                    xtype: 'component',
                    cls: 'dashboard-heading',
                    html: `
                        <h1>Dashboard</h1>
                        <p>Welcome back to MusicVault!</p>
                    `,
                    margin: '0 0 24px'
                },
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },

                    items: [
                        {
                            flex: 1,
                            margin: '0 12px 0 0',
                            padding: 24,
                            cls: 'dashboard-stat-card',
                            html: `
                                <h3>Total Users</h3>
                                <h1>0</h1>
                            `
                        },
                        {
                            flex: 1,
                            padding: 24,
                            cls: 'dashboard-stat-card',
                            html: `
                                <h3>Total Songs</h3>
                                <h1>0</h1>
                            `
                        }
                    ]
                }
            ]
        }
    ]
});
