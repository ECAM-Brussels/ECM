'use strict';

module.exports = function (grunt, done) {
	require('humans-generator')({
		'header': 'ECM',
		'team': {
			'Alexis Paques': {
				'Email': 'alexis.paques@gmail.com',
				'Country': 'Belgium',
				'Organization': 'ECAM'
			},
			'Sébastien Combéfis': {
				'Email': 's.combefis@ecam.be',
				'Country': 'Belgium',
				'Organization': 'ECAM'
			}
		},
		'thanks': ['Lurkin Quentin <q.lurkin@ecam.be>'],
		'site': {
			'Standards': 'HTML5, CSS3',
			'Components': 'AngularJS, MongoDB, Papaparse, Express, NodeJS, Bootstrap, jQuery',
			'Software': 'Sublime Text'
		},
		'out': 'public/humans.txt',
		callback : done
	});
};
