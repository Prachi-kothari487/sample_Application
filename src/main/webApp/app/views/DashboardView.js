Ext.define('MusicApp.view.DashboardView', {
    extend: 'Ext.Container',
    xtype: 'dashboardview',

    cls: 'music-dashboard',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    scrollable: 'y',
    padding: 24,

    items: [


        {
            xtype: 'container',
            margin: '0 0 25 0',

            items: [
                {
                    xtype: 'component',
                    html: '<h1 class="dashboard-heading">Dashboard</h1>'
                },
                {
                    xtype: 'component',
                    html: '<p class="dashboard-welcome">Welcome back! Here is your music overview.</p>'
                }
            ]
        },

        {
            xtype: 'container',
            cls: 'dashboard-stats',
            itemId: 'statsContainer',

            height: 135,

            layout: {
                type: 'hbox',
                align: 'stretch'
            },

            defaults: {
                flex: 1,
                margin: '0 12 0 0'
            },

            items: [
                {
                    xtype: 'container',
                    itemId: 'totalUsersCard',
                    cls: 'dashboard-stat-card',
                    padding: 20,
                    html: `
                        <div class="stat-icon">👥</div>
                        <p>Total Users</p>
                        <h2>Loading...</h2>
                        <span>Registered users</span>
                    `
                },
                {
                    xtype: 'container',
                    itemId: 'totalSongsCard',
                    cls: 'dashboard-stat-card',
                    padding: 20,
                    html: `
                        <div class="stat-icon">🎵</div>
                        <p>Total Songs</p>
                        <h2>Loading...</h2>
                        <span>Available tracks</span>
                    `
                },
                {
                    xtype: 'container',
                    itemId: 'totalGenresCard',
                    cls: 'dashboard-stat-card',
                    padding: 20,
                    html: `
                        <div class="stat-icon">🎧</div>
                        <p>Total Genres</p>
                        <h2>Loading...</h2>
                        <span>Music categories</span>
                    `
                },
                {
                    xtype: 'container',
                    itemId: 'activeUsersCard',
                    cls: 'dashboard-stat-card',
                    padding: 20,
                    html: `
                        <div class="stat-icon">🟢</div>
                        <p>Active Users</p>
                        <h2>Loading...</h2>
                        <span>Currently active</span>
                    `
                }
            ]
        },


        {
            xtype: 'container',
            cls: 'dashboard-chart-card',
            height: 470,
            margin: '28 0 28 0',
            padding: 20,

            layout: {
                type: 'vbox',
                align: 'stretch'
            },

            items: [
                {
                    xtype: 'component',
                    html: '<h2 class="dashboard-section-heading">Songs by Genre</h2>'
                },
                {
                    xtype: 'polar',
                    itemId: 'genreChart',
                    flex: 1,

                    insetPadding: 25,

                    colors: [
                        '#6F4E37',
                        '#987052',
                        '#B68B67',
                        '#D6BFA5',
                        '#EADBC8',
                        '#805A42',
                        '#C19A78',
                        '#A0785A'
                    ],

                    legend: {
                        docked: 'bottom'
                    },

                    store: {
                        fields: ['genre', 'total'],
                        data: []
                    },

                    series: [{
                        type: 'pie',
                        angleField: 'total',
                        donut: 60,

                        highlight: true,

                        label: {
                            field: 'genre',
                            display: 'inside',
                            color: '#4e290d',
                            font: 'bold 12px Arial'
                        },

                        tooltip: {
                            trackMouse: true,

                            renderer: function (tooltip, record) {
                                tooltip.setHtml(
                                    '<b>Genre:</b> ' +
                                    Ext.String.htmlEncode(record.get('genre')) +
                                    '<br><b>Total Songs:</b> ' +
                                    record.get('total')
                                );
                            }
                        }
                    }]
                }
            ]
        },

        {
            xtype: 'container',
            cls: 'dashboard-recent-card',
            padding: 20,
            margin: '0 0 20 0',

            layout: {
                type: 'vbox',
                align: 'stretch'
            },

            items: [
                {
                    xtype: 'component',
                    html: '<h2 class="dashboard-section-heading">Recently Added Songs</h2>'
                },
                {
                    xtype: 'component',
                    itemId: 'recentSongsList',
                    html: '<p>Loading recent songs...</p>'
                }
            ]
        }
    ],


    listeners: {
        painted: function (dashboard) {
            dashboard.loadDashboardData();
        }
    },



    loadDashboardData: function () {

        var dashboard = this;


        var statsContainer = dashboard.getComponent('statsContainer');

        var chartContainer = dashboard.getComponent(2);
        var recentContainer = dashboard.getComponent(3);

        console.log('Dashboard:', dashboard);
        console.log('Stats container:', statsContainer);

        Ext.Ajax.request({

            url: '/sample-application/api/dashboard/summary',
            method: 'GET',

            success: function (response) {
                console.log('1. API SUCCESS');
                console.log('2. HTTP STATUS:', response.status);

                var data = Ext.decode(response.responseText);
                console.log('3. COMPLETE API DATA:', data);
                console.log('4. TOTAL USERS:', data.totalUsers);
                console.log('5. TOTAL SONGS:', data.totalSongs);
                console.log('6. TOTAL GENRES:', data.totalGenres);
                console.log('7. ACTIVE USERS:', data.activeUsers);
                console.log('API response:', data);


                var totalUsersCard = statsContainer.getComponent('totalUsersCard');
                var totalSongsCard = statsContainer.getComponent('totalSongsCard');
                var totalGenresCard = statsContainer.getComponent('totalGenresCard');
                var activeUsersCard = statsContainer.getComponent('activeUsersCard');


                totalUsersCard.setHtml(`
                <div class="stat-icon">👥</div>
                <p>Total Users</p>
                <h2>${data.totalUsers}</h2>
                <span>Registered users</span>
            `);


                totalSongsCard.setHtml(`
                <div class="stat-icon">🎵</div>
                <p>Total Songs</p>
                <h2>${data.totalSongs}</h2>
                <span>Available tracks</span>
            `);


                totalGenresCard.setHtml(`
                <div class="stat-icon">🎧</div>
                <p>Total Genres</p>
                <h2>${data.totalGenres}</h2>
                <span>Music categories</span>
            `);


                activeUsersCard.setHtml(`
                <div class="stat-icon">🟢</div>
                <p>Active Users</p>
                <h2>${data.activeUsers}</h2>
                <span>Currently active</span>
            `);

                // GENRE CHART
                var chart = chartContainer.down('polar');

                if (chart) {

                    console.log('API Genre Count:', data.songsByGenre.length);
                    console.log('API Genre Data:', data.songsByGenre);

                    chart.getStore().setData(data.songsByGenre || []);

                    console.log('Chart Store Count:', chart.getStore().getCount());
                    console.log('Chart Store Data:', chart.getStore().getRange().map(function (record) {
                        return {
                            genre: record.get('genre'),
                            total: record.get('total')
                        };
                    }));
                }

                // RECENT SONGS
                var recentSongsList = recentContainer.getComponent(1);

                var icons = ['🎵', '🎶', '🎧', '🎼', '🎹'];

                var recentSongsHtml = (data.recentSongs || []).map(function (song, index) {

                    return `
                    <div class="recent-song-row">
                        <div class="recent-song-icon">
                            ${icons[index % icons.length]}
                        </div>

                        <div class="recent-song-info">
                            <h3>${Ext.String.htmlEncode(song.title || '')}</h3>
                            <p>${Ext.String.htmlEncode(song.artist || '')}</p>
                        </div>

                        <span class="recent-song-genre">
                            ${Ext.String.htmlEncode(song.genre || 'Unknown')}
                        </span>
                    </div>
                `;

                }).join('');

                recentSongsList.setHtml(
                    recentSongsHtml || '<p>No songs available.</p>'
                );

                console.log('Dashboard loaded successfully!');

            },

            failure: function (response) {

                console.error('Dashboard API failed:', response.status);

                recentContainer.getComponent(1).setHtml(
                    '<p>Unable to load recent songs.</p>'
                );
            }
        });
    }

});
