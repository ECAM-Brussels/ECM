var humans = require('humans-generator');
 
humans({
    header: 'ECM  ECAM',
    team: {
      'Paques Alexis' : {
        'Email':'alexis.paques@gmail.com',
        'Country': 'Brussels',
        'Organization': 'ECAM, CSited'
      },
      'Combéfis Sébastien' : {
        'Email':'cbf@ecam.be',
        'Country': 'Brussels',
        'Organization': 'ECAM, CSited'
      }
    },
    thanks: ['Lurkin Quentin <lur@ecam.be>'],
    site: {
        'Standards': 'HTML5, CSS3',
        'Components': 'AngularJS, MongoDB, Papaparse, Express, NodeJS, Bootstrap, jQuery',
        'Software': 'Sublime Text'
    },
    out: "public",
    error: console.log,
    data : console.log,
    html : console.log
});
