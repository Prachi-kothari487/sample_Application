
Ext.define('MusicApp.view.SongsView', {
    extend: 'Ext.Container',
    xtype: 'songsview',

    cls: 'cappuccino-songs-view',
    layout: 'vbox',
    scrollable: true,

    items: [


        {
            xtype: 'container',
            layout: {
                type: 'hbox',
                align: 'middle'
            },
            margin: '0 0 24 0',

            items: [
                {
                    xtype: 'component',
                    cls: 'songs-page-heading',
                    flex: 1,

                    html: `
                        <div class="songs-title">
                            Songs Management
                        </div>
                        <div class="songs-subtitle">
                            Explore and manage your MusicVault collection
                        </div>
                    `
                },
                {
                    xtype: 'button',
                    text: '+ Add Song',
                    cls: 'cappuccino-primary-button',
                    ui: 'plain',
                    width: 150,
                    height: 56,
                    itemId: 'addSongButton',
                    hidden:true,

                    handler: function () {

                        var form = Ext.create('Ext.form.Panel', {
                            width: '100%',
                            bodyPadding: 20,

                            defaults: {
                                xtype: 'textfield',
                                labelAlign: 'top',
                                width: '100%'
                            },

                            items: [
                                {
                                    name: 'title',
                                    label: 'Song Title',
                                    placeholder: 'Enter song title',
                                    required: true
                                },
                                {
                                    name: 'artist',
                                    label: 'Artist',
                                    placeholder: 'Enter artist name',
                                    required: true
                                },
                                {
                                    name: 'album',
                                    label: 'Album',
                                    placeholder: 'Enter album name'
                                },
                                {
                                    name: 'genre',
                                    label: 'Genre',
                                    placeholder: 'Enter genre'
                                },
                                {
                                    xtype: 'numberfield',
                                    name: 'year',
                                    label: 'Year',
                                    placeholder: 'Enter release year'
                                }
                            ]
                        });

                        var windowForm = Ext.create('Ext.Dialog', {
                            title: 'Add Song',
                            width: 480,
                            maxHeight: '90%',
                            scrollable: true,
                            closable: true,
                            modal: true,
                            cls: 'cappuccino-form-dialog',
                            items: [form],

                            buttons: [
                                {
                                    text: 'Cancel',
                                    ui: 'plain',
                                    cls: 'cappuccino-dialog-cancel',
                                    handler: function () {
                                        windowForm.destroy();
                                    }
                                },
                                {
                                    text: 'Save Song',
                                    ui: 'plain',
                                    cls: 'cappuccino-dialog-save',
                                    handler: function () {

                                        var values = form.getValues();

                                        if (!values.title || !values.artist) {
                                            Ext.Msg.alert(
                                                'Validation',
                                                'Song title and artist are required.'
                                            );
                                            return;
                                        }

                                        if (values.year) {
                                            values.year = Number(values.year);
                                        }

                                        fetch('/sample-application/api/songs', {
                                            method: 'POST',

                                            headers: {
                                                'Content-Type': 'application/json'
                                            },

                                            credentials: 'same-origin',

                                            body: JSON.stringify(values)
                                        })
                                            .then(function (response) {

                                                if (!response.ok) {
                                                    throw new Error(
                                                        'Could not create song. Check the entered details.'
                                                    );
                                                }

                                                return response.json();
                                            })
                                            .then(function () {

                                                windowForm.destroy();

                                                Ext.Msg.alert(
                                                    'Success',
                                                    'Song added successfully!'
                                                );

                                                var grid =
                                                    Ext.ComponentQuery.query('songsview grid')[0];

                                                if (grid) {
                                                    grid.getStore().reload();
                                                }
                                            })
                                            .catch(function (error) {
                                                Ext.Msg.alert('Error', error.message);
                                            });
                                    }
                                }
                            ]
                        });

                        windowForm.show();
                    }
                }
            ]
        },


        {
            xtype: 'container',
            cls: 'songs-content-panel',
            width: '100%',

            items: [


                {
                    xtype: 'textfield',
                    itemId: 'songSearch',
                    cls: 'cappuccino-search-field',

                    placeholder: 'Search songs, artists, albums...',
                    clearable: true,
                    width: '100%',


                    listeners: {
                        change: function (field, newValue) {

                            var grid = Ext.ComponentQuery.query('#songsGrid')[0];

                            if (!grid) {
                                return;
                            }

                            var store = grid.getStore();
                            var searchText = (newValue || '').trim();

                            store.load({
                                params: {
                                    page: 1,
                                    size: 12,
                                    search: searchText
                                }
                            });
                        }
                    }

                },


                {
                    xtype: 'grid',
                    itemId: 'songsGrid',
                    cls: 'cappuccino-songs-grid',
                    itemConfig: {
                        viewModel: {
                            formulas: {
                                likeIconCls: function (get) {
                                    return get('record.isLiked')
                                        ? 'x-fa fa-heart liked-song-heart'
                                        : 'x-fa fa-heart unliked-song-heart';
                                }
                            }
                        }
                    },
                    width: '100%',
                    minHeight: 350,
                    margin: '16 0 0 0',

                    store: {
                        fields: [
                            'id',
                            'title',
                            'artist',
                            'album',
                            'genre',
                            'year',
                            'isLiked'
                        ],

                        autoLoad: true,
                        currentPage: 1,
                        totalPages: 1,

                        proxy: {
                            type: 'ajax',
                            url: '/sample-application/api/songs/page',

                            extraParams: {
                                page: 1,
                                size: 12
                            },

                            reader: {
                                type: 'json',
                                rootProperty: 'songs',
                                keepRawData: true
                            }
                        },


                        listeners: {
                            load: function (store, records, successful) {

                                if (!successful) {
                                    return;
                                }

                                var data = store.getProxy().getReader().rawData;

                                if (!data) {
                                    return;
                                }

                                store.currentPage = data.currentPage;
                                store.totalPages = data.totalPages;

                                var songsView = Ext.ComponentQuery.query('songsview')[0];

                                if (songsView) {
                                    songsView.applyLikedState(records);

                                    songsView.updateSongsPagination(
                                        data.currentPage,
                                        data.totalPages
                                    );
                                }
                            }
                        }
                    },

                    columns: [
                        {
                            text: 'ID',
                            dataIndex: 'id',
                            width: 65
                        },
                        {
                            text: 'Title',
                            dataIndex: 'title',
                            flex: 2
                        },
                        {
                            text: 'Artist',
                            dataIndex: 'artist',
                            flex: 1
                        },
                        {
                            text: 'Album',
                            dataIndex: 'album',
                            flex: 1
                        },
                        {
                            text: 'Genre',
                            dataIndex: 'genre',
                            flex: 1
                        },
                        {
                            text: 'Year',
                            dataIndex: 'year',
                            width: 90
                        },

                        {
                            itemId: 'playlistActionsColumn',
                            text: 'Playlist',
                            width: 155,

                            cell: {
                                tools: {
                                    addToPlaylist: {
                                        iconCls: 'x-fa fa-plus-circle',
                                        text: 'Add to Playlist',

                                        handler: function (grid, location) {

                                            var record = location.record;
                                            var songId = record.get('id');


                                            fetch('/sample-application/api/playlists', {
                                                method: 'GET',
                                                credentials: 'same-origin'
                                            })
                                                .then(function (response) {
                                                    if (!response.ok) {
                                                        throw new Error('Unable to load your playlists.');
                                                    }

                                                    return response.json();
                                                })
                                                .then(function (playlists) {

                                                    if (!playlists || playlists.length === 0) {
                                                        Ext.Msg.alert(
                                                            'No Playlists',
                                                            'You have not created any playlists yet. Please create a playlist first.'
                                                        );
                                                        return;
                                                    }


                                                    var playlistOptions = playlists.map(function (playlist) {
                                                        return {
                                                            text: playlist.name,
                                                            value: playlist.id
                                                        };
                                                    });


                                                    var form = Ext.create('Ext.form.Panel', {
                                                        bodyPadding: 20,

                                                        items: [
                                                            {
                                                                xtype: 'selectfield',
                                                                name: 'playlistId',
                                                                label: 'Choose Playlist',
                                                                labelAlign: 'top',
                                                                placeholder: 'Select a playlist',
                                                                required: true,
                                                                options: playlistOptions,
                                                                value: playlists.length > 0 ? playlists[0].id : null
                                                            }
                                                        ]
                                                    });

                                                    var dialog = Ext.create('Ext.Dialog', {
                                                        title: 'Add Song to Playlist',
                                                        width: 380,
                                                        modal: true,
                                                        closable: true,
                                                        cls: 'cappuccino-form-dialog',

                                                        items: [form],

                                                        buttons: [
                                                            {
                                                                text: 'Cancel',
                                                                ui: 'plain',
                                                                cls: 'cappuccino-dialog-cancel',

                                                                handler: function () {
                                                                    dialog.destroy();
                                                                }
                                                            },
                                                            {
                                                                text: 'Add',
                                                                ui: 'plain',
                                                                cls: 'cappuccino-dialog-save',

                                                                handler: function () {

                                                                    var playlistId =
                                                                        form.down('selectfield').getValue();

                                                                    if (!playlistId) {
                                                                        Ext.Msg.alert(
                                                                            'Validation',
                                                                            'Please select a playlist.'
                                                                        );
                                                                        return;
                                                                    }


                                                                    fetch(
                                                                        '/sample-application/api/playlists/' +
                                                                        playlistId + '/songs',
                                                                        {
                                                                            method: 'POST',

                                                                            headers: {
                                                                                'Content-Type': 'application/json'
                                                                            },

                                                                            credentials: 'same-origin',

                                                                            body: JSON.stringify({
                                                                                songId: songId
                                                                            })
                                                                        }
                                                                    )
                                                                        .then(function (response) {
                                                                            if (!response.ok) {
                                                                                throw new Error(
                                                                                    'Unable to add this song. It may already exist in the selected playlist.'
                                                                                );
                                                                            }

                                                                            return response;
                                                                        })
                                                                        .then(function () {

                                                                            dialog.destroy();

                                                                            Ext.Msg.alert(
                                                                                'Success',
                                                                                'Song added to your playlist successfully!',
                                                                                null,
                                                                                {
                                                                                    cls: 'cappuccino-alert'
                                                                                }
                                                                            );
                                                                        })
                                                                        .catch(function (error) {
                                                                            Ext.Msg.alert(
                                                                                'Error',
                                                                                error.message,
                                                                                null,
                                                                                {
                                                                                    cls: 'cappuccino-alert'
                                                                                }
                                                                            );
                                                                        });
                                                                }
                                                            }
                                                        ]
                                                    });

                                                    dialog.show();
                                                })
                                                .catch(function (error) {
                                                    Ext.Msg.alert(
                                                        'Error',
                                                        error.message,
                                                        null,
                                                        {
                                                            cls: 'cappuccino-alert'
                                                        }
                                                    );
                                                });
                                        }
                                    }
                                }
                            }
                        },
                        {
                            itemId: 'likeSongColumn',
                            text: 'Like',
                            width: 90,

                            cell: {
                                tools: {
                                    like: {
                                        bind: {
                                            iconCls: '{likeIconCls}'
                                        },

                                        text: 'Like / Unlike',

                                        handler: function (grid, location) {

                                            var record = location.record;
                                            var songId = record.get('id');
                                            var isLiked = record.get('isLiked');

                                            var method = isLiked ? 'DELETE' : 'POST';

                                            fetch(
                                                '/sample-application/api/songs/' + songId + '/like',
                                                {
                                                    method: method,
                                                    credentials: 'same-origin'
                                                }
                                            )
                                                .then(function (response) {

                                                    if (!response.ok) {
                                                        throw new Error(
                                                            isLiked
                                                                ? 'Unable to remove this song from Liked Songs.'
                                                                : 'Unable to add this song to Liked Songs.'
                                                        );
                                                    }

                                                    var songsView = Ext.ComponentQuery.query('songsview')[0];

                                                    if (songsView) {

                                                        var songKey = String(songId);

                                                        if (isLiked) {
                                                            delete songsView.likedSongIds[songKey];
                                                        } else {
                                                            songsView.likedSongIds[songKey] = true;
                                                        }
                                                    }

                                                    record.set('isLiked', !isLiked);
                                                    Ext.Msg.alert(
                                                        'Success',
                                                        isLiked
                                                            ? 'Song removed from Liked Songs!'
                                                            : 'Song added to Liked Songs!',
                                                        null,
                                                        {
                                                            cls: 'cappuccino-alert'
                                                        }
                                                    );
                                                })
                                                .catch(function (error) {

                                                    console.error('Like/Unlike error:', error);

                                                    Ext.Msg.alert(
                                                        'Error',
                                                        error.message,
                                                        null,
                                                        {
                                                            cls: 'cappuccino-alert'
                                                        }
                                                    );
                                                });
                                        }
                                    }
                                }
                            }
                        },

                        {
                            itemId:'songActionsColumn',
                            hidden:true,
                            text: 'Action',
                            width: 100,

                            cell: {
                                tools: {
                                    edit: {
                                        iconCls: 'x-fa fa-edit',
                                        text: 'Edit',

                                        handler: function (grid, location) {

                                            var record = location.record;

                                            var form = Ext.create('Ext.form.Panel', {
                                                bodyPadding: 20,

                                                defaults: {
                                                    xtype: 'textfield',
                                                    labelAlign: 'top',
                                                    width: '100%'
                                                },

                                                items: [
                                                    {
                                                        name: 'title',
                                                        label: 'Song Title',
                                                        value: record.get('title'),
                                                        required: true
                                                    },
                                                    {
                                                        name: 'artist',
                                                        label: 'Artist',
                                                        value: record.get('artist'),
                                                        required: true
                                                    },
                                                    {
                                                        name: 'album',
                                                        label: 'Album',
                                                        value: record.get('album')
                                                    },
                                                    {
                                                        name: 'genre',
                                                        label: 'Genre',
                                                        value: record.get('genre')
                                                    },
                                                    {
                                                        xtype: 'numberfield',
                                                        name: 'year',
                                                        label: 'Year',
                                                        value: record.get('year')
                                                    }
                                                ]
                                            });

                                            var windowForm = Ext.create('Ext.Dialog', {
                                                title: 'Edit Song',
                                                width: 480,
                                                maxHeight: '90%',
                                                scrollable: true,
                                                modal: true,
                                                cls: 'cappuccino-form-dialog',
                                                items: [form],

                                                buttons: [
                                                    {
                                                        text: 'Cancel',
                                                        ui: 'plain',
                                                        cls: 'cappuccino-dialog-cancel',

                                                        handler: function () {
                                                            windowForm.destroy();
                                                        }
                                                    },
                                                    {
                                                        text: 'Save Changes',
                                                        ui: 'plain',
                                                        cls: 'cappuccino-dialog-save',
                                                        handler: function () {

                                                            var values = form.getValues();

                                                            if (!values.title || !values.artist) {
                                                                Ext.Msg.alert(
                                                                    'Validation',
                                                                    'Song title and artist are required.',
                                                                    null,
                                                                    {
                                                                        cls: 'cappuccino-alert'
                                                                    }
                                                                );
                                                                return;
                                                            }

                                                            if (values.year) {
                                                                values.year = Number(values.year);
                                                            }

                                                            var updates = {};

                                                            [
                                                                'title',
                                                                'artist',
                                                                'album',
                                                                'genre',
                                                                'year'
                                                            ].forEach(function (field) {

                                                                var oldValue = record.get(field);
                                                                var newValue = values[field];

                                                                if (field === 'year') {
                                                                    oldValue = oldValue == null || oldValue === ''
                                                                        ? ''
                                                                        : String(oldValue);

                                                                    newValue = newValue == null || newValue === ''
                                                                        ? ''
                                                                        : String(newValue);
                                                                }

                                                                if (newValue !== oldValue) {
                                                                    updates[field] = values[field];
                                                                }
                                                            });

                                                            if (Object.keys(updates).length === 0) {
                                                                windowForm.destroy();
                                                                return;
                                                            }

                                                            fetch(
                                                                '/sample-application/api/songs/' +
                                                                record.get('id'),
                                                                {
                                                                    method: 'PATCH',

                                                                    headers: {
                                                                        'Content-Type': 'application/json'
                                                                    },

                                                                    credentials: 'same-origin',

                                                                    body: JSON.stringify(updates)
                                                                }
                                                            )
                                                                .then(function (response) {

                                                                    if (!response.ok) {
                                                                        throw new Error(
                                                                            'Could not update song.'
                                                                        );
                                                                    }

                                                                    return response.json();
                                                                })
                                                                .then(function () {

                                                                    windowForm.destroy();

                                                                    Ext.Msg.alert(
                                                                        'Success',
                                                                        'Song updated successfully!',
                                                                        null,
                                                                        {
                                                                            cls: 'cappuccino-alert'
                                                                        }
                                                                    );

                                                                    var songsGrid =
                                                                        Ext.ComponentQuery.query('songsview grid')[0];

                                                                    if (songsGrid) {
                                                                        songsGrid.getStore().reload();
                                                                    }
                                                                })
                                                                .catch(function (error) {
                                                                    Ext.Msg.alert('Error', error.message);
                                                                });
                                                        }
                                                    }
                                                ]
                                            });

                                            windowForm.show();
                                        }
                                    },
                                    delete: {
                                        iconCls: 'x-fa fa-trash',
                                        text: 'Delete',

                                        handler: function (grid, location) {

                                            var record = location.record;
                                            var songId = record.get('id');

                                            Ext.Msg.confirm(
                                                'Confirm Delete',
                                                'Are you sure you want to delete this song?',
                                                function (button) {

                                                    if (button === 'yes') {

                                                        fetch('/sample-application/api/songs/' + songId, {
                                                            method: 'DELETE',
                                                            credentials: 'same-origin'
                                                        })
                                                            .then(function (response) {

                                                                if (!response.ok) {
                                                                    throw new Error('Could not delete song.');
                                                                }

                                                                Ext.Msg.alert(
                                                                    'Success',
                                                                    'Song deleted successfully!'
                                                                );

                                                                grid.getStore().reload();
                                                            })
                                                            .catch(function (error) {
                                                                Ext.Msg.alert('Error', error.message);
                                                            });
                                                    }
                                                }
                                            );
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },



                {
                    xtype: 'container',
                    itemId: 'songsPagination',
                    cls: 'cappuccino-pagination',

                    width: '100%',
                    margin: '20 0',

                    layout: {
                        type: 'hbox',
                        pack: 'center',
                        align: 'center'
                    },

                    items: [
                        {
                            xtype: 'button',
                            itemId: 'songsPrevPage',
                            iconCls: 'x-fa fa-chevron-left',
                            ui: 'plain',
                            cls: 'cappuccino-page-arrow',
                            width: 40,
                            height: 40,
                            disabled: true,

                            handler: function () {
                                var view = Ext.ComponentQuery.query('songsview')[0];

                                if (view) {
                                    var grid = view.down('#songsGrid');
                                    view.loadSongsPage(grid.getStore().currentPage - 1);
                                }
                            }
                        },
                        {
                            xtype: 'numberfield',
                            itemId: 'songsPageInput',
                            value: 1,
                            minValue: 1,
                            clearable:false,
                            width: 50,
                            height: 40,
                            cls: 'cappuccino-page-input',
                            margin: '0 10',

                            listeners: {
                                action: function (field) {
                                    var view = Ext.ComponentQuery.query('songsview')[0];

                                    if (view) {
                                        view.loadSongsPage(field.getValue());
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'component',
                            itemId: 'songsTotalPages',
                            html: 'of 1',
                            cls: 'cappuccino-total-pages',
                            margin: '0 10'
                        },
                        {
                            xtype: 'button',
                            itemId: 'songsNextPage',
                            iconCls: 'x-fa fa-chevron-right',
                            ui: 'plain',
                            cls: 'cappuccino-page-arrow',
                            width: 40,
                            height: 40,

                            handler: function () {
                                var view = Ext.ComponentQuery.query('songsview')[0];

                                if (view) {
                                    var grid = view.down('#songsGrid');
                                    view.loadSongsPage(grid.getStore().currentPage + 1);
                                }
                            }
                        }
                    ]
                }
            ]
        }
    ],
    applyLikedState: function (records) {

        var view = this;
        var likedSongIds = view.likedSongIds || {};

        records.forEach(function (record) {

            var songId = record.get('id');

            record.set(
                'isLiked',
                !!likedSongIds[String(songId)]
            );
        });
    },

loadSongsPage: function (page) {

    var grid = this.down('#songsGrid');

    if (!grid) {
        return;
    }

    var store = grid.getStore();

    page = parseInt(page, 10);

    var totalPages = store.totalPages || 0;

    if (
        isNaN(page) ||
        page < 1 ||
        page > totalPages ||
        totalPages === 0
    ) {
        var pageInput = this.down('#songsPageInput');

        if (pageInput) {
            pageInput.setValue(store.currentPage || 1);
        }

        return;
    }

    var searchField = this.down('#songSearch');

    var searchText = searchField
        ? (searchField.getValue() || '').trim()
        : '';

    store.load({
        params: {
            page: page,
            size: 12,
            search: searchText
        }
    });
},

updateSongsPagination: function (currentPage, totalPages) {

    var pageInput = this.down('#songsPageInput');
    var totalPagesText = this.down('#songsTotalPages');
    var prevButton = this.down('#songsPrevPage');
    var nextButton = this.down('#songsNextPage');

    totalPages = totalPages || 0;

    if (pageInput) {
        pageInput.setValue(currentPage || 1);
        pageInput.setMaxValue(Math.max(totalPages, 1));
    }

    if (totalPagesText) {
        totalPagesText.setHtml('of ' + totalPages);
    }

    if (prevButton) {
        prevButton.setDisabled(currentPage <= 1 || totalPages === 0);
    }

    if (nextButton) {
        nextButton.setDisabled(
            currentPage >= totalPages || totalPages === 0
        );
    }
},


    initialize: function () {
        this.callParent(arguments);
        var view = this;

        view.likedSongIds = Object.create(null);

        fetch('/sample-application/api/songs/liked', {
            method: 'GET',
            credentials: 'same-origin'
        })
            .then(function (response) {

                if (!response.ok) {
                    throw new Error('Unable to load liked songs.');
                }

                return response.json();
            })
            .then(function (data) {

                var likedSongs = Array.isArray(data)
                    ? data
                    : (data.songs || data.data || []);

                likedSongs.forEach(function (song) {

                    var songId = song.id || song.songId ||
                        (song.song && song.song.id);

                    if (songId != null) {
                        view.likedSongIds[String(songId)] = true;
                    }
                });

                var grid = view.down('#songsGrid');

                if (grid) {
                    view.applyLikedState(grid.getStore().getRange());
                }

                console.log('Liked song IDs:', view.likedSongIds);
            })
            .catch(function (error) {
                console.error('Unable to load liked songs:', error);
            });
        var addButton = this.down('#addSongButton');
        var actionColumn = this.down('#songActionsColumn');

        fetch('/sample-application/api/auth/role', {
            method: 'GET',
            credentials: 'same-origin'
        })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Unable to fetch user role');
                }
                return response.json();
            })
            .then(function (data) {
                var role = (data.role || '').trim().toUpperCase();
                var isAdmin = role === 'ADMIN';

                if (addButton) {
                    addButton.setHidden(!isAdmin);
                }

                if (actionColumn) {
                    actionColumn.setHidden(!isAdmin);
                }
                var playlistColumn = view.down('#playlistActionsColumn');
                var likeColumn = view.down('#likeSongColumn');

                if (playlistColumn) {
                    playlistColumn.setHidden(isAdmin);
                }

                if (likeColumn) {
                    likeColumn.setHidden(isAdmin);
                }

                console.log('SongsView role:', role);
            })
            .catch(function (error) {
                if (addButton) {
                    addButton.setHidden(true);
                }

                if (actionColumn) {
                    actionColumn.setHidden(true);
                }

                console.error('Role fetch error:', error);
            });
    }



});
