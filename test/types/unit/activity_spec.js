/* global describe, it, before, beforeEach */
/* jshint expr:true */

'use strict';

process.env.DBNAME = 'dating-test';

var expect = require('chai').expect;
var Mongo = require('mongodb');
var app = require('../../../app/app');
var request = require('supertest');
var traceur = require('traceur');
var factory = traceur.require(__dirname + '/../../helpers/factory.js');
var moment = require('moment');

var Activity;

describe('Activity', function(){
  before(function(done){
    request(app)
    .get('/')
    .end(function(){
      Activity = traceur.require(__dirname + '/../../../app/models/activity.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('activities').remove(function(){
      factory('activity', function(activities){
        done();
      });
    });
  });

  describe('.create', function(){
    it('should successfully create an activity', function(done){
      var obj = {
        name:'Derping',
        date:'6/13/2014',
        description:'Join us for some serious herpderp.',
        address:'91 Herp Lane, Suite 108, Brentwood, TN 37208',
        coordinates: ['87.124235356', '92.249863579847'],
        tags:'herping, derping'
      };

      Activity.create(obj, function(a){
        expect(a).to.be.ok;
        expect(a).to.be.an.instanceof(Activity);
        expect(a._id).to.be.an.instanceof(Mongo.ObjectID);
        expect(a.name).to.equal('Derping');
        expect(moment(a.date).format('MM/DD/YYYY')).to.equal('06/13/2014');
        expect(a.userIds.length).to.equal(0);
        expect(a.description).to.equal('Join us for some serious herpderp.');
        expect(a.address).to.equal('91 Herp Lane, Suite 108, Brentwood, TN 37208');
        expect(a.coordinates).to.be.an('array');
        expect(a.coordinates[0].toString()).to.equal('87.124235356');
        expect(a.coordinates[1].toString()).to.equal('92.249863579847');
        expect(a.tags).to.be.an('array');
        expect(a.tags[0]).to.equal('herping');
        expect(a.tags[1]).to.equal('derping');
        done();
      });
    });
  });

  describe('.findByLocation', function () {
    it('should find an activity by a current location', function (done) {
      var obj= {coordinates: ['7.345356345', '4.30430594']};

      Activity.findByLocation(obj, function (activities) {
        expect(activities).to.be.ok;
        expect(activities).to.be.an('array');
        expect(activities[0]).to.be.instanceof(Activity);
        expect(activities[0].name).to.equal('Happy Hour');
        done();
      });
    });
  });

  describe('.findAll', function () {
    it('should find all activity activities', function (done) {
      Activity.findAll(function (activities) {
        expect(activities).to.be.an('array');
        expect(activities[0]).to.be.ok;
        expect(activities[0]).to.be.instanceof(Activity);
        expect(activities[0]._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });

  describe('.findById', function () {
    it('should return an activity with matching credentials', function (done) {
      Activity.findById('0123456789abcdef01234568', function (activity) {
        expect(activity).to.be.ok;
        expect(activity).to.be.instanceof(Activity);
        expect(activity._id.toString()).to.equal('0123456789abcdef01234568');
        done();
      });
    });
  });

});
