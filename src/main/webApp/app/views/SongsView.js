
Ext.define('MusicApp.view.SongsView', {
    extend: 'Ext.Container',
    xtype: 'songsview',

    cls: 'cappuccino-songs-view',
    layout: 'vbox',
    scrollable: true,

    items: [

        // 1. Heading Section
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

                // Add Song Button
                {
                    xtype: 'button',
                    text: '+ Add Song',
                    cls: 'cappuccino-primary-button',
                    ui: 'plain',
                    width: 150,
                    height: 56,

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

        // 2. Content Panel
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

                            var grid =
                                Ext.ComponentQuery.query('songsview grid')[0];

                            if (!grid) {
                                return;
                            }

                            var store = grid.getStore();

                            var searchText =
                                (newValue || '').toLowerCase().trim();

                            store.clearFilter();

                            if (searchText) {

                                store.filterBy(function (record) {

                                    return (
                                        (record.get('title') || '')
                                            .toLowerCase().includes(searchText) ||

                                        (record.get('artist') || '')
                                            .toLowerCase().includes(searchText) ||

                                        (record.get('album') || '')
                                            .toLowerCase().includes(searchText) ||

                                        (record.get('genre') || '')
                                            .toLowerCase().includes(searchText) ||

                                        String(record.get('year') || '')
                                            .includes(searchText)
                                    );
                                });
                            }
                        }
                    }
                },


                {
                    xtype: 'grid',
                    itemId: 'songsGrid',
                    cls: 'cappuccino-songs-grid',

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
                            'year'
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

                                console.log('Song Pagination response:', data);

                                if (!data) {
                                    console.error('Song pagination data not found');
                                    return;
                                }

                                store.currentPage = data.currentPage;
                                store.totalPages = data.totalPages;

                                var pageInfo =
                                    Ext.ComponentQuery.query('#songsPageInfo')[0];

                                var prevButton =
                                    Ext.ComponentQuery.query('#songsPrevPage')[0];

                                var nextButton =
                                    Ext.ComponentQuery.query('#songsNextPage')[0];

                                if (pageInfo) {
                                    pageInfo.setHtml(
                                        'Page ' + data.currentPage +
                                        ' of ' + data.totalPages
                                    );
                                }

                                if (prevButton) {
                                    prevButton.setDisabled(data.currentPage <= 1);
                                }

                                if (nextButton) {
                                    nextButton.setDisabled(
                                        data.currentPage >= data.totalPages
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

                        // Edit Action
                        {
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

                    layout: {
                        type: 'hbox',
                        pack: 'center',
                        align: 'center'
                    },

                    margin: '20 0',

                    items: [
                        {
                            xtype: 'button',
                            itemId: 'songsPrevPage',
                            text: 'Previous',
                            disabled: true,

                            handler: function () {

                                var grid =
                                    Ext.ComponentQuery.query('#songsGrid')[0];

                                var store = grid.getStore();

                                var previousPage = store.currentPage - 1;

                                if (previousPage >= 1) {
                                    store.load({
                                        params: {
                                            page: previousPage,
                                            size: 12
                                        }
                                    });
                                }
                            }
                        },

                        {
                            xtype: 'component',
                            itemId: 'songsPageInfo',
                            html: 'Page 1',
                            margin: '0 15'
                        },

                        {
                            xtype: 'button',
                            itemId: 'songsNextPage',
                            text: 'Next',

                            handler: function () {

                                var grid =
                                    Ext.ComponentQuery.query('#songsGrid')[0];

                                var store = grid.getStore();

                                var nextPage = store.currentPage + 1;

                                if (nextPage <= store.totalPages) {
                                    store.load({
                                        params: {
                                            page: nextPage,
                                            size: 12
                                        }
                                    });
                                }
                            }
                        }
                    ]
                }
            ]
        }
    ]
});
