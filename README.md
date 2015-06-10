# ECM [![Build Status](https://travis-ci.org/combefis/ECM.svg?branch=master)](https://travis-ci.org/combefis/ECM) [![Dependencies Status](https://david-dm.org/combefis/ECM.svg)](https://david-dm.org/)

Exam Copies Manager is used to manage exams copies and to automatically generate pre-filled and ready-to-print PDF files for the exams.

## Requirements

- Node.js 0.12.1 or later
- MongoDB 2.4.9 or later
- Bower 1.4.0 or later
- Grunt 0.1.13 or later

## Installation

- Clone the repository
  `git clone https://github.com/combefis/ECM.git`
- Get into the directory
  `cd ECM`
- Install packages
  `npm install`
- Build the application
  `NODE_ENV=development grunt build`
- Launch the application
  `NODE_ENV=production grunt`