
Ext.define('MusicApp.view.SecurityQuestionsView', {
    extend: 'Ext.Container',
    xtype: 'securityquestionsview',

    config: {
        email: null,
        questions: null
    },

    layout: {
        type: 'vbox',
        pack: 'center',
        align: 'center'
    },

    padding: 24,

    style: {
        backgroundColor: '#F5EBDD',
        backgroundImage: "url('/sample-application/resources/images/music-doodle.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
    },

    items: [
        {
            xtype: 'formpanel',
            width: '100%',
            maxWidth: 500,
            padding: 28,

            style: {
                backgroundColor: 'rgba(255, 249, 239, 0.96)',
                borderRadius: '20px',
                border: '1px solid #D8B99A',
                boxShadow: '0 8px 30px rgba(75, 48, 40, 0.12)'
            },

            items: [
                {
                    xtype: 'component',
                    html: `
                        <div style="text-align:center; color:#4B3028;">
                            <div style="font-size:32px; margin-bottom:12px;">♫</div>
                            <h2 style="margin:0 0 10px; font-size:27px;">
                                Security Verification
                            </h2>
                            <p style="margin:0 0 22px; font-size:14px; color:#80634F;">
                                Answer your security questions to reset your password.
                            </p>
                        </div>
                    `
                },

                {
                    xtype: 'component',
                    itemId: 'question1',
                    html: ''
                },
                {
                    xtype: 'textfield',
                    name: 'answer1',
                    label: 'Your Answer',
                    placeholder: 'Enter your answer',
                    required: true,
                    clearable: true,
                    labelAlign: 'top'
                },

                {
                    xtype: 'component',
                    itemId: 'question2',
                    html: ''
                },
                {
                    xtype: 'textfield',
                    name: 'answer2',
                    label: 'Your Answer',
                    placeholder: 'Enter your answer',
                    required: true,
                    clearable: true,
                    labelAlign: 'top'
                },

                {
                    xtype: 'component',
                    itemId: 'question3',
                    html: ''
                },
                {
                    xtype: 'textfield',
                    name: 'answer3',
                    label: 'Your Answer',
                    placeholder: 'Enter your answer',
                    required: true,
                    clearable: true,
                    labelAlign: 'top'
                },

                {
                    xtype: 'button',
                    text: 'Verify Answers',
                    ui: 'plain',
                    height: 52,
                    width: '100%',
                    margin: '20 0 0 0',

                    style: {
                        background: '#4B3028',
                        borderRadius: '10px',
                        color: '#FFFFFF',
                        fontSize: '16px',
                        fontWeight: '600'
                    },

                    handler: function (button) {
                        var view = button.up('securityquestionsview');
                        var form = button.up('formpanel');
                        var values = form.getValues();

                        if (!form.validate()) {
                            showCappuccinoAlert(
                                'Validation',
                                'Please answer all three security questions.'
                            );
                            return;
                        }

                        var questions = view.getQuestions() || [];

                        if (questions.length !== 3) {
                            showCappuccinoAlert(
                                'Error',
                                'Security questions could not be loaded.'
                            );
                            return;
                        }

                        var requestData = {
                            email: view.getEmail(),
                            answers: [
                                {
                                    questionId: questions[0].id,
                                    answer: values.answer1
                                },
                                {
                                    questionId: questions[1].id,
                                    answer: values.answer2
                                },
                                {
                                    questionId: questions[2].id,
                                    answer: values.answer3
                                }
                            ]
                        };

                        button.setDisabled(true);

                        fetch('/sample-application/api/auth/verify-security-answers', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            credentials: 'same-origin',
                            body: JSON.stringify(requestData)
                        })
                            .then(function (response) {
                                return response.text().then(function (message) {
                                    if (!response.ok) {
                                        throw new Error(
                                            message || 'Security answer verification failed.'
                                        );
                                    }

                                    return message;
                                });
                            })
                            .then(function (message) {
                                showCappuccinoAlert(
                                    'Verification Successful',
                                    message || 'Password reset link has been sent to your registered email.'
                                );
                            })
                            .catch(function (error) {
                                showCappuccinoAlert(
                                    'Verification Failed',
                                    error.message
                                );
                            })
                            .finally(function () {
                                button.setDisabled(false);
                            });
                    }
                },

                {
                    xtype: 'button',
                    text: 'Back to Login',
                    ui: 'plain',
                    margin: '12 0 0 0',

                    style: {
                        background: 'transparent',
                        color: '#9A6748',
                        fontSize: '13px',
                        fontWeight: '600'
                    },

                    handler: function () {
                        Ext.Viewport.removeAll(true);
                        Ext.Viewport.add({
                            xtype: 'loginview'
                        });
                    }
                }
            ]
        }
    ],

    initialize: function () {
        this.callParent(arguments);

        var questions = this.getQuestions() || [];

        for (var i = 0; i < 3; i++) {
            var questionComponent = this.down('#question' + (i + 1));

            if (questions[i] && questionComponent) {
                questionComponent.setHtml(
                    '<div style="' +
                    'color:#4B3028;' +
                    'font-size:14px;' +
                    'font-weight:600;' +
                    'margin-top:14px;' +
                    'margin-bottom:4px;">' +
                    'Question ' + (i + 1) + ': ' +
                    questions[i].question +
                    '</div>'
                );
            }
        }
    }
});
