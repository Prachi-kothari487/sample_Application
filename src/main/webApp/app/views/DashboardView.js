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
                    cls: 'dashboard-stat-card clickable-dashboard-card',
                    padding: 20,

                    html: `
        <div class="stat-icon">👥</div>
        <p>Total Users</p>
        <h2>Loading...</h2>
        <span>Registered users</span>
    `,

                    listeners: {
                        tap: {
                            element: 'element',
                            fn: function () {
                                var mainLayout = Ext.ComponentQuery.query('mainlayout')[0];

                                if (mainLayout) {
                                    mainLayout.showPage('usersview');
                                }
                            }
                        }
                    }
                },
                {
                    xtype: 'container',
                    itemId: 'totalSongsCard',
                    cls: 'dashboard-stat-card clickable-dashboard-card',
                    padding: 20,

                    html: `
        <div class="stat-icon">🎵</div>
        <p>Total Songs</p>
        <h2>Loading...</h2>
        <span>Available tracks</span>
    `,

                    listeners: {
                        tap: {
                            element: 'element',
                            fn: function () {
                                var mainLayout = Ext.ComponentQuery.query('mainlayout')[0];

                                if (mainLayout) {
                                    mainLayout.showPage('songsview');
                                }
                            }
                        }
                    }
                },
                {
                    xtype: 'container',
                    itemId: 'totalGenresCard',
                    cls: 'dashboard-stat-card clickable-dashboard-card',
                    padding: 20,
                    html: `
        <div class="stat-icon">🎧</div>
        <p>Total Genres</p>
        <h2>Loading...</h2>
        <span>Music categories</span>
    `,
                    listeners: {
                        tap: {
                            element: 'element',
                            fn: function () {

                                console.log('Total Genres card clicked');

                                var dashboard = Ext.ComponentQuery.query('dashboardview')[0];

                                if (!dashboard) {
                                    console.log('Dashboard not found');
                                    return;
                                }

                                var chartCard = dashboard.down('#genreChartCard');

                                if (!chartCard || !chartCard.el) {
                                    console.log('Genre chart card not found');
                                    return;
                                }

                                chartCard.el.dom.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start'
                                });
                            }
                        }
                    }
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
            itemId: 'genreChartCard',
            cls: 'dashboard-chart-card',
            height: 470,
            margin: '28 0 28 0',
            padding: 30,

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
                    xtype: 'container',
                    flex: 1,
                    cls: 'genre-chart-layout',

                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },

                    items: [


                        {
                            xtype: 'polar',
                            itemId: 'genreChart',
                            flex: 1,
                            height: 360,
                            minWidth: 250,
                            insetPadding: 30,


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

                            store: {
                                fields: ['genre', 'total'],
                                data: []
                            },

                            series: [
                                {
                                    type: 'pie',
                                    angleField: 'total',
                                    donut: 60,
                                    highlight: false,

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
                                }
                            ]
                        },


                        {
                            xtype: 'component',
                            itemId: 'genreLegend',
                            width: 180,
                            cls: 'genre-custom-legend'
                        }
                    ]
                }
            ]
        },


        {
            xtype: 'container',
            itemId: 'recentSongsCard',
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

        var statsContainer = dashboard.down('#statsContainer');
        var chartContainer = dashboard.down('#genreChartCard');
        var recentContainer = dashboard.down('#recentSongsCard');

        var recentSongsList = recentContainer
            ? recentContainer.down('#recentSongsList')
            : null;

        console.log('Dashboard:', dashboard);
        console.log('Stats container:', statsContainer);
        console.log('Chart container:', chartContainer);
        console.log('Recent container:', recentContainer);
        console.log('Recent songs component:', recentSongsList);

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



                if (statsContainer) {

                    statsContainer.down('#totalUsersCard').setHtml(`
                        <div class="stat-icon">👥</div>
                        <p>Total Users</p>
                        <h2>${data.totalUsers}</h2>
                        <span>Registered users</span>
                    `);

                    statsContainer.down('#totalSongsCard').setHtml(`
                        <div class="stat-icon">🎵</div>
                        <p>Total Songs</p>
                        <h2>${data.totalSongs}</h2>
                        <span>Available tracks</span>
                    `);

                    statsContainer.down('#totalGenresCard').setHtml(`
                        <div class="stat-icon">🎧</div>
                        <p>Total Genres</p>
                        <h2>${data.totalGenres}</h2>
                        <span>Music categories</span>
                    `);

                    statsContainer.down('#activeUsersCard').setHtml(`
                        <div class="stat-icon">🟢</div>
                        <p>Active Users</p>
                        <h2>${data.activeUsers}</h2>
                        <span>Currently active</span>
                    `);
                }



                var chart = chartContainer
                    ? chartContainer.down('#genreChart')
                    : null;

                var genreLegend = chartContainer
                    ? chartContainer.down('#genreLegend')
                    : null;

                var genreData = data.songsByGenre || [];

                if (chart) {

                    console.log('API Genre Count:', genreData.length);
                    console.log('API Genre Data:', genreData);

                    chart.getStore().setData(genreData);

                    var genreColors = [
                        '#6F4E37',
                        '#987052',
                        '#B68B67',
                        '#D6BFA5',
                        '#EADBC8',
                        '#805A42',
                        '#C19A78',
                        '#A0785A'
                    ];

                    var legendHtml = genreData.map(function (item, index) {

                        return `
                            <div class="genre-legend-item">
                                <span class="genre-legend-dot"
                                    style="background:${genreColors[index % genreColors.length]}">
                                </span>

                                <span class="genre-legend-name">
                                    ${Ext.String.htmlEncode(item.genre || 'Unknown')}
                                </span>

                                <strong class="genre-legend-count">
                                    ${item.total}
                                </strong>
                            </div>
                        `;

                    }).join('');

                    if (genreLegend) {
                        genreLegend.setHtml(
                            legendHtml || '<p>No genre data available.</p>'
                        );
                    }

                    console.log('Chart Store Count:', chart.getStore().getCount());

                    console.log(
                        'Chart Store Data:',
                        chart.getStore().getRange().map(function (record) {
                            return {
                                genre: record.get('genre'),
                                total: record.get('total')
                            };
                        })
                    );


                }


                console.log('Recent Songs:', data.recentSongs);
                console.log('Recent Songs Count:', data.recentSongs?.length);

                if (recentSongsList) {

                    var icons = ['🎵', '🎶', '🎧', '🎼', '🎹'];

                    var recentSongsHtml = (data.recentSongs || [])
                        .map(function (song, index) {

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

                } else {
                    console.error('Recent songs component not found!');
                }

                console.log('Dashboard loaded successfully!');

            },

            failure: function (response) {

                console.error('Dashboard API failed:', response.status);

                if (recentSongsList) {
                    recentSongsList.setHtml(
                        '<p>Unable to load recent songs.</p>'
                    );
                }
            }
        });
    }
});
