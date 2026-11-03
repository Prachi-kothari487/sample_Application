Ext.define('MusicApp.view.DashboardView', {
    extend: 'Ext.Container',
    xtype: 'dashboardview',

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
});